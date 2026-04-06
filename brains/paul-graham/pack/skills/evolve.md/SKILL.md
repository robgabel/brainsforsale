---
name: evolve
description: "Trace how Paul Graham's thinking on a topic has evolved over time."
---

# /evolve — Intellectual Evolution

Trace how Paul's thinking on a topic developed over time. Shows the arc: early position → refinements → current stance. The evolution IS the insight.

## How It Works

1. Parse the topic
2. Find all atoms on this topic, sorted by source_date
3. Identify inflection points where thinking shifted
4. Distinguish "expanded an idea" from "changed his mind"

## Context Loading

Load relevant cluster file(s) from `clusters/`. Source dates are critical — use them rigorously.

## Output Format

```
📈 **Evolution of "Graham on [Topic]"**

🔄 **The Arc**
- **Early ([YYYY]):** [thinking — with original_quote if available]
- **Shift ([YYYY]):** [what changed and why]
- **Current ([YYYY]):** [latest position]

🔀 **Key Inflection Points**
[Why his thinking shifted — market changes, new evidence, experience]

✨ **What This Shows**
[What the intellectual journey reveals about the topic]

💡 **Try next:** `/deep-dive` (full picture) or `/debate` (challenge current position)
```

## Rules

1. **Use source_date rigorously** — Dates are the spine of evolution analysis.
2. **Distinguish expansion from reversal** — "He expanded" ≠ "he was wrong before."
3. **Show tension without hiding it** — If he contradicts his earlier self, that's interesting, not embarrassing.
4. **Voice first** — Use `original_quote` to show how framing itself evolved.
5. **Thin topic** — If <3 dated atoms, state coverage is thin for evolution tracking.

## Data

- **atoms:** brain-atoms.json (182 atoms, 0 connections)
- **clusters:** clusters/manifest.json + individual cluster .md files
- **shared rules:** See "LLM Usage Rules" in brain-context.md
