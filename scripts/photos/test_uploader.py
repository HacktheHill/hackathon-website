#!/usr/bin/env python3
"""Mocked regression tests for the generic S3-compatible verifier."""

from __future__ import annotations

import hashlib
import sys
import unittest
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))
import uploader  # noqa: E402  (the script directory is the test import root)


class StreamingBody:
    def __init__(self, payload: bytes) -> None:
        self.payload = payload

    def iter_chunks(self, chunk_size: int):
        for offset in range(0, len(self.payload), chunk_size):
            yield self.payload[offset : offset + chunk_size]


class MockS3:
    def __init__(self, objects: dict[str, tuple[bytes, str, str]]) -> None:
        self.objects = objects
        self.list_calls: list[dict] = []

    def head_object(self, *, Bucket: str, Key: str):
        if Key not in self.objects:
            raise KeyError(Key)
        payload, content_type, sha256 = self.objects[Key]
        return {"ContentLength": len(payload), "ContentType": content_type, "Metadata": {"sha256": sha256}}

    def get_object(self, *, Bucket: str, Key: str):
        if Key not in self.objects:
            raise KeyError(Key)
        return {"Body": StreamingBody(self.objects[Key][0])}

    def list_objects_v2(self, **request):
        self.list_calls.append(request)
        keys = sorted(self.objects)
        # Force continuation pagination so the test covers ListObjectsV2
        # token handling rather than only the first page.
        offset = int(request.get("ContinuationToken", "0"))
        page = keys[offset : offset + 2]
        response = {"Contents": [{"Key": key} for key in page], "IsTruncated": offset + 2 < len(keys)}
        if response["IsTruncated"]:
            response["NextContinuationToken"] = str(offset + 2)
        return response


def item(key: str, payload: bytes, content_type: str = "image/jpeg") -> dict:
    return {"objectKey": key, "size": len(payload), "sha256": hashlib.sha256(payload).hexdigest(), "contentType": content_type}


class UploaderVerificationTests(unittest.TestCase):
    def test_all_bytes_detects_missing_extra_content_type_and_hash(self) -> None:
        good = item("good/full.jpg", b"good")
        wrong_type = item("wrong-type/preview.webp", b"preview", "image/webp")
        bad_hash = item("bad-hash/quick.jpg", b"quick")
        missing = item("missing/thumbnail.webp", b"thumbnail", "image/webp")
        client = MockS3({
            good["objectKey"]: (b"good", "image/jpeg", good["sha256"]),
            wrong_type["objectKey"]: (b"preview", "image/jpeg", wrong_type["sha256"]),
            bad_hash["objectKey"]: (b"corru", "image/jpeg", bad_hash["sha256"]),
            "unexpected/object.jpg": (b"extra", "image/jpeg", hashlib.sha256(b"extra").hexdigest()),
        })

        result = uploader.verify_remote(client, "staging", [good, wrong_type, bad_hash, missing], all_bytes=True, sample_count=16)

        self.assertEqual(result["byteHashMode"], "all")
        self.assertEqual(result["headChecked"], 4)
        self.assertEqual(result["contentTypeChecked"], 4)
        self.assertEqual(result["byteHashChecked"], 3)
        self.assertEqual(result["extras"], ["unexpected/object.jpg"])
        self.assertEqual(result["missing"], [missing["objectKey"]])
        self.assertIn(f"content-type:image/jpeg:{wrong_type['objectKey']}", result["errors"])
        self.assertIn(f"bytes:{bad_hash['objectKey']}", result["errors"])
        self.assertIn(f"extra:unexpected/object.jpg", result["errors"])
        self.assertIn(f"missing:{missing['objectKey']}", result["errors"])
        self.assertGreaterEqual(len(client.list_calls), 2)

    def test_sample_mode_is_explicit_and_hashes_only_requested_prefix(self) -> None:
        first = item("a/full.jpg", b"a")
        second = item("b/full.jpg", b"b")
        client = MockS3({
            first["objectKey"]: (b"a", "image/jpeg", first["sha256"]),
            second["objectKey"]: (b"b", "image/jpeg", second["sha256"]),
        })

        result = uploader.verify_remote(client, "staging", [first, second], all_bytes=False, sample_count=1)

        self.assertEqual(result["byteHashMode"], "sample")
        self.assertEqual(result["sampleCount"], 1)
        self.assertEqual(result["byteHashChecked"], 1)
        self.assertEqual(result["errors"], [])


if __name__ == "__main__":
    unittest.main()
