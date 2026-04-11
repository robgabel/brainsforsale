---
name: brain
description: "Set, show, list, or clear the active BrainsFor brain for the session. Usage: /brain <slug> to activate, /brain to show current, /brain list to see installed brains, /brain clear to unset."
---

# /brain — Active Brain Router

Controls which BrainsFor brain the 8 thinking skills (`/advise`, `/teach`, `/debate`, `/connect`, `/evolve`, `/surprise`, `/coach`, `/predict`) use by default. Set it once and chain skills without re-typing the slug each time.

## State File

Active brain is stored at `${BRAINSFOR_HOME:-~/.brainsfor}/state/active-brain.txt` — a single line containing the brain slug (e.g. `scott-belsky`). Create the directory if it doesn't exist.

## Subcommands

### `/brain <slug>` — Activate a brain

1. Verify `<slug>` matches an entry in `${BRAINSFOR_HOME:-~/.brainsfor}/brains/index.json`.
2. If not: list valid slugs and stop.
3. If yes: write the slug to `${BRAINSFOR_HOME:-~/.brainsfor}/state/active-brain.txt` (overwrite).
4. Load `${BRAINSFOR_HOME:-~/.brainsfor}/brains/<slug>/pack/brain-context.md` as session context — this primes the session with synthesis, first principles, thinking patterns, and all atoms.
5. Confirm: "🧠 Loaded [Thinker Name]. [atom_count] atoms, [connection_count] connections. Try `/advise <question>`, `/teach <concept>`, or `/surprise` to start."

### `/brain` (no args) — Show current

1. Read `${BRAINSFOR_HOME:-~/.brainsfor}/state/active-brain.txt`.
2. If empty or missing: "No active brain. Run `/brain <slug>` to activate one."
3. Otherwise: show the active brain name, slug, and atom/connection counts from `index.json`.

### `/brain list` — Show installed brains

Read `${BRAINSFOR_HOME:-~/.brainsfor}/brains/index.json` and render a table with: slug, name, atom_count, connection_count. Order by name.

### `/brain clear` — Unset active brain

Delete `${BRAINSFOR_HOME:-~/.brainsfor}/state/active-brain.txt`. Confirm: "Active brain cleared."

## Override Behavior

The 8 thinking skills each accept an inline slug as the first token, which ALWAYS overrides the active brain for that one call:

```
/brain scott-belsky           ← active = Belsky
/advise should I ship?        ← uses Belsky
/advise paul-graham should I ship?   ← uses Graham for this call only
/advise how should I scale?   ← back to Belsky
```

## Cross-Brain

Some skills (`/debate`, `/connect`) accept two slugs for cross-brain mode:

```
/debate scott-belsky paul-graham agency
/connect sun-tzu steve-jobs timing
```

Active brain doesn't apply in cross-brain mode — both slugs must be explicit.

## Why This Exists

The 8 thinking skills are generic. They work for any installed brain. This router lets you switch context without retyping the slug on every call. Think of it like `cd` for brains.

## Data

- Registry: `${BRAINSFOR_HOME:-~/.brainsfor}/brains/index.json`
- Active state: `${BRAINSFOR_HOME:-~/.brainsfor}/state/active-brain.txt`
- Brain context: `${BRAINSFOR_HOME:-~/.brainsfor}/brains/<slug>/pack/brain-context.md`
- Atoms: `${BRAINSFOR_HOME:-~/.brainsfor}/brains/<slug>/pack/brain-atoms.json`
