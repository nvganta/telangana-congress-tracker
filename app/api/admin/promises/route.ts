import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { verifyAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  let body: { data?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const denied = verifyAdmin(request, body?.password);
  if (denied) return denied;

  if (!Array.isArray(body.data)) {
    return NextResponse.json({ error: "data must be an array" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "data", "guarantees.json");
    await writeFile(filePath, JSON.stringify(body.data, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
