#!/usr/bin/env python3
"""
Video & web transcript extraction for BrainsForSale.

Extracts transcripts from YouTube videos or web pages (via Firecrawl) and
saves them as source material for atom generation. Works with the generic
brain pipeline.

Usage:
    # Extract transcript from a single YouTube video
    python scripts/ingest-youtube.py --brain steve-jobs --url "https://youtube.com/watch?v=..."

    # Extract from a URL list file (one URL per line)
    python scripts/ingest-youtube.py --brain steve-jobs --url-file brains/steve-jobs/source/urls.txt

    # Extract from all sources in sources.json that have youtube_id set
    python scripts/ingest-youtube.py --brain steve-jobs --from-sources

    # Fetch transcript/article text via Firecrawl (for web pages with transcripts)
    python scripts/ingest-youtube.py --brain steve-jobs --firecrawl --url "https://example.com/transcript"

    # Fetch all sources via Firecrawl using transcript_url from sources.json
    python scripts/ingest-youtube.py --brain steve-jobs --firecrawl --from-sources

    # Decompose transcripts into atoms using Claude
    python scripts/ingest-youtube.py --brain steve-jobs --decompose

    # Decompose a specific transcript file
    python scripts/ingest-youtube.py --brain steve-jobs --decompose --file transcripts/think-different-1997.json
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

# Optional imports (graceful degradation)
try:
    from youtube_transcript_api import YouTubeTranscriptApi
    HAS_YT_TRANSCRIPT = True
except ImportError:
    HAS_YT_TRANSCRIPT = False

try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False

try:
    import httpx
    HAS_HTTPX = True
except ImportError:
    HAS_HTTPX = False


def extract_video_id(url_or_id: str) -> str:
    """Extract YouTube video ID from URL or return as-is if already an ID."""
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
    """Fetch transcript for a YouTube video. Returns transcript data."""
    if not HAS_YT_TRANSCRIPT:
        print("ERROR: youtube-transcript-api not installed. Run: pip install youtube-transcript-api")
        sys.exit(1)

    try:
        ytt = YouTubeTranscriptApi()
        transcript_list = ytt.list(video_id)

        # Prefer manual captions over auto-generated
        transcript = None
        for t in transcript_list:
            if not t.is_generated:
                transcript = t
                break
        if transcript is None:
            # Fall back to auto-generated
            for t in transcript_list:
                transcript = t
                break

        if transcript is None:
            return {"error": f"No transcripts available for {video_id}"}

        fetched = transcript.fetch()
        segments = []
        for snippet in fetched:
            segments.append({
                "text": snippet.text,
                "start": snippet.start,
                "duration": snippet.duration
            })

        # Build full text with timestamps every ~60 seconds
        full_text_parts = []
        last_timestamp = -60
        for seg in segments:
            if seg["start"] - last_timestamp >= 60:
                mins = int(seg["start"] // 60)
                secs = int(seg["start"] % 60)
                full_text_parts.append(f"\n[{mins:02d}:{secs:02d}] ")
                last_timestamp = seg["start"]
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


def fetch_via_firecrawl(url: str, firecrawl_key: str = None, supabase_url: str = None) -> dict:
    """Fetch page content via Firecrawl API or Supabase edge function.

    Supports two modes:
    1. Direct Firecrawl API (requires FIRECRAWL_API_KEY)
    2. Supabase edge function proxy (requires SUPABASE_URL + SUPABASE_SERVICE_KEY)
    """
    if not HAS_HTTPX:
        print("ERROR: httpx not installed. Run: pip install httpx")
        sys.exit(1)

    firecrawl_key = firecrawl_key or os.environ.get("FIRECRAWL_API_KEY")
    supabase_url = supabase_url or os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

    try:
        if firecrawl_key:
            # Direct Firecrawl API
            resp = httpx.post(
                "https://api.firecrawl.dev/v1/scrape",
                headers={"Authorization": f"Bearer {firecrawl_key}"},
                json={"url": url, "formats": ["markdown"]},
                timeout=60,
            )
            resp.raise_for_status()
            data = resp.json()
            markdown = data.get("data", {}).get("markdown", "")
            metadata = data.get("data", {}).get("metadata", {})
        elif supabase_url and supabase_key:
            # Supabase edge function proxy
            resp = httpx.post(
                f"{supabase_url}/functions/v1/firecrawl-scrape",
                headers={
                    "Authorization": f"Bearer {supabase_key}",
                    "Content-Type": "application/json",
                },
                json={"url": url},
                timeout=60,
            )
            resp.raise_for_status()
            data = resp.json()
            markdown = data.get("markdown", data.get("data", {}).get("markdown", ""))
            metadata = data.get("metadata", {})
        else:
            return {"error": "No Firecrawl API key or Supabase edge function configured. "
                    "Set FIRECRAWL_API_KEY or both SUPABASE_URL + SUPABASE_SERVICE_KEY."}

        if not markdown:
            return {"error": f"No content extracted from {url}"}

        return {
            "video_id": None,
            "source_url": url,
            "language": metadata.get("language", "en"),
            "is_generated": False,
            "segment_count": len(markdown.split("\n\n")),
            "duration_seconds": 0,
            "full_text": markdown,
            "segments": [],
            "metadata": metadata,
        }

    except Exception as e:
        return {"error": str(e)}


def slugify(text: str) -> str:
    """Convert text to a filename-safe slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text[:80].strip('-')


def save_transcript(brain_slug: str, title: str, transcript_data: dict, source_meta: dict = None):
    """Save transcript to brains/{slug}/source/transcripts/."""
    base = Path(f"brains/{brain_slug}/source/transcripts")
    base.mkdir(parents=True, exist_ok=True)

    filename = slugify(title) + ".json"
    output = {
        "title": title,
        "extracted_at": datetime.now().isoformat(),
        **transcript_data,
    }
    if source_meta:
        output["source_meta"] = source_meta

    filepath = base / filename
    with open(filepath, "w") as f:
        json.dump(output, f, indent=2)

    print(f"  Saved: {filepath} ({transcript_data.get('segment_count', 0)} segments, "
          f"{transcript_data.get('duration_seconds', 0)//60}m)")
    return filepath


def decompose_transcript(brain_slug: str, transcript_path: str, brain_json: dict) -> list:
    """Use Claude to decompose a transcript into atoms."""
    if not HAS_ANTHROPIC:
        print("ERROR: anthropic SDK not installed. Run: pip install anthropic")
        sys.exit(1)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY not set")
        sys.exit(1)

    with open(transcript_path) as f:
        transcript = json.load(f)

    clusters = brain_json.get("clusters", {})
    cluster_list = "\n".join(f"- {k}: {v['name']} — {v['description']}" for k, v in clusters.items())

    brain_name = brain_json["brain_name"]
    first_name = brain_json["brain_first_name"]

    prompt = f"""You are decomposing a transcript of {brain_name} speaking into discrete "atoms" —
individual insights, beliefs, frameworks, or principles expressed in this recording.

TRANSCRIPT TITLE: {transcript.get('title', 'Unknown')}
DATE: {transcript.get('source_meta', {}).get('date', 'Unknown')}

CLUSTERS (assign each atom to exactly one):
{cluster_list}

RULES:
1. Each atom is ONE discrete idea — a belief, principle, framework, or insight
2. Write the atom's "content" as a distilled 2-4 sentence statement of the idea
3. Extract "original_quote" — {first_name}'s ACTUAL words from the transcript (1-3 sentences, preserve voice, metaphors, stories)
4. Write "implication" — the "so what" (1-2 sentences about what this means for builders/leaders)
5. Assign 2-5 topic tags per atom
6. Set confidence: 0.95 for clearly stated beliefs, 0.85 for strong implications, 0.75 for inferred positions
7. AIM FOR 15-30 ATOMS per transcript (more for longer/richer sources, fewer for short ones)
8. SKIP small talk, introductions, product specs/pricing, and audience interaction that doesn't contain ideas
9. Prioritize {first_name}'s most provocative, original, and timeless ideas over mundane observations

OUTPUT FORMAT (JSON array):
[
  {{
    "content": "Distilled insight statement...",
    "original_quote": "{first_name}'s actual words from the transcript...",
    "implication": "What this means for builders/leaders...",
    "cluster": "cluster_key",
    "topics": ["topic1", "topic2", "topic3"],
    "confidence": 0.92,
    "source_type": "video",
    "source_ref": "youtube:{transcript.get('video_id', 'unknown')}",
    "source_date": "{transcript.get('source_meta', {}).get('date', 'unknown')}"
  }}
]

TRANSCRIPT:
{transcript['full_text'][:50000]}

Return ONLY the JSON array, no other text."""

    client = anthropic.Anthropic(api_key=api_key)
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=8000,
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.content[0].text.strip()
    # Extract JSON from response (handle markdown code blocks)
    if text.startswith("```"):
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)

    atoms = json.loads(text)
    return atoms


def main():
    parser = argparse.ArgumentParser(description="YouTube transcript extraction for BrainsForSale")
    parser.add_argument("--brain", required=True, help="Brain slug (e.g., steve-jobs)")
    parser.add_argument("--url", help="Single YouTube URL or video ID")
    parser.add_argument("--url-file", help="File with one YouTube URL per line")
    parser.add_argument("--from-sources", action="store_true",
                        help="Extract from all sources in sources.json that have youtube_id")
    parser.add_argument("--title", help="Title for the video (with --url)")
    parser.add_argument("--firecrawl", action="store_true",
                        help="Use Firecrawl to fetch web page content (for transcript pages)")
    parser.add_argument("--decompose", action="store_true",
                        help="Decompose transcripts into atoms using Claude")
    parser.add_argument("--file", help="Specific transcript file to decompose (with --decompose)")
    parser.add_argument("--dry-run", action="store_true", help="Print what would be done without doing it")
    args = parser.parse_args()

    brain_dir = Path(f"brains/{args.brain}")
    if not brain_dir.exists():
        print(f"ERROR: Brain directory not found: {brain_dir}")
        sys.exit(1)

    brain_json_path = brain_dir / "brain.json"
    if not brain_json_path.exists():
        print(f"ERROR: brain.json not found: {brain_json_path}")
        sys.exit(1)

    with open(brain_json_path) as f:
        brain_json = json.load(f)

    # --- TRANSCRIPT EXTRACTION ---
    if args.url and args.firecrawl:
        # Firecrawl mode: fetch web page content
        title = args.title or f"firecrawl-page"
        print(f"Fetching via Firecrawl: {args.url}")
        if not args.dry_run:
            data = fetch_via_firecrawl(args.url)
            if "error" in data:
                print(f"  ERROR: {data['error']}")
                sys.exit(1)
            save_transcript(args.brain, title, data, {"date": "unknown", "url": args.url})
        else:
            print(f"  [DRY RUN] Would fetch via Firecrawl: {args.url}")

    elif args.url:
        video_id = extract_video_id(args.url)
        title = args.title or f"video-{video_id}"
        print(f"Fetching transcript for: {video_id}")
        if not args.dry_run:
            data = fetch_transcript(video_id)
            if "error" in data:
                print(f"  ERROR: {data['error']}")
                sys.exit(1)
            save_transcript(args.brain, title, data, {"date": "unknown", "url": args.url})
        else:
            print(f"  [DRY RUN] Would fetch transcript for {video_id}")

    elif args.url_file:
        with open(args.url_file) as f:
            lines = [line.strip() for line in f if line.strip() and not line.startswith("#")]

        print(f"Processing {len(lines)} URLs from {args.url_file}")
        for i, line in enumerate(lines):
            # Format: URL [TAB] optional title [TAB] optional date
            parts = line.split("\t")
            url = parts[0].strip()
            title = parts[1].strip() if len(parts) > 1 else None
            date = parts[2].strip() if len(parts) > 2 else "unknown"

            try:
                video_id = extract_video_id(url)
                title = title or f"video-{video_id}"
                print(f"[{i+1}/{len(lines)}] {title}")
                if not args.dry_run:
                    data = fetch_transcript(video_id)
                    if "error" in data:
                        print(f"  ERROR: {data['error']}")
                        continue
                    save_transcript(args.brain, title, data, {"date": date, "url": url})
                else:
                    print(f"  [DRY RUN] Would fetch {video_id}")
            except ValueError as e:
                print(f"  SKIP: {e}")

    elif args.from_sources:
        sources_path = brain_dir / "source" / "sources.json"
        if not sources_path.exists():
            print(f"ERROR: sources.json not found: {sources_path}")
            sys.exit(1)

        with open(sources_path) as f:
            sources = json.load(f)

        if args.firecrawl:
            # Firecrawl mode: fetch sources with transcript_url
            pages = [s for s in sources["sources"] if s.get("transcript_url")]
            print(f"Found {len(pages)} sources with transcript_url set")
            for i, source in enumerate(pages):
                url = source["transcript_url"]
                title = source["title"]
                print(f"[{i+1}/{len(pages)}] {title}")
                if not args.dry_run:
                    data = fetch_via_firecrawl(url)
                    if "error" in data:
                        print(f"  ERROR: {data['error']}")
                        continue
                    save_transcript(args.brain, title, data, {
                        "date": source.get("date", "unknown"),
                        "type": source.get("type", "video"),
                        "priority": source.get("priority", "medium"),
                        "key_topics": source.get("key_topics", []),
                        "url": url,
                    })
                else:
                    print(f"  [DRY RUN] Would fetch via Firecrawl: {url}")
        else:
            # YouTube mode: fetch sources with youtube_id
            videos = [s for s in sources["sources"] if s.get("youtube_id")]
            print(f"Found {len(videos)} sources with youtube_id set")
            for i, source in enumerate(videos):
                vid = source["youtube_id"]
                title = source["title"]
                print(f"[{i+1}/{len(videos)}] {title}")
                if not args.dry_run:
                    data = fetch_transcript(vid)
                    if "error" in data:
                        print(f"  ERROR: {data['error']}")
                        continue
                    save_transcript(args.brain, title, data, {
                        "date": source.get("date", "unknown"),
                        "type": source.get("type", "video"),
                        "priority": source.get("priority", "medium"),
                        "key_topics": source.get("key_topics", []),
                    })
                else:
                    print(f"  [DRY RUN] Would fetch {vid}")

    # --- ATOM DECOMPOSITION ---
    if args.decompose:
        transcripts_dir = brain_dir / "source" / "transcripts"
        if args.file:
            files = [Path(args.file)]
        elif transcripts_dir.exists():
            files = sorted(transcripts_dir.glob("*.json"))
        else:
            print("No transcripts found to decompose.")
            sys.exit(1)

        all_atoms = []
        for filepath in files:
            print(f"\nDecomposing: {filepath.name}")
            if args.dry_run:
                print("  [DRY RUN] Would decompose into atoms")
                continue

            atoms = decompose_transcript(args.brain, str(filepath), brain_json)
            print(f"  Extracted {len(atoms)} atoms")
            all_atoms.extend(atoms)

        if all_atoms and not args.dry_run:
            output_path = brain_dir / "research" / "video-atoms.json"
            with open(output_path, "w") as f:
                json.dump(all_atoms, f, indent=2)
            print(f"\nTotal: {len(all_atoms)} atoms saved to {output_path}")

    # --- STATUS ---
    if not args.url and not args.url_file and not args.from_sources and not args.decompose:
        # Show status
        transcripts_dir = brain_dir / "source" / "transcripts"
        transcript_count = len(list(transcripts_dir.glob("*.json"))) if transcripts_dir.exists() else 0
        research_dir = brain_dir / "research"
        atom_files = list(research_dir.glob("*-atoms.json")) if research_dir.exists() else []
        atom_count = 0
        for af in atom_files:
            with open(af) as f:
                atom_count += len(json.load(f))

        print(f"Brain: {brain_json['brain_name']} ({args.brain})")
        print(f"Transcripts: {transcript_count}")
        print(f"Atom files: {len(atom_files)} ({atom_count} total atoms)")
        print(f"\nNext steps:")
        if transcript_count == 0:
            print(f"  1. Add youtube_id to sources in brains/{args.brain}/source/sources.json")
            print(f"  2. Run: python scripts/ingest-youtube.py --brain {args.brain} --from-sources")
            print(f"  OR: python scripts/ingest-youtube.py --brain {args.brain} --url <youtube-url> --title 'Title'")
        elif atom_count == 0:
            print(f"  1. Run: python scripts/ingest-youtube.py --brain {args.brain} --decompose")
        else:
            print(f"  1. Review atoms in brains/{args.brain}/research/")
            print(f"  2. Load into Supabase")
            print(f"  3. Run enrichment: python scripts/enrich-connections.py --brain {args.brain} --discover --llm")
            print(f"  4. Export: python scripts/export-brain.py --brain {args.brain} --from-files video-atoms.json connections.json")


if __name__ == "__main__":
    main()
