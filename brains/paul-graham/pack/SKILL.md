---
name: brain-setup
description: "Load the Paul Graham brain and configure all 10 thinking skills. One-time setup that detects your AI tool, loads brain context, and verifies everything works."
---

# Paul Graham Brain Pack — Setup & Configuration

Welcome to the **Graham Brain Pack** from [brainsforsale.com](https://brainsforsale.com). This is a premium knowledge asset extracted from Paul Graham's essays on paulgraham.com — a curated collection of his most influential thinking on startups, programming, writing, taste, and doing great work.

## What You're Getting

- **182 knowledge atoms** — Core insights, frameworks, and strategic principles from 220+ essays spanning 2001-2025, plus interviews, talks, and tweets
- **0 typed connections** — Relationships between ideas (supports, contradicts, extends, related, inspired_by)
- **10 specialized thinking skills** — Each designed to activate different modes of reasoning
- **Cross-referenced topics** — startups, programming, writing, wealth, taste, ambition, fundraising, hackers, ideas, growth, education, design, and more

This brain is designed to augment YOUR thinking — not replace it. Use it for strategic decisions, creative problem-solving, research, and to challenge your assumptions.

---

## Setup Instructions

### Step 1: Verify Installation

Your Graham Brain Pack folder should contain:

```
pack/
  ├── SKILL.md                 ← you are here
  ├── brain-context.md         ← full knowledge base + usage guide
  ├── brain-atoms.json         ← structured atoms (182 insights)
  └── README.md                ← quick reference
```

If any files are missing, reinstall from [brainsforsale.com](https://brainsforsale.com).

### Step 2: Detect Your AI Environment

This brain works across multiple AI tools. Identify which one you're using:

- **Claude Code** — Run this skill directly; brain context loads automatically
- **Cowork (Claude in Slack)** — Use `/brain-setup` command; Cowork syncs context
- **Cursor** — Paste brain-context.md into `.cursor/rules` or project instructions
- **ChatGPT / Claude.ai** — Copy brain-context.md into system prompt or conversation starter
- **Other tools** — Load brain-context.md as your first message or context injection

### Step 3: Load Brain Context

The brain operates in three layers:

1. **Layer 1 — Quick Reference** (brain-atoms.json)
   - JSON structure of 182 atoms with titles, summaries, connections
   - Ideal for: Rapid lookups, programmatic access, integrations
   - Use when: You need structured data for routing or filtering

2. **Layer 2 — Full Knowledge Base** (brain-context.md)
   - Complete narrative knowledge graph with topic tags, people, themes
   - Ideal for: Deep reasoning, strategy sessions, comprehensive understanding
   - Load this file when: Starting a session that requires brain-informed thinking

3. **Layer 3 — Thinking Skills** (the 10 skills below)
   - Each skill is a reasoning mode that activates specific parts of the brain
   - Ideal for: Targeted analysis, creative workflows, decision-making
   - Use when: You have a specific type of problem to solve

**Recommended:** Load `brain-context.md` at the start of each session where you want to use the brain. Claude will index it automatically.

### Step 4: Verify Everything Works

Test your setup with the Quick Start prompt below. You should get a thoughtful response grounded in Paul's thinking.

---

## The 10 Thinking Skills

Each skill is a specialized reasoning mode. Use them in combination for more powerful thinking.

### 🧠 **1. /advise** — Strategic Counsel
Ask for advice on decisions grounded in Paul's frameworks. Best for: career moves, company decisions, strategy choices.
*Example: "Should I drop out of college to work on my startup?"*

### 🔥 **2. /debate** — Steel-Man Both Sides
Present a position; brain argues both for and against it. Best for: understanding tradeoffs, challenging assumptions.
*Example: "Is it better to build something a lot of people kind of want, or something a few people really want?"*

### 🎯 **3. /apply** — Actionable Frameworks
Get concrete steps to apply an idea to your situation. Best for: implementation, execution, tactical work.
*Example: "Apply the 'do things that don't scale' framework to my marketplace startup."*

### 📚 **4. /teach** — Explain Like I'm Learning
Get a clear explanation of a concept as Paul sees it. Best for: understanding unfamiliar ideas, building mental models.
*Example: "Explain what makes a good startup idea using Paul's frameworks."*

### 🔍 **5. /deep-dive** — Exhaustive Analysis
Explore a topic across all connected atoms and frameworks. Best for: research, comprehensive understanding, thesis writing.
*Example: "Deep dive into Paul's thinking on wealth and economics."*

### 🎨 **6. /surprise** — Unexpected Connections
Get a random connection or counterintuitive insight you wouldn't think to ask for. Best for: creative breakthroughs, morning inspiration.
*Example: No input needed — just run it.*

### 🔗 **7. /connect** — Bridge Ideas
Find unexpected connections between two concepts. Best for: synthesis, innovation, cross-domain thinking.
*Example: "Connect Paul's ideas about taste to hiring decisions."*

### ⚔️ **8. /brainfight** — Ideas in Conflict
Pit two ideas against each other. Best for: understanding nuance, avoiding false consensus, strategic clarity.
*Example: "Move fast vs. do things right — which should win early on?"*

### 🔄 **9. /mashup** — Synthesize Atoms
Combine multiple ideas into a new framework or thesis. Best for: original thinking, writing, strategy synthesis.
*Example: "Mashup: startups + writing + programming as craft."*

### 📈 **10. /evolve** — How Ideas Build On Each Other
Trace how a concept develops and changes across the brain. Best for: historical perspective, maturity models, trajectory thinking.
*Example: "How has Paul's thinking on AI and programming evolved?"*

---

## Recommended Workflows

Use these skill combinations for better results:

### 🎯 Decision Workflow
→ `/advise` (get perspective) → `/debate` (stress-test) → `/apply` (make it real)

*Example: Deciding on a hire? Ask for advice, debate the tradeoffs, then map out decision criteria.*

### 📚 Learning Workflow
→ `/teach` (understand) → `/deep-dive` (go deeper) → `/evolve` (see how it develops)

*Example: New to startups? Teach → deep-dive → evolve to understand how PG's advice has matured.*

### 💡 Creative Workflow
→ `/surprise` (get inspired) → `/connect` (build bridges) → `/apply` (make it work)

*Example: Stuck on a problem? Surprise + connect often surface unexpected angles.*

### 🔬 Research Workflow
→ `/deep-dive` (understand the landscape) → `/mashup` (synthesize) → `/brainfight` (sharpen)

*Example: Fundraising soon? Deep-dive fundraising atoms → apply to your situation → debate your assumptions.*

### 🌅 Daily Ritual
→ Run `/surprise` each morning for 10 seconds of strategic inspiration.

---

## Quick Start

**Try this right now to verify setup:**

```
/advise

"I'm a developer with a side project getting traction. Should I quit my job and go full-time on it?"
```

You should get a thoughtful response that:
- References specific frameworks from the brain
- Weighs tradeoffs from Paul's perspective
- Suggests which of his mental models apply here
- Feels strategic and grounded (not generic)

If you get that, you're all set.

---

## Troubleshooting

**Q: The brain doesn't seem to know what I'm asking about.**
→ Make sure `brain-context.md` is loaded in your session. If using Claude Code, check that the file is in your working directory.

**Q: I want to search the brain for a specific topic.**
→ Use `/deep-dive` with a keyword: `"Deep dive: Paul's thinking on startups"` → The brain will pull all relevant atoms.

**Q: Can I combine skills?**
→ Absolutely. Chain them: `"First /advise on whether to pivot, then /debate the tradeoffs, then /apply the decision framework."`

**Q: What if a skill doesn't feel relevant to my question?**
→ Try a different one. `/brainfight` often works when you're stuck; `/mashup` when you need something original; `/surprise` when you need inspiration.

**Q: How often should I reload the brain?**
→ Once per session is sufficient. Brain context doesn't expire, and atoms don't change. But if you're switching between different projects, fresh context load = sharper thinking.

---

## About Paul Graham

Paul Graham is a programmer, essayist, and co-founder of Y Combinator — the most successful startup accelerator in history. His essays on paulgraham.com have shaped how a generation of founders and programmers think about startups, ambition, wealth creation, and the craft of building things. He is one of the most cited thinkers in Silicon Valley.

This brain pack extracts and structures his core ideas so you can activate his mental models in your own thinking.

**More:** Visit [brainsforsale.com](https://brainsforsale.com) for other brain packs, documentation, and community.

---

## Support & Feedback

If you encounter issues or have feedback:

1. Check `README.md` for quick answers
2. Verify all files are present and readable
3. Try a fresh load of `brain-context.md`
4. Contact support via [brainsforsale.com](https://brainsforsale.com)

---

**You're ready to think like Paul. Let's go.** 🚀
