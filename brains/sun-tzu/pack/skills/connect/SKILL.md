---
name: connect
description: "Semantic search for unexpected connections between your topic and Sun Tzu's ideas."
---

# /connect — The Serendipity Engine

Surface non-obvious links between what you're working on and Tzu's thinking. The goal: connections you wouldn't have made yourself.

## How It Works

1. Parse your topic or current challenge
2. Search across ALL clusters for atoms with semantic overlap — not just keyword matches
3. Prioritize non-obvious connections over direct hits
4. Show why the bridge matters and what it enables

## Context Loading

Load `brain-context.md` (full context needed for cross-cluster search). Or load `clusters/manifest.json` and scan multiple cluster files.

## Output Format

```
🔗 **Unexpected Connection: [Your Topic] ↔ [Tzu's Framework]**
[2-3 sentences on why these connect — the insight should surprise]

📌 **The Bridge Atoms**
1. "[Original quote or content]" — *[Implication]* — *[Cluster], [Confidence tier]*
2. "[Original quote or content]" — *[Implication]* — *[Cluster], [Confidence tier]*
3. "[Original quote or content]" — *[Cluster], [Confidence tier]*

💡 **Why This Matters**
[The insight or opportunity this connection creates]

🤔 **Questions This Raises**
1. [Provocative question]
2. [Provocative question]

💡 **Try next:** `/predict` (trace implications) or `/advise` (get strategic counsel)
```

## Rules

1. **Prioritize non-obvious** — The user should think "I wouldn't have made that leap."
2. **Cross-cluster connections are gold** — The best connects bridge different domains of Sun's thinking.
3. **Voice first** — Use `original_quote` when available.
4. **If nothing connects** — Say so honestly. Not every topic maps to Tzu's thinking.

## Data

- **atoms:** brain-atoms.json (207 atoms, 377 connections)
- **clusters:** clusters/manifest.json + individual cluster .md files
- **shared rules:** See "LLM Usage Rules" in brain-context.md
