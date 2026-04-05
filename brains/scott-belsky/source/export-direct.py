#!/usr/bin/env python3
"""
Export Belsky Brain Pack from Supabase → flat files.

Reads from: belsky_atoms, belsky_connections tables
Writes to:  brains/belsky/pack/brain-atoms.json
            brains/belsky/pack/brain-context.md

Run: python brains/belsky/source/export-direct.py

Requires: SUPABASE_URL and SUPABASE_SERVICE_KEY env vars
          pip install supabase
"""

import json
import os
import sys
from datetime import datetime, timezone
from collections import defaultdict
from pathlib import Path

try:
    from supabase import create_client
except ImportError:
    print("pip install supabase --break-system-packages")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    # Walk up from brains/belsky/source/ to find .env at rob-ai root
    _root = Path(__file__).resolve().parents[4]  # source/ → belsky/ → brains/ → brainsforsale/ → rob-ai/
    load_dotenv(_root / ".env")
except ImportError:
    pass  # dotenv not installed — fall back to env vars

# --- Config ---
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://uzediwokyshjbsymevtp.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "pack")

# Cluster display names and descriptions
CLUSTER_META = {
    "leadership": {
        "name": "Leadership & Organizational Design",
        "desc": "Organizations amplify or constrain leadership. Structure, clarity, decision-making norms, and culture shape whether good people can do great work. Scott explores the relationship between org design and creative output."
    },
    "product_design": {
        "name": "Product Design & Strategy",
        "desc": "Product excellence hinges on design discipline, radical simplification, and the ability to see what others miss. Scott emphasizes taste, craft, and the human side of product strategy over feature lists."
    },
    "craft_originality": {
        "name": "Craft, Originality & Taste",
        "desc": "Taste is learnable. Originality comes from taste + deep attention to craft. In a world of templates and shortcuts, craft differentiates. Scott values makers who sweat the details."
    },
    "consumer_ai": {
        "name": "Consumer AI & Social",
        "desc": "Beyond enterprise tools, how will AI reshape consumer experiences, social apps, dating, education, and daily life? Scott explores the human side of AI adoption."
    },
    "competitive_moats": {
        "name": "Competitive Advantage & Moats",
        "desc": "Sustainable competitive advantage requires defensible moats — often hidden in execution discipline, taste, brand trust, or network effects. Differentiation is harder than ever; imitation is faster."
    },
    "ai_agents": {
        "name": "AI Agents & Agentic Commerce",
        "desc": "Scott anticipates three waves of agentic commerce and explores how AI agents will reshape consumer experience, decision-making, and autonomous commerce. Key tensions: integration vs. autonomy, reactivity vs. proactivity."
    },
    "platform_strategy": {
        "name": "Platform Strategy & Network Effects",
        "desc": "Platforms succeed when they internalize network effects and reduce friction for participants. The best platforms feel invisible — they're utilities, not destinations."
    },
    "creator_economy": {
        "name": "Creator Economy & Brands",
        "desc": "Personalization is the next frontier. As AI makes mass customization possible, creators and brands must decide: standardize for scale, or personalize for connection?"
    },
    "memory_knowledge": {
        "name": "Memory, Learning & Knowledge",
        "desc": "As information abundance increases, memory and context become competitive advantages. Tools that remember what matters — and help you learn from your own experience — unlock new possibilities."
    },
    "future_of_work": {
        "name": "Future of Work & Talent",
        "desc": "Remote work, async collaboration, and AI-augmented knowledge workers are redefining productivity, hiring, and organizational effectiveness."
    },
    "superhumanity": {
        "name": "Superhumanity & Agency",
        "desc": "Two possible futures: humans become less important (Wall-E) or more important (Superhumanity). Scott bets on humans as tastemakers, contrarians, and agents of audacious change."
    },
    "commerce": {
        "name": "Commerce & Economic Models",
        "desc": "Every product is ultimately a commerce play — direct transactions, attention, or data. Understanding your economic model clarifies what you're actually optimizing for."
    },
    "vibe_coding": {
        "name": "Vibe Coding & Software Abundance",
        "desc": "Code generation is no longer constrained by human hours. Disposable software, bespoke solutions, and AI-native development transform what's possible."
    },
    "osint": {
        "name": "OSINT & Information Warfare",
        "desc": "Citizen-driven intelligence, strategic data noise, and the democratization of surveillance reshape geopolitics and journalism."
    },
    "enterprise_ai": {
        "name": "Enterprise AI & Internal Tools",
        "desc": "IT becomes the most important team. Companies vibe-code tailor-made software and deploy agentic tools, replacing clunky general-purpose SaaS."
    },
    "longevity": {
        "name": "Longevity & Health",
        "desc": "Health wearables, blood testing, preventative scans, and AI health coaches give humans materially more insight into their own biology."
    },
}

# Cluster display order (largest/most important first)
CLUSTER_ORDER = [
    "ai_agents", "product_design", "leadership", "craft_originality",
    "consumer_ai", "competitive_moats", "platform_strategy", "creator_economy",
    "memory_knowledge", "superhumanity", "future_of_work", "commerce",
    "vibe_coding", "enterprise_ai", "osint", "longevity"
]


def fetch_data(supabase):
    """Fetch all Belsky atoms and connections from Supabase."""
    # Atoms
    atoms_resp = supabase.table("belsky_atoms").select(
        "id, content, source_type, source_ref, source_date, topics, cluster, confidence, confidence_tier, original_quote, implication"
    ).order("source_date", desc=True).execute()
    atoms = atoms_resp.data

    # Connections
    conn_resp = supabase.table("belsky_connections").select(
        "id, atom_id_1, atom_id_2, relationship, confidence"
    ).execute()
    connections = conn_resp.data

    return atoms, connections


def build_topic_index(atoms):
    """Build topic → atom_id mapping."""
    index = defaultdict(list)
    for atom in atoms:
        for topic in (atom.get("topics") or []):
            index[topic].append(atom["id"])
    return dict(sorted(index.items()))


def build_connection_map(connections):
    """Build atom_id → list of connections."""
    conn_map = defaultdict(list)
    for c in connections:
        conn_map[c["atom_id_1"]].append({
            "target_id": c["atom_id_2"],
            "relationship": c["relationship"],
            "confidence": c.get("confidence")
        })
        conn_map[c["atom_id_2"]].append({
            "target_id": c["atom_id_1"],
            "relationship": c["relationship"],
            "confidence": c.get("confidence")
        })
    return conn_map


def export_json(atoms, connections, output_path):
    """Export brain-atoms.json with atoms, connections, and topic index."""
    conn_map = build_connection_map(connections)
    topic_index = build_topic_index(atoms)

    # Build connection summary by type
    rel_counts = defaultdict(int)
    for c in connections:
        rel_counts[c["relationship"]] += 1

    output = {
        "brain": {
            "name": "Scott Belsky",
            "slug": "belsky",
            "source": "Implications Newsletter (implications.com)",
            "atom_count": len(atoms),
            "connection_count": len(connections),
            "cluster_count": len(set(a["cluster"] for a in atoms)),
            "topic_count": len(topic_index),
            "connection_types": dict(rel_counts),
            "last_updated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "coverage": "77 editions (May 2014 — April 2026)"
        },
        "atoms": [],
        "connections": [
            {
                "id": c["id"],
                "atom_id_1": c["atom_id_1"],
                "atom_id_2": c["atom_id_2"],
                "relationship": c["relationship"],
                "confidence": c.get("confidence")
            }
            for c in connections
        ],
        "topic_index": topic_index
    }

    for atom in atoms:
        atom_connections = conn_map.get(atom["id"], [])
        entry = {
            "id": atom["id"],
            "content": atom["content"],
            "cluster": atom["cluster"],
            "topics": atom.get("topics", []),
            "source_ref": atom.get("source_ref"),
            "source_date": atom.get("source_date", "")[:10] if atom.get("source_date") else None,
            "confidence": atom.get("confidence"),
            "confidence_tier": atom.get("confidence_tier"),
        }
        if atom.get("original_quote"):
            entry["original_quote"] = atom["original_quote"]
        if atom.get("implication"):
            entry["implication"] = atom["implication"]
        if atom_connections:
            entry["connections"] = atom_connections
        output["atoms"].append(entry)

    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"  brain-atoms.json: {len(atoms)} atoms, {len(connections)} connections, {len(topic_index)} topics")
    return output


def export_markdown(atoms, connections, output_path):
    """Export brain-context.md — full narrative knowledge base."""
    conn_map = build_connection_map(connections)

    # Group atoms by cluster
    clusters = defaultdict(list)
    for atom in atoms:
        clusters[atom["cluster"]].append(atom)

    lines = []
    lines.append("# Scott Belsky Brain — Full Knowledge Base\n")
    lines.append(f"> {len(atoms)} knowledge atoms from 77 editions of the Implications newsletter (May 2014—April 2026).")
    lines.append("> Extracted from implications.com. This file is designed to be loaded as LLM context for brain-informed thinking.\n")

    # Usage section
    lines.append("## How to Use This Brain\n")
    lines.append("This knowledge base is a structured export of Scott Belsky's key insights from 12 years of the Implications newsletter. Each atom is:\n")
    lines.append("- **Self-contained**: Can be understood independently")
    lines.append("- **Sourceable**: Every atom links back to the original article")
    lines.append("- **Confidence-scored**: 0.82–0.95 (higher = more explicitly stated in source)")
    lines.append("- **Connected**: Atoms link to related atoms via typed relationships (supports, contradicts, extends, related, inspired_by)")
    lines.append("- **Clustered**: Organized into 16 topic clusters for navigation\n")
    lines.append("### Recommended Usage for LLMs\n")
    lines.append("1. Load this entire file as context for a session")
    lines.append("2. Reference atoms by cluster, date, and confidence when reasoning")
    lines.append("3. Follow connections between atoms to build richer arguments")
    lines.append("4. Cite source URLs when you reference an atom")
    lines.append("5. Use the topic index in brain-atoms.json for targeted lookups\n")
    lines.append("---\n")

    # Cluster sections
    lines.append("## Topic Clusters\n")

    for cluster_key in CLUSTER_ORDER:
        if cluster_key not in clusters:
            continue
        meta = CLUSTER_META.get(cluster_key, {"name": cluster_key, "desc": ""})
        cluster_atoms = clusters[cluster_key]

        lines.append(f"### {meta['name']} ({len(cluster_atoms)} atoms)\n")
        lines.append(f"{meta['desc']}\n")

        # Sort by date descending within cluster
        cluster_atoms.sort(key=lambda a: a.get("source_date", "") or "", reverse=True)

        for atom in cluster_atoms:
            date = (atom.get("source_date") or "")[:10]
            lines.append(f"#### {date}\n")
            lines.append(f"> {atom['content']}\n")

            topics_str = ", ".join(atom.get("topics", []))
            lines.append(f"**Topics:** {topics_str}  ")
            lines.append(f"**Confidence:** {atom.get('confidence', 'N/A')}  ")

            source = atom.get("source_ref", "")
            if source:
                lines.append(f"**Source:** [{date}]({source})")

            # Show connections if any
            atom_conns = conn_map.get(atom["id"], [])
            if atom_conns:
                conn_summary = defaultdict(int)
                for c in atom_conns:
                    conn_summary[c["relationship"]] += 1
                conn_str = ", ".join(f"{v} {k}" for k, v in sorted(conn_summary.items(), key=lambda x: -x[1]))
                lines.append(f"**Connections:** {conn_str}")

            lines.append("")

        lines.append("")

    # Footer
    lines.append("---\n")
    lines.append("## About Scott Belsky\n")
    lines.append("Scott Belsky is founder of Behance (acquired by Adobe), Chief Strategy Officer & EVP of Design and Emerging Products at Adobe, author of \"The Messy Middle,\" and early-stage investor. His \"Implications\" newsletter is where he shares his latest thinking on originality, organizational design, AI, and the future of work.\n")
    lines.append("## Stats\n")
    lines.append(f"- **Total atoms:** {len(atoms)}")
    lines.append(f"- **Total connections:** {len(connections)}")
    lines.append(f"- **Topic clusters:** {len(clusters)}")
    lines.append(f"- **Source editions:** ~77 Implications newsletter editions")
    lines.append(f"- **Date range:** May 2014 — April 2026\n")
    lines.append(f"**Generated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d')}")

    with open(output_path, "w") as f:
        f.write("\n".join(lines))

    print(f"  brain-context.md: {len(atoms)} atoms across {len(clusters)} clusters")


def main():
    if not SUPABASE_KEY:
        print("ERROR: Set SUPABASE_SERVICE_KEY env var")
        sys.exit(1)

    print(f"Connecting to Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    print(f"Fetching Belsky brain data...")
    atoms, connections = fetch_data(supabase)
    print(f"  Found {len(atoms)} atoms, {len(connections)} connections")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"\nExporting brain-atoms.json...")
    export_json(atoms, connections, os.path.join(OUTPUT_DIR, "brain-atoms.json"))

    print(f"\nExporting brain-context.md...")
    export_markdown(atoms, connections, os.path.join(OUTPUT_DIR, "brain-context.md"))

    print(f"\nDone! Files written to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
