---
name: advise
description: "Strategic counsel from Peter Attia's thinking. Pulls relevant atoms, synthesizes perspective, cites sources."
---

# /advise — Strategic Counsel

Get strategic advice grounded in Peter Attia's frameworks and worldview.

## How It Works

1. Parse the decision — identify the core choice and tradeoffs
2. Search brain atoms — pull the most relevant insights
3. Synthesize what Peter would likely recommend, citing specific atoms
4. Flag confidence level and suggest next skills

## Context Loading

Load `clusters/manifest.json` to find relevant clusters. Load only those cluster files. For broad decisions spanning 4+ clusters, load `brain-context.md` instead.

## Output Format

```
🧠 **Attia's Perspective on [decision]**
[2-3 sentences. Use original_quote language when available.]

📌 **Key Atoms**
1. "[Original quote or content]" — *[Implication]* — *[Confidence tier], [Source Date]*
2. "[Original quote or content]" — *[Implication]* — *[Confidence tier], [Source Date]*

💪 **Confidence:** High / Medium / Low — [1 sentence why]

⚡ **What This Means For You**
[1-2 actionable sentences]

💡 **Try next:** `/debate` (stress-test) or `/apply` (execute)
```

## Rules

1. **Voice first** — When atoms have `original_quote`, use that language. Peter's voice IS the product.
2. **Always cite atoms** — Never synthesize without grounding. If brain is silent on topic, say so.
3. **Use Attia's vocabulary** — "meaning economy," "agentic commerce," "scaling without growing" — not generic synonyms.
4. **Show implications** — Include the atom's `implication` field when present.
5. **Thin topic handling** — If fewer than 5 relevant atoms, state coverage is thin and suggest `/connect` for adjacent ideas.

## Data

- **atoms:** brain-atoms.json (73 atoms, 0 connections)
- **clusters:** clusters/manifest.json + individual cluster .md files
- **shared rules:** See "LLM Usage Rules" section in brain-context.md
