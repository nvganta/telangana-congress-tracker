/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS script: it hooks require() to load the .ts routes */
// Exercises the admin and feedback route handlers directly, no server needed.
// Run with: npm run test:api
//
// The route files are TypeScript with "@/..." imports, so this registers a
// small require hook that transpiles .ts with the repo's own typescript
// package and maps "@/" to the repo root. Handlers run against a temp data/
// folder so the real data files are never touched.

const fs = require("fs");
const os = require("os");
const path = require("path");
const Module = require("module");
const test = require("node:test");
const assert = require("node:assert/strict");
const ts = require("typescript");

const ROOT = path.resolve(__dirname, "..");

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith("@/")) request = path.join(ROOT, request.slice(2));
  return originalResolve.call(this, request, ...rest);
};
require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  module._compile(outputText, filename);
};

// Route modules resolve data/ from process.cwd() at load time.
const SANDBOX = fs.mkdtempSync(path.join(os.tmpdir(), "tct-routes-"));
fs.mkdirSync(path.join(SANDBOX, "data"));
const FEEDBACK_FILE = path.join(SANDBOX, "data", "feedback.json");
const GUARANTEES_FILE = path.join(SANDBOX, "data", "guarantees.json");
const SAMPLE_FEEDBACK = [
  {
    id: "fb-1",
    name: "Test Person",
    email: "person@example.com",
    type: "feedback",
    message: "hello",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];
const ORIGINAL_CWD = process.cwd();
process.chdir(SANDBOX);

const { NextRequest } = require("next/server");
const adminAuth = require(path.join(ROOT, "lib/admin-auth.ts"));
const authRoute = require(path.join(ROOT, "app/api/admin/auth/route.ts"));
const promisesRoute = require(path.join(ROOT, "app/api/admin/promises/route.ts"));
const feedbackRoute = require(path.join(ROOT, "app/api/feedback/route.ts"));

const PASSWORD = "correct horse battery staple, but longer";
let ipCounter = 0;
const freshIp = () => `203.0.113.${++ipCounter}`;

function req(urlPath, { method = "GET", body, headers = {}, ip } = {}) {
  const h = { ...headers };
  if (ip) h["x-real-ip"] = ip;
  if (body !== undefined) h["content-type"] = "application/json";
  return new NextRequest(`http://localhost${urlPath}`, {
    method,
    headers: h,
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
}

const login = (password, opts = {}) =>
  authRoute.POST(req("/api/admin/auth", { method: "POST", body: { password }, ...opts }));

test.beforeEach(() => {
  process.env.ADMIN_PASSWORD = PASSWORD;
  adminAuth.resetAdminRateLimit();
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(SAMPLE_FEEDBACK));
  fs.writeFileSync(GUARANTEES_FILE, "[]");
});

test.after(() => {
  // Windows will not delete the current directory, so step out first.
  process.chdir(ORIGINAL_CWD);
  fs.rmSync(SANDBOX, { recursive: true, force: true });
});

test("no hardcoded admin password left in app/ or lib/", () => {
  const offenders = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(ts|tsx)$/.test(entry.name) && fs.readFileSync(full, "utf8").includes("telangana2024-2029")) {
        offenders.push(path.relative(ROOT, full));
      }
    }
  };
  walk(path.join(ROOT, "app"));
  walk(path.join(ROOT, "lib"));
  assert.deepEqual(offenders, []);
});

test("admin routes return 503 when ADMIN_PASSWORD is unset, empty or blank", async () => {
  for (const value of [undefined, "", "   "]) {
    if (value === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = value;

    for (const guess of ["telangana2024-2029", "", value ?? "undefined"]) {
      const res = await login(guess, { ip: freshIp() });
      assert.equal(res.status, 503, `login with ADMIN_PASSWORD=${JSON.stringify(value)}`);
      assert.match((await res.json()).error, /not configured/);
    }

    const save = await promisesRoute.POST(
      req("/api/admin/promises", { method: "POST", body: { data: [], password: "" }, ip: freshIp() })
    );
    assert.equal(save.status, 503);

    const fb = await feedbackRoute.GET(req("/api/feedback", { headers: { "x-admin-password": "" }, ip: freshIp() }));
    assert.equal(fb.status, 503);
  }
});

test("login accepts the right password and rejects everything else", async () => {
  assert.equal((await login(PASSWORD, { ip: freshIp() })).status, 200);
  assert.equal((await login("telangana2024-2029", { ip: freshIp() })).status, 401);
  assert.equal((await login(PASSWORD + "x", { ip: freshIp() })).status, 401);
  assert.equal((await login(PASSWORD.slice(0, -1), { ip: freshIp() })).status, 401);
  assert.equal((await login("", { ip: freshIp() })).status, 401);
  assert.equal((await login(undefined, { ip: freshIp() })).status, 401);
  assert.equal((await login(12345, { ip: freshIp() })).status, 401);
  assert.equal((await login({ toString: () => PASSWORD }, { ip: freshIp() })).status, 401);

  const badJson = await authRoute.POST(req("/api/admin/auth", { method: "POST", body: "{not json", ip: freshIp() }));
  assert.equal(badJson.status, 400);
});

test("five failures lock an IP out for the window, other IPs unaffected", async () => {
  const ip = freshIp();
  for (let i = 0; i < adminAuth.MAX_FAILED_ATTEMPTS; i++) {
    assert.equal((await login("wrong", { ip })).status, 401, `attempt ${i + 1}`);
  }

  const locked = await login("wrong", { ip });
  assert.equal(locked.status, 429);
  const retryAfter = Number(locked.headers.get("retry-after"));
  assert.ok(retryAfter > 0 && retryAfter <= adminAuth.FAILURE_WINDOW_MS / 1000);

  // Even the right password is refused while locked.
  assert.equal((await login(PASSWORD, { ip })).status, 429);
  // The lockout covers every admin route, not just login.
  const fb = await feedbackRoute.GET(req("/api/feedback", { headers: { "x-admin-password": PASSWORD }, ip }));
  assert.equal(fb.status, 429);

  assert.equal((await login(PASSWORD, { ip: freshIp() })).status, 200);
});

test("lockout expires after the window", async () => {
  const ip = freshIp();
  const realNow = Date.now;
  try {
    let now = realNow();
    Date.now = () => now;
    for (let i = 0; i < adminAuth.MAX_FAILED_ATTEMPTS; i++) await login("wrong", { ip });
    assert.equal((await login(PASSWORD, { ip })).status, 429);
    now += adminAuth.FAILURE_WINDOW_MS + 1;
    assert.equal((await login(PASSWORD, { ip })).status, 200);
  } finally {
    Date.now = realNow;
  }
});

test("a successful login clears that IP's failure count", async () => {
  const ip = freshIp();
  for (let i = 0; i < adminAuth.MAX_FAILED_ATTEMPTS - 1; i++) await login("wrong", { ip });
  assert.equal((await login(PASSWORD, { ip })).status, 200);
  for (let i = 0; i < adminAuth.MAX_FAILED_ATTEMPTS; i++) {
    assert.equal((await login("wrong", { ip })).status, 401);
  }
  assert.equal((await login("wrong", { ip })).status, 429);
});

test("client IP: x-real-ip, then x-vercel-forwarded-for, then last x-forwarded-for", () => {
  const ipOf = (headers) => adminAuth.getClientIp(req("/", { headers }));
  assert.equal(
    ipOf({ "x-real-ip": "1.1.1.1", "x-vercel-forwarded-for": "2.2.2.2", "x-forwarded-for": "3.3.3.3" }),
    "1.1.1.1"
  );
  assert.equal(ipOf({ "x-vercel-forwarded-for": "2.2.2.2", "x-forwarded-for": "3.3.3.3" }), "2.2.2.2");
  assert.equal(ipOf({ "x-forwarded-for": "9.9.9.9, 8.8.8.8,  4.4.4.4 " }), "4.4.4.4");
  assert.equal(ipOf({}), "unknown");
});

test("spoofing an earlier x-forwarded-for entry does not dodge the limit", async () => {
  const realClient = "198.51.100.7";
  for (let i = 0; i < adminAuth.MAX_FAILED_ATTEMPTS; i++) {
    await login("wrong", { headers: { "x-forwarded-for": `10.0.0.${i}, ${realClient}` } });
  }
  const res = await login("wrong", { headers: { "x-forwarded-for": `10.0.0.99, ${realClient}` } });
  assert.equal(res.status, 429);
});

test("GET /api/feedback is admin-only and never cached", async () => {
  const anon = await feedbackRoute.GET(req("/api/feedback", { ip: freshIp() }));
  assert.equal(anon.status, 401);
  assert.doesNotMatch(await anon.text(), /example\.com/);

  const wrong = await feedbackRoute.GET(req("/api/feedback", { headers: { "x-admin-password": "nope" }, ip: freshIp() }));
  assert.equal(wrong.status, 401);

  const ok = await feedbackRoute.GET(req("/api/feedback", { headers: { "x-admin-password": PASSWORD }, ip: freshIp() }));
  assert.equal(ok.status, 200);
  assert.equal(ok.headers.get("cache-control"), "no-store");
  assert.deepEqual(await ok.json(), SAMPLE_FEEDBACK);
});

test("feedback reads work for passwords a raw header can't carry", async () => {
  const previous = process.env.ADMIN_PASSWORD;
  const unusual = "  తెలంగాణ password  ";
  process.env.ADMIN_PASSWORD = unusual;
  try {
    const ok = await feedbackRoute.GET(
      req("/api/feedback", { headers: { "x-admin-password": encodeURIComponent(unusual) }, ip: freshIp() }),
    );
    assert.equal(ok.status, 200);
    const bad = await feedbackRoute.GET(
      req("/api/feedback", { headers: { "x-admin-password": "%E0%A4" }, ip: freshIp() }),
    );
    assert.equal(bad.status, 401);
  } finally {
    process.env.ADMIN_PASSWORD = previous;
  }
});

test("POST /api/feedback stays open to the public", async () => {
  const res = await feedbackRoute.POST(
    req("/api/feedback", { method: "POST", body: { name: "A", type: "bug", message: "m" }, ip: freshIp() })
  );
  assert.equal(res.status, 200);
  assert.equal(JSON.parse(fs.readFileSync(FEEDBACK_FILE, "utf8")).length, SAMPLE_FEEDBACK.length + 1);
});

test("POST /api/admin/promises needs the password and an array", async () => {
  const data = [{ id: "g1", status: "pending" }];

  const denied = await promisesRoute.POST(
    req("/api/admin/promises", { method: "POST", body: { data, password: "telangana2024-2029" }, ip: freshIp() })
  );
  assert.equal(denied.status, 401);
  assert.equal(fs.readFileSync(GUARANTEES_FILE, "utf8"), "[]");

  const notArray = await promisesRoute.POST(
    req("/api/admin/promises", { method: "POST", body: { data: { x: 1 }, password: PASSWORD }, ip: freshIp() })
  );
  assert.equal(notArray.status, 400);
  assert.equal(fs.readFileSync(GUARANTEES_FILE, "utf8"), "[]");

  const saved = await promisesRoute.POST(
    req("/api/admin/promises", { method: "POST", body: { data, password: PASSWORD }, ip: freshIp() })
  );
  assert.equal(saved.status, 200);
  assert.deepEqual(JSON.parse(fs.readFileSync(GUARANTEES_FILE, "utf8")), data);
});
