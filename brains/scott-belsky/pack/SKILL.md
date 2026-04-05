---
name: brain-setup
description: "Load the Scott Belsky brain and configure all 10 thinking skills. One-time setup that detects your AI tool, loads brain context, and verifies everything works."
---

# Scott Belsky Brain Pack — Setup

Welcome to the **Belsky Brain Pack** from [brainsforsale.com](https://brainsforsale.com). 359 knowledge atoms from 77 editions of the Implications newsletter, with 161 typed connections and 10 thinking skills.

## Load the Brain

Load `brain-context.md` into your AI tool's context window. This single file contains the full knowledge base, LLM usage rules, synthesis of how Belsky thinks, and skill instructions.

- **Claude Code / Cowork:** Brain context loads automatically when this skill runs.
- **Cursor:** Add `brain-context.md` to `.cursor/rules` or project instructions.
- **ChatGPT / Claude.ai:** Paste `brain-context.md` as your first message or system prompt.

## The 10 Thinking Skills

| Skill | Mode | Example |
|-------|------|---------|
| `/advise` | Strategic counsel | "Should I raise my Series A or stay bootstrapped?" |
| `/debate` | Steel-man both sides | "Is remote work better for innovation?" |
| `/apply` | Actionable frameworks | "How do I apply the originality framework to my product?" |
| `/teach` | Explain concepts | "Explain agentic commerce to me." |
| `/deep-dive` | Exhaustive analysis | "Deep dive into Scott's thinking on organizational design." |
| `/surprise` | Serendipity | No input needed — just run it. |
| `/connect` | Bridge ideas | "Connect originality to organizational structure." |
| `/brainfight` | Ideas in conflict | "Longevity vs. urgency — which should win?" |
| `/mashup` | Synthesize | "Mashup: originality + AI agents + organizational design." |
| `/evolve` | Trace evolution | "How does Scott's thinking on AI agents evolve?" |

## Workflows

- **Decide:** `/advise` → `/debate` → `/apply`
- **Learn:** `/teach` → `/deep-dive` → `/evolve`
- **Create:** `/surprise` → `/connect` → `/mashup`
- **Research:** `/deep-dive` → `/mashup` → `/brainfight`
- **Daily ritual:** `/surprise` each morning

## Verify Setup

```
/advise "I'm thinking about whether to focus my company on serving large enterprises or build a platform for creators. What would Scott think?"
```

You should get a response grounded in specific atoms, using Scott's vocabulary, with confidence assessment and a suggested next skill.

## For Humans

Open `explore.html` in a browser to browse atoms, search, and view connections visually. LLMs use `brain-context.md`; humans use `explore.html`.
