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
    README.dev.md                    ← developer docs
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
  - `belsky_atoms` — 359 atoms with `content`, `original_quote`, `implication`, `confidence_tier`, `cluster`, `topics`, `embedding`
  - `belsky_connections` — typed relationships (supports, contradicts, extends, related, inspired_by)
  - `brain_metadata` — brain config record (1 row per brain, generic schema)
  - `cross_connections` — Rob ↔ Belsky cross-brain links
- **Export scripts** require `SUPABASE_SERVICE_KEY` — set in `~/rob-ai/.env`
- **Voice enrichment** requires `ANTHROPIC_API_KEY` env var

## Architecture

### Two Audiences, Two Paths

- **LLMs** load `brain-context.md` — the single file with everything: synthesis, LLM rules, all atoms, and skill instructions
- **Humans** open `explore.html` — reads brain-atoms.json and renders a browsable UI

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
brains/scott-belsky/brain.json (config) + Supabase data
  → scripts/export-brain.py --brain scott-belsky
    → brains/scott-belsky/pack/brain-atoms.json (structured data)
    → brains/scott-belsky/pack/brain-context.md (full narrative + skills)
    → brains/scott-belsky/pack/skills/{name}/SKILL.md (thin reasoning modes)
    → brains/scott-belsky/pack/SKILL.md, README.md (from templates)
```

### Skill Design (v2 — thin, context-loaded)

- 10 skills, each ~15 lines in `skills/{name}/SKILL.md`
- Each skill assumes `brain-context.md` is loaded — no manifest routing, no cluster discovery
- Skill instructions also inline at bottom of `brain-context.md` for LLMs that load that file
- All skills: voice-first (original_quote), thin-topic graceful degradation, suggest next skill
- Template variables: `{{brain_name}}`, `{{brain_first_name}}`, `{{atom_count}}`, etc.

### Adding Brain #2

```
brains/
  index.json    ← add entry
  scott-belsky/ ← existing
  peter-attia/  ← same internal structure: brain.json, synthesis.md, source/, research/, pack/
```

Zero structural decisions. Same pipeline, same templates, different config.

## Remaining Questions

- [ ] Pricing model — subscription vs. one-time purchase vs. freemium?
- [ ] Distribution: working `npx skills add` command pointing to `brains/{slug}/pack/`
- [ ] Next brain pack after Belsky?
- [ ] Legal/licensing framework for packaging a person's published thinking?
- [ ] Supabase schema migration to generic `brain_atoms` table (Phase 7)

See `IMPROVEMENTS.md` for the full backlog from the April 2026 critique panel.
