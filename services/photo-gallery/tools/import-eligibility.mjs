import { createHmac, randomUUID } from "node:crypto";
import { readFile, writeFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const inputPath = process.argv[2];
const remote = process.argv.includes("--remote");
if (!inputPath) throw new Error("Usage: npm run import:eligibility -- path/to/attendee-eligibility.json [--remote]");
if (remote && process.env.CONFIRM_PHOTO_GALLERY_REMOTE_IMPORT !== "yes") throw new Error("Remote import requires CONFIRM_PHOTO_GALLERY_REMOTE_IMPORT=yes");
const secret = process.env.OTP_HMAC_SECRET;
if (!secret || secret.length < 32) throw new Error("Set OTP_HMAC_SECRET in the invoking environment; its value is never printed.");
const source = JSON.parse(await readFile(resolve(inputPath), "utf8"));
if (!Array.isArray(source.accounts)) throw new Error("Eligibility input must contain accounts[]");
const now = Date.now();
const statements = [];
for (const item of source.accounts) {
  if (!item || item.eligible !== true || typeof item.email !== "string") continue;
  const email = item.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) continue;
  const id = `acct-${createHmac("sha256", secret).update(`account:${email}`).digest("hex").slice(0, 32)}`;
  const emailHash = createHmac("sha256", secret).update(email).digest("base64url");
  const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
  statements.push(`INSERT INTO accounts(id,email,email_hash,role,active,created_at,revoked_at) VALUES(${quote(id)},${quote(email)},${quote(emailHash)},'viewer',1,${now},NULL) ON CONFLICT(email_hash) DO UPDATE SET email=excluded.email,active=1,revoked_at=NULL;`);
}
if (!statements.length) throw new Error("No eligible email addresses found");
const file = resolve(`.eligibility-import-${randomUUID()}.sql`);
await writeFile(file, `${statements.join("\n")}\n`, { mode: 0o600 });
try {
  const args = ["wrangler", "d1", "execute", "DB", remote ? "--remote" : "--local", "--file", file];
  await new Promise((resolvePromise, reject) => {
    const child = spawn("npx", args, { cwd: resolve(".", import.meta.dirname, ".."), stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolvePromise() : reject(new Error(`wrangler exited ${code}`)));
  });
  console.log(`Imported ${statements.length} eligible accounts into ${remote ? "remote" : "local"} DB.`);
} finally {
  await rm(file, { force: true });
}
