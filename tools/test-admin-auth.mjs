// Isolated auth regression tests: Sanity is mocked; no credentials or network calls.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import crypto from "node:crypto";
import vm from "node:vm";
import ts from "typescript";

const env = { NODE_ENV: "development", ADMIN_EMAIL: "owner@example.test", ADMIN_INITIAL_PASSWORD: "test12",
  ADMIN_SESSION_SECRET: "test-secret-with-at-least-32-characters", ADMIN_PASSWORD_ENCRYPTION_KEY: "a".repeat(64),
  NEXT_PUBLIC_SANITY_PROJECT_ID: "test", NEXT_PUBLIC_SANITY_DATASET: "production", SANITY_API_WRITE_TOKEN: "mock",
  ADMIN_ALLOWED_ORIGINS: "https://classroom.example.test" };
const docs = new Map();
let revision = 0, collisions = 0;
const clone = (value) => value ? structuredClone(value) : undefined;
const client = {
  getDocument: async (id) => clone(docs.get(id)),
  createIfNotExists: async (doc) => {
    if (!docs.has(doc._id)) docs.set(doc._id, { ...clone(doc), _rev: String(++revision) });
    return clone(docs.get(doc._id));
  },
  patch(id) {
    let expected, values;
    const patch = {
      ifRevisionId(rev) { expected = rev; return patch; },
      set(input) { values = input; return patch; },
      async commit() {
        if (collisions-- > 0 || docs.get(id)?._rev !== expected)
          throw Object.assign(new Error("Conflict"), { statusCode: 409 });
        docs.set(id, { ...docs.get(id), ...values, _rev: String(++revision) });
        return clone(docs.get(id));
      },
    };
    return patch;
  },
};
const root = new URL("../", import.meta.url);
function load(path, imports) {
  const output = {};
  const code = ts.transpileModule(readFileSync(new URL(path, root), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, { exports: output, Buffer, URL, Response, process: { env },
    require(name) {
      if (name === "server-only") return {};
      if (name === "node:crypto") return crypto;
      if (name in imports) return imports[name];
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return output;
}
const auth = load("lib/admin/auth.ts", { "next-sanity": { createClient: () => client } });
const server = load("lib/admin/sanity-server.ts", { "next-sanity": { createClient: () => { throw new Error("Content writes disabled"); } },
  "next/cache": {}, "./auth": auth, "./schema.json": JSON.parse(readFileSync(new URL("lib/admin/schema.json", root))) });
let passed = 0;
async function test(name, action) { await action(); passed++; console.log(`PASS ${name}`); }
const rejects = (action, status) => assert.rejects(action, (e) => e.status === status);
const request = (token, origin = "http://localhost:3100") => new Request(`${origin}/admin/password`, {
  headers: { host: new URL(origin).host, origin, "x-ivy-admin-request": "1", ...(token ? { cookie: `${auth.SESSION_COOKIE}=${token}` } : {}) },
});
await test("Unauthenticated content API denied", () => rejects(() => server.guard(request()), 401));
await test("Missing encryption key fails closed before storing anything", async () => {
  const key = env.ADMIN_PASSWORD_ENCRYPTION_KEY;
  env.ADMIN_PASSWORD_ENCRYPTION_KEY = "";
  await rejects(() => auth.login(env.ADMIN_EMAIL, "test12"), 503);
  assert.equal(docs.size, 0); env.ADMIN_PASSWORD_ENCRYPTION_KEY = key;
});
await test("Wrong credentials never create account", async () => {
  await rejects(() => auth.login("other@example.test", "test12"), 401);
  await rejects(() => auth.login(env.ADMIN_EMAIL, "wrong-password"), 401);
  assert.equal(docs.has("admin-account"), false);
});
let session;
await test("Initial login stores only encrypted account data", async () => {
  session = await auth.login(env.ADMIN_EMAIL.toUpperCase(), "test12");
  assert.equal((await auth.getSession(session.token)).email, env.ADMIN_EMAIL);
  assert.equal(docs.get("admin-account").passwordHash, undefined);
  assert.equal(docs.get("admin-account").email, undefined);
  assert.match(docs.get("admin-account").ciphertext, /^[a-f0-9]+$/);
  assert.equal(JSON.stringify([...docs.values()]).includes("test12"), false);
  assert.equal(JSON.stringify([...docs.values()]).includes("scrypt:"), false);
  assert.equal(JSON.stringify([...docs.values()]).includes(env.ADMIN_EMAIL), false);
});
await test("Encrypted account tampering fails closed", async () => {
  const original = clone(docs.get("admin-account"));
  docs.get("admin-account").tag = "0".repeat(32);
  await rejects(() => auth.getSession(session.token), 503);
  docs.set("admin-account", original);
});
await test("Forged and expired sessions rejected", async () => {
  assert.equal(await auth.getSession(`${session.token}tampered`), null);
  const original = JSON.parse(Buffer.from(session.token.split(".")[0], "base64url").toString());
  const payload = Buffer.from(JSON.stringify({ ...original, expiresAt: 1 })).toString("base64url");
  const signature = crypto.createHmac("sha256", env.ADMIN_SESSION_SECRET).update(payload).digest("base64url");
  assert.equal(await auth.getSession(`${payload}.${signature}`), null);
});
await test("Authenticated content API allowed without content write", () => server.guard(request(session.token), true));
await test("Cross-origin and missing custom header rejected", async () => {
  assert.throws(() => auth.guardOrigin(new Request("http://localhost:3100/admin/session", { headers: { host: "localhost:3100", origin: "https://evil.test", "x-ivy-admin-request": "1" } })), (e) => e.status === 403);
  assert.throws(() => auth.guardOrigin(new Request("http://localhost:3100/admin/session", { headers: { origin: "http://localhost:3100" } })), (e) => e.status === 403);
});
await test("Production accepts only configured HTTPS origin", async () => {
  env.NODE_ENV = "production";
  auth.guardOrigin(request(undefined, "https://classroom.example.test"));
  assert.throws(() => auth.guardOrigin(request()), (e) => e.status === 403);
  env.NODE_ENV = "development";
});
await test("Wrong current password does not change account", async () => {
  const original = docs.get("admin-account").ciphertext;
  await rejects(() => auth.changePassword(request(session.token), "wrong", "new-password"), 401);
  assert.equal(docs.get("admin-account").ciphertext, original);
});
await test("Password change survives reinitialization and invalidates previous sessions", async () => {
  await auth.changePassword(request(session.token), "test12", "new-password");
  assert.equal(await auth.getSession(session.token), null);
  const restarted = load("lib/admin/auth.ts", { "next-sanity": { createClient: () => client } });
  await rejects(() => restarted.login(env.ADMIN_EMAIL, "test12"), 401);
  assert.ok((await restarted.login(env.ADMIN_EMAIL, "new-password")).token);
});
await test("Revision collision is retried for login limit", async () => {
  docs.delete("admin-login-attempts"); collisions = 1;
  assert.ok((await auth.login(env.ADMIN_EMAIL, "new-password")).token);
});
await test("Concurrent wrong logins are bounded by shared limit", async () => {
  docs.set("admin-login-attempts", { _id: "admin-login-attempts", _rev: String(++revision), count: 9, expiresAt: Date.now() + 60000 });
  const outcomes = await Promise.allSettled([auth.login(env.ADMIN_EMAIL, "wrong"), auth.login(env.ADMIN_EMAIL, "wrong")]);
  assert.ok(outcomes.some((r) => r.status === "rejected" && r.reason.status === 429));
  assert.equal(docs.get("admin-login-attempts").count, 10);
});
await test("Expired login limit permits next attempt", async () => {
  docs.get("admin-login-attempts").expiresAt = 0;
  assert.ok((await auth.login(env.ADMIN_EMAIL, "new-password")).token);
});
console.log(`${passed} auth regression checks passed. No network or Sanity writes.`);
