#!/usr/bin/env python3
"""
Connection enrichment for brain atoms (generic — works with any brain).

Discovers new connections between atoms using:
1. Topic overlap (Jaccard similarity) for "related" connections
2. LLM-assisted analysis for "contradicts", "extends", and "inspired_by"

Usage:
  python scripts/enrich-connections.py --brain scott-belsky --discover
  python scripts/enrich-connections.py --brain scott-belsky --discover --llm
  python scripts/enrich-connections.py --brain scott-belsky --apply FILE
  python scripts/enrich-connections.py --brain scott-belsky --stats

Requires: SUPABASE_URL + SUPABASE_SERVICE_KEY (in .env), ANTHROPIC_API_KEY (for --llm)
"""

import argparse
import json
import os
import sys
import time
import uuid
from collections import defaultdict
from itertools import combinations
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parents[2] / ".env")
except ImportError:
    pass

try:
    from supabase import create_client
except ImportError:
    print("pip install supabase python-dotenv")
    sys.exit(1)

# --- Paths ---
SCRIPT_DIR = Path(__file__).parent
ROOT_DIR = SCRIPT_DIR.parent
BRAINS_DIR = ROOT_DIR / "brains"

# --- Config ---
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://uzediwokyshjbsymevtp.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
ANTHROPIC_KEY = os.environ.get("ANTHROPIC_API_KEY", "")


def load_brain_config(slug: str) -> dict:
    """Load brain config from brains/{slug}/brain.json"""
    config_path = BRAINS_DIR / slug / "brain.json"
    if not config_path.exists():
        print(f"ERROR: Brain config not found: {config_path}")
        sys.exit(1)
    with open(config_path) as f:
        return json.load(f)


def fetch_all_data(supabase, atoms_table: str, connections_table: str):
    """Fetch all atoms and existing connections."""
    atoms_resp = supabase.table(atoms_table).select(
        "id, content, cluster, topics, source_date, confidence"
    ).execute()

    conn_resp = supabase.table(connections_table).select(
        "atom_id_1, atom_id_2, relationship"
    ).execute()

    atoms = atoms_resp.data
    connections = conn_resp.data

    existing = set()
    for c in connections:
        pair = tuple(sorted([c["atom_id_1"], c["atom_id_2"]]))
        existing.add(pair)

    return atoms, connections, existing


def jaccard_similarity(set_a: set, set_b: set) -> float:
    """Jaccard similarity between two sets."""
    if not set_a or not set_b:
        return 0.0
    intersection = set_a & set_b
    union = set_a | set_b
    return len(intersection) / len(union)


def discover_topic_overlap(atoms: list, existing: set, threshold: float = 0.3) -> list:
    """Find candidate connections via topic overlap within same cluster."""
    candidates = []
    clusters = defaultdict(list)
    for atom in atoms:
        clusters[atom.get("cluster", "unknown")].append(atom)

    for cluster_key, cluster_atoms in clusters.items():
        for a, b in combinations(cluster_atoms, 2):
            pair = tuple(sorted([a["id"], b["id"]]))
            if pair in existing:
                continue

            topics_a = set(a.get("topics") or [])
            topics_b = set(b.get("topics") or [])
            sim = jaccard_similarity(topics_a, topics_b)

            if sim >= threshold:
                candidates.append({
                    "atom_id_1": a["id"],
                    "atom_id_2": b["id"],
                    "relationship": "related",
                    "confidence": round(min(sim, 0.90), 2),
                    "method": "topic_overlap",
                    "cluster": cluster_key,
                    "similarity": round(sim, 3),
                    "content_1": a["content"][:100],
                    "content_2": b["content"][:100],
                    "shared_topics": list(topics_a & topics_b)
                })

    candidates.sort(key=lambda c: c["similarity"], reverse=True)
    return candidates


def discover_temporal(atoms: list, existing: set) -> list:
    """Find candidate 'extends' connections between atoms published within 7 days with overlapping topics."""
    candidates = []
    dated = [a for a in atoms if a.get("source_date")]
    dated.sort(key=lambda a: a["source_date"])

    for i, a in enumerate(dated):
        for j in range(i + 1, len(dated)):
            b = dated[j]
            date_a = a["source_date"][:10]
            date_b = b["source_date"][:10]

            from datetime import datetime
            try:
                da = datetime.strptime(date_a, "%Y-%m-%d")
                db = datetime.strptime(date_b, "%Y-%m-%d")
                if abs((db - da).days) > 7:
                    break
            except ValueError:
                continue

            pair = tuple(sorted([a["id"], b["id"]]))
            if pair in existing:
                continue

            topics_a = set(a.get("topics") or [])
            topics_b = set(b.get("topics") or [])
            overlap = topics_a & topics_b

            if len(overlap) >= 2:
                candidates.append({
                    "atom_id_1": a["id"],
                    "atom_id_2": b["id"],
                    "relationship": "extends",
                    "confidence": 0.80,
                    "method": "temporal_proximity",
                    "cluster": a.get("cluster"),
                    "shared_topics": list(overlap),
                    "content_1": a["content"][:100],
                    "content_2": b["content"][:100]
                })

    return candidates


def discover_llm_connections(atoms: list, existing: set, brain_name: str, source_desc: str) -> list:
    """Use LLM to find contradicts, extends, inspired_by within each cluster."""
    import anthropic
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    candidates = []

    clusters = defaultdict(list)
    for atom in atoms:
        clusters[atom.get("cluster", "unknown")].append(atom)

    prompt_template = """Analyze these knowledge atoms from {brain_name}'s {source_desc}. All are in the "{cluster}" cluster.

Find connections between atoms. Focus ESPECIALLY on:
1. **contradicts** — Where {brain_name} contradicts themselves, holds tension between opposing ideas, or where two atoms pull in different directions. These are the MOST VALUABLE. Be aggressive — intellectual tension is the point.
2. **extends** — Where one atom builds on, deepens, or evolves another
3. **inspired_by** — Where one idea clearly led to or motivated another

Return a JSON array. Each item: {{"atom_1_index": N, "atom_2_index": M, "relationship": "contradicts|extends|inspired_by", "confidence": 0.70-0.95, "rationale": "one sentence why"}}

If no connections found, return [].

ATOMS:
{atoms_text}"""

    for cluster_key, cluster_atoms in clusters.items():
        if len(cluster_atoms) < 3:
            continue

        print(f"  LLM analyzing cluster: {cluster_key} ({len(cluster_atoms)} atoms)...")

        atoms_text = ""
        for i, atom in enumerate(cluster_atoms):
            date = (atom.get("source_date") or "")[:10]
            atoms_text += f"\n[{i}] ({date}) {atom['content']}\n"

        prompt = prompt_template.format(
            brain_name=brain_name,
            source_desc=source_desc,
            cluster=cluster_key,
            atoms_text=atoms_text
        )

        try:
            message = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
            text = message.content[0].text.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

            found = json.loads(text)
            for item in found:
                idx_a = item.get("atom_1_index", -1)
                idx_b = item.get("atom_2_index", -1)
                if idx_a < 0 or idx_b < 0 or idx_a >= len(cluster_atoms) or idx_b >= len(cluster_atoms):
                    continue

                a = cluster_atoms[idx_a]
                b = cluster_atoms[idx_b]
                pair = tuple(sorted([a["id"], b["id"]]))
                if pair in existing:
                    continue

                candidates.append({
                    "atom_id_1": a["id"],
                    "atom_id_2": b["id"],
                    "relationship": item["relationship"],
                    "confidence": item.get("confidence", 0.80),
                    "method": "llm_analysis",
                    "cluster": cluster_key,
                    "rationale": item.get("rationale", ""),
                    "content_1": a["content"][:100],
                    "content_2": b["content"][:100]
                })
                existing.add(pair)

        except (json.JSONDecodeError, KeyError) as e:
            print(f"    Parse error for {cluster_key}: {e}")
        except Exception as e:
            print(f"    Error for {cluster_key}: {e}")

        time.sleep(0.5)

    return candidates


def print_stats(atoms: list, connections: list, existing: set):
    """Print connection stats."""
    conn_counts = defaultdict(int)
    for a in atoms:
        conn_counts[a["id"]] = 0

    rel_counts = defaultdict(int)
    for c in connections:
        conn_counts[c["atom_id_1"]] += 1
        conn_counts[c["atom_id_2"]] += 1
        rel_counts[c["relationship"]] += 1

    orphans = sum(1 for v in conn_counts.values() if v == 0)
    total = len(connections)
    avg = total * 2 / len(atoms) if atoms else 0

    print(f"\n--- Connection Stats ---")
    print(f"Total atoms: {len(atoms)}")
    print(f"Total connections: {total}")
    print(f"Avg connections per atom: {avg:.1f}")
    print(f"Orphan atoms (0 connections): {orphans}")
    print(f"\nBy type:")
    for rel, count in sorted(rel_counts.items(), key=lambda x: -x[1]):
        print(f"  {rel}: {count}")

    print(f"\nTarget: 800+ connections, 50+ contradicts, 0 orphans")


def apply_connections(supabase, connections_table: str, filepath: str):
    """Write approved connections to Supabase."""
    with open(filepath) as f:
        candidates = json.load(f)

    applied = 0
    for item in candidates:
        if item.get("_skip"):
            continue

        row = {
            "id": str(uuid.uuid4()),
            "atom_id_1": item["atom_id_1"],
            "atom_id_2": item["atom_id_2"],
            "relationship": item["relationship"],
            "confidence": item.get("confidence", 0.80)
        }

        try:
            supabase.table(connections_table).insert(row).execute()
            applied += 1
        except Exception as e:
            print(f"  Error inserting: {e}")

    print(f"\nApplied {applied} new connections")


def main():
    parser = argparse.ArgumentParser(description="Enrich brain connections")
    parser.add_argument("--brain", required=True, help="Brain slug (matches brains/{slug}/brain.json)")
    parser.add_argument("--discover", action="store_true", help="Find candidate connections")
    parser.add_argument("--llm", action="store_true", help="Include LLM-assisted discovery (slower, better)")
    parser.add_argument("--apply", metavar="FILE", help="Write approved connections to Supabase")
    parser.add_argument("--stats", action="store_true", help="Show current connection stats")
    parser.add_argument("--threshold", type=float, default=0.3, help="Jaccard threshold (default: 0.3)")
    args = parser.parse_args()

    if not SUPABASE_KEY:
        print("ERROR: Set SUPABASE_SERVICE_KEY in .env")
        sys.exit(1)

    # Load brain config
    config = load_brain_config(args.brain)
    atoms_table = config.get("supabase", {}).get("atoms_table")
    connections_table = config.get("supabase", {}).get("connections_table")

    if not atoms_table or not connections_table:
        print(f"ERROR: brain.json missing supabase.atoms_table or supabase.connections_table")
        sys.exit(1)

    brain_name = config["brain_name"]
    source_desc = config.get("brain_source_description", "published content")

    print(f"Brain: {brain_name} ({args.brain})")
    print(f"Tables: {atoms_table}, {connections_table}")

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Output dir for review files
    output_dir = BRAINS_DIR / config["brain_slug"] / "data"

    print("Fetching all atoms and connections...")
    atoms, connections, existing = fetch_all_data(supabase, atoms_table, connections_table)
    print(f"  {len(atoms)} atoms, {len(connections)} existing connections")

    if args.stats:
        print_stats(atoms, connections, existing)
        return

    if args.apply:
        print(f"Applying connections from {args.apply}...")
        apply_connections(supabase, connections_table, args.apply)
        return

    if args.discover:
        all_candidates = []

        print("\nDiscovering topic overlap connections...")
        topic_candidates = discover_topic_overlap(atoms, existing, args.threshold)
        print(f"  Found {len(topic_candidates)} candidates via topic overlap")
        all_candidates.extend(topic_candidates)

        for c in topic_candidates:
            pair = tuple(sorted([c["atom_id_1"], c["atom_id_2"]]))
            existing.add(pair)

        print("\nDiscovering temporal proximity connections...")
        temporal_candidates = discover_temporal(atoms, existing)
        print(f"  Found {len(temporal_candidates)} candidates via temporal proximity")
        all_candidates.extend(temporal_candidates)

        for c in temporal_candidates:
            pair = tuple(sorted([c["atom_id_1"], c["atom_id_2"]]))
            existing.add(pair)

        if args.llm:
            if not ANTHROPIC_KEY:
                print("ERROR: Set ANTHROPIC_API_KEY for --llm mode")
                sys.exit(1)
            print("\nDiscovering LLM-assisted connections...")
            llm_candidates = discover_llm_connections(atoms, existing, brain_name, source_desc)
            print(f"  Found {len(llm_candidates)} candidates via LLM analysis")
            all_candidates.extend(llm_candidates)

        rel_summary = defaultdict(int)
        method_summary = defaultdict(int)
        for c in all_candidates:
            rel_summary[c["relationship"]] += 1
            method_summary[c["method"]] += 1

        print(f"\n--- Discovery Summary ---")
        print(f"Total candidates: {len(all_candidates)}")
        print(f"By relationship: {dict(rel_summary)}")
        print(f"By method: {dict(method_summary)}")
        print(f"Would bring total to: {len(connections) + len(all_candidates)}")

        output_dir.mkdir(exist_ok=True)
        output_file = output_dir / "connection-candidates.json"
        with open(output_file, "w") as f:
            json.dump(all_candidates, f, indent=2)
        print(f"\nReview file: {output_file}")
        print(f"To apply: python scripts/enrich-connections.py --brain {args.brain} --apply {output_file}")
        return

    parser.print_help()


if __name__ == "__main__":
    main()
