import { createHmac, randomUUID } from "node:crypto";
import { readFile, writeFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const email = process.argv[2]?.trim().toLowerCase();
const remote = process.argv.includes("--remote");
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Usage: npm run revoke:eligibility -- person@example.org [--remote]");
if (remote && process.env.CONFIRM_PHOTO_GALLERY_REMOTE_REVOKE !== "yes") throw new Error("Remote revoke requires CONFIRM_PHOTO_GALLERY_REMOTE_REVOKE=yes");
const secret = process.env.OTP_HMAC_SECRET;
if (!secret || secret.length < 32) throw new Error("Set OTP_HMAC_SECRET in the invoking environment; its value is never printed.");
const emailHash = createHmac("sha256", secret).update(email).digest("base64url");
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const file = resolve(`.eligibility-revoke-${randomUUID()}.sql`);
await writeFile(file, `UPDATE accounts SET active=0,revoked_at=${Date.now()} WHERE email_hash=${quote(emailHash)};\nUPDATE sessions SET revoked_at=${Date.now()} WHERE account_id IN (SELECT id FROM accounts WHERE email_hash=${quote(emailHash)});\n`, { mode: 0o600 });
try {
  await new Promise((resolvePromise, reject) => {
    const child = spawn("npx", ["wrangler", "d1", "execute", "DB", remote ? "--remote" : "--local", "--file", file], { cwd: resolve(".", import.meta.dirname, ".."), stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolvePromise() : reject(new Error(`wrangler exited ${code}`)));
  });
  console.log(`Revoked matching account in ${remote ? "remote" : "local"} DB.`);
} finally {
  await rm(file, { force: true });
}
