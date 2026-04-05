#!/usr/bin/env python3
"""
Voice enrichment for Belsky brain atoms.

Fetches original newsletter content, extracts Belsky's actual voice/framing
and the "implication" (the "so what") for each atom.

Usage:
  python scripts/enrich-voice.py                    # Process top 80 atoms, output review JSON
  python scripts/enrich-voice.py --limit 20         # Process top 20 atoms
  python scripts/enrich-voice.py --apply review.json # Write approved enrichments to Supabase
  python scripts/enrich-voice.py --dry-run           # Show what would be processed

Requires: ANTHROPIC_API_KEY, SUPABASE_URL + SUPABASE_SERVICE_KEY (in .env)
"""

import argparse
import json
import os
import sys
import time
from collections import defaultdict
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parents[2] / ".env")
except ImportError:
    pass

try:
    import anthropic
    from supabase import create_client
except ImportError:
    print("pip install anthropic supabase python-dotenv")
    sys.exit(1)

# --- Config ---
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://uzediwokyshjbsymevtp.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
ANTHROPIC_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
OUTPUT_DIR = Path(__file__).parent.parent / "brains" / "belsky" / "data"


EXTRACTION_PROMPT = """You are extracting the original voice and implications from Scott Belsky's "Implications" newsletter.

You will receive:
1. An ATOM — a distilled insight previously extracted from Scott's writing
2. The FULL TEXT of the newsletter edition where this atom came from

Your job:

**original_quote**: Find the passage in the newsletter that this atom was extracted from. Capture Scott's ACTUAL language — his provocative framing, specific metaphors, stories, examples, and emotional weight. This should be 1-3 sentences that preserve his voice. If you can find an exact quote, use it. If the idea spans multiple paragraphs, synthesize into his voice (not a neutral restatement). The quote should sound like SCOTT, not like a textbook.

**implication**: What is the "so what"? What does this insight MEAN for someone making decisions? This is the Implications newsletter — every insight has implications. Write 1-2 sentences in Scott's provocative style about what this means for builders, leaders, or companies. If Scott explicitly states the implication in the newsletter, use his words. If not, write one faithful to his voice and thinking patterns.

Return ONLY valid JSON:
{
  "original_quote": "...",
  "implication": "..."
}

If you cannot find the relevant passage in the newsletter text, return:
{
  "original_quote": null,
  "implication": null,
  "reason": "Could not locate the source passage"
}"""


def fetch_top_atoms(supabase, limit: int = 80) -> list:
    """Fetch atoms most worth enriching: highest confidence + most connected."""
    # Get connection counts per atom
    conn_resp = supabase.table("belsky_connections").select("atom_id_1, atom_id_2").execute()
    conn_counts = defaultdict(int)
    for c in conn_resp.data:
        conn_counts[c["atom_id_1"]] += 1
        conn_counts[c["atom_id_2"]] += 1

    # Get atoms that don't already have original_quote
    atoms_resp = supabase.table("belsky_atoms").select(
        "id, content, source_ref, source_date, cluster, confidence, confidence_tier, original_quote"
    ).is_("original_quote", "null").order("confidence", desc=True).execute()

    atoms = atoms_resp.data

    # Score by confidence + connection count
    for atom in atoms:
        atom["_conn_count"] = conn_counts.get(atom["id"], 0)
        atom["_score"] = (atom.get("confidence") or 0.8) * 100 + atom["_conn_count"] * 10

    atoms.sort(key=lambda a: a["_score"], reverse=True)
    return atoms[:limit]


def fetch_newsletter_content(url: str) -> str:
    """Fetch newsletter text from URL using httpx."""
    import httpx

    try:
        resp = httpx.get(url, follow_redirects=True, timeout=30,
                         headers={"User-Agent": "Mozilla/5.0 (research bot)"})
        resp.raise_for_status()
        html = resp.text

        # Extract text from HTML — strip tags, keep content
        import re
        # Remove script/style blocks
        html = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', html, flags=re.DOTALL | re.IGNORECASE)
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', ' ', html)
        # Collapse whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        # Decode entities
        text = text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&#39;', "'")

        return text[:15000]  # Cap at ~15K chars to stay within context limits
    except Exception as e:
        return f"ERROR: Could not fetch {url}: {e}"


def extract_voice(client: anthropic.Anthropic, atom_content: str, newsletter_text: str) -> dict:
    """Use Claude to extract original voice + implication."""
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"{EXTRACTION_PROMPT}\n\n---\n\nATOM:\n{atom_content}\n\n---\n\nFULL NEWSLETTER TEXT:\n{newsletter_text}"
        }]
    )

    try:
        text = message.content[0].text.strip()
        # Handle markdown code fences
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
        return json.loads(text)
    except (json.JSONDecodeError, IndexError):
        return {"original_quote": None, "implication": None, "reason": f"Parse error: {message.content[0].text[:100]}"}


def process_atoms(atoms: list, dry_run: bool = False) -> list:
    """Process atoms: fetch source, extract voice, return enrichments."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    results = []
    url_cache = {}  # Cache newsletter content by URL

    for i, atom in enumerate(atoms):
        url = atom.get("source_ref", "")
        atom_id = atom["id"]
        content = atom["content"]

        print(f"[{i+1}/{len(atoms)}] {content[:80]}...")

        if dry_run:
            results.append({
                "id": atom_id,
                "content": content,
                "source_ref": url,
                "cluster": atom.get("cluster"),
                "confidence_tier": atom.get("confidence_tier"),
                "status": "would_process"
            })
            continue

        if not url:
            results.append({
                "id": atom_id,
                "content": content,
                "original_quote": None,
                "implication": None,
                "status": "no_source_url"
            })
            continue

        # Fetch newsletter content (cached)
        if url not in url_cache:
            print(f"  Fetching: {url}")
            url_cache[url] = fetch_newsletter_content(url)
            time.sleep(0.5)  # Rate limit

        newsletter_text = url_cache[url]
        if newsletter_text.startswith("ERROR:"):
            results.append({
                "id": atom_id,
                "content": content,
                "original_quote": None,
                "implication": None,
                "status": newsletter_text
            })
            continue

        # Extract voice
        extraction = extract_voice(client, content, newsletter_text)
        results.append({
            "id": atom_id,
            "content": content,
            "cluster": atom.get("cluster"),
            "confidence_tier": atom.get("confidence_tier"),
            "original_quote": extraction.get("original_quote"),
            "implication": extraction.get("implication"),
            "status": "ok" if extraction.get("original_quote") else "extraction_failed",
            "reason": extraction.get("reason")
        })

        time.sleep(0.3)  # Rate limit API calls

    return results


def apply_enrichments(supabase, filepath: str):
    """Write approved enrichments from review JSON back to Supabase."""
    with open(filepath) as f:
        enrichments = json.load(f)

    applied = 0
    skipped = 0
    for item in enrichments:
        if item.get("status") != "ok":
            skipped += 1
            continue
        if not item.get("original_quote"):
            skipped += 1
            continue

        update = {"original_quote": item["original_quote"]}
        if item.get("implication"):
            update["implication"] = item["implication"]

        supabase.table("belsky_atoms").update(update).eq("id", item["id"]).execute()
        applied += 1
        print(f"  Updated atom {item['id'][:8]}...")

    print(f"\nApplied: {applied}, Skipped: {skipped}")


def main():
    parser = argparse.ArgumentParser(description="Enrich Belsky atoms with original voice + implications")
    parser.add_argument("--limit", type=int, default=80, help="Number of atoms to process (default: 80)")
    parser.add_argument("--apply", metavar="FILE", help="Apply enrichments from review JSON to Supabase")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be processed without fetching")
    args = parser.parse_args()

    if not SUPABASE_KEY:
        print("ERROR: Set SUPABASE_SERVICE_KEY in .env")
        sys.exit(1)

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    if args.apply:
        print(f"Applying enrichments from {args.apply}...")
        apply_enrichments(supabase, args.apply)
        return

    if not ANTHROPIC_KEY and not args.dry_run:
        print("ERROR: Set ANTHROPIC_API_KEY env var")
        sys.exit(1)

    print(f"Fetching top {args.limit} atoms for voice enrichment...")
    atoms = fetch_top_atoms(supabase, args.limit)
    print(f"  Found {len(atoms)} atoms to enrich")

    if not atoms:
        print("  All atoms already have original_quote. Nothing to do.")
        return

    # Group by source URL for stats
    urls = defaultdict(int)
    for a in atoms:
        urls[a.get("source_ref", "no_url")] += 1
    print(f"  Spanning {len(urls)} unique source URLs")

    results = process_atoms(atoms, dry_run=args.dry_run)

    # Write review file
    OUTPUT_DIR.mkdir(exist_ok=True)
    output_file = OUTPUT_DIR / "voice-enrichment-review.json"
    with open(output_file, "w") as f:
        json.dump(results, f, indent=2)

    ok = sum(1 for r in results if r["status"] == "ok")
    failed = sum(1 for r in results if r["status"] != "ok" and r["status"] != "would_process")
    print(f"\nResults: {ok} enriched, {failed} failed")
    print(f"Review file: {output_file}")
    print(f"\nNext step: Review the JSON, then run:")
    print(f"  python scripts/enrich-voice.py --apply {output_file}")


if __name__ == "__main__":
    main()
