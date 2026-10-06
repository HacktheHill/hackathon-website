#!/usr/bin/env python3
"""Regression tests for the D1 initial-import seed policy."""

from __future__ import annotations

import sqlite3
import sys
import unittest
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))
import seed_sql  # noqa: E402  (the script directory is the test import root)


def inventory() -> dict:
    variants = {}
    for format_name, extension, content_type in (
        ("thumbnail", "webp", "image/webp"),
        ("preview", "webp", "image/webp"),
        ("full", "jpg", "image/jpeg"),
        ("quick", "jpg", "image/jpeg"),
    ):
        variants[format_name] = {
            "objectKey": f"photo-id/version/{format_name}.{extension}",
            "dimensions": {"width": 100, "height": 80},
            "size": 10,
            "sha256": format_name.ljust(64, "0"),
            "contentType": content_type,
        }
    return {
        "photos": [{
            "id": "photo-id",
            "category": "Opening Ceremony",
            "filename": "sample.jpg",
            "dimensions": {"width": 4000, "height": 3000},
            "variants": variants,
        }]
    }


class SeedSqlTests(unittest.TestCase):
    def setUp(self) -> None:
        self.connection = sqlite3.connect(":memory:")
        schema = (SCRIPT_DIR.parent.parent / "services/photo-gallery/migrations/0001_initial.sql").read_text(encoding="utf-8")
        self.connection.executescript(schema)

    def tearDown(self) -> None:
        self.connection.close()

    def test_seed_is_replay_safe_for_withdrawn_photo_and_variants(self) -> None:
        sql = seed_sql.render_sql(inventory(), created_at=100)
        self.assertNotIn("BEGIN", sql)
        self.assertNotIn("COMMIT", sql)
        self.assertIn("ON CONFLICT(id) DO NOTHING", sql)
        self.assertIn("ON CONFLICT(photo_id, format) DO NOTHING", sql)

        self.connection.executescript(sql)
        self.connection.execute("UPDATE photos SET status='withdrawn', version=7, full_key='old/full.jpg', updated_at=200 WHERE id='photo-id'")
        self.connection.execute("UPDATE photo_variants SET object_key='old/preview.webp', sha256='old-hash' WHERE photo_id='photo-id' AND format='preview'")
        self.connection.commit()

        # A second initial import must not republish, reset the revision, or
        # replace keys/hashes that moderation or publication already owns.
        self.connection.executescript(sql)
        photo = self.connection.execute("SELECT status, version, full_key, updated_at FROM photos WHERE id='photo-id'").fetchone()
        variant = self.connection.execute("SELECT object_key, sha256 FROM photo_variants WHERE photo_id='photo-id' AND format='preview'").fetchone()
        self.assertEqual(photo, ("withdrawn", 7, "old/full.jpg", 200))
        self.assertEqual(variant, ("old/preview.webp", "old-hash"))

    def test_seed_inserts_all_four_variants_on_empty_schema(self) -> None:
        self.connection.executescript(seed_sql.render_sql(inventory()))
        count = self.connection.execute("SELECT COUNT(*) FROM photo_variants WHERE photo_id='photo-id'").fetchone()[0]
        status = self.connection.execute("SELECT status FROM photos WHERE id='photo-id'").fetchone()[0]
        self.assertEqual(count, 4)
        self.assertEqual(status, "published")


if __name__ == "__main__":
    unittest.main()
