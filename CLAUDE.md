# BrainsForSale — Project CLAUDE.md

## Canonical Location

**All BrainsForSale work lives here: `~/rob-ai/brainsforsale/`**

Do NOT create or save files to a standalone `Brainsforsale` Cowork mount, `~/.claude/`, or anywhere else. Everything goes in this directory under `~/rob-ai/` so it's version-controlled, backed up, and visible to all sessions that mount `rob-ai/`.

## What This Is

BrainsForSale is a product: packaged "brain packs" — curated knowledge sets from notable thinkers (starting with Scott Belsky) that users install into AI assistants. Each brain ships with 10 thinking skills (`/advise`, `/teach`, `/debate`, `/connect`, `/evolve`, `/apply`, `/mashup`, `/brainfight`, `/deep-dive`, `/surprise`).

## Directory Structure (v2)

```
brainsforsale/
  CLAUDE.md                          ← this file
  DESIGN.md                          ← design system (Stripe-inspired, indigo-tinted premium knowledge aesthetic)
  BRAND.md                           ← brand style guide (voice, messaging, vocabulary, visual identity)
  IMPROVEMENTS.md                    ← improvement backlog
  business-plan.md                   ← strategy doc
  .gitignore

  scripts/                           ← SHARED pipeline (brain-agnostic)
    export-brain.py                  ← generic: --brain scott-belsky
    enrich-voice.py                  ← generic: --brain scott-belsky
    enrich-connections.py            ← generic: --brain scott-belsky

  templates/                         ← SHARED templates
    SKILL.md.template                ← brain-setup template
    README.md.template
    README.dev.md                    ← **START HERE** for building a new brain (full step-by-step guide)
    explore.html.template            ← data-driven human UI (reads brain-atoms.json)
    create-brain-tables.sql          ← Supabase table creation template
    skills/                          ← 10 skill templates
      advise.md.template, teach.md.template, etc.

  storefront/                        ← product-level assets
    landing-page-prototype.html

  brains/
    index.json                       ← registry: all brains, slugs, status
    scott-belsky/                    ← EVERYTHING for this brain
      brain.json                     ← config (clusters, skill examples, Supabase refs)
      synthesis.md                   ← thinking analysis layer
      source/                        ← raw inputs + brain-specific scripts
        extracted-insights.md
        export-direct.py             ← Supabase direct fetch
        visual-prototype.html
      research/                      ← enrichment atoms (pipeline inputs)
        interview-atoms.json, book-atoms.json, etc.
      data/                          ← gitignored ephemeral
      pack/                          ← CUSTOMER DELIVERABLE
        SKILL.md                     ← brain-setup (loads brain-context.md)
        brain-context.md             ← THE LLM file (synthesis + rules + atoms + skills)
        brain-atoms.json             ← structured data (atoms + connections + index)
        explore.html                 ← THE human file (reads brain-atoms.json)
        README.md                    ← quick start
        skills/                      ← 10 thin reasoning modes
          advise/SKILL.md, teach/SKILL.md, etc.
```

## Key Dependencies

- **Supabase project:** `uzediwokyshjbsymevtp` (same as PAOS)
- **Tables:**
  - `belsky_atoms` — 284 atoms from all 77 Implications editions, with `content`, `original_quote`, `implication`, `confidence_tier`, `cluster`, `topics`, `embedding`
  - `belsky_connections` — 430 typed relationships (supports, contradicts, extends, related)
  - `brain_metadata` — brain config record (1 row per brain, generic schema)
  - `cross_connections` — Rob ↔ Belsky cross-brain links
  - `belsky_enrichment_log` — connection enrichment run history (mode, counts, duration, errors)
- **Edge function:** `enrich-connections` — automated connection discovery (topic overlap + temporal + LLM). Runs daily at 11:30pm PT via pg_cron. Modes: `discover` (cron), `discover-llm` (manual), `stats`.
- **Export scripts** require `SUPABASE_SERVICE_KEY` — set in `~/rob-ai/.env`
- **Voice enrichment** requires `ANTHROPIC_API_KEY` env var

## Architecture

### Two Audiences, Two Paths

- **LLMs** load `brain-context.md` — the single file with everything: synthesis, LLM rules, all atoms, and skill instructions
- **Humans** open `explore.html` — fully data-driven, reads brain-atoms.json (including synthesis section) and renders a browsable UI. Same template for all brains.

### brain.json Synthesis Section

The `synthesis` key in brain.json contains structured data for the "How They Think" tab in explore.html:
- `first_principles` — array of {title, desc}
- `thinking_patterns` — array of {name, desc}
- `contrarian_positions` — array of {title, desc}
- `does_not_believe` — array of {title, desc}
- `would_not_say` — array of {title, desc}
- `biography` — array of {date, role, lesson}
- `skills` — array of {name, title, desc, example}
- `hero_tagline`, `hero_updated` — strings for hero section

This data is exported into brain-atoms.json's `synthesis` key and rendered by explore.html dynamically.

### Atom Schema (belsky_atoms)

| Column | Type | Purpose |
|--------|------|---------|
| content | text | Distilled insight (always present) |
| original_quote | text | Belsky's ACTUAL voice — provocative framing, stories, metaphors |
| implication | text | The "so what" — what this means for builders/leaders |
| confidence_tier | text | high / medium / low |
| cluster | text | One of 16 topic clusters |
| topics | text[] | Topic tags for cross-cluster search |
| embedding | vector(1536) | For semantic search |
| source_ref | text | URL to original newsletter edition |
| source_date | timestamp | Publication date |

### Environment Setup

```bash
# Add to ~/rob-ai/.env (one time):
export ANTHROPIC_API_KEY=sk-ant-...       # Required for atom generation, connections, voice enrichment
export SUPABASE_SERVICE_KEY=eyJ...        # Required for Supabase operations
export SUPABASE_URL=https://uzediwokyshjbsymevtp.supabase.co
export FIRECRAWL_API_KEY=fc-...           # Optional, for web scraping fallback

# Source before any pipeline work:
source ~/rob-ai/.env

# Python deps:
pip install anthropic youtube-transcript-api httpx
```

### Build Pipeline (one command)

```bash
# Build a brain from scratch (generates atoms, merges, exports, everything):
source ~/rob-ai/.env && python scripts/build-brain.py --brain {slug}

# With YouTube transcripts + connection enrichment:
source ~/rob-ai/.env && python scripts/build-brain.py --brain {slug} --all

# Rebuild pack from existing atoms (skip generation):
source ~/rob-ai/.env && python scripts/build-brain.py --brain {slug} --skip-generate --connections

# Dry run — preview what would happen:
python scripts/build-brain.py --brain {slug} --dry-run
```

**Stages:** `generate → youtube → merge → synthesis → connections → export → index`

### Adding a New Brain (3 steps)

```bash
# 1. Scaffold directory + copy brain.json template
mkdir -p brains/{slug}/{source,research,data,pack}
cp brains/steve-jobs/brain.json brains/{slug}/brain.json

# 2. Edit brain.json — replace ALL values
#    (name, bio, clusters, synthesis, skill examples — this is the creative work, ~1-2 hours)

# 3. Build everything
source ~/rob-ai/.env && python scripts/build-brain.py --brain {slug} --connections
```

That's it. The pipeline generates atoms, creates synthesis.md, discovers connections, exports the full pack, and updates the registry.

For **living figures** with YouTube content: add `source/sources.json` with youtube_id entries, then use `--all`.
For **deceased/pre-blogging figures**: deep-research generation handles it (no YouTube needed).

### Individual Scripts (for manual control)

```
scripts/build-brain.py                   ← ONE-COMMAND BUILD (chains all below)
scripts/generate-atoms-research.py       ← deep-research atom generation via Claude
scripts/ingest-youtube.py                ← YouTube transcript extraction + decomposition
scripts/export-brain.py                  ← generic pack export: --brain {slug}
scripts/enrich-voice.py                  ← extract original voice from source URLs
scripts/enrich-connections.py            ← topic overlap + temporal + LLM connections
```

### SQL Table Template

```
templates/create-brain-tables.sql   # sed 's/{{SLUG}}/peter_attia/g' | psql
```

### Skill Design (v2 — thin, context-loaded)

- 10 skills, each ~15 lines in `skills/{name}/SKILL.md`
- Each skill assumes `brain-context.md` is loaded — no manifest routing, no cluster discovery
- Skill instructions also inline at bottom of `brain-context.md` for LLMs that load that file
- All skills: voice-first (original_quote), thin-topic graceful degradation, suggest next skill
- Template variables: `{{brain_name}}`, `{{brain_first_name}}`, `{{atom_count}}`, etc.

## Design System

`DESIGN.md` in the project root defines BrainsForSale's visual identity. Based on the [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) format (Google Stitch DESIGN.md standard). Any AI agent can read it and generate on-brand UI.

**Design DNA:** Stripe-inspired premium knowledge aesthetic. Light-first with warm paper alternating sections. Space Grotesk weight-300 display type ("whispered authority"). Brain Indigo (`#6366f1`) as the singular accent. Indigo-tinted multi-layer shadows. Knowledge Gold (`#d97706`) reserved for premium moments only.

**How to use:** Drop `DESIGN.md` into any project folder or paste into an AI agent context, then say "build me a page that looks like this." All 9 sections (theme, colors, typography, components, layout, depth, do's/don'ts, responsive, agent prompts) give agents everything they need for pixel-perfect output.

**Cluster colors** (for atom cards and topic visualization): Product/Design `#6366f1`, AI/Tech `#0ea5e9`, Leadership `#d97706`, Creativity `#ec4899`, Business `#059669`, Culture `#8b5cf6`.

## Key Documents

- `personas.md` — 7 customer personas with JTBD, objections, channels, WTP, killer features. Stack-ranked by priority.
- `IMPROVEMENTS.md` — Full improvement backlog from April 2026 critique panel.
- `business-plan.md` — Strategy doc (Greg Isenberg style).

## Remaining Questions

- [ ] Pricing model — subscription vs. one-time purchase vs. freemium?
- [ ] Distribution: working `npx skills add` command pointing to `brains/{slug}/pack/`
- [ ] Next brain pack after Belsky?
- [ ] Legal/licensing framework for packaging a person's published thinking?
- [ ] Supabase schema migration to generic `brain_atoms` table (Phase 7)

See `IMPROVEMENTS.md` for the full backlog from the April 2026 critique panel.
