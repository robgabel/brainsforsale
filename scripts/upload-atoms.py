#!/usr/bin/env python3
"""Upload atoms from all-atoms.json to Supabase brain tables."""
import json
import os
import sys
import argparse
import httpx

def main():
    parser = argparse.ArgumentParser(description="Upload atoms to Supabase")
    parser.add_argument("--brain", required=True, help="Brain slug (e.g. john-green)")
    parser.add_argument("--dry-run", action="store_true", help="Preview without uploading")
    args = parser.parse_args()

    slug = args.brain
    table = slug.replace("-", "_") + "_atoms"
    atoms_path = f"brains/{slug}/research/all-atoms.json"

    if not os.path.exists(atoms_path):
        print(f"ERROR: {atoms_path} not found")
        sys.exit(1)

    with open(atoms_path) as f:
        atoms = json.load(f)

    print(f"Brain: {slug}")
    print(f"Table: {table}")
    print(f"Atoms: {len(atoms)}")

    if args.dry_run:
        print("DRY RUN — no upload.")
        return

    url = os.environ["SUPABASE_URL"].rstrip("/")
    key = os.environ["SUPABASE_SERVICE_KEY"]

    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }

    # Map atoms to DB schema
    rows = []
    for a in atoms:
        row = {
            "content": a["content"],
            "original_quote": a.get("original_quote"),
            "implication": a.get("implication"),
            "cluster": a.get("cluster"),
            "topics": a.get("topics", []),
            "source_ref": a.get("source_ref"),
            "confidence": a.get("confidence", 0.8),
            "confidence_tier": a.get("confidence_tier", "medium"),
        }
        # Parse source_date if present — handle ranges like "2020-2021", plain years, etc.
        sd = a.get("source_date")
        if sd:
            sd_str = str(sd).strip()
            # Range like "2020-2021" → take first year
            if len(sd_str) == 9 and sd_str[4] == "-" and sd_str[:4].isdigit():
                row["source_date"] = f"{sd_str[:4]}-01-01T00:00:00Z"
            elif len(sd_str) == 4 and sd_str.isdigit():
                row["source_date"] = f"{sd_str}-01-01T00:00:00Z"
            elif "T" in sd_str or "-" in sd_str:
                row["source_date"] = sd_str
            # else skip unparseable dates
        rows.append(row)

    # Upload in batches of 50
    batch_size = 50
    total_inserted = 0
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        resp = httpx.post(
            f"{url}/rest/v1/{table}",
            headers=headers,
            json=batch,
            timeout=30,
        )
        if resp.status_code in (200, 201):
            total_inserted += len(batch)
            print(f"  Uploaded batch {i // batch_size + 1}: {len(batch)} atoms ({total_inserted}/{len(rows)})")
        else:
            print(f"  ERROR batch {i // batch_size + 1}: {resp.status_code} {resp.text}")
            sys.exit(1)

    print(f"\nDone! {total_inserted} atoms uploaded to {table}.")

if __name__ == "__main__":
    main()
