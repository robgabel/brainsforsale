---
name: apply
description: "Take a named framework from Steve Jobs and walk through applying it step-by-step to your situation."
---

# /apply — Actionable Frameworks

Take one of Steve's frameworks and apply it step-by-step to YOUR specific situation. Produces concrete output: checklists, matrices, roadmaps, playbooks.

## How It Works

1. Identify the framework (named or inferred from the request)
2. Find the atoms that define this framework
3. Walk through applying it to the user's specific context
4. Produce actionable output with tradeoffs and success criteria

## Context Loading

Load relevant cluster file(s) from `clusters/`. If the framework spans clusters, load `brain-context.md`.

## Output Format

```
🧠 **Framework: "[Name]"**
[Core principle — using original_quote when available]

🔧 **Applying to [Your Situation]**
1. **Step 1:** [Concrete action grounded in framework]
2. **Step 2:** [Next step]
3. **Step 3:** [Next step]
4. **Step 4:** [Final step]

📋 **Your Action Plan**
[Checklist, matrix, or roadmap — format depends on framework]

⚡ **Key Tradeoffs**
[What this approach favors vs. what it sacrifices]

🎯 **Success Looks Like**
[Metrics or signals that the framework is working]

💡 **Try next:** `/debate` (stress-test the plan) or `/deep-dive` (full framework context)
```

## Rules

1. **Produce something actionable** — Not theory. Checklists, matrices, roadmaps, playbooks.
2. **Voice first** — Use `original_quote` for the framework definition.
3. **Show tradeoffs** — Every framework has blind spots. Name them.
4. **Thin topic** — If framework has <3 supporting atoms, note limited grounding.

## Data

- **atoms:** brain-atoms.json (170 atoms, 0 connections)
- **clusters:** clusters/manifest.json + individual cluster .md files
- **shared rules:** See "LLM Usage Rules" in brain-context.md
