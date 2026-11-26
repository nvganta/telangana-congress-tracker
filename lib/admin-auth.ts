import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

// Failed attempts allowed per IP inside one window before we start refusing.
export const MAX_FAILED_ATTEMPTS = 5;
export const FAILURE_WINDOW_MS = 15 * 60 * 1000;
// Keeps the map from growing without bound if many IPs hit the route.
const MAX_TRACKED_IPS = 10_000;

interface FailureRecord {
  count: number;
  resetAt: number;
}

// In-memory, so it is per server instance. On Vercel each warm function
// instance keeps its own counts. That still turns an unlimited online guess
// into a slow one, which is the point here.
const failures = new Map<string, FailureRecord>();

export function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const vercelIp = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercelIp) return vercelIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const entries = forwarded.split(",").map((s) => s.trim()).filter(Boolean);
    const last = entries[entries.length - 1];
    if (last) return last;
  }

  return "unknown";
}

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

// Hashing first gives two equal-length buffers, so timingSafeEqual never
// throws and the comparison time does not depend on where the inputs differ.
function passwordsMatch(supplied: string, expected: string): boolean {
  return timingSafeEqual(sha256(supplied), sha256(expected));
}

function activeRecord(ip: string, now: number): FailureRecord | undefined {
  const record = failures.get(ip);
  if (record && record.resetAt <= now) {
    failures.delete(ip);
    return undefined;
  }
  return record;
}

function recordFailure(ip: string, now: number): void {
  const record = activeRecord(ip, now);
  if (record) {
    record.count += 1;
    return;
  }
  if (failures.size >= MAX_TRACKED_IPS) {
    for (const [key, value] of failures) {
      if (value.resetAt <= now) failures.delete(key);
    }
    if (failures.size >= MAX_TRACKED_IPS) {
      const oldest = failures.keys().next().value;
      if (oldest !== undefined) failures.delete(oldest);
    }
  }
  failures.set(ip, { count: 1, resetAt: now + FAILURE_WINDOW_MS });
}

/**
 * Checks an admin password for a request. Returns null when the caller is an
 * admin, or the error response to send back when they are not:
 * 503 if ADMIN_PASSWORD is not set, 429 if this IP has failed too often,
 * 401 if the password is missing or wrong.
 */
export function verifyAdmin(request: NextRequest, password: unknown): NextResponse | null {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !expected.trim()) {
    return NextResponse.json(
      { error: "Admin is not configured on this deployment" },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const record = activeRecord(ip, now);
  if (record && record.count >= MAX_FAILED_ATTEMPTS) {
    const retryAfter = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return NextResponse.json(
      { error: "Too many failed attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  if (typeof password !== "string" || !password || !passwordsMatch(password, expected)) {
    recordFailure(ip, now);
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  failures.delete(ip);
  return null;
}

/** Test hook: clears all failure counts. */
export function resetAdminRateLimit(): void {
  failures.clear();
}
