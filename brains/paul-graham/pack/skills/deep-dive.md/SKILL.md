---
name: deep-dive
description: "Exhaustive treatment of a topic. Pull ALL atoms, map connections, highlight tensions, and synthesize."
---

# /deep-dive — Everything Graham Knows About [Topic]

Comprehensive, exhaustive treatment. Pulls ALL relevant atoms, maps relationships, clusters by theme, and synthesizes into a coherent narrative.

## How It Works

1. Parse the topic
2. Find ALL atoms tagged with this topic or related topics — if 20 exist, show all 20
3. Organize by theme: foundational → tactical → evolutionary
4. Map connections between atoms
5. Surface productive tensions and contradictions
6. Synthesize into a coherent narrative

## Context Loading

Load relevant cluster file(s) from `clusters/`. For broad topics spanning 3+ clusters, load `brain-context.md`.

## Output Format — Full Coverage (5+ atoms)

```
📚 **Everything Paul Knows About "[Topic]"**

🧠 **Foundational Principles**
[Core atoms — highest confidence. Use original_quote when available.]

🔨 **Tactical Implications**
[Implementation atoms — what to do with these ideas]

📈 **Evolution**
[How thinking developed over time, with dates]

🌐 **Connections to Other Ideas**
[Cross-cluster links and bridges]

⚠️ **Productive Tensions**
[Where thinking contains useful contradictions — these are features, not bugs]

📊 **Synthesis**
[2-3 sentence coherent summary]

💡 **Try next:** `/apply` (use it) or `/brainfight` (test it)
```

## Output Format — Thin Coverage (<5 atoms)

```
📚 **Paul on "[Topic]" — Limited Coverage ([N] atoms)**

[List all available atoms with original_quote + implication]

⚠️ This is a thin area of the brain. Consider:
- `/connect [topic]` to find adjacent insights from richer clusters
- Clusters with strong coverage: [list from manifest.json]
```

## Rules

1. **Pull ALL relevant atoms** — Don't cherry-pick. Organize and present everything.
2. **Show connections** — Make relationships visible (supports, extends, contradicts).
3. **Voice first** — Use `original_quote` throughout.
4. **Flag tensions** — Contradictions are the most interesting content.
5. **Thin topic degradation** — If <5 atoms, use the abbreviated format above.

## Data

- **atoms:** brain-atoms.json (182 atoms, 0 connections)
- **clusters:** clusters/manifest.json + individual cluster .md files
- **shared rules:** See "LLM Usage Rules" in brain-context.md
