import "server-only";
import { createClient } from "next-sanity";
import { createCipheriv, createDecipheriv, createHmac, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "ivy_admin_session";
export const SESSION_SECONDS = 8 * 60 * 60;
const ACCOUNT_ID = "admin-account";
const ATTEMPT_ID = "admin-login-attempts";
const WINDOW_MS = 15 * 60 * 1000;
type Account = { _id: string; _rev: string; email: string; passwordHash: string; version: string };
type StoredAccount = { _id: string; _rev: string; ciphertext: string; iv: string; tag: string };
type Attempts = { _id: string; _rev: string; count: number; expiresAt: number };
export class AuthError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
function config() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const encryptionKey = process.env.ADMIN_PASSWORD_ENCRYPTION_KEY;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!email || !initialPassword || !secret || secret.length < 32 || !dataset || !projectId || !token ||
    !encryptionKey || !/^[a-f0-9]{64}$/.test(encryptionKey))
    throw new AuthError("관리자 계정 환경 설정을 확인하세요.", 503);
  return { email, initialPassword, secret, dataset, projectId, token, encryptionKey };
}
async function store() {
  const cfg = config();
  const client = createClient({ projectId: cfg.projectId, dataset: cfg.dataset, token: cfg.token,
    apiVersion: "2025-02-19", useCdn: false, perspective: "raw" });
  return { client, cfg };
}
function encryptAccount(account: Pick<Account, "email" | "passwordHash" | "version">) {
  const cfg = config();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(cfg.encryptionKey, "hex"), iv);
  cipher.setAAD(Buffer.from(`${cfg.projectId}/${cfg.dataset}/${ACCOUNT_ID}`));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify({ email: account.email,
    passwordHash: account.passwordHash, version: account.version }), "utf8"), cipher.final()]);
  return { ciphertext: ciphertext.toString("hex"), iv: iv.toString("hex"), tag: cipher.getAuthTag().toString("hex") };
}
function decryptAccount(stored: StoredAccount): Account {
  try {
    const cfg = config();
    if (!/^[a-f0-9]{24}$/.test(stored.iv) || !/^[a-f0-9]{32}$/.test(stored.tag) ||
      !/^[a-f0-9]+$/.test(stored.ciphertext) || stored.ciphertext.length > 4096) throw new Error("Invalid account");
    const decipher = createDecipheriv("aes-256-gcm", Buffer.from(cfg.encryptionKey, "hex"), Buffer.from(stored.iv, "hex"));
    decipher.setAAD(Buffer.from(`${cfg.projectId}/${cfg.dataset}/${ACCOUNT_ID}`));
    decipher.setAuthTag(Buffer.from(stored.tag, "hex"));
    const values = JSON.parse(Buffer.concat([decipher.update(Buffer.from(stored.ciphertext, "hex")), decipher.final()]).toString("utf8"));
    if (typeof values.email !== "string" || typeof values.passwordHash !== "string" || typeof values.version !== "string")
      throw new Error("Invalid account");
    return { _id: stored._id, _rev: stored._rev, email: values.email, passwordHash: values.passwordHash, version: values.version };
  } catch { throw new AuthError("관리자 계정 암호화 설정을 확인하세요.", 503); }
}
async function readAccount(client: Awaited<ReturnType<typeof store>>["client"]) {
  const stored = await client.getDocument<StoredAccount>(ACCOUNT_ID);
  return stored ? decryptAccount(stored) : undefined;
}
function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => scrypt(password, salt, 64,
    (error, key) => error ? reject(error) : resolve(key)));
}
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt:${salt}:${(await derive(password, salt)).toString("hex")}`;
}
export async function verifyPassword(password: string, encoded: string) {
  const [type, salt, hex] = encoded.split(":");
  if (type !== "scrypt" || !/^[a-f0-9]{32}$/.test(salt || "") || !/^[a-f0-9]{128}$/.test(hex || "")) return false;
  return timingSafeEqual(await derive(password, salt), Buffer.from(hex, "hex"));
}
function sign(payload: string) {
  return createHmac("sha256", config().secret).update(payload).digest("base64url");
}
function sessionFor(account: Account) {
  const payload = Buffer.from(JSON.stringify({ email: account.email, version: account.version,
    expiresAt: Date.now() + SESSION_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
export function cookieToken(header: string | null) {
  return header?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
}
export async function getSession(token?: string) {
  if (!token || token.length > 2048) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  let session: { email: string; version: string; expiresAt: number };
  try { session = JSON.parse(Buffer.from(payload, "base64url").toString()); } catch { return null; }
  if (typeof session.expiresAt !== "number" || session.expiresAt <= Date.now() || session.email !== config().email) return null;
  const { client } = await store();
  const account = await readAccount(client);
  if (!account || account.email !== session.email || account.version !== session.version) return null;
  return { email: account.email, version: account.version };
}
export async function requireSession(request: Request) {
  const session = await getSession(cookieToken(request.headers.get("cookie")));
  if (!session) throw new AuthError("로그인이 필요합니다.", 401);
  return session;
}
export function guardOrigin(request: Request) {
  const origin = request.headers.get("origin");
  let browser: URL;
  try { browser = new URL(origin || ""); } catch { throw new AuthError("관리자 화면에서 다시 시도하세요.", 403); }
  const host = request.headers.get("host") || new URL(request.url).host;
  const local = process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1", "[::1]"].includes(browser.hostname);
  const allowed = (process.env.ADMIN_ALLOWED_ORIGINS || "").split(",").map((item) => item.trim());
  if (browser.host !== host || (!local && (browser.protocol !== "https:" || !allowed.includes(browser.origin))) ||
    request.headers.get("x-ivy-admin-request") !== "1")
    throw new AuthError("관리자 화면에서 다시 시도하세요.", 403);
}
async function reserveAttempt(client: Awaited<ReturnType<typeof store>>["client"]) {
  await client.createIfNotExists({ _id: ATTEMPT_ID, _type: "adminLoginAttempts", count: 0, expiresAt: 0 });
  for (let retry = 0; retry < 5; retry++) {
    const current = await client.getDocument<Attempts>(ATTEMPT_ID);
    if (!current) throw new AuthError("로그인 요청을 다시 시도하세요.", 503);
    const active = current.expiresAt > Date.now();
    if (active && current.count >= 10) throw new AuthError("로그인 시도가 많습니다. 15분 후 다시 시도하세요.", 429);
    try {
      await client.patch(ATTEMPT_ID).ifRevisionId(current._rev).set({ count: active ? current.count + 1 : 1,
        expiresAt: active ? current.expiresAt : Date.now() + WINDOW_MS }).commit({ visibility: "sync" });
      return;
    } catch (error) { if ((error as { statusCode?: number }).statusCode !== 409) throw error; }
  }
  throw new AuthError("로그인 요청이 겹쳤습니다. 잠시 후 다시 시도하세요.", 429);
}
export async function login(email: unknown, password: unknown) {
  if (typeof email !== "string" || email.length > 254 || typeof password !== "string" || password.length > 128)
    throw new AuthError("이메일과 비밀번호를 확인하세요.", 401);
  const { client, cfg } = await store();
  await reserveAttempt(client);
  let account = await readAccount(client);
  // Only a valid initial login may create the singleton account. Never overwrite a changed password.
  const hash = account?.passwordHash || await hashPassword(cfg.initialPassword);
  const validPassword = await verifyPassword(password, hash);
  if (email.trim().toLowerCase() !== cfg.email || !validPassword || (account && account.email !== cfg.email))
    throw new AuthError("이메일 또는 비밀번호가 일치하지 않습니다.", 401);
  if (!account) {
    const stored = await client.createIfNotExists({ _id: ACCOUNT_ID, _type: "adminAccount",
      ...encryptAccount({ email: cfg.email, passwordHash: hash, version: randomUUID() }) });
    account = decryptAccount(stored);
    if (account.email !== cfg.email || !await verifyPassword(password, account.passwordHash))
      throw new AuthError("계정이 변경되었습니다. 다시 로그인하세요.", 401);
  }
  return { token: sessionFor(account), email: account.email };
}
export async function changePassword(request: Request, currentPassword: unknown, newPassword: unknown) {
  const session = await requireSession(request);
  if (typeof currentPassword !== "string" || currentPassword.length > 128 || typeof newPassword !== "string" ||
    newPassword.length < 6 || newPassword.length > 128)
    throw new AuthError("새 비밀번호는 6~128자로 입력하세요.");
  if (newPassword === currentPassword) throw new AuthError("현재 비밀번호와 다른 비밀번호를 입력하세요.");
  const { client } = await store();
  await reserveAttempt(client);
  const account = await readAccount(client);
  if (!account || account.email !== session.email || account.version !== session.version || !await verifyPassword(currentPassword, account.passwordHash))
    throw new AuthError("현재 비밀번호가 일치하지 않습니다.", 401);
  try {
    await client.patch(ACCOUNT_ID).ifRevisionId(account._rev).set(encryptAccount({ email: account.email,
      passwordHash: await hashPassword(newPassword), version: randomUUID() })).commit({ visibility: "sync" });
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 409)
      throw new AuthError("계정이 먼저 변경되었습니다. 다시 로그인하세요.", 409);
    throw error;
  }
}
export function authFailure(error: unknown) {
  return Response.json({ error: error instanceof AuthError ? error.message : "인증 저장소 연결을 확인하세요." },
    { status: error instanceof AuthError ? error.status : 503, headers: { "Cache-Control": "no-store" } });
}
export const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production",
  path: "/admin", maxAge: SESSION_SECONDS };
