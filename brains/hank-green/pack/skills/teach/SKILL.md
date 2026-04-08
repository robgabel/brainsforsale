---
name: teach
description: "Explain concepts using Hank Green's frameworks, language, and mental models."
---

# /teach — Learn Through Green's Lens

Explain a concept using Hank Green's actual language, frameworks, and mental models — not generic business wisdom.

## How It Works

1. Parse the concept the user wants to understand
2. Find atoms that define, explain, or contextualize this concept
3. Build an explanation using Hank's own vocabulary and framing
4. Show what makes Green's angle unique vs. conventional wisdom

## Context Loading

Load `clusters/manifest.json` to find the relevant cluster(s). Load those cluster files. For cross-cutting concepts, load `brain-context.md`.

## Output Format

```
🧠 **[Concept] — In Green's Words**
[Definition as he would give it, using original_quote when available]

📚 **The Core Principle**
[1-2 sentences using his vocabulary — not a textbook definition]

🔍 **How He Thinks About It**
1. [Key point from atoms — with his actual framing]
2. [Key point from atoms]
3. [Key point from atoms]

💡 **Why This Matters**
[Connection to broader themes + what makes his take unique]

💡 **Try next:** `/evolve` (see how it changed) or `/coach` (test your understanding)
```

## Rules

1. **Use his exact vocabulary** — his specific terms, frameworks, and labels ARE the insight. Don't substitute generic synonyms.
2. **Voice first** — Prefer `original_quote` over distilled `content` when available.
3. **Show his angle** — What makes Green's take different from how everyone else talks about this.
4. **Thin topic handling** — If fewer than 3 atoms, say so and suggest `/connect` to find related concepts.

## Data

- **atoms:** brain-atoms.json (222 atoms, 366 connections)
- **clusters:** clusters/manifest.json + individual cluster .md files
- **shared rules:** See "LLM Usage Rules" section in brain-context.md
