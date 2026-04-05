#!/usr/bin/env python3
"""
Connection enrichment for Belsky brain atoms.

Discovers new connections between atoms using:
1. Topic overlap (Jaccard similarity) for "related" connections
2. LLM-assisted analysis for "contradicts", "extends", and "inspired_by"

Usage:
  python scripts/enrich-connections.py --discover        # Find candidate connections
  python scripts/enrich-connections.py --discover --llm   # Include LLM-assisted discovery
  python scripts/enrich-connections.py --apply FILE       # Write approved connections to Supabase
  python scripts/enrich-connections.py --stats            # Show current connection stats

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

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://uzediwokyshjbsymevtp.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
ANTHROPIC_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
OUTPUT_DIR = Path(__file__).parent.parent / "brains" / "belsky" / "data"


def fetch_all_data(supabase):
    """Fetch all atoms and existing connections."""
    atoms_resp = supabase.table("belsky_atoms").select(
        "id, content, cluster, topics, source_date, confidence"
    ).execute()

    conn_resp = supabase.table("belsky_connections").select(
        "atom_id_1, atom_id_2, relationship"
    ).execute()

    atoms = atoms_resp.data
    connections = conn_resp.data

    # Build existing connection set for dedup
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

            # Stop if more than 7 days apart
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


def discover_llm_connections(atoms: list, existing: set) -> list:
    """Use LLM to find contradicts, extends, inspired_by within each cluster."""
    import anthropic
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    candidates = []

    clusters = defaultdict(list)
    for atom in atoms:
        clusters[atom.get("cluster", "unknown")].append(atom)

    prompt_template = """Analyze these knowledge atoms from Scott Belsky's "Implications" newsletter. All are in the "{cluster}" cluster.

Find connections between atoms. Focus ESPECIALLY on:
1. **contradicts** — Where Scott contradicts himself, holds tension between opposing ideas, or where two atoms pull in different directions. These are the MOST VALUABLE. Be aggressive — intellectual tension is the point.
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

        prompt = prompt_template.format(cluster=cluster_key, atoms_text=atoms_text)

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
                existing.add(pair)  # Prevent dups within this run

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

    # Cluster breakdown
    cluster_conns = defaultdict(int)
    atom_clusters = {a["id"]: a.get("cluster", "?") for a in atoms}
    for c in connections:
        c1 = atom_clusters.get(c["atom_id_1"], "?")
        c2 = atom_clusters.get(c["atom_id_2"], "?")
        if c1 == c2:
            cluster_conns[c1] += 1
        else:
            cluster_conns[f"{c1}↔{c2}"] += 1

    print(f"\nTarget: 800+ connections, 50+ contradicts, 0 orphans")


def apply_connections(supabase, filepath: str):
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
            supabase.table("belsky_connections").insert(row).execute()
            applied += 1
        except Exception as e:
            print(f"  Error inserting: {e}")

    print(f"\nApplied {applied} new connections")


def main():
    parser = argparse.ArgumentParser(description="Enrich Belsky brain connections")
    parser.add_argument("--discover", action="store_true", help="Find candidate connections")
    parser.add_argument("--llm", action="store_true", help="Include LLM-assisted discovery (slower, better)")
    parser.add_argument("--apply", metavar="FILE", help="Write approved connections to Supabase")
    parser.add_argument("--stats", action="store_true", help="Show current connection stats")
    parser.add_argument("--threshold", type=float, default=0.3, help="Jaccard threshold (default: 0.3)")
    args = parser.parse_args()

    if not SUPABASE_KEY:
        print("ERROR: Set SUPABASE_SERVICE_KEY in .env")
        sys.exit(1)

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    print("Fetching all atoms and connections...")
    atoms, connections, existing = fetch_all_data(supabase)
    print(f"  {len(atoms)} atoms, {len(connections)} existing connections")

    if args.stats:
        print_stats(atoms, connections, existing)
        return

    if args.apply:
        print(f"Applying connections from {args.apply}...")
        apply_connections(supabase, args.apply)
        return

    if args.discover:
        all_candidates = []

        # Topic overlap
        print("\nDiscovering topic overlap connections...")
        topic_candidates = discover_topic_overlap(atoms, existing, args.threshold)
        print(f"  Found {len(topic_candidates)} candidates via topic overlap")
        all_candidates.extend(topic_candidates)

        # Add new pairs to existing set
        for c in topic_candidates:
            pair = tuple(sorted([c["atom_id_1"], c["atom_id_2"]]))
            existing.add(pair)

        # Temporal proximity
        print("\nDiscovering temporal proximity connections...")
        temporal_candidates = discover_temporal(atoms, existing)
        print(f"  Found {len(temporal_candidates)} candidates via temporal proximity")
        all_candidates.extend(temporal_candidates)

        for c in temporal_candidates:
            pair = tuple(sorted([c["atom_id_1"], c["atom_id_2"]]))
            existing.add(pair)

        # LLM-assisted
        if args.llm:
            if not ANTHROPIC_KEY:
                print("ERROR: Set ANTHROPIC_API_KEY for --llm mode")
                sys.exit(1)
            print("\nDiscovering LLM-assisted connections...")
            llm_candidates = discover_llm_connections(atoms, existing)
            print(f"  Found {len(llm_candidates)} candidates via LLM analysis")
            all_candidates.extend(llm_candidates)

        # Summary
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

        # Write review file
        OUTPUT_DIR.mkdir(exist_ok=True)
        output_file = OUTPUT_DIR / "connection-candidates.json"
        with open(output_file, "w") as f:
            json.dump(all_candidates, f, indent=2)
        print(f"\nReview file: {output_file}")
        print(f"To apply: python scripts/enrich-connections.py --apply {output_file}")
        return

    parser.print_help()


if __name__ == "__main__":
    main()
