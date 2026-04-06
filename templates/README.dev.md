# Brain Pack Developer Guide

How to build a new brain pack from scratch using the BrainsForSale pipeline.

*Last updated: 2026-04-05*

---

## Architecture Overview

```
brain.json (config + synthesis) + Supabase (atoms + connections) + synthesis.md (LLM narrative)
  → export-brain.py --brain {slug}
    → complete customer-facing pack (zero hardcoded content)
```

The system is **config-driven**. `brain.json` is the single source of truth. Templates, export pipeline, enrichment scripts, and explore.html all read from it. Adding a brain is a content problem, not an engineering problem.

### Two Audiences, Two Paths

- **LLMs** load `brain-context.md` — synthesis narrative + LLM rules + all atoms
- **Humans** open `explore.html` — data-driven UI that reads `brain-atoms.json` (including synthesis)

---

## Step-by-Step: Building a New Brain

### Phase 1: Setup (~30 min)

#### 1. Create the directory structure

```bash
mkdir -p brains/{slug}/{source,research,data,pack}
```

#### 2. Create Supabase tables

```bash
sed 's/{{SLUG}}/{slug}/g; s/{{NAME}}/{Full Name}/g' templates/create-brain-tables.sql | psql $DATABASE_URL
```

This creates:
- `{slug}_atoms` — atoms with content, original_quote, implication, cluster, topics, embedding, confidence
- `{slug}_connections` — typed relationships (supports, contradicts, extends, related, inspired_by)
- Proper indexes, RLS policies, and a `brain_metadata` registry entry

#### 3. Fill brain.json

Copy from an existing brain as a starting point:

```bash
cp brains/scott-belsky/brain.json brains/{slug}/brain.json
```

Replace ALL values. Required fields:

**Basic identity:**
- `brain_name`, `brain_first_name`, `brain_last_name`, `brain_slug`
- `brain_possessive` ("his", "her", "their")
- `brain_bio` (2-3 sentences), `brain_tagline` (one-liner)

**Source material:**
- `brain_source_description` (e.g., "\"The Drive\" podcast and \"Outlive\" book")
- `brain_source_url`, `brain_source_detail`, `edition_count`, `date_range`

**Topic taxonomy:**
- `clusters` — 12-16 topic clusters, each with `name` and `description`
- `cluster_order` — display order array

**Skill examples:**
- `skill_examples.{advise,debate,apply,teach,deep_dive,connect,brainfight,mashup,evolve}` — one-liner per skill
- `workflow_examples.{learning,research}` — workflow narratives
- `quick_start_prompt`, `example_topic`, `topic_examples`

**Supabase config:**
- `supabase.project_id`, `supabase.atoms_table`, `supabase.connections_table`

**Synthesis section** (renders the "How They Think" tab in explore.html):
- `synthesis.hero_tagline`, `synthesis.hero_updated`
- `synthesis.first_principles` — array of `{title, desc}` (8-12 items)
- `synthesis.thinking_patterns` — array of `{name, desc}` (6-10 items)
- `synthesis.contrarian_positions` — array of `{title, desc}` (8-12 items)
- `synthesis.does_not_believe` — array of `{title, desc}` (5-7 items)
- `synthesis.would_not_say` — array of `{title, desc}` (4-6 items)
- `synthesis.biography` — array of `{date, role, lesson}` (4-6 entries)
- `synthesis.skills` — array of `{name, title, desc, example}` (10 items)

#### 4. Write synthesis.md

The narrative "How They Think" document that gets embedded into `brain-context.md` for LLMs. Format:

```markdown
## How {Name} Thinks

### First Principles
**1. [Title].** [Explanation]
...

### Thinking Patterns
**[Pattern name].** [Explanation]
...

### Contrarian Positions
**[Position].** [Explanation]
...

### What {Name} Does NOT Believe
**"[Claim]".** [Counter-explanation]
...

### What This Brain Would NOT Say
**"[Claim]".** [Explanation]
...

### Biographical Pattern
[Career timeline narrative]
```

This is the intellectual heavy lift — requires reading/watching the person's work and distilling their mental models (4-8 hours of research + writing).

---

### Phase 2: Ingest Content (~2-8 hours)

#### 5. Gather source material

Brain-specific. Examples:
- **Belsky**: 77 Implications newsletter editions (scraped via Firecrawl)
- **Attia**: Outlive chapters, Drive podcast transcripts, blog posts

Store raw inputs in `brains/{slug}/source/`.

#### 6. Extract atoms

Decompose each piece of content into atomic insights. An atom is one discrete idea, belief, framework, or principle.

Each atom needs:
- `content` (required) — the insight itself
- `cluster` — which topic cluster it belongs to
- `topics[]` — topic tags for cross-cluster search
- `source_ref` — URL to original source
- `source_date` — publication date
- `confidence_tier` — high / medium / low

#### 7. Load atoms into Supabase

Insert into `{slug}_atoms`. Target: **100+ atoms minimum** for a brain to feel worth it. 200-300 is ideal.

---

### Phase 3: Enrich (~1-2 hours compute + review)

#### 8. Voice enrichment

```bash
python scripts/enrich-voice.py --brain {slug}
python scripts/enrich-voice.py --brain {slug} --limit 20    # smaller batch
python scripts/enrich-voice.py --brain {slug} --dry-run      # preview
```

What it does:
- Fetches original source URLs for each atom
- Uses Haiku to extract the thinker's **actual language** (`original_quote`) and the "so what" (`implication`)
- Outputs `brains/{slug}/data/voice-enrichment-review.json` for human QA

To apply after review:
```bash
python scripts/enrich-voice.py --brain {slug} --apply brains/{slug}/data/voice-enrichment-review.json
```

#### 9. Connection discovery

```bash
python scripts/enrich-connections.py --brain {slug} --discover         # topic + temporal
python scripts/enrich-connections.py --brain {slug} --discover --llm   # + LLM analysis
python scripts/enrich-connections.py --brain {slug} --stats            # check progress
```

Three discovery methods:
1. **Topic overlap** — Jaccard similarity between atoms' topic tags within same cluster → `related`
2. **Temporal proximity** — Atoms published within 7 days with 2+ shared topics → `extends`
3. **LLM analysis** — Haiku analyzes each cluster for `contradicts`, `extends`, `inspired_by` (highest value)

To apply after review:
```bash
python scripts/enrich-connections.py --brain {slug} --apply brains/{slug}/data/connection-candidates.json
```

#### 10. Generate embeddings (optional for v1)

1536-dim vectors via OpenAI `text-embedding-3-large` for semantic search. Required for API-backed search; optional for flat-file delivery.

---

### Phase 4: Export & Ship (~5 min)

#### 11. Run the export pipeline

```bash
python scripts/export-brain.py --brain {slug} --from-files atoms.json connections.json
```

One command generates the entire customer-facing pack in `brains/{slug}/pack/`:

| File | Purpose | Source |
|------|---------|--------|
| `brain-atoms.json` | All atoms, connections, topic index, metadata, synthesis data | Supabase data + brain.json |
| `brain-context.md` | THE LLM file (synthesis + rules + all atoms) | Supabase data + synthesis.md |
| `explore.html` | THE human file (data-driven UI) | Shared template (reads brain-atoms.json) |
| `SKILL.md` | Brain setup skill | Template + brain.json |
| `README.md` | Quick start guide | Template + brain.json |
| `skills/*/SKILL.md` | 10 thinking skills | Templates + brain.json |

#### 12. Register in index.json

Add an entry to `brains/index.json`:

```json
{
  "slug": "{slug}",
  "name": "{Full Name}",
  "source": "{Source description}",
  "atom_count": 0,
  "connection_count": 0,
  "status": "scaffolded",
  "pack_path": "brains/{slug}/pack/"
}
```

Update `atom_count` and `connection_count` after export, change `status` to `live` when ready.

#### 13. Verify

- Open `pack/explore.html` in a browser
- Check: synthesis tab renders all sections, atoms load and are searchable, skills display correctly
- Grep for `{{` in all pack files — no unresolved template variables
- Spot-check atom count matches Supabase

---

## Template Variables Reference

Templates use `{{variable}}` syntax. Nested keys use dots: `{{skill_examples.advise}}`.

| Variable | Example | Used In |
|----------|---------|---------|
| `brain_name` | Peter Attia | All files |
| `brain_first_name` | Peter | All skill files |
| `brain_last_name` | Attia | Tab labels |
| `brain_slug` | peter-attia | SKILL.md, README.md |
| `brain_possessive` | his | SKILL.md, explore.html |
| `brain_source_description` | "The Drive" podcast | SKILL.md, brain-context.md |
| `brain_source_url` | peterattiamd.com | README.md |
| `brain_source_detail` | 400+ episodes... | SKILL.md, README.md |
| `brain_tagline` | a curated collection of... | SKILL.md |
| `brain_bio` | Full bio paragraph | SKILL.md, README.md, explore.html |
| `atom_count` | 284 | All files (injected at export) |
| `connection_count` | 430 | All files (injected at export) |
| `topic_examples` | Zone 2, VO2 max, ... | SKILL.md, README.md |
| `example_topic` | VO2 max | SKILL.md |
| `date_range` | 2013 — April 2026 | README.md |
| `quick_start_prompt` | I'm 45 and want to... | SKILL.md |
| `skill_examples.*` | One-liner per skill | SKILL.md |
| `workflow_examples.*` | Workflow narrative | SKILL.md |

---

## Directory Structure

```
brainsforsale/
  CLAUDE.md                          ← project instructions
  IMPROVEMENTS.md                    ← backlog

  scripts/                           ← SHARED pipeline (brain-agnostic)
    export-brain.py                  ← generic: --brain {slug}
    enrich-voice.py                  ← generic: --brain {slug}
    enrich-connections.py            ← generic: --brain {slug}

  templates/                         ← SHARED templates
    SKILL.md.template                ← brain-setup template
    README.md.template               ← quick start template
    README.dev.md                    ← THIS FILE
    explore.html.template            ← data-driven human UI
    create-brain-tables.sql          ← Supabase table template
    skills/                          ← 10 skill templates
      advise.md.template, teach.md.template, etc.

  brains/
    index.json                       ← registry of all brains
    scott-belsky/                    ← brain #1
      brain.json, synthesis.md, source/, research/, data/, pack/
    peter-attia/                     ← brain #2
      brain.json, synthesis.md, source/, research/, data/, pack/
```

---

## Quality Targets per Brain

| Metric | Minimum | Good | Great |
|--------|---------|------|-------|
| Atoms | 100 | 200 | 300+ |
| Connections | 50 | 200 | 400+ |
| Voice enriched (%) | 0% | 30% | 80%+ |
| Contradicts connections | 5 | 15 | 30+ |
| Orphan atoms | <20% | <10% | 0 |
| Clusters | 8 | 12 | 16 |

---

## Supabase Schema

### Per-brain tables

- `{slug}_atoms` — content, original_quote, implication, cluster, topics[], source_ref, source_date, confidence, confidence_tier, embedding(1536)
- `{slug}_connections` — atom_id_1, atom_id_2, relationship, confidence

### Shared tables

- `brain_metadata` — one row per brain (slug, name, tables, status, config)
- `cross_connections` — cross-brain relationships (future)
