#!/usr/bin/env python3
"""Bounded, checkpointed uploader/verifier for an S3-compatible private bucket.

Credentials are read by boto3's normal environment/provider chain and are
never printed.  No network call is made by ``dry-run`` or
``create-inventory``.  Upload is intentionally opt-in; the parent deployment
configuration supplies the endpoint and bucket later.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import os
import threading
from pathlib import Path
from typing import Any

REMOTE_READ_CHUNK = 6 * 1024 * 1024


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        while block := stream.read(1024 * 1024):
            digest.update(block)
    return digest.hexdigest()


def atomic_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def load_inventory(path: Path) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    inventory = json.loads(path.read_text(encoding="utf-8"))
    expected = []
    for photo in inventory["photos"]:
        for format_name in ("full", "quick", "thumbnail", "preview"):
            variant = photo["variants"][format_name]
            expected.append({
                "photoId": photo["id"],
                "format": format_name,
                "objectKey": variant["objectKey"],
                "sha256": variant["sha256"],
                "size": variant["size"],
                "contentType": variant["contentType"],
                "path": variant["objectKey"],
            })
    return inventory, expected


def client_for(args: argparse.Namespace):
    try:
        import boto3
    except ImportError as error:
        raise SystemExit("boto3 is required only for upload/verify; install it in an isolated environment") from error
    if not args.bucket or not args.endpoint_url:
        raise SystemExit("--bucket and --endpoint-url are required for upload/verify")
    # boto3 reads AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY or the configured
    # profile. We do not echo or inspect credential values.
    return boto3.client("s3", endpoint_url=args.endpoint_url, region_name=args.region or "auto")


def remote_matches(client: Any, bucket: str, item: dict[str, Any]) -> bool:
    try:
        response = client.head_object(Bucket=bucket, Key=item["objectKey"])
    except Exception:
        return False
    metadata = {key.lower(): value for key, value in response.get("Metadata", {}).items()}
    return (
        int(response.get("ContentLength", -1)) == int(item["size"])
        and metadata.get("sha256") == item["sha256"]
        and response.get("ContentType") == item["contentType"]
    )


def dry_run(expected: list[dict[str, Any]], output: Path) -> int:
    summary = {
        "network": False,
        "objects": len(expected),
        "bytes": sum(item["size"] for item in expected),
        "bucket": None,
        "keys": [item["objectKey"] for item in expected],
    }
    atomic_json(output, summary)
    print(json.dumps({"network": False, "objects": summary["objects"], "bytes": summary["bytes"], "output": str(output)}))
    return 0


def create_inventory(inventory: dict[str, Any], expected: list[dict[str, Any]], output: Path) -> int:
    payload = {
        "schemaVersion": 1,
        "pipelineVersion": inventory.get("pipelineVersion"),
        "photos": inventory["counts"]["photos"],
        "objects": expected,
    }
    atomic_json(output, payload)
    print(json.dumps({"network": False, "objects": len(expected), "output": str(output)}))
    return 0


def upload(args: argparse.Namespace, client: Any, expected: list[dict[str, Any]]) -> int:
    checkpoint_path = Path(args.checkpoint)
    checkpoint: dict[str, Any] = {}
    if checkpoint_path.exists():
        checkpoint = json.loads(checkpoint_path.read_text(encoding="utf-8"))
    checkpoint.setdefault("objects", {})
    lock = threading.Lock()
    assets_root = Path(args.assets_root)
    reused = 0
    uploaded = 0
    failures: list[str] = []

    def one(item: dict[str, Any]) -> tuple[str, str]:
        nonlocal reused, uploaded
        local_path = assets_root / "objects" / item["objectKey"]
        if not local_path.is_file() or local_path.stat().st_size != item["size"] or sha256_file(local_path) != item["sha256"]:
            return item["objectKey"], "local-integrity-failure"
        known = checkpoint["objects"].get(item["objectKey"])
        if known and known.get("sha256") == item["sha256"] and known.get("size") == item["size"] and remote_matches(client, args.bucket, item):
            with lock:
                reused += 1
                checkpoint["objects"][item["objectKey"]] = {"sha256": item["sha256"], "size": item["size"], "status": "verified"}
            return item["objectKey"], "reused"
        try:
            with local_path.open("rb") as stream:
                client.put_object(
                    Bucket=args.bucket,
                    Key=item["objectKey"],
                    Body=stream,
                    ContentType=item["contentType"],
                    Metadata={"sha256": item["sha256"], "photo-id": item["photoId"], "format": item["format"]},
                )
            if not remote_matches(client, args.bucket, item):
                return item["objectKey"], "post-upload-head-failure"
            with lock:
                uploaded += 1
                checkpoint["objects"][item["objectKey"]] = {"sha256": item["sha256"], "size": item["size"], "status": "verified"}
            return item["objectKey"], "uploaded"
        except Exception as error:
            return item["objectKey"], f"upload-failure:{type(error).__name__}"

    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, min(args.workers, 16))) as pool:
        for key, status in pool.map(one, expected):
            if status not in ("reused", "uploaded"):
                failures.append(f"{key}: {status}")
            with lock:
                atomic_json(checkpoint_path, checkpoint)
    print(json.dumps({"objects": len(expected), "reused": reused, "uploaded": uploaded, "failures": failures, "checkpoint": str(checkpoint_path)}, indent=2))
    return 1 if failures else 0


def list_remote_keys(client: Any, bucket: str) -> set[str]:
    """Enumerate every remote key through ListObjectsV2 continuation pages."""
    keys: set[str] = set()
    continuation_token: str | None = None
    while True:
        request: dict[str, Any] = {"Bucket": bucket, "MaxKeys": 1000}
        if continuation_token:
            request["ContinuationToken"] = continuation_token
        response = client.list_objects_v2(**request)
        keys.update(entry["Key"] for entry in response.get("Contents", []) if "Key" in entry)
        if not response.get("IsTruncated"):
            return keys
        next_token = response.get("NextContinuationToken")
        if not next_token or next_token == continuation_token:
            raise RuntimeError("ListObjectsV2 pagination did not provide a new continuation token")
        continuation_token = next_token


def hash_remote_body(body: Any) -> str:
    """Hash a boto3 streaming body without reading more than 6 MiB at once."""
    digest = hashlib.sha256()
    if hasattr(body, "iter_chunks"):
        chunks = body.iter_chunks(chunk_size=REMOTE_READ_CHUNK)
        for chunk in chunks:
            if chunk:
                digest.update(chunk)
    else:
        while chunk := body.read(REMOTE_READ_CHUNK):
            digest.update(chunk)
    return digest.hexdigest()


def verify_remote(client: Any, bucket: str, expected: list[dict[str, Any]], *, all_bytes: bool, sample_count: int) -> dict[str, Any]:
    """Verify HEAD metadata, complete key set, and sampled/all remote bytes."""
    if sample_count < 1:
        raise ValueError("sample_count must be positive")
    errors: list[str] = []
    head_available: dict[str, bool] = {}
    for item in expected:
        key = item["objectKey"]
        try:
            response = client.head_object(Bucket=bucket, Key=key)
            metadata = {name.lower(): value for name, value in response.get("Metadata", {}).items()}
            checks = (
                (int(response.get("ContentLength", -1)) == int(item["size"]), "size"),
                (metadata.get("sha256") == item["sha256"], "metadata-sha256"),
                (response.get("ContentType") == item["contentType"], f"content-type:{response.get('ContentType', 'missing')}"),
            )
            # A metadata mismatch should still be followed by a byte read when
            # the object exists; only a failed HEAD prevents a GET attempt.
            head_available[key] = True
            for passed, label in checks:
                if not passed:
                    errors.append(f"{label}:{key}")
        except Exception as error:
            head_available[key] = False
            errors.append(f"head:{key}:{type(error).__name__}")

    expected_keys = {item["objectKey"] for item in expected}
    remote_keys = list_remote_keys(client, bucket)
    extras = sorted(remote_keys - expected_keys)
    missing = sorted(expected_keys - remote_keys)
    errors.extend(f"extra:{key}" for key in extras)
    errors.extend(f"missing:{key}" for key in missing)

    byte_items = expected if all_bytes else expected[:sample_count]
    byte_hash_checked = 0
    for item in byte_items:
        key = item["objectKey"]
        if not head_available.get(key, False):
            continue
        try:
            body = client.get_object(Bucket=bucket, Key=key)["Body"]
            actual_hash = hash_remote_body(body)
            byte_hash_checked += 1
            if actual_hash != item["sha256"]:
                errors.append(f"bytes:{key}")
        except Exception as error:
            errors.append(f"get:{key}:{type(error).__name__}")
    return {
        "objects": len(expected),
        "headChecked": len(expected),
        "contentTypeChecked": len(expected),
        "remoteListed": len(remote_keys),
        "byteHashMode": "all" if all_bytes else "sample",
        "byteHashChecked": byte_hash_checked,
        "sampleCount": None if all_bytes else len(byte_items),
        "errors": sorted(errors),
        "extras": extras,
        "missing": missing,
    }


def verify(args: argparse.Namespace, client: Any, expected: list[dict[str, Any]]) -> int:
    result = {"bucket": args.bucket, **verify_remote(client, args.bucket, expected, all_bytes=args.all_bytes, sample_count=args.sample_count)}
    atomic_json(args.output, result)
    print(json.dumps(result, indent=2))
    return 1 if result["errors"] else 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("dry-run", "create-inventory", "upload", "verify"))
    parser.add_argument("--inventory", required=True, type=Path)
    parser.add_argument("--assets-root", type=Path)
    parser.add_argument("--output", type=Path, default=Path("upload-inventory.json"))
    parser.add_argument("--checkpoint", type=Path, default=Path("upload-checkpoint.json"))
    parser.add_argument("--bucket")
    parser.add_argument("--endpoint-url")
    parser.add_argument("--region")
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--sample-count", type=int, default=16)
    parser.add_argument("--all-bytes", action="store_true")
    args = parser.parse_args()
    inventory, expected = load_inventory(args.inventory)
    if args.command == "dry-run":
        return dry_run(expected, args.output)
    if args.command == "create-inventory":
        return create_inventory(inventory, expected, args.output)
    if not args.assets_root:
        raise SystemExit("--assets-root is required for upload/verify")
    client = client_for(args)
    if args.command == "upload":
        return upload(args, client, expected)
    return verify(args, client, expected)


if __name__ == "__main__":
    raise SystemExit(main())
