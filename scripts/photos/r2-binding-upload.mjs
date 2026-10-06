#!/usr/bin/env node
/**
 * Upload and verify the private staging R2 collection through Wrangler's
 * remote R2 binding. This deliberately accepts one named staging bucket and
 * creates a temporary config containing only PHOTO_BUCKET; D1 and production
 * bindings are never loaded.
 */

import { createHash } from "node:crypto";
import { createReadStream, openAsBlob } from "node:fs";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const repositoryRoot = resolve(dirname(new URL(import.meta.url).pathname), "../..");
const serviceRoot = join(repositoryRoot, "services", "photo-gallery");
const defaultConfigPath = join(serviceRoot, "wrangler.jsonc");
const expectedBucket = "hack-the-hill-photo-gallery-staging";
const expectedAccountId = "9cff4e4fc6be8b966eeae47806117336";
const maxReadBuffer = 6 * 1024 * 1024;
const variantNames = ["full", "quick", "thumbnail", "preview"];

function usage() {
  console.error(`Usage:
  node scripts/photos/r2-binding-upload.mjs dry-run --inventory FILE
  node scripts/photos/r2-binding-upload.mjs upload --inventory FILE --assets-root DIR [--checkpoint FILE] [--workers 4] [--verify]
  node scripts/photos/r2-binding-upload.mjs verify --inventory FILE --assets-root DIR [--workers 4] [--output FILE]

Only the staging PHOTO_BUCKET binding from services/photo-gallery/wrangler.jsonc
is accepted. The upload and verify commands use Wrangler OAuth remote bindings.`);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (!command || !["dry-run", "upload", "verify"].includes(command)) {
    usage();
    process.exitCode = 2;
    return null;
  }
  const options = { command, workers: 4, config: defaultConfigPath, checkpoint: null, output: null, verify: false };
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token === "--verify") options.verify = true;
    else if (token === "--workers") options.workers = Number(rest[++index]);
    else if (token === "--inventory") options.inventory = rest[++index];
    else if (token === "--assets-root") options.assetsRoot = rest[++index];
    else if (token === "--checkpoint") options.checkpoint = rest[++index];
    else if (token === "--output") options.output = rest[++index];
    else if (token === "--config") options.config = rest[++index];
    else if (token === "--help" || token === "-h") {
      usage();
      process.exit(0);
    } else {
      throw new Error(`unknown argument: ${token}`);
    }
  }
  if (!options.inventory) throw new Error("--inventory is required");
  if (options.command !== "dry-run" && !options.assetsRoot) throw new Error("--assets-root is required");
  if (!Number.isInteger(options.workers) || options.workers < 1 || options.workers > 4) throw new Error("--workers must be an integer from 1 to 4");
  options.inventory = resolve(options.inventory);
  options.assetsRoot = options.assetsRoot ? resolve(options.assetsRoot) : null;
  options.config = resolve(options.config);
  options.checkpoint = resolve(options.checkpoint ?? join(options.assetsRoot ?? dirname(options.inventory), "r2-binding-checkpoint.json"));
  options.output = resolve(options.output ?? join(options.assetsRoot ?? dirname(options.inventory), "r2-binding-verification.json"));
  return options;
}

function parseJsonc(text) {
  // The checked-in config currently contains JSON only. Keep this small
  // comment stripper for harmless // and /* */ additions without accepting
  // arbitrary executable input.
  return JSON.parse(text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, ""));
}

async function readInventory(path) {
  const inventory = JSON.parse(await readFile(path, "utf8"));
  const expected = [];
  for (const photo of inventory.photos ?? []) {
    for (const format of variantNames) {
      const variant = photo.variants?.[format];
      if (!variant) throw new Error(`missing ${format} variant for ${photo.id}`);
      const key = variant.objectKey;
      const parts = key.split("/");
      if (parts.length !== 3 || parts.some((part) => !part || part === "." || part === "..")) throw new Error(`unsafe object key: ${key}`);
      expected.push({ photoId: photo.id, format, key, path: variantPath(path, key), size: variant.size, sha256: variant.sha256, contentType: variant.contentType });
    }
  }
  if (expected.length !== (inventory.counts?.variants ?? expected.length)) throw new Error("inventory variant count does not match records");
  return { inventory, expected };
}

function variantPath(inventoryPath, key) {
  // The caller replaces this with assetsRoot/objects/key after loading the
  // inventory. Keeping the function here makes the expected-key validation
  // independent from the private source paths in pipeline-inventory.json.
  return join(dirname(inventoryPath), "objects", key);
}

async function sha256File(path) {
  const digest = createHash("sha256");
  for await (const chunk of createReadStream(path, { highWaterMark: maxReadBuffer })) digest.update(chunk);
  return digest.digest("hex");
}

async function atomicJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, path);
}

async function loadExpected(options) {
  const loaded = await readInventory(options.inventory);
  for (const item of loaded.expected) item.path = join(options.assetsRoot ?? dirname(options.inventory), "objects", item.key);
  return loaded;
}

async function verifyLocal(expected) {
  let totalBytes = 0;
  for (const item of expected) {
    const fileStat = await stat(item.path);
    if (fileStat.size !== item.size) throw new Error(`local size mismatch for ${item.key}: expected ${item.size}, got ${fileStat.size}`);
    const hash = await sha256File(item.path);
    if (hash !== item.sha256) throw new Error(`local SHA-256 mismatch for ${item.key}`);
    totalBytes += fileStat.size;
  }
  return totalBytes;
}

async function bounded(items, workers, callback, onResult) {
  let cursor = 0;
  const worker = async () => {
    while (cursor < items.length) {
      const item = items[cursor++];
      const result = await callback(item);
      await onResult(result, item);
    }
  };
  await Promise.all(Array.from({ length: Math.min(workers, items.length || 1) }, () => worker()));
}

async function makeRemoteProxy(configPath) {
  const rawConfig = parseJsonc(await readFile(configPath, "utf8"));
  if (rawConfig.account_id !== expectedAccountId) throw new Error(`refusing account ${rawConfig.account_id ?? "(missing)"}; expected the staging account`);
  const configuredBuckets = rawConfig.r2_buckets ?? [];
  if (configuredBuckets.length !== 1 || configuredBuckets[0].binding !== "PHOTO_BUCKET" || configuredBuckets[0].bucket_name !== expectedBucket) {
    throw new Error(`refusing config: expected only PHOTO_BUCKET=${expectedBucket}`);
  }
  // Create a temporary config beside the service config so relative main
  // paths remain valid. It deliberately omits D1, vars, secrets, envs and
  // every binding other than this one remote R2 bucket.
  const temporaryConfig = join(serviceRoot, `.wrangler-r2-upload-${process.pid}.jsonc`);
  const safeConfig = {
    name: rawConfig.name,
    account_id: rawConfig.account_id,
    main: rawConfig.main,
    compatibility_date: rawConfig.compatibility_date,
    compatibility_flags: rawConfig.compatibility_flags,
    r2_buckets: [{ binding: "PHOTO_BUCKET", bucket_name: expectedBucket, remote: true }],
  };
  await writeFile(temporaryConfig, `${JSON.stringify(safeConfig, null, 2)}\n`, "utf8");
  const require = createRequire(pathToFileURL(join(serviceRoot, "package.json")));
  const { getPlatformProxy } = require("wrangler");
  try {
    const platform = await getPlatformProxy({ configPath: temporaryConfig, remoteBindings: true, persist: false });
    if (!platform.env?.PHOTO_BUCKET || typeof platform.env.PHOTO_BUCKET.put !== "function" || typeof platform.env.PHOTO_BUCKET.head !== "function") {
      await platform.dispose();
      throw new Error("Wrangler did not expose the remote PHOTO_BUCKET R2 binding");
    }
    return { platform, temporaryConfig };
  } catch (error) {
    await rm(temporaryConfig, { force: true });
    throw error;
  }
}

async function uploadOne(bucket, item) {
  const current = await bucket.head(item.key);
  if (current && current.size === item.size && current.customMetadata?.sha256 === item.sha256) return { status: "reused", key: item.key, size: item.size, sha256: item.sha256 };
  // openAsBlob is file-backed and exposes a known content length to the
  // Wrangler remote-binding RPC. It streams the file rather than reading the
  // object into memory; hash verification uses the same 6 MiB read bound.
  const body = await openAsBlob(item.path, { type: item.contentType });
  await bucket.put(item.key, body, {
    httpMetadata: { contentType: item.contentType },
    customMetadata: { sha256: item.sha256, photoId: item.photoId, format: item.format },
  });
  const uploaded = await bucket.head(item.key);
  if (!uploaded || uploaded.size !== item.size || uploaded.customMetadata?.sha256 !== item.sha256) throw new Error(`post-upload HEAD mismatch for ${item.key}`);
  return { status: "uploaded", key: item.key, size: item.size, sha256: item.sha256 };
}

async function hashRemoteBody(object) {
  if (!object?.body) throw new Error("remote object has no body");
  const digest = createHash("sha256");
  const reader = object.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      digest.update(value);
    }
  } finally {
    reader.releaseLock();
  }
  return digest.digest("hex");
}

async function listRemoteKeys(bucket) {
  const keys = new Set();
  let cursor;
  do {
    const page = await bucket.list({ limit: 1000, ...(cursor ? { cursor } : {}) });
    for (const object of page.objects ?? []) keys.add(object.key);
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return keys;
}

async function verifyRemote(bucket, expected, workers) {
  const errors = [];
  let byteHashChecked = 0;
  await bounded(expected, workers, async (item) => {
    const object = await bucket.head(item.key);
    if (!object) return { item, error: "missing", byteHash: false };
    if (object.size !== item.size) return { item, error: `size:${object.size}`, byteHash: false };
    if (object.customMetadata?.sha256 !== item.sha256) return { item, error: "metadata-sha256", byteHash: false };
    if (object.httpMetadata?.contentType !== item.contentType) return { item, error: `content-type:${object.httpMetadata?.contentType ?? "missing"}`, byteHash: false };
    const body = await bucket.get(item.key);
    const hash = await hashRemoteBody(body);
    return { item, error: hash === item.sha256 ? null : `bytes:${hash}`, byteHash: true };
  }, async (result) => {
    if (result.byteHash) byteHashChecked += 1;
    if (result.error) errors.push(`${result.item.key}:${result.error}`);
  });
  const expectedKeys = new Set(expected.map((item) => item.key));
  const actualKeys = await listRemoteKeys(bucket);
  const extras = [...actualKeys].filter((key) => !expectedKeys.has(key)).sort();
  const missing = [...expectedKeys].filter((key) => !actualKeys.has(key)).sort();
  return { objects: expected.length, headChecked: expected.length, byteHashChecked, errors, extras, missing };
}

async function dryRun(options, expected) {
  const totalBytes = expected.reduce((sum, item) => sum + item.size, 0);
  console.log(JSON.stringify({ command: "dry-run", network: false, bucket: expectedBucket, objects: expected.length, bytes: totalBytes, workers: options.workers }, null, 2));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options) return;
  const loaded = await loadExpected(options);
  if (options.command === "dry-run") return dryRun(options, loaded.expected);
  const totalBytes = await verifyLocal(loaded.expected);
  const { platform, temporaryConfig } = await makeRemoteProxy(options.config);
  try {
    const bucket = platform.env.PHOTO_BUCKET;
    let uploaded = 0;
    let reused = 0;
    const checkpoint = { bucket: expectedBucket, objects: {} };
    let checkpointWrite = Promise.resolve();
    try {
      Object.assign(checkpoint, JSON.parse(await readFile(options.checkpoint, "utf8")));
      checkpoint.objects ??= {};
    } catch {
      // A missing checkpoint is the normal first-upload case.
    }
    if (options.command === "upload") {
      await bounded(loaded.expected, options.workers, async (item) => {
        const known = checkpoint.objects[item.key];
        if (known?.sha256 === item.sha256 && known?.size === item.size) {
          const head = await bucket.head(item.key);
          if (head?.size === item.size && head.customMetadata?.sha256 === item.sha256) return { status: "reused", key: item.key, size: item.size, sha256: item.sha256 };
        }
        return uploadOne(bucket, item);
      }, async (result) => {
        if (result.status === "uploaded") uploaded += 1;
        else reused += 1;
        checkpoint.objects[result.key] = { size: result.size, sha256: result.sha256, status: "verified" };
        checkpointWrite = checkpointWrite.then(() => atomicJson(options.checkpoint, checkpoint));
        await checkpointWrite;
      });
    }
    const verification = options.command === "verify" || options.verify ? await verifyRemote(bucket, loaded.expected, options.workers) : null;
    if (verification) await atomicJson(options.output, { bucket: expectedBucket, totalLocalBytes: totalBytes, ...verification });
    if (verification && (verification.errors.length || verification.extras.length || verification.missing.length)) {
      throw new Error(`remote verification failed: ${verification.errors.length} object errors, ${verification.extras.length} extras, ${verification.missing.length} missing`);
    }
    console.log(JSON.stringify({ command: options.command, bucket: expectedBucket, objects: loaded.expected.length, bytes: totalBytes, uploaded, reused, verification }, null, 2));
  } finally {
    await platform.dispose();
    await rm(temporaryConfig, { force: true });
  }
}

main().catch((error) => {
  console.error(`error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
