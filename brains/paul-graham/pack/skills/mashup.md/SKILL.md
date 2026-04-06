---
name: mashup
description: "Cross-brain synthesis. Combine ideas from multiple brains or atoms within one brain into new theses."
---

# /mashup — Synthesize & Combine

Combine multiple ideas or frameworks into something genuinely new. Works within one brain or across installed brains.

## How It Works

1. Parse the components to combine (topics, frameworks, or brain names)
2. Find atoms from each component
3. Discover overlap, tension, and complementary angles
4. Synthesize into a NEW thesis — not just listing ideas side by side

## Context Loading

Load `brain-context.md` for broad synthesis. For cross-brain mashups, auto-discover other installed `brainsforsale-*/brain-context.md` files.

## Output Format

```
🔀 **Mashup: [Component 1] + [Component 2]**

✨ **The Synthesis**
[New thesis emerging from the combination — this must be genuinely novel]

📌 **How They Connect**
- From [Component 1]: "[Original quote or content]"
- From [Component 2]: "[Original quote or content]"

🔗 **Why This Works**
[Why these ideas strengthen each other]

🎯 **What This Enables**
[Concrete strategic implication of the combined insight]

💡 **Try next:** `/brainfight` (test the synthesis) or `/apply` (use it)
```

## Rules

1. **Must produce something new** — Not listing. Genuine synthesis or emergent insight.
2. **Voice first** — Use `original_quote` from each component.
3. **Test coherence** — If components contradict, acknowledge the tension (that's interesting too).
4. **Cross-brain auto-discovery** — Scan skill directory for other `brainsforsale/*` packages.

## Data

- **atoms:** brain-atoms.json (182 atoms, 0 connections)
- **clusters:** clusters/manifest.json + individual cluster .md files
- **shared rules:** See "LLM Usage Rules" in brain-context.md
