# Charlie Munger Brain Pack

> **218 knowledge atoms** · **200 typed connections** · **9 unified skills (1 router + 8 reasoning modes)**
> From [brainsfor.dev](https://brainsfor.dev)

## What This Is

A structured knowledge graph of Charlie Munger's thinking, extracted from Poor Charlie's Almanack (his collected speeches and talks), 40+ years of Berkshire Hathaway shareholder Q&A, Wesco and Daily Journal annual meetings, the 1995 'Psychology of Human Misjudgment' speech at Harvard, the 1986 Harvard School commencement address, and the 2007 USC Law commencement address. Designed to be loaded as context into any LLM — Claude, ChatGPT, Cursor, or any AI tool that accepts system prompts.

This isn't a chatbot or a persona. It's a **thinking partner** grounded in Charlie's actual ideas, frameworks, and worldview.

## Quick Start

1. Install the brain pack into `${BRAINSFOR_HOME:-~/.brainsfor}/brains/charlie-munger/`
2. In your AI tool, activate the brain:
   ```
   /brain charlie-munger
   ```
3. Then run any thinking skill:
   ```
   /advise "Should I diversify across 40 stocks or concentrate in my 5 best ideas?"
   ```

You should get a response that cites specific atoms, synthesizes Charlie's perspective, and recommends what to do next.

## What's Inside

```
pack/
  ├── SKILL.md              ← Setup guide + skill reference (start here)
  ├── brain-context.md      ← Full knowledge base (load this as context)
  ├── brain-atoms.json      ← Structured data (218 atoms, 200 connections)
  ├── README.md             ← You are here
  └── skills/               ← 9 unified skills (work with any installed brain)
      ├── brain/            ← /brain router (set/show/list/clear active brain)
      ├── advise/           ← /advise — strategic counsel
      ├── teach/            ← /teach — explain through the thinker's lens
      ├── debate/           ← /debate — steel-man both sides
      ├── connect/          ← /connect — find unexpected bridges
      ├── evolve/           ← /evolve — trace how thinking changed
      ├── surprise/         ← /surprise — serendipity engine
      ├── coach/            ← /coach — Socratic questioning
      └── predict/          ← /predict — implication chains
```

## Unified Skill Architecture

Every brain pack ships the **same 9 skill files**. They're brain-agnostic — the 8 thinking skills resolve which brain to use by (1) reading `${BRAINSFOR_HOME:-~/.brainsfor}/state/active-brain.txt`, or (2) taking an inline slug as the first argument.

This means:

- **Install this brain pack first** → `/brain charlie-munger` activates it, then `/advise` / `/teach` / `/surprise` all work.
- **Install more brain packs later** → they drop into `${BRAINSFOR_HOME:-~/.brainsfor}/brains/`, auto-registered in `brains/index.json`, and the same 9 skills work for them too. No reinstall, no collisions.
- **Override per call** — `/advise paul-graham should I start a company?` uses Paul Graham for that one call regardless of active brain.
- **Cross-brain mode** — `/debate charlie-munger paul-graham originality` contrasts two thinkers.

## The Knowledge Graph

**218 atoms** — Each atom is a self-contained insight with topic tags, source date, confidence score, and source URL.

**200 connections** — Typed relationships between atoms: supports, contradicts, extends, related, inspired_by. These let skills trace reasoning chains and surface productive tensions.

**16 topic clusters** — mental models, inversion, investing, patience, psychology, incentives, circle of competence, moats, worldly wisdom, temperament, envy, simplicity.

**Date range:** 1962 — 2023

## How to Use

**For Claude Code / Cowork:** The skills in `pack/skills/` load automatically once the pack is installed to `${BRAINSFOR_HOME:-~/.brainsfor}/brains/charlie-munger/`. Run `/brain charlie-munger` to activate.

**For Cursor:** Add `brain-context.md` to your `.cursor/rules` or project instructions, then use the skill prompts as templates.

**For ChatGPT / Claude.ai:** Paste `brain-context.md` as your first message or system prompt, then describe which skill behavior you want (e.g. "respond as /advise would").

**For any other tool:** Load `brain-context.md` as context at the start of your session.

## Skill Workflows

Chain skills for deeper results (all can be prefixed with a brain slug or rely on the active brain):

- **Decide:** `/advise` → `/debate` → `/coach`
- **Learn:** `/teach` → `/evolve` → `/coach`
- **Create:** `/surprise` → `/connect` → `/predict`
- **Forecast:** `/predict` → `/debate` → `/advise`
- **Daily ritual:** `/surprise` each morning

## Cross-Brain Features

Install multiple brain packs and the unified skills auto-discover all of them via `${BRAINSFOR_HOME:-~/.brainsfor}/brains/index.json`:

- `/connect <slug-a> <slug-b> <topic>` — semantic bridges across two thinkers
- `/debate <slug-a> <slug-b> <position>` — stress-test from two worldviews
- `/brain list` — see everything installed
- `/brain <slug>` — switch active brain without reinstalling anything

## About Charlie Munger

Charlie Munger (1924-2023) was the Vice Chairman of Berkshire Hathaway and Warren Buffett's intellectual partner for more than sixty years. A lawyer turned investor, he built his fortune through patience, multidisciplinary thinking, and an almost militant insistence on rationality. His 'latticework of mental models' approach to decision-making, his speech on the psychology of human misjudgment, and his lifelong commitment to inversion have made him one of the most influential practical philosophers of the modern era.

## Sources & Ethics

This brain pack was built exclusively from **freely available, public sources** — interviews, podcasts, public talks, blog posts, free newsletters, YouTube videos, and publicly shared excerpts. No transcripts from commercial works (e.g., audiobooks, paid courses) or paywalled essays were used to derive this brain.

Where a thinker's book ideas appear in the knowledge graph, they are represented as they exist in the public discourse: book reviews, author interviews, press coverage, conference talks, and LLM-generated summaries of widely discussed concepts. Authors typically share their core ideas through extensive public appearances and media — those public representations are what this brain captures.

## Support

- Full setup guide: `SKILL.md`
- Website: [brainsfor.dev](https://brainsfor.dev)

---

**Load a genius into your AI.**
