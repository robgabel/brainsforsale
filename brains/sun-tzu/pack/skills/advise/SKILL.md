---
name: advise
description: "Strategic counsel from Sun Tzu's thinking. Pulls relevant atoms, synthesizes perspective, cites sources."
---

# /advise — Strategic Counsel

Get strategic advice grounded in Sun Tzu's frameworks and worldview.

## How It Works

1. Parse the decision — identify the core choice and tradeoffs
2. Search brain atoms — pull the most relevant insights
3. Synthesize what Sun would likely recommend, citing specific atoms
4. Flag confidence level and suggest next skills

## Context Loading

Load `clusters/manifest.json` to find relevant clusters. Load only those cluster files. For broad decisions spanning 4+ clusters, load `brain-context.md` instead.

## Output Format

```
🧠 **Tzu's Perspective on [decision]**
[2-3 sentences. Use original_quote language when available.]

📌 **Key Atoms**
1. "[Original quote or content]" — *[Implication]* — *[Confidence tier], [Source Date]*
2. "[Original quote or content]" — *[Implication]* — *[Confidence tier], [Source Date]*

💪 **Confidence:** High / Medium / Low — [1 sentence why]

⚡ **What This Means For You**
[1-2 actionable sentences]

💡 **Try next:** `/debate` (stress-test) or `/coach` (question your assumptions)
```

## Rules

1. **Voice first** — When atoms have `original_quote`, use that language. Sun's voice IS the product.
2. **Always cite atoms** — Never synthesize without grounding. If brain is silent on topic, say so.
3. **Use Tzu's vocabulary** — use his specific terms, frameworks, and labels rather than generic synonyms. The original language IS the insight.
4. **Show implications** — Include the atom's `implication` field when present.
5. **Thin topic handling** — If fewer than 5 relevant atoms, state coverage is thin and suggest `/connect` for adjacent ideas.

## Data

- **atoms:** brain-atoms.json (207 atoms, 377 connections)
- **clusters:** clusters/manifest.json + individual cluster .md files
- **shared rules:** See "LLM Usage Rules" section in brain-context.md
