#!/usr/bin/env python3
"""Render deterministic D1 seed SQL from pipeline-inventory.json.

The generated SQL contains only public photo/variant metadata and object keys.
Source paths, editing notes and private inventory roots never enter the seed.
It targets services/photo-gallery/migrations/0001_initial.sql, where the
publication revision is an integer (the content version hash remains in the
private inventory and object path).

This is an idempotent *initial import*.  Every insert uses ``DO NOTHING`` on
conflict, so rerunning it cannot republish a quarantined/withdrawn photo,
reset a moderation revision, or replace an already-published object's keys.
Asset changes require an explicit migration and publication decision.  The
output intentionally has no explicit BEGIN/COMMIT wrapper because Wrangler's
D1 execute path owns statement transactions.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def integer(value: int) -> str:
    return str(int(value))


def render_sql(inventory: dict, created_at: int = 0) -> str:
    """Render an idempotent initial-import script for the gallery schema."""
    photos = inventory["photos"]
    lines = [
        "-- Generated from private photo-gallery pipeline inventory.",
        "-- Initial import only: conflicts are preserved to protect moderation state.",
        "-- Asset replacements require an explicit publication migration.",
        "-- No explicit transaction wrapper: Wrangler D1 owns statement transactions.",
    ]
    for photo in photos:
        variants = photo["variants"]
        lines.append(
            "INSERT INTO photos (id, category, filename, version, status, thumbnail_key, preview_key, full_key, width, height, created_at, updated_at) VALUES ("
            + ", ".join([
                quote(photo["id"]),
                quote(photo["category"]),
                quote(photo["filename"]),
                "1",
                "'published'",
                quote(variants["thumbnail"]["objectKey"]),
                quote(variants["preview"]["objectKey"]),
                quote(variants["full"]["objectKey"]),
                integer(photo["dimensions"]["width"]),
                integer(photo["dimensions"]["height"]),
                integer(created_at),
                integer(created_at),
            ])
            + ") ON CONFLICT(id) DO NOTHING;"
        )
        for format_name in ("thumbnail", "preview", "full", "quick"):
            variant = variants[format_name]
            lines.append(
                "INSERT INTO photo_variants (photo_id, format, object_key, width, height, bytes, sha256, content_type) VALUES ("
                + ", ".join([
                    quote(photo["id"]),
                    quote(format_name),
                    quote(variant["objectKey"]),
                    integer(variant["dimensions"]["width"]),
                    integer(variant["dimensions"]["height"]),
                    integer(variant["size"]),
                    quote(variant["sha256"]),
                    quote(variant["contentType"]),
                ])
                + ") ON CONFLICT(photo_id, format) DO NOTHING;"
            )
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--inventory", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--created-at", type=int, default=0, help="stable Unix timestamp for reproducible SQL (default: 0)")
    args = parser.parse_args()
    inventory = json.loads(args.inventory.read_text(encoding="utf-8"))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(render_sql(inventory, args.created_at), encoding="utf-8")
    photos = inventory["photos"]
    print(json.dumps({"photos": len(photos), "variants": len(photos) * 4, "output": str(args.output)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
