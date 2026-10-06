import { env } from "cloudflare:workers";
import { SELF } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";
import worker from "../src/index";

const email = "attendee@example.org";
const secret = "local-test-secret-that-is-long-enough-123456";

function encoded(value: string | Uint8Array): string {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function accessFixture(overrides: Record<string, unknown> = {}): Promise<{ token: string; restore: () => void }> {
  const pair = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
  const publicJwk = { ...(await crypto.subtle.exportKey("jwk", pair.publicKey)), kid: "gallery-test-key", alg: "RS256", use: "sig" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { sub: "admin-subject", email: "organizer@ctn-rtc.org", iat: now, exp: now + 3600, aud: "gallery-test-audience", iss: "https://access.test", ...overrides };
  const signingInput = `${encoded(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "gallery-test-key" }))}.${encoded(JSON.stringify(payload))}`;
  const signature = await crypto.subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, pair.privateKey, new TextEncoder().encode(signingInput));
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const target = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
    if (target === "https://access.test/cdn-cgi/access/certs") return new Response(JSON.stringify({ keys: [publicJwk] }), { headers: { "content-type": "application/json" } });
    return originalFetch(input, init);
  };
  return { token: `${signingInput}.${encoded(new Uint8Array(signature))}`, restore: () => { globalThis.fetch = originalFetch; } };
}

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function requestCode(language: "en" | "fr" = "en"): Promise<string> {
  const response = await SELF.fetch("https://gallery.test/photos/api/auth/request", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email, language }) });
  expect(response.status).toBe(202);
  const outbox = await env.DB.prepare("SELECT payload_json as payload FROM notification_outbox ORDER BY created_at DESC LIMIT 1").first<{ payload: string }>();
  return (JSON.parse(outbox?.payload ?? "{}") as { text: string }).text.match(/\d{8}/)?.[0] ?? "";
}

async function seed(): Promise<void> {
  await env.DB.batch([
    env.DB.prepare("INSERT INTO accounts(id,email,email_hash,role,active,created_at) VALUES('acct-1',?,?, 'viewer',1,?)").bind(email, await hmac(email), Date.now()),
    env.DB.prepare("INSERT INTO photos(id,category,filename,version,status,thumbnail_key,preview_key,full_key,width,height,created_at,updated_at) VALUES('photo-1','Opening','sample.jpg',1,'published','photo-1/thumb','photo-1/preview','photo-1/full',2,2,?,?)").bind(Date.now(), Date.now()),
    env.DB.prepare("INSERT INTO photos(id,category,filename,version,status,thumbnail_key,preview_key,full_key,width,height,created_at,updated_at) VALUES('photo-2','Closing','second.jpg',1,'published','photo-2/thumb','photo-2/preview','photo-2/full',2,2,?,?)").bind(Date.now(), Date.now()),
    env.DB.prepare("INSERT INTO photo_variants(photo_id,format,object_key,width,height,bytes,content_type) VALUES('photo-1','thumbnail','photo-1/thumb',2,2,4,'image/jpeg'),('photo-1','preview','photo-1/preview',2,2,4,'image/jpeg'),('photo-1','full','photo-1/full',2,2,4,'image/jpeg'),('photo-1','quick','photo-1/quick',2,2,4,'image/jpeg')"),
    env.DB.prepare("INSERT INTO photo_variants(photo_id,format,object_key,width,height,bytes,content_type) VALUES('photo-2','thumbnail','photo-2/thumb',2,2,4,'image/jpeg'),('photo-2','preview','photo-2/preview',2,2,4,'image/jpeg'),('photo-2','full','photo-2/full',2,2,4,'image/jpeg'),('photo-2','quick','photo-2/quick',2,2,4,'image/jpeg')"),
    env.DB.prepare("INSERT INTO licence_versions(version,en_json,fr_json,current,created_at) VALUES('2026-10-06','[]','[]',1,?)").bind(Date.now()),
  ]);
  for (const key of ["photo-1/thumb", "photo-1/preview", "photo-1/full", "photo-1/quick", "photo-2/thumb", "photo-2/preview", "photo-2/full", "photo-2/quick"]) await env.PHOTO_BUCKET.put(key, new Uint8Array([1, 2, 3, 4]), { httpMetadata: { contentType: "image/jpeg" } });
}

async function reset(): Promise<void> {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM download_requests"),
    env.DB.prepare("DELETE FROM viewer_opens"),
    env.DB.prepare("DELETE FROM daily_aggregates"),
    env.DB.prepare("DELETE FROM album_visits"),
    env.DB.prepare("DELETE FROM notification_outbox"),
    env.DB.prepare("DELETE FROM moderation_audit"),
    env.DB.prepare("DELETE FROM removal_reports"),
    env.DB.prepare("DELETE FROM removal_cases"),
    env.DB.prepare("DELETE FROM sessions"),
    env.DB.prepare("DELETE FROM code_challenges"),
    env.DB.prepare("DELETE FROM photo_variants"),
    env.DB.prepare("DELETE FROM photos"),
    env.DB.prepare("DELETE FROM licence_versions"),
    env.DB.prepare("DELETE FROM accounts"),
  ]);
  for (const key of ["photo-1/thumb", "photo-1/preview", "photo-1/full", "photo-1/quick", "photo-2/thumb", "photo-2/preview", "photo-2/full", "photo-2/quick"]) await env.PHOTO_BUCKET.delete(key);
  await seed();
}

describe("photo gallery in the Workers runtime", () => {
  beforeEach(reset);

  it("rejects Access assertions with the wrong audience, domain, or expiry", async () => {
    for (const overrides of [{ aud: "other-audience" }, { email: "organizer@outside.example" }, { exp: Math.floor(Date.now() / 1000) - 1 }]) {
      const fixture = await accessFixture(overrides);
      try {
        const response = await SELF.fetch("https://gallery.test/photos/api/manage/session", { headers: { "cf-access-jwt-assertion": fixture.token } });
        expect(response.status).toBe(403);
      } finally {
        fixture.restore();
      }
    }
  });

  it("keeps auth generic, protects media, and gates downloads on the licence", async () => {
    const unknown = await SELF.fetch("https://gallery.test/photos/api/auth/request", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email: "unknown@example.org", language: "en" }) });
    expect(unknown.status).toBe(202);
    const unknownRetry = await SELF.fetch("https://gallery.test/photos/api/auth/request", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email: "unknown@example.org", language: "fr" }) });
    expect(unknownRetry.status).toBe(429);
    const unauthenticated = await SELF.fetch("https://gallery.test/photos/api/album");
    expect(unauthenticated.status).toBe(401);
    const code = await requestCode();
    const verified = await SELF.fetch("https://gallery.test/photos/api/auth/verify", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email, code }) });
    expect(verified.status).toBe(200);
    const cookie = verified.headers.get("set-cookie")?.split(";")[0] ?? "";
    const session = (await verified.json()) as { csrfToken: string };
    const album = await SELF.fetch("https://gallery.test/photos/api/album", { headers: { cookie } });
    expect(album.status).toBe(200);
    const eventBody = JSON.stringify({ photoIds: ["photo-1"] });
    const eventHeaders = { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": session.csrfToken };
    expect((await SELF.fetch("https://gallery.test/photos/api/events", { method: "POST", headers: eventHeaders, body: eventBody })).status).toBe(200);
    expect((await SELF.fetch("https://gallery.test/photos/api/events", { method: "POST", headers: eventHeaders, body: eventBody })).status).toBe(200);
    expect((await env.DB.prepare("SELECT opens FROM daily_aggregates WHERE photo_id='photo-1'").first<{ opens: number }>())?.opens).toBe(1);
    const media = await SELF.fetch("https://gallery.test/photos/media/photo-1/preview", { headers: { cookie } });
    expect(media.status).toBe(200);
    const blocked = await SELF.fetch("https://gallery.test/photos/download/photo-1?format=full&requestId=11111111-1111-4111-8111-111111111111", { headers: { cookie } });
    expect(blocked.status).toBe(428);
    const acknowledged = await SELF.fetch("https://gallery.test/photos/api/licence/acknowledge", { method: "POST", headers: { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": session.csrfToken }, body: JSON.stringify({ version: "2026-10-06" }) });
    expect(acknowledged.status).toBe(200);
    const download = await SELF.fetch("https://gallery.test/photos/download/photo-1?format=full&requestId=11111111-1111-4111-8111-111111111111", { headers: { cookie } });
    expect(download.status).toBe(200);
    const invalidRange = await SELF.fetch("https://gallery.test/photos/download/photo-1?format=full&requestId=33333333-3333-4333-8333-333333333333", { headers: { cookie, range: "bytes=99-100" } });
    expect(invalidRange.status).toBe(416);
    const suffixRange = await SELF.fetch("https://gallery.test/photos/download/photo-1?format=full&requestId=55555555-5555-4555-8555-555555555555", { headers: { cookie, range: "bytes=-2" } });
    expect(suffixRange.status).toBe(206);
    expect(suffixRange.headers.get("content-range")).toBe("bytes 2-3/4");
    expect((await suffixRange.arrayBuffer()).byteLength).toBe(2);
    const ifRangeMismatch = await SELF.fetch("https://gallery.test/photos/download/photo-1?format=full&requestId=66666666-6666-4666-8666-666666666666", { headers: { cookie, range: "bytes=0-1", "if-range": '"stale-etag"' } });
    expect(ifRangeMismatch.status).toBe(200);
    expect((await ifRangeMismatch.arrayBuffer()).byteLength).toBe(4);
    const crossPhotoRequestId = await SELF.fetch("https://gallery.test/photos/download/photo-2?format=full&requestId=11111111-1111-4111-8111-111111111111", { headers: { cookie } });
    expect(crossPhotoRequestId.status).toBe(409);
    const removed = await SELF.fetch("https://gallery.test/photos/api/photos/photo-1/removal-requests", { method: "POST", headers: { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": session.csrfToken }, body: JSON.stringify({ explanation: "Please remove this photo.", requestId: "22222222-2222-4222-8222-222222222222" }) });
    expect(removed.status).toBe(202);
    const removalNotice = await env.DB.prepare("SELECT payload_json as payload FROM notification_outbox WHERE kind='removal' ORDER BY created_at DESC LIMIT 1").first<{ payload: string }>();
    expect((JSON.parse(removalNotice?.payload ?? "{}") as { text: string }).text).toContain("Examiner la demande");
    const hidden = await SELF.fetch("https://gallery.test/photos/media/photo-1/preview", { headers: { cookie } });
    expect(hidden.status).toBe(404);
    const firstCase = (await removed.json()) as { caseId: string };
    const independent = await SELF.fetch("https://gallery.test/photos/api/photos/photo-1/removal-requests", { method: "POST", headers: { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": session.csrfToken }, body: JSON.stringify({ explanation: "A separate report.", requestId: "44444444-4444-4444-8444-444444444444" }) });
    expect(independent.status).toBe(202);
    const secondCase = (await independent.json()) as { caseId: string };
    expect(secondCase.caseId).not.toBe(firstCase.caseId);
    const duplicate = await SELF.fetch("https://gallery.test/photos/api/photos/photo-1/removal-requests", { method: "POST", headers: { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": session.csrfToken }, body: JSON.stringify({ explanation: "A changed retry must stay idempotent.", requestId: "22222222-2222-4222-8222-222222222222" }) });
    expect((await duplicate.json() as { caseId: string }).caseId).toBe(firstCase.caseId);
    expect((await env.DB.prepare("SELECT status,version FROM photos WHERE id='photo-1'").first<{ status: string; version: number }>())).toMatchObject({ status: "quarantined", version: 3 });
    const admin = await accessFixture();
    try {
      const forgedAdmin = await SELF.fetch("https://gallery.test/photos/api/manage/session", { headers: { "cf-access-jwt-assertion": `${admin.token.split(".").slice(0, 2).join(".")}.invalid` } });
      expect(forgedAdmin.status).toBe(403);
      const adminSession = await SELF.fetch("https://gallery.test/photos/api/manage/session", { headers: { "cf-access-jwt-assertion": admin.token } });
      expect(adminSession.status).toBe(200);
      const adminSessionBody = (await adminSession.json()) as { csrfToken: string; administrator: boolean };
      expect(adminSessionBody.administrator).toBe(true);
      const cookieAdminSession = await SELF.fetch("https://gallery.test/photos/api/manage/session", { headers: { cookie: `CF_Authorization=${admin.token}` } });
      expect(cookieAdminSession.status).toBe(200);
      const summary = await SELF.fetch("https://gallery.test/photos/api/manage", { headers: { "cf-access-jwt-assertion": admin.token } });
      expect(summary.status).toBe(200);
      const review = await SELF.fetch("https://gallery.test/photos/api/manage/photos/photo-1/preview", { headers: { "cf-access-jwt-assertion": admin.token } });
      expect(review.status).toBe(200);
      const crossSiteRights = await SELF.fetch("https://gallery.test/photos/api/manage/rights/photo-1", { headers: { "cf-access-jwt-assertion": admin.token, "sec-fetch-site": "cross-site" } });
      expect(crossSiteRights.status).toBe(403);
      const rights = await SELF.fetch("https://gallery.test/photos/api/manage/rights/photo-1", { headers: { "cf-access-jwt-assertion": admin.token } });
      expect(rights.status).toBe(200);
      expect((await rights.json() as { requests: unknown[] }).requests.length).toBeGreaterThan(0);
      const dismissFirst = await SELF.fetch(`https://gallery.test/photos/api/manage/cases/${firstCase.caseId}`, { method: "POST", headers: { "cf-access-jwt-assertion": admin.token, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": adminSessionBody.csrfToken }, body: JSON.stringify({ action: "dismiss", reason: "Reviewed and dismissed.", expectedVersion: 3 }) });
      expect(dismissFirst.status).toBe(200);
      expect((await dismissFirst.json() as { status: string }).status).toBe("dismissed");
      const restoreBlocked = await SELF.fetch(`https://gallery.test/photos/api/manage/cases/${secondCase.caseId}`, { method: "POST", headers: { "cf-access-jwt-assertion": admin.token, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": adminSessionBody.csrfToken }, body: JSON.stringify({ action: "restore", reason: "Still has another unresolved report.", expectedVersion: 3 }) });
      expect(restoreBlocked.status).toBe(409);
      const dismissSecond = await SELF.fetch(`https://gallery.test/photos/api/manage/cases/${secondCase.caseId}`, { method: "POST", headers: { "cf-access-jwt-assertion": admin.token, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": adminSessionBody.csrfToken }, body: JSON.stringify({ action: "dismiss", reason: "Second report reviewed.", expectedVersion: 3 }) });
      expect(dismissSecond.status).toBe(200);
      const restore = await SELF.fetch(`https://gallery.test/photos/api/manage/cases/${secondCase.caseId}`, { method: "POST", headers: { "cf-access-jwt-assertion": admin.token, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": adminSessionBody.csrfToken }, body: JSON.stringify({ action: "restore", reason: "Evidence supports publication.", expectedVersion: 3, crossChannelReviewed: true }) });
      expect(restore.status).toBe(200);
      expect((await restore.json() as { restored: boolean; version: number })).toMatchObject({ restored: true, version: 4 });
      expect((await env.DB.prepare("SELECT COUNT(*) as count FROM moderation_audit WHERE action='restore' AND case_id=?").bind(secondCase.caseId).first<{ count: number }>())?.count).toBe(1);
      const staleDismiss = await SELF.fetch(`https://gallery.test/photos/api/manage/cases/${secondCase.caseId}`, { method: "POST", headers: { "cf-access-jwt-assertion": admin.token, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": adminSessionBody.csrfToken }, body: JSON.stringify({ action: "duplicate", reason: "Stale action must fail.", expectedVersion: 3 }) });
      expect(staleDismiss.status).toBe(409);
      const newRemoval = await SELF.fetch("https://gallery.test/photos/api/photos/photo-1/removal-requests", { method: "POST", headers: { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": session.csrfToken }, body: JSON.stringify({ explanation: "New report after restoration.", requestId: "77777777-7777-4777-8777-777777777777" }) });
      expect(newRemoval.status).toBe(202);
      const thirdCase = (await newRemoval.json()) as { caseId: string };
      const duplicateThird = await SELF.fetch(`https://gallery.test/photos/api/manage/cases/${thirdCase.caseId}`, { method: "POST", headers: { "cf-access-jwt-assertion": admin.token, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": adminSessionBody.csrfToken }, body: JSON.stringify({ action: "duplicate", reason: "Matches another report.", expectedVersion: 5 }) });
      expect(duplicateThird.status).toBe(200);
      expect((await duplicateThird.json() as { status: string }).status).toBe("duplicate");
      const withdrawRemoval = await SELF.fetch("https://gallery.test/photos/api/photos/photo-1/removal-requests", { method: "POST", headers: { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": session.csrfToken }, body: JSON.stringify({ explanation: "Final rights withdrawal request.", requestId: "88888888-8888-4888-8888-888888888888" }) });
      expect(withdrawRemoval.status).toBe(202);
      const fourthCase = (await withdrawRemoval.json()) as { caseId: string };
      const withdraw = await SELF.fetch(`https://gallery.test/photos/api/manage/cases/${fourthCase.caseId}`, { method: "POST", headers: { "cf-access-jwt-assertion": admin.token, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": adminSessionBody.csrfToken }, body: JSON.stringify({ action: "withdraw", reason: "Confirmed withdrawal.", expectedVersion: 6 }) });
      expect(withdraw.status).toBe(200);
      expect((await withdraw.json() as { status: string }).status).toBe("withdrawn");
    } finally {
      admin.restore();
    }
    const invalidLogout = await SELF.fetch("https://gallery.test/photos/api/auth/logout", { method: "POST", headers: { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": "wrong" } });
    expect(invalidLogout.status).toBe(403);
    const validLogout = await SELF.fetch("https://gallery.test/photos/api/auth/logout", { method: "POST", headers: { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": session.csrfToken } });
    expect(validLogout.status).toBe(200);
    expect((await SELF.fetch("https://gallery.test/photos/api/album", { headers: { cookie } })).status).toBe(401);
  });

  it("expires OTPs, supersedes old challenges, and locks after five wrong attempts", async () => {
    const firstCode = await requestCode();
    await env.DB.prepare("UPDATE code_challenges SET expires_at=0,resend_after=0 WHERE email_hash=?").bind(await hmac(email)).run();
    const expired = await SELF.fetch("https://gallery.test/photos/api/auth/verify", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email, code: firstCode }) });
    expect(expired.status).toBe(401);
    const currentCode = await requestCode();
    const wrong = "00000000" === currentCode ? "99999999" : "00000000";
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await SELF.fetch("https://gallery.test/photos/api/auth/verify", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email, code: wrong }) });
      expect(response.status).toBe(401);
    }
    const locked = await SELF.fetch("https://gallery.test/photos/api/auth/verify", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email, code: currentCode }) });
    expect(locked.status).toBe(401);
  });

  it("applies same-photo removal quotas atomically while preserving idempotent retries", async () => {
    const code = await requestCode();
    const verified = await SELF.fetch("https://gallery.test/photos/api/auth/verify", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email, code }) });
    const cookie = verified.headers.get("set-cookie")?.split(";")[0] ?? "";
    const session = (await verified.json()) as { csrfToken: string };
    const submit = (requestId: string, explanation: string) => SELF.fetch("https://gallery.test/photos/api/photos/photo-1/removal-requests", { method: "POST", headers: { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": session.csrfToken }, body: JSON.stringify({ explanation, requestId }) });
    const ids = ["a0000000-0000-4000-8000-000000000001", "a0000000-0000-4000-8000-000000000002", "a0000000-0000-4000-8000-000000000003", "a0000000-0000-4000-8000-000000000004", "a0000000-0000-4000-8000-000000000005"];
    for (const [index, id] of ids.entries()) expect((await submit(id, `Report ${index}`)).status).toBe(202);
    expect((await submit("a0000000-0000-4000-8000-000000000006", "The sixth report is over quota.")).status).toBe(429);
    const retry = await submit(ids[0], "Changed text must remain idempotent.");
    expect(retry.status).toBe(202);
    expect((await env.DB.prepare("SELECT COUNT(*) as count FROM removal_reports WHERE requester_account_id='acct-1' AND photo_id='photo-1'").first<{ count: number }>())?.count).toBe(5);
  });

  it("paginates the moderation queue without dropping pending cases", async () => {
    const statements: D1PreparedStatement[] = [];
    for (let index = 0; index < 205; index += 1) {
      const now = Date.now() + index;
      const caseId = `queue-case-${index}`;
      statements.push(env.DB.prepare("INSERT INTO removal_cases(id,photo_id,requester_account_id,explanation,status,photo_version,cross_channel_reviewed,created_at,updated_at) VALUES(?,?,?,?, 'pending',1,0,?,?)").bind(caseId, "photo-1", "acct-1", `Queue case ${index}`, now, now));
      statements.push(env.DB.prepare("INSERT INTO removal_reports(id,case_id,photo_id,requester_account_id,explanation,request_id,status,photo_version,created_at) VALUES(?,?,?,?,?,?, 'pending',1,?)").bind(`queue-report-${index}`, caseId, "photo-1", "acct-1", `Queue report ${index}`, `queue-request-${index}`, now));
    }
    for (let offset = 0; offset < statements.length; offset += 80) await env.DB.batch(statements.slice(offset, offset + 80));
    const fixture = await accessFixture();
    try {
      const first = await SELF.fetch("https://gallery.test/photos/api/manage", { headers: { "cf-access-jwt-assertion": fixture.token } });
      expect(first.status).toBe(200);
      const firstBody = await first.json() as { cases: unknown[]; pendingTotal: number; nextCursor: string | null };
      expect(firstBody.cases).toHaveLength(200);
      expect(firstBody.pendingTotal).toBe(205);
      expect(firstBody.nextCursor).toEqual(expect.any(String));
      const second = await SELF.fetch(`https://gallery.test/photos/api/manage?cursor=${encodeURIComponent(firstBody.nextCursor ?? "")}`, { headers: { "cf-access-jwt-assertion": fixture.token } });
      expect(second.status).toBe(200);
      const secondBody = await second.json() as { cases: unknown[]; pendingTotal: number; nextCursor: string | null };
      expect(secondBody.cases).toHaveLength(5);
      expect(secondBody.pendingTotal).toBe(205);
      expect(secondBody.nextCursor).toBeNull();
      const selected = await SELF.fetch("https://gallery.test/photos/api/manage?case=queue-case-0", { headers: { "cf-access-jwt-assertion": fixture.token } });
      expect(selected.status).toBe(200);
      const selectedBody = await selected.json() as { cases: unknown[]; selectedCases: unknown[]; pendingTotal: number; nextCursor: string | null };
      expect(selectedBody.cases).toHaveLength(0);
      expect(selectedBody.selectedCases).toHaveLength(1);
      expect(selectedBody.pendingTotal).toBe(205);
      expect(selectedBody.nextCursor).toBeNull();
      expect((await SELF.fetch("https://gallery.test/photos/api/manage?case=invalid%20case", { headers: { "cf-access-jwt-assertion": fixture.token } })).status).toBe(400);
      expect((await SELF.fetch(`https://gallery.test/photos/api/manage?case=queue-case-0&cursor=${encodeURIComponent(firstBody.nextCursor ?? "")}`, { headers: { "cf-access-jwt-assertion": fixture.token } })).status).toBe(400);
    } finally {
      fixture.restore();
    }
  });

  it("retains pending cases but purges resolved history and old audit rows", async () => {
    const old = Date.now() - 366 * 24 * 60 * 60 * 1000;
    await env.DB.batch([
      env.DB.prepare("INSERT INTO removal_cases(id,photo_id,requester_account_id,explanation,status,photo_version,cross_channel_reviewed,created_at,updated_at) VALUES('old-case','photo-1','acct-1','Old resolved case','dismissed',1,0,?,?)").bind(old, old),
      env.DB.prepare("INSERT INTO removal_reports(id,case_id,photo_id,requester_account_id,explanation,request_id,status,photo_version,created_at,resolved_at) VALUES('old-report','old-case','photo-1','acct-1','Old resolved report','old-request','dismissed',1,?,?)").bind(old, old),
      env.DB.prepare("INSERT INTO moderation_audit(id,actor_account_id,action,photo_id,reason,created_at) VALUES('old-audit','admin-subject','dismiss','photo-1','Old audit',?)").bind(old),
      env.DB.prepare("INSERT INTO removal_cases(id,photo_id,requester_account_id,explanation,status,photo_version,cross_channel_reviewed,created_at,updated_at) VALUES('pending-retained','photo-1','acct-1','Pending case','pending',1,0,?,?)").bind(old, old),
      env.DB.prepare("INSERT INTO removal_reports(id,case_id,photo_id,requester_account_id,explanation,request_id,status,photo_version,created_at) VALUES('pending-retained-report','pending-retained','photo-1','acct-1','Pending report','pending-retained-request','pending',1,?)").bind(old),
    ]);
    const waits: Promise<unknown>[] = [];
    await worker.scheduled({} as ScheduledController, env, { waitUntil(promise: Promise<unknown>) { waits.push(promise); } } as ExecutionContext);
    await Promise.all(waits);
    expect((await env.DB.prepare("SELECT COUNT(*) as count FROM removal_cases WHERE id='old-case'").first<{ count: number }>())?.count).toBe(0);
    expect((await env.DB.prepare("SELECT COUNT(*) as count FROM removal_reports WHERE id='old-report'").first<{ count: number }>())?.count).toBe(0);
    expect((await env.DB.prepare("SELECT COUNT(*) as count FROM moderation_audit WHERE id='old-audit'").first<{ count: number }>())?.count).toBe(0);
    expect((await env.DB.prepare("SELECT COUNT(*) as count FROM removal_cases WHERE id='pending-retained'").first<{ count: number }>())?.count).toBe(1);
  });

  it("consumes a successful OTP exactly once", async () => {
    const code = await requestCode();
    const verified = await SELF.fetch("https://gallery.test/photos/api/auth/verify", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email, code }) });
    expect(verified.status).toBe(200);
    const reused = await SELF.fetch("https://gallery.test/photos/api/auth/verify", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email, code }) });
    expect(reused.status).toBe(401);
  });

  it("queues French OTP subject and text without changing the generic API response", async () => {
    const code = await requestCode("fr");
    const outbox = await env.DB.prepare("SELECT payload_json as payload FROM notification_outbox WHERE kind='otp' ORDER BY created_at DESC LIMIT 1").first<{ payload: string }>();
    const payload = JSON.parse(outbox?.payload ?? "{}") as { subject: string; text: string };
    expect(payload.subject).toBe("Code de connexion à la galerie photo Hack the Hill");
    expect(payload.text).toBe(`Votre code de connexion est ${code}. Il expire dans dix minutes.`);
  });

  it("serializes concurrent OTP requests through the cooldown and budget gate", async () => {
    const request = () => SELF.fetch("https://gallery.test/photos/api/auth/request", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email, language: "en" }) });
    const [first, second] = await Promise.all([request(), request()]);
    expect([first.status, second.status].sort()).toEqual([202, 429]);
    expect((await env.DB.prepare("SELECT COUNT(*) as count FROM code_challenges WHERE email_hash=?").bind(await hmac(email)).first<{ count: number }>())?.count).toBe(1);
    expect((await env.DB.prepare("SELECT COUNT(*) as count FROM notification_outbox WHERE kind='otp'").first<{ count: number }>())?.count).toBe(1);
  });

  it("rejects a concurrent download that loses requestId binding", async () => {
    const code = await requestCode();
    const verified = await SELF.fetch("https://gallery.test/photos/api/auth/verify", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email, code }) });
    const cookie = verified.headers.get("set-cookie")?.split(";")[0] ?? "";
    const session = (await verified.json()) as { csrfToken: string };
    const acknowledged = await SELF.fetch("https://gallery.test/photos/api/licence/acknowledge", { method: "POST", headers: { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": session.csrfToken }, body: JSON.stringify({ version: "2026-10-06" }) });
    expect(acknowledged.status).toBe(200);
    const requestId = "abababab-abab-4aba-8aba-abababababab";
    const fetchDownload = (photoId: string) => SELF.fetch(`https://gallery.test/photos/download/${photoId}?format=full&requestId=${requestId}`, { headers: { cookie } });
    const [first, second] = await Promise.all([fetchDownload("photo-1"), fetchDownload("photo-2")]);
    expect([first.status, second.status].sort()).toEqual([200, 409]);
    expect((await env.DB.prepare("SELECT COUNT(*) as count FROM download_requests WHERE request_id=?").bind(requestId).first<{ count: number }>())?.count).toBe(1);
  });

  it("paginates rights lookup beyond the bounded page size and audits each page", async () => {
    const statements: D1PreparedStatement[] = [];
    for (let index = 0; index < 501; index += 1) {
      statements.push(env.DB.prepare("INSERT INTO download_requests(request_id,account_id,photo_id,photo_version,format,created_at) VALUES(?,?,? ,1,'full',?)").bind(crypto.randomUUID(), "acct-1", "photo-1", Date.now() + index));
    }
    for (let offset = 0; offset < statements.length; offset += 100) await env.DB.batch(statements.slice(offset, offset + 100));
    const fixture = await accessFixture();
    try {
      const first = await SELF.fetch("https://gallery.test/photos/api/manage/rights/photo-1", { headers: { "cf-access-jwt-assertion": fixture.token } });
      expect(first.status).toBe(200);
      const firstBody = await first.json() as { requests: unknown[]; nextCursor: string | null };
      expect(firstBody.requests).toHaveLength(500);
      expect(firstBody.nextCursor).toEqual(expect.any(String));
      const second = await SELF.fetch(`https://gallery.test/photos/api/manage/rights/photo-1?cursor=${encodeURIComponent(firstBody.nextCursor ?? "")}`, { headers: { "cf-access-jwt-assertion": fixture.token } });
      expect(second.status).toBe(200);
      const secondBody = await second.json() as { requests: unknown[]; nextCursor: string | null };
      expect(secondBody.requests).toHaveLength(1);
      expect(secondBody.nextCursor).toBeNull();
      expect((await env.DB.prepare("SELECT COUNT(*) as count FROM moderation_audit WHERE action='rights_lookup' AND photo_id='photo-1'").first<{ count: number }>())?.count).toBe(2);
    } finally {
      fixture.restore();
    }
  });

  it("keeps format and album aggregates after rights records expire", async () => {
    const code = await requestCode();
    const verified = await SELF.fetch("https://gallery.test/photos/api/auth/verify", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email, code }) });
    const cookie = verified.headers.get("set-cookie")?.split(";")[0] ?? "";
    const session = (await verified.json()) as { csrfToken: string };
    const headers = { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": session.csrfToken };
    expect((await SELF.fetch("https://gallery.test/photos/api/licence/acknowledge", { method: "POST", headers, body: JSON.stringify({ version: "2026-10-06" }) })).status).toBe(200);
    expect((await SELF.fetch("https://gallery.test/photos/download/photo-1?format=full&requestId=cdcdcdcd-cdcd-4cdc-8cdc-cdcdcdcdcdcd", { headers: { cookie } })).status).toBe(200);
    expect((await SELF.fetch("https://gallery.test/photos/download/photo-1?format=quick&requestId=dededede-dede-4ded-8ded-dededededede", { headers: { cookie } })).status).toBe(200);
    expect((await SELF.fetch("https://gallery.test/photos/api/events", { method: "POST", headers, body: JSON.stringify({ photoIds: ["photo-1"], albumVisit: true }) })).status).toBe(200);
    await env.DB.prepare("UPDATE download_requests SET created_at=? WHERE photo_id='photo-1'").bind(Date.now() - 91 * 24 * 60 * 60 * 1000).run();
    const waits: Promise<unknown>[] = [];
    await worker.scheduled({} as ScheduledController, env, { waitUntil(promise: Promise<unknown>) { waits.push(promise); } } as ExecutionContext);
    await Promise.all(waits);
    const fixture = await accessFixture();
    try {
      const summary = await SELF.fetch("https://gallery.test/photos/api/manage", { headers: { "cf-access-jwt-assertion": fixture.token } });
      expect(summary.status).toBe(200);
      const body = await summary.json() as { aggregates: Array<{ photoId: string; filename: string; category: string; downloads: number; fullDownloads: number; quickDownloads: number }>; albumVisits: number };
      const aggregate = body.aggregates.find((item) => item.photoId === "photo-1");
      expect(aggregate).toMatchObject({ filename: "sample.jpg", category: "Opening", downloads: 2, fullDownloads: 1, quickDownloads: 1 });
      expect(body.albumVisits).toBe(1);
    } finally {
      fixture.restore();
    }
  });

  it("serializes concurrent moderation decisions with one winning CAS", async () => {
    const code = await requestCode();
    const verified = await SELF.fetch("https://gallery.test/photos/api/auth/verify", { method: "POST", headers: { origin: "https://gallery.test", "content-type": "application/json" }, body: JSON.stringify({ email, code }) });
    const cookie = verified.headers.get("set-cookie")?.split(";")[0] ?? "";
    const session = (await verified.json()) as { csrfToken: string };
    const removed = await SELF.fetch("https://gallery.test/photos/api/photos/photo-1/removal-requests", { method: "POST", headers: { cookie, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": session.csrfToken }, body: JSON.stringify({ explanation: "Concurrent moderation test.", requestId: "99999999-9999-4999-8999-999999999999" }) });
    const caseId = (await removed.json() as { caseId: string }).caseId;
    const fixture = await accessFixture();
    try {
      const adminSession = await SELF.fetch("https://gallery.test/photos/api/manage/session", { headers: { "cf-access-jwt-assertion": fixture.token } });
      const csrfToken = (await adminSession.json() as { csrfToken: string }).csrfToken;
      const action = (body: unknown) => SELF.fetch(`https://gallery.test/photos/api/manage/cases/${caseId}`, { method: "POST", headers: { "cf-access-jwt-assertion": fixture.token, origin: "https://gallery.test", "content-type": "application/json", "x-csrf-token": csrfToken }, body: JSON.stringify(body) });
      const [dismiss, withdraw] = await Promise.all([action({ action: "dismiss", reason: "Concurrent dismiss.", expectedVersion: 2 }), action({ action: "withdraw", reason: "Concurrent withdraw.", expectedVersion: 2 })]);
      if (dismiss.status !== 200 || withdraw.status !== 200) console.log("concurrent moderation", dismiss.status, await dismiss.clone().text(), withdraw.status, await withdraw.clone().text());
      expect([dismiss.status, withdraw.status].sort()).toEqual([200, 409]);
      const [restoreOne, restoreTwo] = await Promise.all([action({ action: "restore", reason: "Concurrent restore one.", expectedVersion: 2 }), action({ action: "restore", reason: "Concurrent restore two.", expectedVersion: 2 })]);
      expect([restoreOne.status, restoreTwo.status].sort()).toEqual([200, 409]);
      expect((await env.DB.prepare("SELECT COUNT(*) as count FROM moderation_audit WHERE photo_id='photo-1' AND action='restore'").first<{ count: number }>())?.count).toBe(1);
    } finally {
      fixture.restore();
    }
  });
});
