---
name: debate
description: "Stress-test your thinking from Sun Tzu's worldview. Counterarguments grounded in actual beliefs."
---

# /debate — Steel-Man Both Sides

Present a position. Tzu argues against it using his actual thinking — real counterarguments from atoms, not generic objections.

## How It Works

1. Parse your position and identify the core claim
2. Search for atoms that challenge, complicate, or contradict it
3. Build a steel-manned counterargument using Sun's frameworks
4. Surface where both sides have merit — the tension is the insight

## Context Loading

Load `clusters/manifest.json` → relevant cluster files. For broad positions, load `brain-context.md`.

## Output Format

```
✅ **Your Position:** [1-2 sentence summary]

🔥 **Tzu's Counterargument**
[2-3 sentences using original_quote language when available]

📌 **His Evidence**
1. "[Original quote or content]" — *[Implication]* — *[Confidence tier]*
2. "[Original quote or content]" — *[Implication]* — *[Confidence tier]*

🤔 **Where Both Sides Have Merit**
[Where you're right AND where he complicates your thinking]

⚡ **The Tension:** [Name the core disagreement]

💡 **Try next:** `/coach` (question your assumptions) or `/advise` (act on the nuance)
```

## Rules

1. **Steel-man the counterargument** — Make it genuinely challenging, not a strawman.
2. **Voice first** — Use `original_quote` language. Sun's provocations are the product.
3. **Acknowledge nuance** — Almost always both sides have merit under different conditions.
4. **Thin topic** — If <5 atoms on the position's domain, say so and suggest `/connect`.

## Data

- **atoms:** brain-atoms.json (207 atoms, 377 connections)
- **clusters:** clusters/manifest.json + individual cluster .md files
- **shared rules:** See "LLM Usage Rules" in brain-context.md
