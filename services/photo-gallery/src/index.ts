import { AwsClient } from "aws4fetch";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

type Account = { id: string; email: string; role: "viewer" | "admin"; active: number };
type Session = Account & {
  tokenHash: string;
  csrfHash: string;
  expiresAt: number;
  licenceVersion: string | null;
};
type AccessIdentity = { sub: string; email: string; exp: number; raw: string; payload: JWTPayload };

const COOKIE = "photo_gallery_session";
const ADMIN_COOKIE = "photo_gallery_admin_csrf";
const MAX_BODY = 128_000;
const OTP_TTL = 10 * 60 * 1000;
const OTP_RESEND = 60 * 1000;
const ATTENDEE_SESSION_TTL = 30 * 24 * 60 * 60 * 1000;
const ADMIN_SESSION_TTL = 60 * 60 * 1000;
const DOWNLOAD_RETENTION = 90 * 24 * 60 * 60 * 1000;
const CASE_HISTORY_RETENTION = 365 * 24 * 60 * 60 * 1000;
const REPORT_ACCOUNT_LIMIT = 30;
const REPORT_PHOTO_LIMIT = 5;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ID_RE = /^[A-Za-z0-9_-]{1,128}$/;

const securityHeaders: Record<string, string> = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function json(value: unknown, status = 200, headers?: HeadersInit): Response {
  const merged = new Headers(securityHeaders);
  merged.set("Content-Type", "application/json; charset=utf-8");
  if (headers) new Headers(headers).forEach((v, k) => merged.set(k, v));
  return new Response(JSON.stringify(value), { status, headers: merged });
}

function error(message: string, status: number): Response {
  return json({ error: message }, status);
}

function requireSecret(value: string | undefined): string {
  if (!value || value.length < 32) throw new Error("missing secret");
  return value;
}

function randomBytes(size: number): Uint8Array {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return bytes;
}

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function randomToken(size = 32): string {
  return base64url(randomBytes(size));
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length < 3 || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function language(value: unknown): "en" | "fr" {
  return value === "fr" ? "fr" : "en";
}

async function hmac(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(requireSecret(secret)), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));
}

async function digest(value: string): Promise<string> {
  return base64url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))));
}

async function equalSecret(left: string, right: string): Promise<boolean> {
  const [a, b] = await Promise.all([crypto.subtle.digest("SHA-256", new TextEncoder().encode(left)), crypto.subtle.digest("SHA-256", new TextEncoder().encode(right))]);
  const av = new Uint8Array(a);
  const bv = new Uint8Array(b);
  let result = 0;
  for (let i = 0; i < av.length; i += 1) result |= av[i] ^ bv[i];
  return result === 0;
}

async function boundedJson(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new Error("json");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("json");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      length += next.value.byteLength;
      if (length > MAX_BODY) {
        await reader.cancel();
        throw new Error("large");
      }
      chunks.push(next.value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const value: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("json");
  return value as Record<string, unknown>;
}

function sameOrigin(request: Request, url: URL): boolean {
  return request.headers.get("origin") === url.origin && request.headers.get("sec-fetch-site") !== "cross-site";
}

function sameSite(request: Request, url: URL): boolean {
  const origin = request.headers.get("origin");
  return (!origin || origin === url.origin) && request.headers.get("sec-fetch-site") !== "cross-site";
}

function parseCookies(request: Request): Record<string, string> {
  const output: Record<string, string> = {};
  for (const part of request.headers.get("cookie")?.split(";") ?? []) {
    const index = part.indexOf("=");
    if (index > 0) output[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return output;
}

function cookie(value: string, maxAge: number): string {
  return `${COOKIE}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/photos; HttpOnly; Secure; SameSite=Strict`;
}

function clearCookie(): string {
  return `${COOKIE}=; Max-Age=0; Path=/photos; HttpOnly; Secure; SameSite=Strict`;
}

function photoId(value: string | undefined): boolean {
  return !!value && ID_RE.test(value);
}

function requestId(value: unknown): string | null {
  return typeof value === "string" && UUID_RE.test(value) ? value.toLowerCase() : null;
}

function approvedOrigin(request: Request, env: Env): string | null {
  const configured = String(env.APP_ORIGIN).trim();
  if (!configured) return null;
  try {
    return new URL(configured).origin;
  } catch {
    return null;
  }
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

async function accountForEmail(env: Env, email: string): Promise<Account | null> {
  return env.DB.prepare("SELECT id,email,role,active FROM accounts WHERE email_hash=? AND active=1 LIMIT 1").bind(await hmac(env.OTP_HMAC_SECRET, email)).first<Account>();
}

async function currentLicence(env: Env): Promise<string> {
  const row = await env.DB.prepare("SELECT version FROM licence_versions WHERE current=1 ORDER BY created_at DESC LIMIT 1").first<{ version: string }>();
  return row?.version ?? env.CURRENT_LICENCE_VERSION;
}

async function sessionForRequest(request: Request, env: Env): Promise<Session | null> {
  const token = parseCookies(request)[COOKIE];
  if (!token) return null;
  const tokenHash = await hmac(env.SESSION_HMAC_SECRET, token);
  const row = await env.DB.prepare("SELECT s.token_hash as tokenHash,s.csrf_hash as csrfHash,s.expires_at as expiresAt,s.licence_version as licenceVersion,a.id,a.email,a.role,a.active FROM sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.revoked_at IS NULL LIMIT 1").bind(tokenHash).first<Session>();
  if (!row || !row.active || row.expiresAt <= Date.now()) return null;
  return row;
}

async function attendeeSession(request: Request, env: Env): Promise<{ session: Session; token: string } | null> {
  const session = await sessionForRequest(request, env);
  if (!session) return null;
  const token = parseCookies(request)[COOKIE];
  return token ? { session, token } : null;
}

async function requireCsrf(request: Request, env: Env, session: Session): Promise<boolean> {
  const supplied = request.headers.get("x-csrf-token");
  return !!supplied && (await equalSecret(await hmac(env.SESSION_HMAC_SECRET, supplied), session.csrfHash));
}

async function issueOtp(email: string): Promise<string> {
  const max = Math.floor(0xffffffff / 100000000) * 100000000;
  let number: number;
  do number = new DataView(randomBytes(4).buffer).getUint32(0); while (number >= max);
  return String(number % 100000000).padStart(8, "0");
}

async function sendSes(env: Env, to: string[], subject: string, text: string, html?: string): Promise<void> {
  if (!env.SES_REGION || !env.SES_FROM_EMAIL || !env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) throw new Error("SES is not configured");
  const body = new URLSearchParams({
    Action: "SendEmail",
    Version: "2010-12-01",
    Source: env.SES_FROM_EMAIL,
    "Message.Subject.Data": subject,
    "Message.Subject.Charset": "UTF-8",
    "Message.Body.Text.Data": text,
    "Message.Body.Text.Charset": "UTF-8",
    ...(html ? { "Message.Body.Html.Data": html, "Message.Body.Html.Charset": "UTF-8" } : {}),
  });
  for (const [index, address] of to.entries()) body.set(`Destination.ToAddresses.member.${index + 1}`, address);
  const client = new AwsClient({ accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY, region: env.SES_REGION, service: "ses" });
  const response = await client.fetch(`https://email.${env.SES_REGION}.amazonaws.com/`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded; charset=utf-8" }, body: body.toString() });
  if (!response.ok) throw new Error(`SES ${response.status}`);
}

async function processOutbox(env: Env): Promise<void> {
  if (!env.SES_REGION || !env.SES_FROM_EMAIL || !env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) return;
  const now = Date.now();
  const rows = await env.DB.prepare("SELECT id,kind,payload_json as payloadJson,attempts FROM notification_outbox WHERE sent_at IS NULL AND available_at<=? AND (locked_until IS NULL OR locked_until<?) AND (kind='removal' OR created_at>?) ORDER BY created_at LIMIT 10").bind(now, now, now - OTP_TTL).all<{ id: string; kind: string; payloadJson: string; attempts: number }>();
  for (const row of rows.results) {
    const lock = await env.DB.prepare("UPDATE notification_outbox SET locked_until=? WHERE id=? AND sent_at IS NULL AND (locked_until IS NULL OR locked_until<?) RETURNING id").bind(now + 60_000, row.id, now).first<{ id: string }>();
    if (!lock) continue;
    try {
      const payload = JSON.parse(row.payloadJson) as { to: string | string[]; subject: string; text: string; html?: string };
      const recipients = Array.isArray(payload.to) ? payload.to : payload.to.split(",").map((value) => value.trim()).filter(Boolean);
      if (!recipients.length) throw new Error("SES recipients are not configured");
      await sendSes(env, recipients, payload.subject, payload.text, payload.html);
      // OTP and removal payloads contain personal data. Keep delivery status for
      // diagnostics, but erase the body as soon as the message is accepted.
      await env.DB.prepare("UPDATE notification_outbox SET sent_at=?,payload_json='{}',locked_until=NULL,last_error=NULL WHERE id=?").bind(Date.now(), row.id).run();
    } catch (caught) {
      const attempt = row.attempts + 1;
      const delay = Math.min(24 * 60 * 60 * 1000, 60_000 * 2 ** Math.min(attempt, 10));
      await env.DB.prepare("UPDATE notification_outbox SET attempts=?,available_at=?,locked_until=NULL,last_error=? WHERE id=?").bind(attempt, Date.now() + delay, caught instanceof Error ? caught.message.slice(0, 200) : "send_failed", row.id).run();
    }
  }
}

async function accessIdentity(request: Request, env: Env): Promise<AccessIdentity> {
  const teamSetting = String(env.ACCESS_TEAM);
  const audience = String(env.ACCESS_AUD);
  if (!teamSetting || !audience) throw new Error("access not configured");
  const raw = request.headers.get("cf-access-jwt-assertion") ?? parseCookies(request).CF_Authorization;
  if (!raw) throw new Error("access token");
  const team = teamSetting.replace(/\/$/, "");
  const jwks = createRemoteJWKSet(new URL(`${team}/cdn-cgi/access/certs`));
  const verified = await jwtVerify(raw, jwks, { issuer: team, audience, algorithms: ["RS256"] });
  const email = normalizeEmail(verified.payload.email);
  const sub = typeof verified.payload.sub === "string" ? verified.payload.sub : null;
  if (!email || !sub || !email.endsWith("@ctn-rtc.org") || !verified.payload.exp || verified.payload.exp * 1000 <= Date.now()) throw new Error("access identity");
  // The Google-only identity-provider policy is enforced by the Cloudflare Access
  // application. Access JWTs do not expose one stable provider claim, so the
  // Worker relies on the signed issuer/audience/domain/expiry checks above.
  return { sub, email, exp: verified.payload.exp, raw, payload: verified.payload };
}

async function adminCsrf(identity: AccessIdentity, env: Env): Promise<string> {
  return hmac(env.SESSION_HMAC_SECRET, `admin:${identity.sub}:${identity.exp}:${String(env.ACCESS_AUD)}`);
}

async function requireAdminCsrf(request: Request, identity: AccessIdentity, env: Env): Promise<boolean> {
  const supplied = request.headers.get("x-csrf-token");
  return !!supplied && (await equalSecret(supplied, await adminCsrf(identity, env)));
}

async function album(env: Env): Promise<Response> {
  const photos = await env.DB.prepare("SELECT p.id,p.category,p.filename,p.version,p.width,p.height,t.width as thumbnailWidth,t.height as thumbnailHeight,t.bytes as thumbnailBytes,pr.width as previewWidth,pr.height as previewHeight,pr.bytes as previewBytes,f.width as fullWidth,f.height as fullHeight,f.bytes as fullBytes,q.width as quickWidth,q.height as quickHeight,q.bytes as quickBytes FROM photos p JOIN photo_variants t ON t.photo_id=p.id AND t.format='thumbnail' JOIN photo_variants pr ON pr.photo_id=p.id AND pr.format='preview' JOIN photo_variants f ON f.photo_id=p.id AND f.format='full' LEFT JOIN photo_variants q ON q.photo_id=p.id AND q.format='quick' WHERE p.status='published' ORDER BY p.category,p.filename").all<Record<string, string | number>>();
  return json({ version: env.CURRENT_LICENCE_VERSION, photos: photos.results.map((row) => ({ id: row.id, category: row.category, filename: row.filename, version: String(row.version), width: row.width, height: row.height, thumbnail: { url: `/photos/media/${row.id}/thumbnail`, width: row.thumbnailWidth, height: row.thumbnailHeight, bytes: row.thumbnailBytes }, preview: { url: `/photos/media/${row.id}/preview`, width: row.previewWidth, height: row.previewHeight, bytes: row.previewBytes }, downloads: { full: { width: row.fullWidth, height: row.fullHeight, bytes: row.fullBytes }, quick: { width: row.quickWidth ?? row.previewWidth, height: row.quickHeight ?? row.previewHeight, bytes: row.quickBytes ?? row.previewBytes } } })) });
}

async function imageResponse(request: Request, env: Env, id: string, format: "thumbnail" | "preview" | "review", admin: boolean): Promise<Response> {
  const row = admin
    ? await env.DB.prepare("SELECT p.id,p.status,p.filename,v.object_key as objectKey,v.content_type as contentType,v.bytes,v.sha256 FROM photos p JOIN photo_variants v ON v.photo_id=p.id AND v.format='preview' WHERE p.id=? LIMIT 1").bind(id).first<{ id: string; status: string; filename: string; objectKey: string; contentType: string; bytes: number; sha256: string | null }>()
    : await env.DB.prepare("SELECT p.id,p.status,p.filename,v.object_key as objectKey,v.content_type as contentType,v.bytes,v.sha256 FROM photos p JOIN photo_variants v ON v.photo_id=p.id AND v.format=? WHERE p.id=? AND p.status='published' LIMIT 1").bind(format, id).first<{ id: string; status: string; filename: string; objectKey: string; contentType: string; bytes: number; sha256: string | null }>();
  if (!row) return error("Not found.", 404);
  const object = await env.PHOTO_BUCKET.get(row.objectKey);
  if (!object?.body) return error("Not found.", 404);
  if (!admin) {
    const publication = await env.DB.prepare("SELECT status FROM photos WHERE id=? LIMIT 1").bind(id).first<{ status: string }>();
    if (!publication || publication.status !== "published") return error("Not found.", 404);
  }
  const headers = new Headers({ ...securityHeaders, "Content-Type": row.contentType || "image/jpeg", "Content-Length": String(row.bytes), "Cache-Control": admin ? "private, no-store" : "private, max-age=60, must-revalidate" });
  if (row.sha256) headers.set("ETag", `"${row.sha256}"`);
  if (request.headers.get("if-none-match") && row.sha256 && request.headers.get("if-none-match") === `"${row.sha256}"`) return new Response(null, { status: 304, headers });
  return new Response(object.body, { headers });
}

function rangeHeader(value: string | null, size: number): { start: number; end: number } | null {
  if (!value || !value.startsWith("bytes=") || value.includes(",")) return null;
  const [startText, endText] = value.slice(6).split("-");
  if (!startText && !endText) return null;
  const suffix = !startText ? Number(endText) : null;
  if (suffix !== null) {
    if (!Number.isInteger(suffix) || suffix <= 0) return null;
    return { start: Math.max(0, size - suffix), end: size - 1 };
  }
  const start = Number(startText);
  const end = endText ? Number(endText) : size - 1;
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || start >= size) return null;
  return { start, end: Math.min(end, size - 1) };
}

async function downloadResponse(request: Request, env: Env, id: string): Promise<Response> {
  const sessionResult = await attendeeSession(request, env);
  if (!sessionResult) return error("Authentication required.", 401);
  const current = await currentLicence(env);
  if (sessionResult.session.licenceVersion !== current) return error("Please acknowledge the current licence before downloading.", 428);
  const format = new URL(request.url).searchParams.get("format");
  if (format !== "full" && format !== "quick") return error("Invalid download format.", 400);
  const reqId = requestId(new URL(request.url).searchParams.get("requestId"));
  if (!reqId) return error("A valid requestId is required.", 400);
  const row = await env.DB.prepare("SELECT p.id,p.version,p.filename,p.status,v.object_key as objectKey,v.content_type as contentType,v.bytes,v.sha256 FROM photos p JOIN photo_variants v ON v.photo_id=p.id AND v.format=? WHERE p.id=? AND p.status='published' LIMIT 1").bind(format, id).first<{ id: string; version: number; filename: string; status: string; objectKey: string; contentType: string; bytes: number; sha256: string | null }>();
  if (!row) return error("Not found.", 404);
  const requestedRange = request.headers.get("range");
  const etag = row.sha256 ? `"${row.sha256}"` : `"${row.version}-${row.bytes}"`;
  const ifRange = request.headers.get("if-range");
  const useRange = requestedRange && (!ifRange || ifRange === etag);
  const range = useRange ? rangeHeader(requestedRange, row.bytes) : null;
  if (requestedRange && useRange && !range) return new Response(null, { status: 416, headers: { ...securityHeaders, "Content-Range": `bytes */${row.bytes}` } });
  const prior = await env.DB.prepare("SELECT account_id as accountId,photo_id as photoId,format,photo_version as photoVersion FROM download_requests WHERE request_id=? LIMIT 1").bind(reqId).first<{ accountId: string; photoId: string; format: string; photoVersion: number }>();
  if (prior && (prior.accountId !== sessionResult.session.id || prior.photoId !== id || prior.format !== format)) return error("That requestId is already bound to another download.", 409);
  const object = await env.PHOTO_BUCKET.get(row.objectKey, range ? { range: { offset: range.start, length: range.end - range.start + 1 } } : undefined);
  if (!object?.body) return error("Not found.", 404);
  const publication = await env.DB.prepare("SELECT status FROM photos WHERE id=? LIMIT 1").bind(id).first<{ status: string }>();
  if (!publication || publication.status !== "published") return error("Not found.", 404);
  const inserted = await env.DB.prepare("INSERT OR IGNORE INTO download_requests(request_id,account_id,photo_id,photo_version,format,created_at) VALUES(?,?,?,?,?,?)").bind(reqId, sessionResult.session.id, id, row.version, format, Date.now()).run();
  if (!inserted.meta.changes) {
    const binding = await env.DB.prepare("SELECT account_id as accountId,photo_id as photoId,format FROM download_requests WHERE request_id=? LIMIT 1").bind(reqId).first<{ accountId: string; photoId: string; format: string }>();
    if (!binding || binding.accountId !== sessionResult.session.id || binding.photoId !== id || binding.format !== format) return error("That requestId is already bound to another download.", 409);
  }
  if (inserted.meta.changes > 0) {
    const day = new Date().toISOString().slice(0, 10);
    const full = format === "full" ? 1 : 0;
    const quick = format === "quick" ? 1 : 0;
    await env.DB.prepare("INSERT INTO daily_aggregates(day,photo_id,downloads,full_downloads,quick_downloads) VALUES(?,?,1,?,?) ON CONFLICT(day,photo_id) DO UPDATE SET downloads=downloads+1,full_downloads=full_downloads+excluded.full_downloads,quick_downloads=quick_downloads+excluded.quick_downloads").bind(day, id, full, quick).run();
  }
  const headers = new Headers({ ...securityHeaders, "Cache-Control": "private, no-store", "Content-Type": row.contentType || "image/jpeg", "Content-Disposition": `attachment; filename="${row.filename.replace(/[\"\r\n]/g, "_")}"`, "Accept-Ranges": "bytes", "ETag": etag });
  if (range) {
    headers.set("Content-Length", String(range.end - range.start + 1));
    headers.set("Content-Range", `bytes ${range.start}-${range.end}/${row.bytes}`);
    return new Response(object.body, { status: 206, headers });
  }
  headers.set("Content-Length", String(row.bytes));
  return new Response(object.body, { headers });
}

async function removal(request: Request, env: Env, id: string, ctx: ExecutionContext): Promise<Response> {
  const sessionResult = await attendeeSession(request, env);
  if (!sessionResult) return error("Authentication required.", 401);
  if (!(await requireCsrf(request, env, sessionResult.session))) return error("Invalid CSRF token.", 403);
  const body = await boundedJson(request);
  if (body.albumVisit !== undefined && typeof body.albumVisit !== "boolean") return error("Invalid albumVisit.", 400);
  const explanation = typeof body.explanation === "string" ? body.explanation.trim() : "";
  const reqId = requestId(body.requestId);
  if (!explanation || explanation.length > 2000 || !reqId) return error("A nonblank explanation and valid requestId are required.", 400);
  const photo = await env.DB.prepare("SELECT id,category,filename,status,version FROM photos WHERE id=? LIMIT 1").bind(id).first<{ id: string; category: string; filename: string; status: string; version: number }>();
  if (!photo) return error("Not found.", 404);
  const caseId = (await digest(`case:${sessionResult.session.id}:${id}:${reqId}`)).slice(0, 42);
  const existing = await env.DB.prepare("SELECT case_id as caseId FROM removal_reports WHERE photo_id=? AND requester_account_id=? AND request_id=? LIMIT 1").bind(id, sessionResult.session.id, reqId).first<{ caseId: string }>();
  if (existing) return json({ caseId: existing.caseId }, 202);
  const outboxId = (await digest(`outbox:${caseId}`)).slice(0, 42);
  const now = Date.now();
  const origin = approvedOrigin(request, env);
  const reviewUrl = origin ? `${origin}/photos/manage?case=${encodeURIComponent(caseId)}` : "/photos/manage";
  const requester = sessionResult.session.email;
  const safeReason = escapeHtml(explanation);
  const reportId = await digest(`report:${caseId}`);
  const outboxPayload = JSON.stringify({ to: String(env.MODERATOR_EMAILS), subject: `Photo removal request / Demande de retrait ${caseId}`, text: `Review request / Examiner la demande: ${caseId} for photo / pour la photo ${id}.\nRequester / Demandeur: ${requester}\nReason / Motif: ${explanation}\nReview / Examiner: ${reviewUrl}`, html: `<p>Photo removal request / Demande de retrait <strong>${escapeHtml(caseId)}</strong></p><p>Photo: ${escapeHtml(id)}</p><p>Requester / Demandeur: ${escapeHtml(requester)}</p><p>Reason / Motif: ${safeReason}</p><p><a href=\"${escapeHtml(reviewUrl)}\">Review request / Examiner la demande</a></p>` });
  const hourAgo = now - 60 * 60 * 1000;
  // The conditional INSERT is the quota gate. It runs in the same D1 batch as
  // report creation, so parallel requests cannot both pass a pre-count.
  const results = await env.DB.batch([
    env.DB.prepare("INSERT OR IGNORE INTO removal_cases(id,photo_id,requester_account_id,explanation,status,photo_version,cross_channel_reviewed,created_at,updated_at) SELECT ?,?,?,?,'pending',?,0,?,? WHERE (SELECT COUNT(*) FROM removal_reports WHERE requester_account_id=? AND created_at>=?) < ? AND (SELECT COUNT(*) FROM removal_reports WHERE requester_account_id=? AND photo_id=? AND created_at>=?) < ?").bind(caseId, id, sessionResult.session.id, explanation, photo.version + 1, now, now, sessionResult.session.id, hourAgo, REPORT_ACCOUNT_LIMIT, sessionResult.session.id, id, hourAgo, REPORT_PHOTO_LIMIT),
    env.DB.prepare("INSERT OR IGNORE INTO removal_reports(id,case_id,photo_id,requester_account_id,explanation,request_id,status,photo_version,created_at) SELECT ?,?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM removal_cases WHERE id=? AND status='pending')").bind(reportId, caseId, id, sessionResult.session.id, explanation, reqId, "pending", photo.version + 1, now, caseId),
    env.DB.prepare("INSERT OR IGNORE INTO notification_outbox(id,kind,payload_json,attempts,available_at,created_at) SELECT ?,'removal',?,0,?,? WHERE EXISTS (SELECT 1 FROM removal_reports WHERE id=? AND status='pending')").bind(outboxId, outboxPayload, now, now, reportId),
  ]);
  if (!results[1]?.meta.changes) {
    const raced = await env.DB.prepare("SELECT case_id as caseId FROM removal_reports WHERE photo_id=? AND requester_account_id=? AND request_id=? LIMIT 1").bind(id, sessionResult.session.id, reqId).first<{ caseId: string }>();
    if (raced) return json({ caseId: raced.caseId }, 202);
    return error("Removal request limit reached. Please try again later.", 429);
  }
  ctx.waitUntil(processOutbox(env));
  return json({ caseId }, 202);
}

async function events(request: Request, env: Env): Promise<Response> {
  const sessionResult = await attendeeSession(request, env);
  if (!sessionResult) return error("Authentication required.", 401);
  if (!(await requireCsrf(request, env, sessionResult.session))) return error("Invalid CSRF token.", 403);
  const body = await boundedJson(request);
  if (!Array.isArray(body.photoIds) || body.photoIds.length > 50 || body.photoIds.some((id) => !photoId(typeof id === "string" ? id : undefined))) return error("Invalid photoIds.", 400);
  const now = Date.now();
  const viewerKey = await hmac(env.SESSION_HMAC_SECRET, `viewer-session:${sessionResult.session.tokenHash}`);
  const statements: D1PreparedStatement[] = [];
  for (const id of [...new Set(body.photoIds as string[])]) {
    const inserted = await env.DB.prepare("INSERT OR IGNORE INTO viewer_opens(photo_id,session_key,opened_at) SELECT id,?,? FROM photos WHERE id=? AND status='published'").bind(viewerKey, now, id).run();
    if (inserted.meta.changes > 0) statements.push(env.DB.prepare("INSERT INTO daily_aggregates(day,photo_id,opens) VALUES(?,?,1) ON CONFLICT(day,photo_id) DO UPDATE SET opens=opens+1").bind(new Date(now).toISOString().slice(0, 10), id));
  }
  if (statements.length) await env.DB.batch(statements);
  if (body.albumVisit === true) await env.DB.prepare("INSERT INTO album_visits(day,visits) VALUES(?,1) ON CONFLICT(day) DO UPDATE SET visits=visits+1").bind(new Date(now).toISOString().slice(0, 10)).run();
  return json({ accepted: true });
}

type QueueCursor = { bucket: 0 | 1; createdAt: number; id: string };

function encodeQueueCursor(value: QueueCursor): string {
  return base64url(new TextEncoder().encode(JSON.stringify(value)));
}

function decodeQueueCursor(value: string | null): QueueCursor | null {
  if (!value || value.length > 512 || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - value.length % 4) % 4);
    const text = atob(padded);
    const parsed = JSON.parse(text) as Partial<QueueCursor>;
    if ((parsed.bucket !== 0 && parsed.bucket !== 1) || typeof parsed.createdAt !== "number" || !Number.isSafeInteger(parsed.createdAt) || typeof parsed.id !== "string" || !ID_RE.test(parsed.id)) return null;
    return { bucket: parsed.bucket, createdAt: parsed.createdAt, id: parsed.id };
  } catch {
    return null;
  }
}

async function manageSummary(request: Request, env: Env): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const rawCursor = params.get("cursor");
  const selectedCaseId = params.get("case");
  if (selectedCaseId && (!ID_RE.test(selectedCaseId) || rawCursor)) return error(rawCursor ? "Use either cursor or case, not both." : "Invalid case identifier.", 400);
  if (rawCursor && !decodeQueueCursor(rawCursor)) return error("Invalid queue cursor.", 400);
  const cursor = decodeQueueCursor(rawCursor);
  const pendingTotal = await env.DB.prepare("SELECT COUNT(*) as count FROM removal_cases WHERE status='pending'").first<{ count: number }>();
  const selectFields = "SELECT c.id,c.photo_id as photoId,p.filename,p.category,p.version as photoVersion,p.status as photoStatus,c.explanation,a.email as requesterEmail,c.created_at as createdAt,c.status,c.cross_channel_reviewed as crossChannelReviewed,(SELECT COUNT(*) FROM removal_reports r WHERE r.photo_id=c.photo_id AND r.status='pending') as unresolvedReports FROM removal_cases c JOIN photos p ON p.id=c.photo_id JOIN accounts a ON a.id=c.requester_account_id";
  const cursorSql = cursor
    ? "WHERE (CASE WHEN c.status='pending' THEN 0 ELSE 1 END > ? OR (CASE WHEN c.status='pending' THEN 0 ELSE 1 END = ? AND (c.created_at < ? OR (c.created_at = ? AND c.id < ?))))"
    : "";
  const selected = selectedCaseId ? await env.DB.prepare(`${selectFields} WHERE c.id=? LIMIT 1`).bind(selectedCaseId).all<Record<string, string | number>>() : { results: [] as Record<string, string | number>[] };
  const cases = selectedCaseId ? { results: [] as Record<string, string | number>[] } : await env.DB.prepare(`${selectFields} ${cursorSql} ORDER BY CASE WHEN c.status='pending' THEN 0 ELSE 1 END,c.created_at DESC,c.id DESC LIMIT 201`).bind(...(cursor ? [cursor.bucket, cursor.bucket, cursor.createdAt, cursor.createdAt, cursor.id] : [])).all<Record<string, string | number>>();
  const page = cases.results.slice(0, 200);
  const last = page.at(-1);
  const hasMore = cases.results.length > page.length;
  const present = (row: Record<string, string | number>) => ({ ...row, photoVersion: Number(row.photoVersion), createdAt: Number(row.createdAt), unresolvedReports: Number(row.unresolvedReports), crossChannelReviewed: Boolean(row.crossChannelReviewed), previewUrl: `/photos/api/manage/photos/${row.photoId}/preview` });
  const aggregates = await env.DB.prepare("SELECT p.id as photoId,p.filename,p.category,COALESCE(SUM(CASE WHEN d.day>=date('now','-90 day') THEN d.opens ELSE 0 END),0) as opens,COALESCE(SUM(CASE WHEN d.day>=date('now','-90 day') THEN d.downloads ELSE 0 END),0) as downloads,COALESCE(SUM(CASE WHEN d.day>=date('now','-90 day') THEN d.full_downloads ELSE 0 END),0) as fullDownloads,COALESCE(SUM(CASE WHEN d.day>=date('now','-90 day') THEN d.quick_downloads ELSE 0 END),0) as quickDownloads FROM photos p LEFT JOIN daily_aggregates d ON d.photo_id=p.id GROUP BY p.id,p.filename,p.category ORDER BY p.id LIMIT 500").all<{ photoId: string; filename: string; category: string; opens: number; downloads: number; fullDownloads: number; quickDownloads: number }>();
  const albumVisits = await env.DB.prepare("SELECT COALESCE(SUM(visits),0) as visits FROM album_visits WHERE day>=date('now','-90 day')").first<{ visits: number }>();
  const diagnostics = await env.DB.prepare("SELECT SUM(CASE WHEN sent_at IS NULL THEN 1 ELSE 0 END) as pendingNotifications,SUM(CASE WHEN sent_at IS NULL AND attempts>0 THEN 1 ELSE 0 END) as failedNotifications FROM notification_outbox").first<{ pendingNotifications: number | null; failedNotifications: number | null }>();
  return json({ cases: page.map(present), selectedCases: selected.results.map(present), pendingTotal: Number(pendingTotal?.count ?? 0), nextCursor: selectedCaseId ? null : hasMore && last ? encodeQueueCursor({ bucket: last.status === "pending" ? 0 : 1, createdAt: Number(last.createdAt), id: String(last.id) }) : null, aggregates: aggregates.results, albumVisits: Number(albumVisits?.visits ?? 0), diagnostics: { pendingNotifications: diagnostics?.pendingNotifications ?? 0, failedNotifications: diagnostics?.failedNotifications ?? 0 } });
}

async function manageCase(request: Request, env: Env, identity: AccessIdentity, caseId: string): Promise<Response> {
  if (!(await requireAdminCsrf(request, identity, env)) || !sameOrigin(request, new URL(request.url))) return error("Invalid CSRF token.", 403);
  const body = await boundedJson(request);
  const action = body.action;
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  const expectedVersion = typeof body.expectedVersion === "number" ? body.expectedVersion : Number.NaN;
  if (!["dismiss", "withdraw", "duplicate", "restore"].includes(String(action)) || !reason || reason.length > 2000 || !Number.isInteger(expectedVersion) || expectedVersion < 1) return error("Invalid moderation action.", 400);
  const row = await env.DB.prepare("SELECT c.id,c.photo_id as photoId,c.status as caseStatus,p.version,p.status as photoStatus FROM removal_cases c JOIN photos p ON p.id=c.photo_id WHERE c.id=? LIMIT 1").bind(caseId).first<{ id: string; photoId: string; caseStatus: string; version: number; photoStatus: string }>();
  if (!row) return error("Not found.", 404);
  if (row.version !== expectedVersion) return error("The case changed; reload before acting.", 409);
  const operationId = crypto.randomUUID();
  if (action === "restore") {
    const now = Date.now();
    const results = await env.DB.batch([
      env.DB.prepare("UPDATE photos SET status='published',version=version+1,moderation_operation_id=?,updated_at=? WHERE id=? AND version=? AND status='quarantined' AND NOT EXISTS (SELECT 1 FROM removal_reports WHERE photo_id=? AND status='pending')").bind(operationId, now, row.photoId, expectedVersion, row.photoId),
      env.DB.prepare("UPDATE removal_cases SET moderation_operation_id=?,cross_channel_reviewed=?,updated_at=? WHERE id=? AND EXISTS (SELECT 1 FROM photos WHERE id=? AND status='published' AND version=? AND moderation_operation_id=?)").bind(operationId, body.crossChannelReviewed === true ? 1 : 0, now, caseId, row.photoId, expectedVersion + 1, operationId),
      env.DB.prepare("INSERT INTO moderation_audit(id,actor_account_id,action,case_id,photo_id,reason,expected_version,created_at) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM photos WHERE id=? AND status='published' AND version=? AND moderation_operation_id=?)").bind(crypto.randomUUID(), identity.sub, "restore", caseId, row.photoId, reason, expectedVersion, now, row.photoId, expectedVersion + 1, operationId),
    ]);
    if (!results[0]?.meta.changes) return error("Resolve all pending reports and reload before restoring.", 409);
    return json({ restored: true, version: expectedVersion + 1 });
  }
  const nextStatus = ({ dismiss: "dismissed", withdraw: "withdrawn", duplicate: "duplicate" } as const)[action as "dismiss" | "withdraw" | "duplicate"];
  if (row.caseStatus !== "pending") return error("This case is already resolved.", 409);
  const now = Date.now();
  const results = action === "withdraw"
    ? await env.DB.batch([
      env.DB.prepare("UPDATE photos SET status='withdrawn',version=version+1,moderation_operation_id=?,updated_at=? WHERE id=? AND version=? AND status IN ('published','quarantined') AND EXISTS (SELECT 1 FROM removal_cases WHERE id=? AND status='pending')").bind(operationId, now, row.photoId, expectedVersion, caseId),
      env.DB.prepare("UPDATE removal_cases SET status='withdrawn',moderation_operation_id=?,cross_channel_reviewed=CASE WHEN ?=1 THEN 1 ELSE cross_channel_reviewed END,updated_at=? WHERE id=? AND status='pending' AND EXISTS (SELECT 1 FROM photos WHERE id=? AND status='withdrawn' AND version=? AND moderation_operation_id=?)").bind(operationId, body.crossChannelReviewed === true ? 1 : 0, now, caseId, row.photoId, expectedVersion + 1, operationId),
      env.DB.prepare("UPDATE removal_reports SET status='withdrawn',resolved_at=? WHERE case_id=? AND status='pending' AND EXISTS (SELECT 1 FROM photos WHERE id=? AND status='withdrawn' AND version=? AND moderation_operation_id=?)").bind(now, caseId, row.photoId, expectedVersion + 1, operationId),
      env.DB.prepare("INSERT INTO moderation_audit(id,actor_account_id,action,case_id,photo_id,reason,expected_version,created_at) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM photos WHERE id=? AND status='withdrawn' AND version=? AND moderation_operation_id=?)").bind(crypto.randomUUID(), identity.sub, action, caseId, row.photoId, reason, expectedVersion, now, row.photoId, expectedVersion + 1, operationId),
    ])
    : await env.DB.batch([
      env.DB.prepare("UPDATE removal_cases SET status=?,moderation_operation_id=?,cross_channel_reviewed=CASE WHEN ?=1 THEN 1 ELSE cross_channel_reviewed END,updated_at=? WHERE id=? AND status='pending' AND EXISTS (SELECT 1 FROM photos WHERE id=? AND version=?)").bind(nextStatus, operationId, body.crossChannelReviewed === true ? 1 : 0, now, caseId, row.photoId, expectedVersion),
      env.DB.prepare("UPDATE removal_reports SET status=?,resolved_at=? WHERE case_id=? AND status='pending' AND EXISTS (SELECT 1 FROM removal_cases WHERE id=? AND status=? AND moderation_operation_id=? AND EXISTS (SELECT 1 FROM photos WHERE id=? AND version=?))").bind(nextStatus, now, caseId, caseId, nextStatus, operationId, row.photoId, expectedVersion),
      env.DB.prepare("INSERT INTO moderation_audit(id,actor_account_id,action,case_id,photo_id,reason,expected_version,created_at) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM removal_cases WHERE id=? AND status=? AND moderation_operation_id=? AND EXISTS (SELECT 1 FROM photos WHERE id=? AND version=?))").bind(crypto.randomUUID(), identity.sub, action, caseId, row.photoId, reason, expectedVersion, now, caseId, nextStatus, operationId, row.photoId, expectedVersion),
    ]);
  if (!results[0]?.meta.changes) return error("The case changed; reload before acting.", 409);
  return json({ status: nextStatus });
}

async function rights(request: Request, env: Env, identity: AccessIdentity, id: string): Promise<Response> {
  if (!sameSite(request, new URL(request.url))) return error("Same-origin request required.", 403);
  const rawCursor = new URL(request.url).searchParams.get("cursor");
  let cursor: { createdAt: number; id: string } | null = null;
  if (rawCursor) {
    if (rawCursor.length > 512 || !/^[A-Za-z0-9_-]+$/.test(rawCursor)) return error("Invalid rights cursor.", 400);
    try {
      const padded = rawCursor.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - rawCursor.length % 4) % 4);
      const parsed = JSON.parse(atob(padded)) as { createdAt?: number; id?: string };
      if (typeof parsed.createdAt !== "number" || !Number.isSafeInteger(parsed.createdAt) || typeof parsed.id !== "string" || !ID_RE.test(parsed.id)) return error("Invalid rights cursor.", 400);
      cursor = { createdAt: parsed.createdAt, id: parsed.id };
    } catch {
      return error("Invalid rights cursor.", 400);
    }
  }
  await env.DB.prepare("INSERT INTO moderation_audit(id,actor_account_id,action,photo_id,reason,created_at) VALUES(?,?,?,?,?,?)").bind(crypto.randomUUID(), identity.sub, "rights_lookup", id, "Audited rights follow-up lookup", Date.now()).run();
  const cutoff = Date.now() - DOWNLOAD_RETENTION;
  const cursorSql = cursor ? " AND (d.created_at<? OR (d.created_at=? AND d.request_id<?))" : "";
  const bindings = cursor ? [id, cutoff, cursor.createdAt, cursor.createdAt, cursor.id] : [id, cutoff];
  const rows = await env.DB.prepare(`SELECT a.email,d.format,d.created_at as createdAt,d.request_id as requestId FROM download_requests d JOIN accounts a ON a.id=d.account_id WHERE d.photo_id=? AND d.created_at>=?${cursorSql} ORDER BY d.created_at DESC,d.request_id DESC LIMIT 501`).bind(...bindings).all<{ email: string; format: "full" | "quick"; createdAt: number; requestId: string }>();
  const page = rows.results.slice(0, 500);
  const last = page.at(-1);
  const nextCursor = rows.results.length > page.length && last ? base64url(new TextEncoder().encode(JSON.stringify({ createdAt: Number(last.createdAt), id: last.requestId }))) : null;
  return json({ requests: page, nextCursor });
}

async function handle(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/photos/")) return error("Not found.", 404);
  if (request.method === "OPTIONS") return error("Method not allowed.", 405);

  if (url.pathname === "/photos/api/auth/session" && request.method === "GET") {
    const session = await sessionForRequest(request, env);
    if (!session) return json({ authenticated: false });
    return json({ authenticated: true, csrfToken: await hmac(env.SESSION_HMAC_SECRET, `${session.tokenHash}:${session.expiresAt}`), accountId: session.id, administrator: false, licenceVersion: session.licenceVersion ?? undefined, expiresAt: session.expiresAt });
  }
  if (url.pathname === "/photos/api/auth/request" && request.method === "POST") {
    if (!sameOrigin(request, url)) return error("Same-origin request required.", 403);
    try {
      const body = await boundedJson(request);
      const email = normalizeEmail(body.email);
      if (!email) return error("Request accepted.", 202);
      const account = await accountForEmail(env, email);
      const emailHash = await hmac(env.OTP_HMAC_SECRET, email);
      const ipHash = await hmac(env.OTP_HMAC_SECRET, request.headers.get("cf-connecting-ip") ?? "unknown-ip");
      const code = await issueOtp(email);
      const now = Date.now();
      const challengeId = crypto.randomUUID();
      const emailHourAgo = now - 60 * 60 * 1000;
      const ipWindowAgo = now - 10 * 60 * 1000;
      const statements: D1PreparedStatement[] = [
        env.DB.prepare("INSERT INTO code_challenges(id,account_id,email,email_hash,code_hash,language,created_at,expires_at,resend_after,request_ip_hash) SELECT ?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM code_challenges WHERE email_hash=? AND consumed_at IS NULL AND resend_after>?) AND (SELECT COUNT(*) FROM code_challenges WHERE request_ip_hash=? AND created_at>?) < 10 AND (SELECT COUNT(*) FROM code_challenges WHERE email_hash=? AND created_at>?) < 5").bind(challengeId, account?.id ?? null, email, emailHash, await hmac(env.OTP_HMAC_SECRET, `${email}:${code}`), language(body.language), now, now + OTP_TTL, now + OTP_RESEND, ipHash, emailHash, now, ipHash, ipWindowAgo, emailHash, emailHourAgo),
        env.DB.prepare("UPDATE code_challenges SET consumed_at=? WHERE email_hash=? AND consumed_at IS NULL AND id<>? AND EXISTS (SELECT 1 FROM code_challenges WHERE id=? AND consumed_at IS NULL)").bind(now, emailHash, challengeId, challengeId),
      ];
      if (account) {
        const french = language(body.language) === "fr";
        const payload = french
          ? { to: email, subject: "Code de connexion à la galerie photo Hack the Hill", text: `Votre code de connexion est ${code}. Il expire dans dix minutes.` }
          : { to: email, subject: "Hack the Hill photo gallery sign-in code", text: `Your sign-in code is ${code}. It expires in ten minutes.` };
        statements.push(env.DB.prepare("INSERT INTO notification_outbox(id,kind,payload_json,attempts,available_at,created_at) SELECT ?, 'otp', ?, 0, ?, ? WHERE EXISTS (SELECT 1 FROM code_challenges WHERE id=? AND consumed_at IS NULL)").bind(crypto.randomUUID(), JSON.stringify(payload), now, now, challengeId));
      }
      const results = await env.DB.batch(statements);
      if (!results[0]?.meta.changes) return error("Please wait before requesting another code.", 429);
      if (account) ctx.waitUntil(processOutbox(env));
      return json({ accepted: true }, 202);
    } catch {
      return error("Request accepted.", 202);
    }
  }
  if (url.pathname === "/photos/api/auth/verify" && request.method === "POST") {
    if (!sameOrigin(request, url)) return error("Same-origin request required.", 403);
    try {
      const body = await boundedJson(request);
      const email = normalizeEmail(body.email);
      const code = typeof body.code === "string" && /^\d{8}$/.test(body.code) ? body.code : null;
      if (!email || !code) return error("Invalid code.", 401);
      const emailHash = await hmac(env.OTP_HMAC_SECRET, email);
      const challenge = await env.DB.prepare("SELECT id,account_id,code_hash,expires_at as expiresAt,attempts,consumed_at as consumedAt FROM code_challenges WHERE email_hash=? AND consumed_at IS NULL ORDER BY created_at DESC LIMIT 1").bind(emailHash).first<{ id: string; account_id: string; code_hash: string; expiresAt: number; attempts: number; consumedAt: number | null }>();
      if (!challenge || challenge.expiresAt <= Date.now() || challenge.attempts >= 5) return error("Invalid code.", 401);
      const hash = await hmac(env.OTP_HMAC_SECRET, `${email}:${code}`);
      const accepted = await env.DB.prepare("UPDATE code_challenges SET consumed_at=? WHERE id=? AND code_hash=? AND consumed_at IS NULL AND attempts<5 AND expires_at>? RETURNING account_id").bind(Date.now(), challenge.id, hash, Date.now()).first<{ account_id: string }>();
      if (!accepted) {
        await env.DB.prepare("UPDATE code_challenges SET attempts=attempts+1 WHERE id=? AND consumed_at IS NULL AND attempts<5").bind(challenge.id).run();
        return error("Invalid code.", 401);
      }
      const account = await env.DB.prepare("SELECT id,email,role,active FROM accounts WHERE id=? AND active=1 LIMIT 1").bind(accepted.account_id).first<Account>();
      if (!account) return error("Invalid code.", 401);
      const rawToken = randomToken();
      const expiresAt = Date.now() + ATTENDEE_SESSION_TTL;
      const tokenHash = await hmac(env.SESSION_HMAC_SECRET, rawToken);
      const csrf = await hmac(env.SESSION_HMAC_SECRET, `${tokenHash}:${expiresAt}`);
      await env.DB.prepare("INSERT INTO sessions(token_hash,account_id,csrf_hash,created_at,expires_at) VALUES(?,?,?,?,?)").bind(tokenHash, account.id, await hmac(env.SESSION_HMAC_SECRET, csrf), Date.now(), expiresAt).run();
      return json({ authenticated: true, csrfToken: csrf, accountId: account.id, administrator: false, expiresAt }, 200, { "Set-Cookie": cookie(rawToken, ATTENDEE_SESSION_TTL / 1000) });
    } catch {
      return error("Invalid code.", 401);
    }
  }
  if (url.pathname === "/photos/api/auth/logout" && request.method === "POST") {
    const session = await sessionForRequest(request, env);
    if (session) {
      if (!sameOrigin(request, url) || !(await requireCsrf(request, env, session))) return error("Invalid CSRF token.", 403);
      await env.DB.prepare("UPDATE sessions SET revoked_at=? WHERE token_hash=?").bind(Date.now(), session.tokenHash).run();
    }
    return json({ accepted: true }, 200, { "Set-Cookie": clearCookie() });
  }
  if (url.pathname === "/photos/api/album" && request.method === "GET") {
    if (!(await attendeeSession(request, env))) return error("Authentication required.", 401);
    return album(env);
  }
  if (url.pathname === "/photos/api/licence/acknowledge" && request.method === "POST") {
    const session = await sessionForRequest(request, env);
    if (!session) return error("Authentication required.", 401);
    if (!(await requireCsrf(request, env, session))) return error("Invalid CSRF token.", 403);
    const body = await boundedJson(request);
    const current = await currentLicence(env);
    if (body.version !== current) return error("That licence version is no longer current.", 409);
    await env.DB.prepare("UPDATE sessions SET licence_version=? WHERE token_hash=? AND revoked_at IS NULL").bind(current, session.tokenHash).run();
    return json({ version: current });
  }
  if (url.pathname === "/photos/api/events" && request.method === "POST") return events(request, env);
  if (url.pathname.startsWith("/photos/api/photos/") && url.pathname.endsWith("/removal-requests") && request.method === "POST") {
    const id = url.pathname.split("/")[4];
    if (!photoId(id)) return error("Not found.", 404);
    return removal(request, env, id, ctx);
  }
  if (url.pathname === "/photos/api/manage/session" && request.method === "GET") {
    try {
      const identity = await accessIdentity(request, env);
      const csrfToken = await adminCsrf(identity, env);
      return json({ authenticated: true, csrfToken, administrator: true, accountId: identity.sub, email: identity.email, expiresAt: Math.min(identity.exp * 1000, Date.now() + ADMIN_SESSION_TTL) }, 200, { "Set-Cookie": `${ADMIN_COOKIE}=1; Max-Age=${ADMIN_SESSION_TTL / 1000}; Path=/photos; Secure; SameSite=Strict` });
    } catch {
      return error("Administrator authentication required.", 403);
    }
  }
  if (url.pathname === "/photos/api/manage" && request.method === "GET") {
    try { await accessIdentity(request, env); return manageSummary(request, env); } catch { return error("Administrator authentication required.", 403); }
  }
  if (url.pathname.startsWith("/photos/api/manage/cases/") && request.method === "POST") {
    try {
      const identity = await accessIdentity(request, env);
      const id = url.pathname.split("/").at(-1);
      if (!id || !ID_RE.test(id)) return error("Not found.", 404);
      return manageCase(request, env, identity, id);
    } catch { return error("Administrator authentication required.", 403); }
  }
  if (url.pathname.startsWith("/photos/api/manage/rights/") && request.method === "GET") {
    try {
      const identity = await accessIdentity(request, env);
      const id = url.pathname.split("/").at(-1);
      if (!id || !photoId(id)) return error("Not found.", 404);
      return rights(request, env, identity, id);
    } catch { return error("Administrator authentication required.", 403); }
  }
  if (url.pathname.startsWith("/photos/download/") && request.method === "GET") {
    const id = url.pathname.split("/").at(-1);
    return id && photoId(id) ? downloadResponse(request, env, id) : error("Not found.", 404);
  }
  if (url.pathname.startsWith("/photos/api/manage/photos/") && url.pathname.endsWith("/preview") && request.method === "GET") {
    try {
      await accessIdentity(request, env);
      const id = url.pathname.split("/")[5];
      if (!photoId(id)) return error("Not found.", 404);
      return imageResponse(request, env, id, "review", true);
    } catch {
      return error("Administrator authentication required.", 403);
    }
  }
  if (url.pathname.startsWith("/photos/media/") && request.method === "GET") {
    const parts = url.pathname.split("/");
    const id = parts[3];
    if (!photoId(id)) return error("Not found.", 404);
    if (parts[4] !== "thumbnail" && parts[4] !== "preview") return error("Not found.", 404);
    if (!(await attendeeSession(request, env))) return error("Authentication required.", 401);
    return imageResponse(request, env, id, parts[4], false);
  }
  return error("Not found.", 404);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      return await handle(request, env, ctx);
    } catch (caught) {
      console.error(JSON.stringify({ code: "photo_gallery_request_failed", type: caught instanceof Error ? caught.name : "unknown" }));
      return error("The request could not be completed.", 500);
    }
  },
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil((async () => {
      const cutoff = Date.now() - DOWNLOAD_RETENTION;
      const caseCutoff = Date.now() - CASE_HISTORY_RETENTION;
      await env.DB.batch([
        env.DB.prepare("DELETE FROM download_requests WHERE created_at<?").bind(cutoff),
        env.DB.prepare("DELETE FROM viewer_opens WHERE opened_at<?").bind(Date.now() - ATTENDEE_SESSION_TTL),
        env.DB.prepare("DELETE FROM sessions WHERE expires_at<? OR revoked_at<?").bind(Date.now(), cutoff),
        env.DB.prepare("DELETE FROM code_challenges WHERE expires_at<? OR consumed_at<?").bind(Date.now(), cutoff),
        env.DB.prepare("DELETE FROM notification_outbox WHERE kind='otp' AND created_at<?").bind(Date.now() - OTP_TTL),
        env.DB.prepare("DELETE FROM notification_outbox WHERE kind='removal' AND created_at<?").bind(cutoff),
        env.DB.prepare("DELETE FROM removal_reports WHERE status!='pending' AND resolved_at IS NOT NULL AND resolved_at<?").bind(caseCutoff),
        env.DB.prepare("DELETE FROM removal_cases WHERE status!='pending' AND updated_at<? AND NOT EXISTS (SELECT 1 FROM removal_reports WHERE case_id=removal_cases.id)").bind(caseCutoff),
        env.DB.prepare("DELETE FROM moderation_audit WHERE created_at<?").bind(caseCutoff),
      ]);
      await processOutbox(env);
    })());
  },
} satisfies ExportedHandler<Env>;
