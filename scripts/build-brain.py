#!/usr/bin/env python3
"""
build-brain.py — One-command brain pack builder for BrainsFor.

Takes a brain.json config and produces a complete, shippable brain pack.
Chains all pipeline stages: atom generation, merging, synthesis, YouTube
transcript ingestion, connection discovery, and pack export.

Usage:
    # Full build (requires ANTHROPIC_API_KEY)
    python scripts/build-brain.py --brain steve-jobs

    # Skip atom generation (use existing research/*.json files)
    python scripts/build-brain.py --brain steve-jobs --skip-generate

    # Only specific stages
    python scripts/build-brain.py --brain steve-jobs --stages merge,synthesis,export

    # With YouTube transcripts
    python scripts/build-brain.py --brain steve-jobs --youtube

    # With connection enrichment (requires ANTHROPIC_API_KEY)
    python scripts/build-brain.py --brain steve-jobs --connections

    # Dry run — show what would happen
    python scripts/build-brain.py --brain steve-jobs --dry-run

    # Use a specific model for generation
    python scripts/build-brain.py --brain steve-jobs --model claude-sonnet-4-20250514

    # Specify a reference brain for exemplar atoms
    python scripts/build-brain.py --brain steve-jobs --reference scott-belsky
"""

import argparse
import json
import os
import re
import shutil
import sys
import time
import uuid
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

# --- Paths ---
SCRIPT_DIR = Path(__file__).parent
ROOT_DIR = SCRIPT_DIR.parent
BRAINS_DIR = ROOT_DIR / "brains"
TEMPLATES_DIR = ROOT_DIR / "templates"

# Optional imports
try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    HAS_YT_TRANSCRIPT = True
except ImportError:
    HAS_YT_TRANSCRIPT = False


# =============================================================================
# STAGE 1: Generate atoms via deep research (Claude API)
# =============================================================================

def load_exemplar_atoms(reference_slug: str, n_per_cluster: int = 3) -> list:
    """Load diverse sample atoms from a reference brain as format exemplars."""
    research_dir = BRAINS_DIR / reference_slug / "research"
    pack_dir = BRAINS_DIR / reference_slug / "pack"

    atoms = []
    for f in sorted(research_dir.glob("*-atoms.json")) if research_dir.exists() else []:
        with open(f) as fh:
            atoms.extend(json.load(fh))

    if not atoms:
        brain_atoms_path = pack_dir / "brain-atoms.json"
        if brain_atoms_path.exists():
            with open(brain_atoms_path) as fh:
                data = json.load(fh)
                atoms = data.get("atoms", [])

    if not atoms:
        return []

    by_cluster = {}
    for atom in atoms:
        cluster = atom.get("cluster", "unknown")
        by_cluster.setdefault(cluster, []).append(atom)

    exemplars = []
    for cluster_atoms in by_cluster.values():
        sorted_atoms = sorted(cluster_atoms, key=lambda a: a.get("confidence", 0.8), reverse=True)
        exemplars.extend(sorted_atoms[:n_per_cluster])

    return exemplars[:15]


def generate_cluster_atoms(brain_json, cluster_key, cluster_info, exemplars, sources_json, model):
    """Generate atoms for one cluster using Claude."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    brain_name = brain_json["brain_name"]
    first_name = brain_json["brain_first_name"]
    date_range = brain_json.get("date_range", "unknown")

    exemplar_text = json.dumps(exemplars[:5], indent=2)

    synthesis = brain_json.get("synthesis", {})
    fp_text = "\n".join(f"- {fp['title']}: {fp['desc']}" for fp in synthesis.get("first_principles", []))
    tp_text = "\n".join(f"- {t['name']}: {t['desc']}" for t in synthesis.get("thinking_patterns", []))
    contrarian_text = "\n".join(f"- {c['title']}: {c['desc']}" for c in synthesis.get("contrarian_positions", []))

    source_titles = "\n".join(
        f"- {s['title']} ({s['date']}): {s['description']}"
        for s in sources_json.get("sources", [])
        if s.get("priority") in ("essential", "high")
    )

    all_clusters = "\n".join(f"- {k}: {v['name']}" for k, v in brain_json.get("clusters", {}).items())

    prompt = f"""You are a research assistant generating "atoms" — discrete units of knowledge — for a
brain pack about {brain_name} ({date_range}).

YOUR TASK: Generate 15-25 high-quality atoms for the cluster "{cluster_info['name']}".

CLUSTER DESCRIPTION: {cluster_info['description']}

IMPORTANT RULES:
1. Every atom must be grounded in {first_name}'s ACTUAL documented statements, speeches,
   interviews, or publicly known positions. Do NOT invent or speculate.
2. "original_quote" must be {first_name}'s REAL words — actual quotes from speeches, interviews,
   or documented conversations. If you cannot find a real quote, omit the field rather than fabricate.
3. "content" is your distilled 2-4 sentence statement of the insight.
4. "implication" is the "so what" — what this means for builders, creators, and leaders today.
5. "source_ref" should reference the specific speech, interview, or appearance.
6. "source_date" should be as precise as possible (YYYY-MM-DD or YYYY).
7. Set confidence: 0.95 for direct quotes, 0.85 for well-documented positions, 0.75 for reasonable inferences.
8. Assign 2-5 topic tags per atom.

{first_name.upper()}'S FIRST PRINCIPLES (for context):
{fp_text}

{first_name.upper()}'S THINKING PATTERNS:
{tp_text}

{first_name.upper()}'S CONTRARIAN POSITIONS:
{contrarian_text}

KEY SOURCES TO DRAW FROM:
{source_titles}

ALL AVAILABLE CLUSTERS (assign to "{cluster_key}" unless a different one fits better):
{all_clusters}

EXEMPLAR ATOMS (from another brain pack — match this format and quality):
{exemplar_text}

OUTPUT FORMAT — Return ONLY a JSON array:
[
  {{
    "content": "Distilled 2-4 sentence insight...",
    "original_quote": "{first_name}'s actual documented words...",
    "implication": "What this means for builders/leaders today...",
    "cluster": "{cluster_key}",
    "topics": ["topic1", "topic2", "topic3"],
    "confidence": 0.92,
    "source_type": "video",
    "source_ref": "Stanford commencement speech, 2005",
    "source_date": "2005-06-12"
  }}
]

Generate 15-25 atoms. Prioritize {first_name}'s most provocative, original, and timeless ideas.
Return ONLY the JSON array."""

    client = anthropic.Anthropic(api_key=api_key)
    response = client.messages.create(
        model=model,
        max_tokens=12000,
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.content[0].text.strip()
    if text.startswith("```"):
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)

    return json.loads(text)


def stage_generate(brain_json, brain_dir, reference_slug, model, dry_run=False):
    """STAGE 1: Generate atoms for all clusters via deep research."""
    print("\n" + "=" * 60)
    print("STAGE 1: Generate atoms (deep research)")
    print("=" * 60)

    if not HAS_ANTHROPIC:
        print("  SKIP: anthropic SDK not installed (pip install anthropic)")
        return False
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("  SKIP: ANTHROPIC_API_KEY not set")
        return False

    research_dir = brain_dir / "research"
    research_dir.mkdir(parents=True, exist_ok=True)

    # Check if atoms already exist
    existing = list(research_dir.glob("*-atoms.json"))
    if existing:
        total = sum(len(json.load(open(f))) for f in existing)
        print(f"  Found {len(existing)} existing atom files ({total} atoms)")
        print(f"  To regenerate, delete brains/{brain_json['brain_slug']}/research/*-atoms.json")
        return True

    # Load exemplars and sources
    print(f"  Loading exemplars from {reference_slug}...")
    exemplars = load_exemplar_atoms(reference_slug)
    print(f"  Loaded {len(exemplars)} exemplar atoms")

    sources_path = brain_dir / "source" / "sources.json"
    sources_json = {}
    if sources_path.exists():
        with open(sources_path) as f:
            sources_json = json.load(f)

    clusters = brain_json.get("clusters", {})
    print(f"  Generating atoms for {len(clusters)} clusters using {model}...\n")

    for i, (cluster_key, cluster_info) in enumerate(clusters.items()):
        print(f"  [{i + 1}/{len(clusters)}] {cluster_info['name']}...", end=" ", flush=True)

        if dry_run:
            print("[DRY RUN]")
            continue

        try:
            atoms = generate_cluster_atoms(brain_json, cluster_key, cluster_info, exemplars, sources_json, model)
            output_path = research_dir / f"{cluster_key.replace('_', '-')}-atoms.json"
            with open(output_path, "w") as f:
                json.dump(atoms, f, indent=2)
            print(f"{len(atoms)} atoms")
            if i < len(clusters) - 1:
                time.sleep(2)  # Rate limiting
        except Exception as e:
            print(f"ERROR: {e}")

    return True


# =============================================================================
# STAGE 2: YouTube transcript ingestion + decomposition
# =============================================================================

def extract_video_id(url_or_id: str) -> str:
    """Extract YouTube video ID from URL or bare ID."""
    patterns = [
        r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]{11})',
        r'^([a-zA-Z0-9_-]{11})$',
    ]
    for pattern in patterns:
        match = re.search(pattern, url_or_id)
        if match:
            return match.group(1)
    raise ValueError(f"Could not extract video ID from: {url_or_id}")


def fetch_transcript(video_id: str) -> dict:
    """Fetch transcript for a YouTube video."""
    try:
        ytt = YouTubeTranscriptApi()
        transcript_list = ytt.list(video_id)

        transcript = None
        for t in transcript_list:
            if not t.is_generated:
                transcript = t
                break
        if transcript is None:
            for t in transcript_list:
                transcript = t
                break

        if transcript is None:
            return {"error": f"No transcripts available for {video_id}"}

        fetched = transcript.fetch()
        segments = [{"text": s.text, "start": s.start, "duration": s.duration} for s in fetched]

        full_text_parts = []
        last_ts = -60
        for seg in segments:
            if seg["start"] - last_ts >= 60:
                mins, secs = int(seg["start"] // 60), int(seg["start"] % 60)
                full_text_parts.append(f"\n[{mins:02d}:{secs:02d}] ")
                last_ts = seg["start"]
            full_text_parts.append(seg["text"] + " ")

        return {
            "video_id": video_id,
            "language": transcript.language,
            "is_generated": transcript.is_generated,
            "segment_count": len(segments),
            "duration_seconds": round(segments[-1]["start"] + segments[-1]["duration"]) if segments else 0,
            "full_text": "".join(full_text_parts).strip(),
            "segments": segments,
        }
    except Exception as e:
        return {"video_id": video_id, "error": str(e)}


def decompose_transcript(transcript_data: dict, brain_json: dict, model: str) -> list:
    """Use Claude to decompose a transcript into atoms."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    clusters = brain_json.get("clusters", {})
    cluster_list = "\n".join(f"- {k}: {v['name']} — {v['description']}" for k, v in clusters.items())
    brain_name = brain_json["brain_name"]
    first_name = brain_json["brain_first_name"]

    prompt = f"""You are decomposing a transcript of {brain_name} speaking into discrete "atoms" —
individual insights, beliefs, frameworks, or principles expressed in this recording.

TRANSCRIPT TITLE: {transcript_data.get('title', 'Unknown')}
DATE: {transcript_data.get('source_meta', {}).get('date', 'Unknown')}

CLUSTERS (assign each atom to exactly one):
{cluster_list}

RULES:
1. Each atom is ONE discrete idea — a belief, principle, framework, or insight
2. Write "content" as a distilled 2-4 sentence statement of the idea
3. Extract "original_quote" — {first_name}'s ACTUAL words (1-3 sentences, preserve voice)
4. Write "implication" — the "so what" (1-2 sentences)
5. Assign 2-5 topic tags per atom
6. Set confidence: 0.95 for clearly stated, 0.85 for strong implications, 0.75 for inferred
7. AIM FOR 15-30 ATOMS per transcript
8. SKIP small talk, introductions, product specs, audience interaction without ideas

OUTPUT FORMAT (JSON array):
[
  {{
    "content": "Distilled insight...",
    "original_quote": "{first_name}'s actual words...",
    "implication": "What this means...",
    "cluster": "cluster_key",
    "topics": ["topic1", "topic2"],
    "confidence": 0.92,
    "source_type": "video",
    "source_ref": "youtube:{transcript_data.get('video_id', 'unknown')}",
    "source_date": "{transcript_data.get('source_meta', {}).get('date', 'unknown')}"
  }}
]

TRANSCRIPT:
{transcript_data['full_text'][:50000]}

Return ONLY the JSON array."""

    client = anthropic.Anthropic(api_key=api_key)
    response = client.messages.create(
        model=model,
        max_tokens=8000,
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.content[0].text.strip()
    if text.startswith("```"):
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
    return json.loads(text)


def slugify(text: str) -> str:
    """Convert text to a filename-safe slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text[:80].strip('-')


def stage_youtube(brain_json, brain_dir, model, dry_run=False):
    """STAGE 2: Ingest YouTube transcripts and decompose into atoms."""
    print("\n" + "=" * 60)
    print("STAGE 2: YouTube transcript ingestion")
    print("=" * 60)

    if not HAS_YT_TRANSCRIPT:
        print("  SKIP: youtube-transcript-api not installed (pip install youtube-transcript-api)")
        return False

    sources_path = brain_dir / "source" / "sources.json"
    if not sources_path.exists():
        print("  SKIP: No sources.json found")
        return False

    with open(sources_path) as f:
        sources_json = json.load(f)

    # Only process sources that have youtube_id set
    videos = [s for s in sources_json.get("sources", []) if s.get("youtube_id")]
    if not videos:
        print("  SKIP: No sources have youtube_id set in sources.json")
        print("  TIP: Add youtube_id to sources, then re-run with --youtube")
        return False

    transcripts_dir = brain_dir / "source" / "transcripts"
    transcripts_dir.mkdir(parents=True, exist_ok=True)
    research_dir = brain_dir / "research"

    all_video_atoms = []

    for i, source in enumerate(videos):
        vid = source["youtube_id"]
        title = source["title"]
        slug = slugify(title)
        transcript_path = transcripts_dir / f"{slug}.json"

        print(f"  [{i + 1}/{len(videos)}] {title}...", end=" ", flush=True)

        if dry_run:
            print("[DRY RUN]")
            continue

        # Fetch transcript (skip if already cached)
        if transcript_path.exists():
            with open(transcript_path) as f:
                transcript_data = json.load(f)
            print("(cached)", end=" ")
        else:
            data = fetch_transcript(vid)
            if "error" in data:
                print(f"ERROR: {data['error']}")
                continue
            transcript_data = {
                "title": title,
                "extracted_at": datetime.now().isoformat(),
                **data,
                "source_meta": {
                    "date": source.get("date", "unknown"),
                    "type": source.get("type", "video"),
                    "priority": source.get("priority", "medium"),
                    "key_topics": source.get("key_topics", []),
                },
            }
            with open(transcript_path, "w") as f:
                json.dump(transcript_data, f, indent=2)

        # Decompose into atoms
        if HAS_ANTHROPIC and os.environ.get("ANTHROPIC_API_KEY"):
            try:
                atoms = decompose_transcript(transcript_data, brain_json, model)
                print(f"{len(atoms)} atoms")
                all_video_atoms.extend(atoms)
                time.sleep(2)
            except Exception as e:
                print(f"decompose ERROR: {e}")
        else:
            print(f"transcript saved (decompose requires ANTHROPIC_API_KEY)")

    if all_video_atoms and not dry_run:
        output_path = research_dir / "video-atoms.json"
        with open(output_path, "w") as f:
            json.dump(all_video_atoms, f, indent=2)
        print(f"\n  Saved {len(all_video_atoms)} video atoms to {output_path}")

    return True


# =============================================================================
# STAGE 3: Merge all research atoms into one file with IDs
# =============================================================================

def stage_merge(brain_json, brain_dir, dry_run=False):
    """STAGE 3: Merge all research/*-atoms.json → research/all-atoms.json with UUIDs."""
    print("\n" + "=" * 60)
    print("STAGE 3: Merge atoms")
    print("=" * 60)

    research_dir = brain_dir / "research"
    atom_files = sorted(research_dir.glob("*-atoms.json"))
    # Exclude all-atoms.json itself and connections
    atom_files = [f for f in atom_files if f.name not in ("all-atoms.json", "connections.json")]

    if not atom_files:
        print("  ERROR: No atom files found in research/")
        return False

    all_atoms = []
    for f in atom_files:
        with open(f) as fh:
            atoms = json.load(fh)
        print(f"  {f.name}: {len(atoms)} atoms")
        all_atoms.extend(atoms)

    # Add IDs and confidence_tier
    for atom in all_atoms:
        if not atom.get("id"):
            atom["id"] = str(uuid.uuid4())
        conf = atom.get("confidence", 0.8)
        if conf >= 0.9:
            atom["confidence_tier"] = "high"
        elif conf >= 0.8:
            atom["confidence_tier"] = "medium"
        else:
            atom["confidence_tier"] = "low"

    if dry_run:
        print(f"\n  [DRY RUN] Would merge {len(all_atoms)} atoms")
        return True

    output_path = research_dir / "all-atoms.json"
    with open(output_path, "w") as f:
        json.dump(all_atoms, f, indent=2)

    # Create empty connections file if it doesn't exist
    connections_path = research_dir / "connections.json"
    if not connections_path.exists():
        with open(connections_path, "w") as f:
            json.dump([], f)

    # Stats
    clusters = Counter(a.get("cluster", "unknown") for a in all_atoms)
    high = sum(1 for a in all_atoms if a.get("confidence_tier") == "high")
    med = sum(1 for a in all_atoms if a.get("confidence_tier") == "medium")
    low = sum(1 for a in all_atoms if a.get("confidence_tier") == "low")

    print(f"\n  Merged: {len(all_atoms)} atoms → {output_path}")
    print(f"  Confidence: {high} high, {med} medium, {low} low")
    print(f"  Clusters: {len(clusters)}")
    for c, n in clusters.most_common():
        print(f"    {c}: {n}")

    return True


# =============================================================================
# STAGE 4: Generate synthesis.md from brain.json
# =============================================================================

def stage_synthesis(brain_json, brain_dir, dry_run=False):
    """STAGE 4: Generate synthesis.md from brain.json synthesis section."""
    print("\n" + "=" * 60)
    print("STAGE 4: Generate synthesis.md")
    print("=" * 60)

    synthesis_path = brain_dir / "synthesis.md"
    if synthesis_path.exists():
        print(f"  Already exists: {synthesis_path}")
        return True

    synthesis = brain_json.get("synthesis", {})
    if not synthesis:
        print("  SKIP: No synthesis section in brain.json")
        return False

    brain_name = brain_json["brain_name"]
    # Resolve subject/possessive pronouns from brain_possessive ("his"/"her"/"their")
    possessive = brain_json.get("brain_possessive", "their").lower()
    subject = {"his": "He", "her": "She", "their": "They"}.get(possessive, "They")
    lines = [f"# How {brain_name} Thinks\n"]

    # First principles
    fps = synthesis.get("first_principles", [])
    if fps:
        lines.append("## First Principles\n")
        for fp in fps:
            lines.append(f"**{fp['title']}** {fp['desc']}\n")

    # Thinking patterns
    tps = synthesis.get("thinking_patterns", [])
    if tps:
        lines.append("## Thinking Patterns\n")
        for tp in tps:
            lines.append(f"**{tp['name']}.** {tp['desc']}\n")

    # Contrarian positions
    cps = synthesis.get("contrarian_positions", [])
    if cps:
        lines.append("## Contrarian Positions\n")
        for cp in cps:
            lines.append(f"**{cp['title']}** {cp['desc']}\n")

    # What they do not believe
    dnbs = synthesis.get("does_not_believe", [])
    if dnbs:
        lines.append(f"## What {brain_name} Does Not Believe\n")
        for dnb in dnbs:
            lines.append(f"**{dnb['title']}** {dnb['desc']}\n")

    # What they would not say
    wns = synthesis.get("would_not_say", [])
    if wns:
        lines.append(f"## What {subject} Would Not Say\n")
        for wn in wns:
            lines.append(f"\"{wn['title']}\" — {wn['desc']}\n")

    # Biographical pattern
    bios = synthesis.get("biography", [])
    if bios:
        lines.append("## Biographical Pattern\n")
        for bio in bios:
            date = bio.get("date", "")
            role = bio.get("role", "")
            lesson = bio.get("lesson", "")
            lines.append(f"**{date} — {role}.** {lesson}\n")

    if dry_run:
        print(f"  [DRY RUN] Would generate {len(lines)} lines")
        return True

    with open(synthesis_path, "w") as f:
        f.write("\n".join(lines))

    print(f"  Generated: {synthesis_path} ({len(lines)} lines)")
    return True


# =============================================================================
# STAGE 5: Connection enrichment (optional, requires ANTHROPIC_API_KEY)
# =============================================================================

def stage_connections(brain_json, brain_dir, model, dry_run=False):
    """STAGE 5: Discover connections between atoms."""
    print("\n" + "=" * 60)
    print("STAGE 5: Connection enrichment")
    print("=" * 60)

    all_atoms_path = brain_dir / "research" / "all-atoms.json"
    if not all_atoms_path.exists():
        print("  ERROR: all-atoms.json not found — run merge stage first")
        return False

    with open(all_atoms_path) as f:
        atoms = json.load(f)

    connections_path = brain_dir / "research" / "connections.json"

    # Topic overlap connections (no API needed)
    print("  Discovering topic overlap connections...")
    by_cluster = defaultdict(list)
    for atom in atoms:
        by_cluster[atom.get("cluster", "unknown")].append(atom)

    connections = []
    seen_pairs = set()  # dedupe (atom_id_1, atom_id_2) unordered

    def _add_pair(a1, a2, relationship, confidence, method, shared_topics):
        key = tuple(sorted([a1["id"], a2["id"]]))
        if key in seen_pairs:
            return
        seen_pairs.add(key)
        connections.append({
            "id": str(uuid.uuid4()),
            "atom_id_1": a1["id"],
            "atom_id_2": a2["id"],
            "relationship": relationship,
            "confidence": confidence,
            "method": method,
            "shared_topics": sorted(shared_topics),
        })

    # Within-cluster: jaccard >= 0.3
    within_count = 0
    for cluster_key, cluster_atoms in by_cluster.items():
        for i, a1 in enumerate(cluster_atoms):
            for a2 in cluster_atoms[i + 1:]:
                topics1 = set(a1.get("topics", []))
                topics2 = set(a2.get("topics", []))
                if not topics1 or not topics2:
                    continue
                jaccard = len(topics1 & topics2) / len(topics1 | topics2)
                if jaccard >= 0.3:
                    before = len(connections)
                    _add_pair(a1, a2, "related",
                              round(min(jaccard + 0.3, 0.95), 2),
                              "topic_overlap_within", topics1 & topics2)
                    if len(connections) > before:
                        within_count += 1

    # Cross-cluster: jaccard >= 0.5 (higher bar — bridges are more meaningful)
    cross_count = 0
    cluster_keys = list(by_cluster.keys())
    for i, k1 in enumerate(cluster_keys):
        for k2 in cluster_keys[i + 1:]:
            for a1 in by_cluster[k1]:
                for a2 in by_cluster[k2]:
                    topics1 = set(a1.get("topics", []))
                    topics2 = set(a2.get("topics", []))
                    if not topics1 or not topics2:
                        continue
                    jaccard = len(topics1 & topics2) / len(topics1 | topics2)
                    if jaccard >= 0.5:
                        before = len(connections)
                        _add_pair(a1, a2, "related",
                                  round(min(jaccard + 0.2, 0.95), 2),
                                  "topic_overlap_cross", topics1 & topics2)
                        if len(connections) > before:
                            cross_count += 1

    # Orphan rescue: any atom still without a connection gets one via nearest
    # neighbor by topic overlap (any shared topic, even a single tag)
    connected_ids = {c["atom_id_1"] for c in connections} | {c["atom_id_2"] for c in connections}
    orphan_count = 0
    for atom in atoms:
        if atom["id"] in connected_ids:
            continue
        topics = set(atom.get("topics", []))
        if not topics:
            continue
        best = None
        best_jaccard = 0
        for other in atoms:
            if other["id"] == atom["id"]:
                continue
            other_topics = set(other.get("topics", []))
            if not other_topics:
                continue
            shared = topics & other_topics
            if not shared:
                continue
            jac = len(shared) / len(topics | other_topics)
            if jac > best_jaccard:
                best_jaccard = jac
                best = other
        if best is not None:
            before = len(connections)
            _add_pair(atom, best, "related",
                      round(min(best_jaccard + 0.1, 0.75), 2),
                      "orphan_rescue", topics & set(best.get("topics", [])))
            if len(connections) > before:
                orphan_count += 1
                connected_ids.add(atom["id"])
                connected_ids.add(best["id"])

    print(f"  Found {len(connections)} topic overlap connections "
          f"(within: {within_count}, cross: {cross_count}, orphan-rescue: {orphan_count})")

    # LLM-assisted connections (optional)
    if HAS_ANTHROPIC and os.environ.get("ANTHROPIC_API_KEY") and not dry_run:
        print("  Discovering LLM-assisted connections...")
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        client = anthropic.Anthropic(api_key=api_key)
        brain_name = brain_json["brain_name"]
        llm_connections = []

        for cluster_key, cluster_atoms in by_cluster.items():
            if len(cluster_atoms) < 3:
                continue

            atom_summaries = "\n".join(
                f"[{a['id'][:8]}] {a['content'][:200]}"
                for a in cluster_atoms[:20]
            )

            prompt = f"""Analyze these atoms from {brain_name}'s "{cluster_key}" cluster and find relationships.

ATOMS:
{atom_summaries}

Find 3-8 connections. Focus on:
- "contradicts" — intellectual tension (highest value)
- "extends" — one idea builds on another
- "inspired_by" — one idea led to another

Return ONLY a JSON array:
[{{"atom_id_1": "first8chars", "atom_id_2": "first8chars", "relationship": "contradicts|extends|inspired_by", "rationale": "brief explanation"}}]"""

            try:
                response = client.messages.create(
                    model=model,
                    max_tokens=4000,
                    messages=[{"role": "user", "content": prompt}]
                )
                text = response.content[0].text.strip()
                if text.startswith("```"):
                    text = re.sub(r'^```(?:json)?\s*', '', text)
                    text = re.sub(r'\s*```$', '', text)

                candidates = json.loads(text)

                # Resolve short IDs back to full UUIDs
                id_map = {a["id"][:8]: a["id"] for a in cluster_atoms}
                for c in candidates:
                    full_id_1 = id_map.get(c["atom_id_1"])
                    full_id_2 = id_map.get(c["atom_id_2"])
                    if full_id_1 and full_id_2:
                        llm_connections.append({
                            "id": str(uuid.uuid4()),
                            "atom_id_1": full_id_1,
                            "atom_id_2": full_id_2,
                            "relationship": c["relationship"],
                            "confidence": 0.8,
                            "method": "llm_analysis",
                            "rationale": c.get("rationale", ""),
                        })

                time.sleep(1)
            except Exception as e:
                print(f"    {cluster_key}: ERROR — {e}")

        print(f"  Found {len(llm_connections)} LLM connections")
        connections.extend(llm_connections)

    if dry_run:
        print(f"  [DRY RUN] Would save {len(connections)} connections")
        return True

    with open(connections_path, "w") as f:
        json.dump(connections, f, indent=2)

    rel_counts = Counter(c["relationship"] for c in connections)
    print(f"  Total: {len(connections)} connections saved")
    for rel, count in rel_counts.most_common():
        print(f"    {rel}: {count}")

    return True


# =============================================================================
# STAGE 6: Export pack (brain-atoms.json, brain-context.md, skills, explore.html)
# =============================================================================

def stage_export(brain_json, brain_dir, dry_run=False):
    """STAGE 6: Run export-brain.py to generate the complete pack."""
    print("\n" + "=" * 60)
    print("STAGE 6: Export pack")
    print("=" * 60)

    slug = brain_json["brain_slug"]
    atoms_path = brain_dir / "research" / "all-atoms.json"
    connections_path = brain_dir / "research" / "connections.json"

    if not atoms_path.exists():
        print(f"  ERROR: {atoms_path} not found — run merge stage first")
        return False

    if dry_run:
        print("  [DRY RUN] Would run export-brain.py")
        return True

    # Import and run the export script directly
    import subprocess
    cmd = [
        sys.executable, str(SCRIPT_DIR / "export-brain.py"),
        "--brain", slug,
        "--from-files", str(atoms_path), str(connections_path),
    ]
    result = subprocess.run(cmd, cwd=str(ROOT_DIR), capture_output=False)
    return result.returncode == 0


# =============================================================================
# STAGE 7: Update index.json registry
# =============================================================================

def stage_update_index(brain_json, brain_dir, dry_run=False):
    """STAGE 7: Update brains/index.json with current atom count and status."""
    print("\n" + "=" * 60)
    print("STAGE 7: Update registry")
    print("=" * 60)

    index_path = BRAINS_DIR / "index.json"
    slug = brain_json["brain_slug"]

    all_atoms_path = brain_dir / "research" / "all-atoms.json"
    connections_path = brain_dir / "research" / "connections.json"

    atom_count = 0
    connection_count = 0

    if all_atoms_path.exists():
        with open(all_atoms_path) as f:
            atom_count = len(json.load(f))
    if connections_path.exists():
        with open(connections_path) as f:
            connection_count = len(json.load(f))

    # Determine status
    pack_dir = brain_dir / "pack"
    has_pack = (pack_dir / "brain-atoms.json").exists()
    if has_pack and atom_count >= 100:
        status = "live"
    elif atom_count > 0:
        status = "ingesting"
    else:
        status = "scaffolded"

    if dry_run:
        print(f"  [DRY RUN] Would update {slug}: {atom_count} atoms, {connection_count} connections, status={status}")
        return True

    if index_path.exists():
        with open(index_path) as f:
            index = json.load(f)
    else:
        index = {"brains": []}

    # Find or create entry
    entry = None
    for b in index["brains"]:
        if b["slug"] == slug:
            entry = b
            break

    if entry is None:
        entry = {
            "slug": slug,
            "name": brain_json["brain_name"],
            "source": brain_json.get("brain_source_detail", brain_json.get("brain_source_description", "")),
            "pack_path": f"brains/{slug}/pack/",
        }
        index["brains"].append(entry)

    entry["atom_count"] = atom_count
    entry["connection_count"] = connection_count
    entry["status"] = status

    with open(index_path, "w") as f:
        json.dump(index, f, indent=2)

    print(f"  Updated: {slug} → {atom_count} atoms, {connection_count} connections, status={status}")
    return True


# =============================================================================
# MAIN
# =============================================================================

ALL_STAGES = ["generate", "youtube", "merge", "synthesis", "connections", "export", "index"]

def main():
    parser = argparse.ArgumentParser(
        description="Build a complete brain pack from brain.json config",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Stages (in order):
  generate    — Generate atoms via deep research (Claude API)
  youtube     — Ingest YouTube transcripts + decompose into atoms
  merge       — Merge all research atoms, add UUIDs and confidence tiers
  synthesis   — Generate synthesis.md from brain.json
  connections — Discover connections (topic overlap + LLM)
  export      — Run export pipeline (brain-atoms.json, brain-context.md, skills)
  index       — Update brains/index.json registry

Default runs: generate, merge, synthesis, export, index
Add --youtube for YouTube ingestion, --connections for enrichment
        """,
    )
    parser.add_argument("--brain", required=True, help="Brain slug (e.g., steve-jobs)")
    parser.add_argument("--reference", default="scott-belsky", help="Reference brain for exemplars (default: scott-belsky)")
    parser.add_argument("--model", default="claude-sonnet-4-20250514", help="Claude model for generation")
    parser.add_argument("--stages", help="Comma-separated stages to run (default: generate,merge,synthesis,export,index)")
    parser.add_argument("--skip-generate", action="store_true", help="Skip atom generation (use existing research files)")
    parser.add_argument("--youtube", action="store_true", help="Include YouTube transcript ingestion stage")
    parser.add_argument("--connections", action="store_true", help="Include connection enrichment stage")
    parser.add_argument("--all", action="store_true", help="Run ALL stages including youtube and connections")
    parser.add_argument("--dry-run", action="store_true", help="Show what would happen without doing it")
    args = parser.parse_args()

    # Resolve brain directory
    brain_dir = BRAINS_DIR / args.brain
    if not brain_dir.exists():
        print(f"ERROR: Brain directory not found: {brain_dir}")
        print(f"Create it first: mkdir -p brains/{args.brain}/{{source,research,data,pack}}")
        sys.exit(1)

    brain_json_path = brain_dir / "brain.json"
    if not brain_json_path.exists():
        print(f"ERROR: brain.json not found: {brain_json_path}")
        sys.exit(1)

    with open(brain_json_path) as f:
        brain_json = json.load(f)

    # Determine stages to run
    if args.stages:
        stages = [s.strip() for s in args.stages.split(",")]
    elif args.all:
        stages = ALL_STAGES
    else:
        stages = ["generate", "merge", "synthesis", "export", "index"]
        if args.youtube:
            stages.insert(1, "youtube")
        if args.connections:
            stages.insert(stages.index("export"), "connections")

    if args.skip_generate and "generate" in stages:
        stages.remove("generate")

    # Banner
    print(f"\n{'#' * 60}")
    print(f"# BUILD BRAIN: {brain_json['brain_name']}")
    print(f"# Slug: {brain_json['brain_slug']}")
    print(f"# Stages: {' → '.join(stages)}")
    print(f"# Model: {args.model}")
    print(f"# Reference: {args.reference}")
    if args.dry_run:
        print(f"# MODE: DRY RUN")
    print(f"{'#' * 60}")

    start_time = time.time()
    results = {}

    # Run stages
    stage_map = {
        "generate": lambda: stage_generate(brain_json, brain_dir, args.reference, args.model, args.dry_run),
        "youtube": lambda: stage_youtube(brain_json, brain_dir, args.model, args.dry_run),
        "merge": lambda: stage_merge(brain_json, brain_dir, args.dry_run),
        "synthesis": lambda: stage_synthesis(brain_json, brain_dir, args.dry_run),
        "connections": lambda: stage_connections(brain_json, brain_dir, args.model, args.dry_run),
        "export": lambda: stage_export(brain_json, brain_dir, args.dry_run),
        "index": lambda: stage_update_index(brain_json, brain_dir, args.dry_run),
    }

    for stage_name in stages:
        if stage_name not in stage_map:
            print(f"\n  WARNING: Unknown stage '{stage_name}' — skipping")
            continue
        results[stage_name] = stage_map[stage_name]()

    # Summary
    elapsed = time.time() - start_time
    print(f"\n{'=' * 60}")
    print(f"BUILD COMPLETE — {brain_json['brain_name']}")
    print(f"{'=' * 60}")
    for stage_name, success in results.items():
        icon = "OK" if success else "SKIP/FAIL"
        print(f"  {stage_name}: {icon}")
    print(f"\n  Time: {elapsed:.1f}s")
    print(f"  Pack: brains/{brain_json['brain_slug']}/pack/")

    # Final atom count
    all_atoms_path = brain_dir / "research" / "all-atoms.json"
    if all_atoms_path.exists():
        with open(all_atoms_path) as f:
            count = len(json.load(f))
        print(f"  Atoms: {count}")

    connections_path = brain_dir / "research" / "connections.json"
    if connections_path.exists():
        with open(connections_path) as f:
            conn_count = len(json.load(f))
        if conn_count:
            print(f"  Connections: {conn_count}")


if __name__ == "__main__":
    main()
