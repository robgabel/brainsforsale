# BrainsFor — Project CLAUDE.md

## Canonical Location

**All BrainsFor work lives here: `~/rob-ai/brainsfor/`**

Do NOT create or save files to a standalone `Brainsfor` Cowork mount, `~/.claude/`, or anywhere else. Everything goes in this directory under `~/rob-ai/` so it's version-controlled, backed up, and visible to all sessions that mount `rob-ai/`.

## What This Is

BrainsFor is a product: packaged "brain packs" — curated knowledge sets from notable thinkers (starting with Scott Belsky) that users install into AI assistants. Each brain ships with 8 thinking skills (`/advise`, `/teach`, `/debate`, `/connect`, `/evolve`, `/surprise`, `/coach`, `/predict`).

## Directory Structure (v2)

```
brainsfor/
  CLAUDE.md                          ← this file
  DESIGN.md                          ← design system (Stripe-inspired, indigo-tinted premium knowledge aesthetic)
  BRAND.md                           ← brand style guide (voice, messaging, vocabulary, visual identity)
  IMPROVEMENTS.md                    ← improvement backlog
  business-plan.md                   ← strategy doc
  .gitignore

  scripts/                           ← SHARED pipeline (brain-agnostic)
    audit-brains.py                  ← QA validator: structural + data quality checks across all brains
    export-brain.py                  ← generic: --brain scott-belsky
    enrich-voice.py                  ← generic: --brain scott-belsky
    enrich-connections.py            ← generic: --brain scott-belsky
    ingest-youtube.py                ← generic: --brain peter-attia (download + extract)

  templates/                         ← SHARED templates
    SKILL.md.template                ← brain-setup template
    README.md.template
    README.dev.md                    ← **START HERE** for building a new brain (full step-by-step guide)
    explore.html.template            ← data-driven human UI (reads brain-atoms.json)
    create-brain-tables.sql          ← Supabase table creation template
    skills/                          ← 8 skill templates
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
        skills/                      ← 8 reasoning modes
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

### Export Pipeline

```
brains/{slug}/brain.json (config) + Supabase data
  → scripts/export-brain.py --brain {slug}
    → brains/{slug}/pack/brain-atoms.json (structured data + synthesis)
    → brains/{slug}/pack/brain-context.md (full narrative + skills)
    → brains/{slug}/pack/explore.html (copied from templates/, reads brain-atoms.json)
    → brains/{slug}/pack/skills/{name}/SKILL.md (thin reasoning modes)
    → brains/{slug}/pack/SKILL.md, README.md (from templates)
```

### YouTube Transcript Ingestion (generic — `--brain {slug}`)

```
scripts/ingest-youtube.py --brain {slug} --download                   # Download transcripts from youtube_sources in brain.json
scripts/ingest-youtube.py --brain {slug} --extract                    # Extract atoms from transcripts using Claude Haiku
scripts/ingest-youtube.py --brain {slug} --download --extract         # Both phases
scripts/ingest-youtube.py --brain {slug} --download --video VIDEO_ID  # Single video
scripts/ingest-youtube.py --brain {slug} --extract --limit 5          # Limit to N transcripts
scripts/ingest-youtube.py --brain {slug} --stats                      # Show download/extraction stats
scripts/ingest-youtube.py --brain {slug} --dry-run                    # Preview without writing
```

Requires `youtube-transcript-api` (`pip install youtube-transcript-api`). Configure videos in brain.json `youtube_sources.videos`. Output: `brains/{slug}/research/youtube-atoms.json`.

### Enrichment Scripts (generic — all accept `--brain {slug}`)

```
scripts/enrich-voice.py --brain {slug}                                # Extract original voice from source URLs
scripts/enrich-connections.py --brain {slug} --discover               # Topic overlap + temporal (within + cross-cluster)
scripts/enrich-connections.py --brain {slug} --discover --llm         # + Sonnet LLM analysis (within + cross-cluster)
scripts/enrich-connections.py --brain {slug} --discover --llm --auto-apply  # Autonomous: discover + apply, no review step
scripts/enrich-connections.py --brain {slug} --stats                  # Quality assessment with targets
```

### SQL Table Template

```
templates/create-brain-tables.sql   # sed 's/{{SLUG}}/peter_attia/g' | psql
```

### Skill Architecture (v4 — Unified, 2026-04-11)

**Important:** The PAOS install at `~/rob-ai/skills/` uses a **unified skill architecture** — ONE set of 8 generic reasoning skills + a `/brain` router, not per-brain copies. Any skill can use any installed brain.

- `~/rob-ai/skills/brain/` — router: `/brain <slug>` sets the active brain for the session (writes `~/.claude/state/active-brain.txt`). `/brain list`, `/brain` (show), `/brain clear` supported.
- `~/rob-ai/skills/{advise,teach,debate,connect,evolve,surprise,coach,predict}/` — 8 generic thinking skills. Each resolves the brain via: (1) inline first-token slug override, (2) active brain state file, (3) error if neither.
- Cross-brain mode: `/debate <slug-a> <slug-b> <topic>` and `/connect <slug-a> <slug-b> <topic>`.

Why this design: installing 7+ brain packs naively creates 63+ prefixed skills (`scott-belsky-advise`, `paul-graham-advise`, ...) which collide with the README-documented `/advise` UX. Unified skills match the original v3 intent and README promise. See `IMPROVEMENTS.md` → Architecture & Distribution for the history.

Customer deliverable (`brains/<slug>/pack/skills/`) still ships the per-brain skill files for users who install a single brain pack — those are templates for solo use. The PAOS install flattens them into one generic set because PAOS runs all 8 brains simultaneously.

### Skill Design (v3 — 8 skills, zero overlap)

8 skills, each a distinct reasoning mode with a unique output type:

| # | Skill | Output Type | What It Does |
|---|-------|-------------|--------------|
| 1 | `/advise` | Recommendations | Strategic counsel from the thinker's frameworks |
| 2 | `/teach` | Explanations | Explain concepts through the thinker's lens |
| 3 | `/debate` | Counterarguments | Steel-man the other side (absorbs old `/brainfight`) |
| 4 | `/connect` | Bridges | Find unexpected links between ideas (absorbs old `/mashup`) |
| 5 | `/evolve` | Timeline of thought | Trace how thinking changed over time |
| 6 | `/surprise` | Serendipity | Surface a high-quality atom you haven't seen |
| 7 | `/coach` | Questions | Socratic questioning — no answers, just what to ask yourself |
| 8 | `/predict` | Implication chains | Cascade second and third-order effects of a trend |

**Cut from v2:** `/brainfight` (into `/debate`), `/mashup` (into `/connect`), `/deep-dive` (into `/advise`), `/apply` (into `/advise`).
**Added in v3:** `/coach` (Socratic mode), `/predict` (implication chains — plays to thinkers who forecast).

- Each skill ~15 lines in `skills/{name}/SKILL.md`
- Each skill assumes `brain-context.md` is loaded — no manifest routing, no cluster discovery
- Skill instructions also inline at bottom of `brain-context.md` for LLMs that load that file
- All skills: voice-first (original_quote), thin-topic graceful degradation, suggest next skill
- Template variables: `{{brain_name}}`, `{{brain_first_name}}`, `{{atom_count}}`, etc.

### QA / Audit

**Script:** `scripts/audit-brains.py` — deterministic validator, zero API calls, runs in <2s. Produces a **0-100 completeness score** per brain across 6 weighted criteria.

```
python3 scripts/audit-brains.py                       # Audit all brains (scores + issues)
python3 scripts/audit-brains.py --brain scott-belsky   # Audit one brain
python3 scripts/audit-brains.py --json                 # Machine-readable output
python3 scripts/audit-brains.py --fix-hints            # Include remediation hints
python3 scripts/audit-brains.py --remediate            # Generate runnable fix script
```

**Scoring criteria (6, weighted to 100):**
| Criterion | Weight | What 100% Looks Like |
|-----------|--------|---------------------|
| Structure & Files | /20 | All files, canonical paths, zero duplicates |
| Schema Completeness | /15 | All brain.json keys filled, all synthesis sections |
| Atom Volume | /15 | 200+ atoms |
| Connection Density | /15 | <15% orphans, all atoms linked |
| Voice Enrichment | /20 | 100% original_quote + implication coverage |
| Synthesis Depth | /15 | 1500+ words, all sections, synthesis in export |

**Remediation:** `--remediate` generates a shell script ordered by impact (structural cleanup → re-export → enrichment). Each issue maps to a specific pipeline command.

**Cowork skill:** `/brain-audit` — runs the script (Phase 1), presents scores, generates remediation plan (Phase 2), optionally does LLM-powered semantic review (Phase 3: voice quality spot-check, synthesis coherence, connection quality, cross-brain consistency).

**When to run:** After any export, before deploy, after adding a new brain.

### Adding Brain #2 (Checklist)

1. **Create directory:** `brains/{slug}/` with `brain.json`, `synthesis.md`, `source/`, `research/`, `data/`, `pack/`
2. **Create Supabase tables:** `sed 's/{{SLUG}}/{slug}/g; s/{{NAME}}/{Name}/g' templates/create-brain-tables.sql | psql`
3. **Fill brain.json:** Copy from scott-belsky, replace all values (name, source, clusters, skill examples, synthesis)
4. **Write synthesis.md:** First principles, thinking patterns, contrarian positions (manual research, 4-8 hours)
5. **Ingest atoms:** Load source content into `{slug}_atoms` table
6. **Run enrichment:** `python scripts/enrich-voice.py --brain {slug}` and `python scripts/enrich-connections.py --brain {slug} --discover --llm`
7. **Export pack:** `python scripts/export-brain.py --brain {slug} --from-files atoms.json connections.json`
8. **Register:** Add entry to `brains/index.json`
9. **Verify:** Open `pack/explore.html` in browser, check all tabs render correctly

Zero structural decisions. Same pipeline, same templates, different config.

## Design System

`DESIGN.md` in the project root defines BrainsFor's visual identity. Based on the [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) format (Google Stitch DESIGN.md standard). Any AI agent can read it and generate on-brand UI.

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
