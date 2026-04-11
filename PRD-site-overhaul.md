# PRD: BrainsFor.com Site Overhaul

**Date:** 2026-04-06
**Author:** Rob Gabel + Claude (from Belsky critique)
**Status:** Ready to build
**Priority:** P0 — this is the difference between "developer side project" and "product people want"

---

## The Problem

The current site explains BrainsFor. It doesn't *demonstrate* it. Every section tells the visitor what the product is. Almost nothing lets them feel it. Per Belsky's Do-Show-Explain hierarchy: we're explaining when we should be doing.

Specific failures:
1. **First mile is dead.** Hero is a tagline + install command. No value proven in the first 10 seconds.
2. **Skills look brain-locked.** Nothing communicates that `/advise`, `/debate`, `/surprise` work across ALL brains. Visitors think skills are Belsky-specific.
3. **Pricing is disconnected from brains.** Three abstract SaaS tiers with no brain selector. "Doesn't even seem like you know you're buying one brain."
4. **Two brains, one story.** Landing page only tells the Belsky story. Paul Graham is live but invisible on the homepage.
5. **No joyspan.** The explore.html visualization is high-craft. The marketing pages are template-y. The gap undermines the brand.
6. **Features listed as ingredients, not outcomes.** "Knowledge atoms (JSON)" and "Pre-computed embeddings (1536-dim)" mean nothing to non-developers.

---

## The Fix: 7 Changes

### Change 1: Explorer as Hero (Landing Page)

**What:** Replace the static side-by-side demo with a live mini-explorer that lets visitors interact with actual brain data in the first 10 seconds.

**Why:** Belsky's first-mile principle — more than 30% of product energy should go into the first 30 seconds. The explore.html visualization IS the product demo. It should be the first thing visitors experience, not something buried below three scrolls on the detail page.

**Implementation:**

- New component: `HeroExplorer.tsx` — a compact, interactive widget (not a full iframe)
- Shows 3-5 random high-confidence atoms from a randomly selected live brain
- Each atom card shows: original_quote (if available), topic pill, confidence badge, cluster color stripe
- "Surprise Me" button cycles to a new random atom with a smooth animation
- Below the atoms: "This is one of {atomCount} atoms in the {brainName} brain. Explore all →"
- Falls back to the current static demo on mobile (atoms widget on desktop only)

**Acceptance criteria:**
- [ ] Visitor sees real brain content within 3 seconds of page load
- [ ] "Surprise Me" works without page reload
- [ ] Links to full brain detail page
- [ ] Renders atoms from both Belsky and PG brains (alternates or lets user toggle)
- [ ] Mobile: simplified version (single atom card, swipeable)

**Files to modify:**
- `app/page.tsx` — replace "Live Demo" section
- New: `components/HeroExplorer.tsx`
- `lib/brains.ts` — may need to export atom data for client-side rendering (or fetch from static JSON)

---

### Change 2: Multi-Brain Skill Showcase

**What:** Redesign the skill showcase to make it crystal clear that skills are brain-agnostic. Every skill works with every brain. The brain is the context; the skill is the verb.

**Why:** Current site shows 8 skills as a flat grid with generic descriptions. Nothing says "this works across brains." Visitors assume skills are Belsky-specific. The multi-brain model is the entire business — one skill, many brains — and the site doesn't communicate it.

**Implementation:**

The skill showcase section gets a complete redesign:

**A) Skill cards with brain selector tabs**

Each skill card shows example output with toggle tabs for different brains:

```
┌─────────────────────────────────────────────┐
│ 🧭 /advise                                  │
│ Strategic counsel on your decisions          │
│                                              │
│ [Paul Graham] [Scott Belsky] [Peter Attia]   │
│                                              │
│ > /advise --paul-graham "Should I pivot      │
│   my startup?"                               │
│                                              │
│ Graham would tell you that most pivots are   │
│ actually just founders finally admitting     │
│ what they should have built from the start...│
│                                              │
│ Sources: "Do Things That Don't Scale",       │
│ "How to Get Startup Ideas"                   │
└─────────────────────────────────────────────┘
```

Clicking a different brain tab swaps the example:

```
│ > /advise --scott-belsky "Should I pivot     │
│   my startup?"                               │
│                                              │
│ Belsky would push back on the word "pivot."  │
│ His messy middle thesis says volatility is   │
│ the feature, not the bug...                  │
```

**B) The `--brain` flag syntax is always visible**

Every skill invocation shows the flag:
- `/advise --paul-graham "your question"`
- `/debate --scott-belsky "your position"`
- `/surprise --peter-attia`

This teaches the mental model: **skill + brain + prompt = output.**

**C) "Works with every brain" callout**

Above the skill grid:
> "8 skills. Every brain. One command."
> Skills are reasoning modes, not brain-specific features. Load any brain, use any skill.

**D) Workflow chains show multi-brain usage**

Below the skill grid, show workflow examples that chain across brains:
- **Cross-brain debate:** `/debate --paul-graham "AI will replace most knowledge work"` → `/debate --scott-belsky "AI will replace most knowledge work"` → Compare frameworks
- **Multi-perspective advise:** `/advise --paul-graham "Should I raise?"` → `/advise --scott-belsky "Should I raise?"` → Synthesize

**Acceptance criteria:**
- [ ] Every skill card shows the `--brain-name` flag in its example
- [ ] At least 2 skills show toggleable examples across 2+ brains
- [ ] "Works with every brain" messaging is prominent
- [ ] Workflow chains demonstrate cross-brain usage
- [ ] Scaffolded brains (Attia) show "Coming soon" state in toggles

**Files to modify:**
- `app/page.tsx` — skill showcase section
- `app/brains/[slug]/page.tsx` — skill section (brain-specific examples)
- New: `components/SkillShowcase.tsx` — interactive skill cards with brain tabs
- `lib/brains.ts` — add `skillExamples` data per brain (prompt + response pairs)

---

### Change 3: Brain-First Pricing

**What:** Restructure pricing page around brains, not abstract tiers. Brain selector at top → tiers below. "Choose your brain, then your plan."

**Why:** Current pricing shows three SaaS tiers (Standard/Pro/API) disconnected from any specific brain. It reads like generic pricing for a platform, not "I'm buying the Paul Graham brain." Belsky's principle: interface controls value — and the pricing interface should make the brain the hero.

**Implementation:**

**A) Brain selector at top of pricing page**

Horizontal brain cards (compact — name, atom count, status badge). Click to select. Selected brain highlights with indigo border. Default: first live brain.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Paul Graham   │  │ Scott Belsky  │  │ Peter Attia   │
│ 182 atoms     │  │ 284 atoms     │  │ Coming soon   │
│ ● Live        │  │ ● Live        │  │ ○ Building    │
└──────────────┘  └──────────────┘  └──────────────┘
```

**B) Tier cards anchored to selected brain**

Below the selector, tiers show brain-specific content:
- CTA reads "Get the Paul Graham brain" (not generic "Get this brain")
- Feature bullets reference the selected brain: "All 182 Paul Graham atoms" (not "Knowledge atoms (JSON)")
- The install command updates: `npx skills add brainsfor/paul-graham`

**C) Outcome-framed features**

Replace ingredient lists with outcome language:

| Current (ingredients) | New (outcomes) |
|---|---|
| Full skill pack (8 AI skills) | Ask any strategic question, get a cited answer in seconds |
| Knowledge atoms (JSON) | Every insight extracted, indexed, and connected |
| Brain context file (MD) | One file turns your AI into a domain expert |
| Visual brain explorer (HTML) | Browse the full knowledge graph before you install |
| Mental model map | See how a genius actually thinks — first principles, patterns, blind spots |
| All topic lenses | Deep-dive any topic: 12 clusters, hundreds of connections |

| Current (Pro ingredients) | New (Pro outcomes) |
|---|---|
| Pre-computed embeddings (1536-dim) | Semantic search — find insights by meaning, not keywords |
| API access for semantic search | Build products on top of the brain |
| Auto-updates on new content | Brain gets smarter as new content is published |

**D) Bundle pricing teaser**

Below individual brain tiers:
> "Want multiple brains? The more perspectives you load, the more powerful the cross-brain skills become."
> `/debate --paul-graham --scott-belsky "Is taste more important than speed?"`
> Bundle pricing coming soon.

**Acceptance criteria:**
- [ ] Brain selector at top of pricing page, all brains shown
- [ ] Selecting a brain updates tier content (CTA, features, install command)
- [ ] Feature bullets are outcomes, not ingredients
- [ ] Bundle/multi-brain messaging present
- [ ] FAQ still present but reframed (see Change 7)

**Files to modify:**
- `app/pricing/page.tsx` — full rewrite
- New: `components/BrainSelector.tsx` — compact horizontal brain picker
- `lib/brains.ts` — add outcome-framed feature descriptions per tier

---

### Change 4: Two-Brain Landing Page

**What:** Landing page tells the story of a platform with multiple brains, not a Belsky fan page. PG gets equal billing.

**Why:** We have two live brains. The landing page only features Belsky (demo example, stats section, founding supporters). A visitor should immediately understand this is a growing catalog of thinkers, not a single product.

**Implementation:**

**A) Dual-brain demo section**

Replace the single Belsky demo with a tabbed demo showing both brains:

```
[Paul Graham]  [Scott Belsky]

> /advise --paul-graham "Should I raise my Series A?"

Graham's central insight is that the best startups delay
raising as long as possible. "Do things that don't scale"
isn't just about early tactics — it's about staying close
to users long enough to find product-market fit...

Sources: "Do Things That Don't Scale", "Default Alive or
Default Dead?"
```

Clicking "Scott Belsky" tab:

```
> /advise --scott-belsky "Should I raise my Series A?"

Belsky would push you toward staying small. His core thesis
is "revenue per employee" as the new status metric...
```

**B) Stats section shows both brains**

Replace single-brain stats with a combined view:

```
2 live brains · 466 atoms · 928 connections · 297 source docs · 28 topic clusters · 8 skills each
```

Or show both side-by-side:

```
Paul Graham                    Scott Belsky
182 atoms · 498 connections    284 atoms · 430 connections
220+ essays · 12 clusters     77 editions · 16 clusters
```

**C) Brain catalog preview shows all three brains with equal weight**

Current implementation already does this (BrainCard grid) — keep as-is, but ensure PG card shows its live stats (182 atoms, 498 connections).

**D) Founding supporters section references both brains**

Change "87 of 100 founding spots remaining for the Belsky brain" to show counts for each live brain or aggregate.

**Acceptance criteria:**
- [ ] Demo section has tabs for both live brains
- [ ] Demo examples use `--brain-name` flag syntax
- [ ] Stats section reflects both brains (not just Belsky's numbers)
- [ ] Founding supporters section references both brains
- [ ] The word "brains" (plural) appears more than "brain" (singular) in marketing copy

**Files to modify:**
- `app/page.tsx` — demo section, stats section, founding supporters section
- New: `components/DualBrainDemo.tsx` — tabbed demo with brain toggle

---

### Change 5: Brain Detail Page — Explorer Above the Fold

**What:** Move the embedded explore.html iframe up so it's visible within one scroll. Restructure the page so the explorer IS the hero, not something you scroll past the bio to reach.

**Why:** Belsky's first-mile principle: the thing that proves value should be above the fold or one scroll away. Currently, visitors scroll past: hero, bio, topics, stats, AND the CTA card before they see the actual brain explorer.

**Implementation:**

**A) Restructured page layout:**

```
1. Compact hero (brain name + status + one-line tagline + stats row) ← condensed
2. CTA card (right-aligned on desktop, inline on mobile)
3. Brain Explorer iframe ← MOVED UP (was section 4, now section 2-3 area)
4. Skills section with brain-specific examples
5. "What's in the pack"
6. Install instructions
7. Full bio + topics (moved down — interested visitors will scroll)
```

**B) Brain-specific skill examples**

On the PG detail page, skills show PG-specific prompts and outputs:
- `/advise --paul-graham "Is my startup idea good?"` → PG-flavored response
- `/surprise --paul-graham` → Random PG insight

On the Belsky detail page, skills show Belsky-specific prompts and outputs:
- `/advise --scott-belsky "Should I ship MVP or polish?"` → Belsky-flavored response

**C) Quote highlight from the brain**

Above the explorer, show one powerful `original_quote` from the brain's highest-confidence atoms. Rotates on each page load.

> *"Do things that don't scale."* — Paul Graham

This gives an immediate taste of the brain's voice.

**Acceptance criteria:**
- [ ] Explorer iframe visible within one scroll on 1080p desktop
- [ ] Brain-specific skill examples (not generic)
- [ ] Rotating quote from brain's best atoms
- [ ] Bio and extended info moved below explorer
- [ ] CTA card remains sticky or prominently visible

**Files to modify:**
- `app/brains/[slug]/page.tsx` — section reorder + skill examples
- `lib/brains.ts` — add `featuredQuotes` and `skillExamples` per brain

---

### Change 6: Social Proof on Brain Cards

**What:** Show claim counts and identity-flex signals on brain cards throughout the site.

**Why:** Belsky's unsaid motivations framework — people adopt products for ego, status, and identity, not just utility. "47 people have claimed this brain" is both social proof and identity signal: "I'm the kind of person who loads Paul Graham's thinking into my AI."

**Implementation:**

**A) Claim count on BrainCard**

Add to each brain card: "Claimed by 47 people" (pulled from Supabase `brain_access` count).

For scaffolded brains: "Requested by 23 people" (from `brain_requests` votes).

**B) Claim count on brain detail page CTA card**

In the CTA card: "Join 47 others who've loaded this brain"

**C) "Recently claimed by" on brain detail**

Show the 3 most recent claimers (display_name or "Anonymous") as tiny avatars/initials below the CTA. Social proof + FOMO.

**D) Landing page stats update**

Add to the stats section: total users, total brain claims, most popular brain.

**Acceptance criteria:**
- [ ] Brain cards show claim count (real-time from Supabase)
- [ ] Brain detail CTA shows claim count
- [ ] Scaffolded brain cards show request count
- [ ] Data is fetched server-side (RSC) to avoid layout shift

**Files to modify:**
- `components/BrainCard.tsx` — add claim count
- `app/brains/[slug]/page.tsx` — CTA card claim count
- `app/page.tsx` — stats section
- `lib/brains.ts` — add functions to fetch claim/request counts from Supabase
- `lib/supabase-server.ts` — may need additional queries

---

### Change 7: Copy Overhaul — Outcomes Over Ingredients

**What:** Global copy pass replacing ingredient language with outcome language. Reframe from "what's in the box" to "what changes for you."

**Why:** Belsky's humanity test: products succeed on unsaid motivations, not feature specs. "Knowledge atoms (JSON)" is an ingredient. "Every insight extracted, indexed, and connected so your AI can reason with it" is an outcome.

**Implementation:**

**A) Hero subtitle rewrite**

Current: "Knowledge graphs of the world's best thinkers. 8 AI skills per brain. Install in seconds."

New: "The world's best thinkers, loaded into your AI. Ask any question. Get cited, framework-backed answers. Not hallucinations."

**B) "How It Works" section rewrite**

Current steps focus on mechanism. New steps focus on transformation:

1. **"Explore a mind"** — Browse how Paul Graham thinks about startups. See every insight, every connection, every contradiction. No paywall. No signup.
2. **"Load it into your AI"** — One command. 30 seconds. Your AI now has 182 structured insights with typed connections — not training data hallucinations.
3. **"Think better, immediately"** — `/advise --paul-graham "Is my startup idea good?"` Ask any question through the lens of a genius. 8 skills. Every brain.

**C) Skill descriptions rewrite**

Current: generic one-liners that don't reference brains.
New: outcome-oriented, multi-brain:

| Skill | Current | New |
|---|---|---|
| /advise | Strategic counsel on your decisions | "What would Graham/Belsky/Attia actually say about your decision?" |
| /debate | Stress-test your thinking | "Steel-man both sides using a thinker's real frameworks, not generic pros and cons" |
| /surprise | Surface an unexpected insight | "A random brilliant insight you've never seen. Daily dose of genius." |
| /connect | Find unexpected bridges to your work | "Your problem + their framework = connections you'd never make alone" |
| /predict | Follow the implications forward | "Where does this thinking lead? Extrapolate the thinker's logic into the future." |

**D) FAQ reframe**

Keep the same objections but lead with enthusiasm, not defense:

Current: "How is this better than just asking ChatGPT what Belsky would say?"
New: "What's the difference between this and asking ChatGPT about Paul Graham?"
Answer leads with the demo, not the argument: "Try it. Ask ChatGPT 'What would Paul Graham say about my startup?' Then load the PG brain and run `/advise --paul-graham`. The difference is night and day: cited sources, specific frameworks, confidence scores, and connections to related insights. It's the difference between someone who skimmed Wikipedia and someone who has the entire corpus indexed and cross-referenced."

**Acceptance criteria:**
- [ ] Zero instances of "Knowledge atoms (JSON)" or "Pre-computed embeddings (1536-dim)" in user-facing copy
- [ ] Every feature bullet maps to a user outcome
- [ ] `--brain-name` flag appears in at least 5 places across the site
- [ ] FAQ answers lead with demonstrations, not arguments
- [ ] Hero subtitle references outcomes, not mechanisms

**Files to modify:**
- `app/page.tsx` — hero, how it works, skills, stats
- `app/pricing/page.tsx` — tier features, FAQ
- `app/brains/[slug]/page.tsx` — skills section
- `app/brains/page.tsx` — header copy
- `lib/brains.ts` — TIERS features array, SKILLS descriptions

---

## New Data Structures

### `lib/brains.ts` additions

```typescript
// Add to Brain interface
export interface Brain {
  // ... existing fields
  featuredQuotes: string[];        // 3-5 best original_quotes for the rotating hero
  claimCount?: number;             // fetched from Supabase at render time
}

// Add skill examples per brain
export interface SkillExample {
  skill: string;                   // "advise", "debate", etc.
  brainSlug: string;
  prompt: string;                  // e.g. "Should I raise my Series A?"
  response: string;                // 2-3 sentence example output
  sources: string[];               // atom titles cited
}

export const SKILL_EXAMPLES: SkillExample[] = [
  {
    skill: "advise",
    brainSlug: "paul-graham",
    prompt: "Should I raise my Series A or stay bootstrapped?",
    response: "Graham's central insight is that the best startups delay raising as long as possible. In 'Default Alive or Default Dead?' he argues the real question isn't whether to raise — it's whether your growth rate means you'll survive without it. If you're default alive, raising is optional leverage. If you're default dead, raising is a lifeline that masks the real problem.",
    sources: ["Default Alive or Default Dead?", "Do Things That Don't Scale", "Startup = Growth"],
  },
  {
    skill: "advise",
    brainSlug: "scott-belsky",
    prompt: "Should I raise my Series A or stay bootstrapped?",
    response: "Belsky would push you toward staying small. His core thesis is 'revenue per employee' as the new status metric — he believes resourcefulness outperforms resources, and AI-native tools let small teams scale ambition without proportionate headcount. The future is STBB: Small Team, Big Business.",
    sources: ["Scaling Without Growing", "Premium of Originality", "Exponential Code"],
  },
  {
    skill: "surprise",
    brainSlug: "paul-graham",
    prompt: "",
    response: "\"The most dangerous thing about being in a hole is not that you're in a hole, but that you stop noticing you're in it.\" Graham argues that most founders don't fail because they run out of ideas — they fail because they gradually accept mediocrity without realizing it. The antidote: talk to users so often that reality can't be ignored.",
    sources: ["How Not to Die"],
  },
  {
    skill: "debate",
    brainSlug: "scott-belsky",
    prompt: "AI will make designers obsolete",
    response: "Belsky would demolish this. His entire worldview hinges on 'taste is the ultimate human moat.' AI commoditizes execution — that makes human taste MORE valuable, not less. 'When anything becomes ubiquitous, demand shifts to scarcity, craft, and meaning.' Designers who have taste will thrive. Designers who only had technical skill were already in trouble.",
    sources: ["Taste as Moat", "Craft Survives Abundance", "The Prompt Era is Ending"],
  },
  {
    skill: "predict",
    brainSlug: "paul-graham",
    prompt: "Where does Graham's 'do things that don't scale' thinking lead in the AI era?",
    response: "Following Graham's logic forward: if AI makes scaling trivially cheap, then 'doing things that don't scale' becomes even MORE important — because the unscalable things (deep user empathy, founder taste, manual curation) are the only remaining differentiators. The implication: the best AI-era startups will be radically high-touch at the core, with AI handling everything around the edges.",
    sources: ["Do Things That Don't Scale", "Startup = Growth"],
  },
];

// Update SKILLS descriptions to be outcome-oriented
export const SKILLS = [
  { name: "advise", title: "Advise", desc: "What would they actually say about your decision? Deep, actionable, cited.", icon: "🧭", workflow: "Decision" },
  { name: "teach", title: "Teach", desc: "Learn any concept through their lens and frameworks", icon: "📖", workflow: "Learning" },
  { name: "debate", title: "Debate", desc: "Steel-man both sides using real frameworks, not generic pros and cons", icon: "⚔️", workflow: "Decision" },
  { name: "connect", title: "Connect", desc: "Your problem + their framework = connections you'd never make alone", icon: "🔗", workflow: "Creative" },
  { name: "evolve", title: "Evolve", desc: "How did their thinking change? Track intellectual evolution over time", icon: "📈", workflow: "Learning" },
  { name: "surprise", title: "Surprise", desc: "A random brilliant insight you've never seen. Daily dose of genius.", icon: "✨", workflow: "Creative" },
  { name: "coach", title: "Coach", desc: "Socratic questions that sharpen your thinking — the thinker as mentor", icon: "🎯", workflow: "Decision" },
  { name: "predict", title: "Predict", desc: "Follow the implications forward — where does this thinking lead?", icon: "🔮", workflow: "Research" },
];

// Update TIERS with outcome-framed features
export const TIERS = [
  {
    name: "Standard",
    price: 29,
    period: "per brain",
    features: [
      "8 thinking skills — advise, debate, surprise, and 5 more",
      "Every insight extracted, indexed, and connected",
      "One file turns your AI into a domain expert",
      "Visual brain explorer — browse the full knowledge graph",
      "See how they actually think — first principles, patterns, blind spots",
      "Deep-dive any topic across all clusters",
    ],
    cta: "Get this brain",
    highlighted: true,
  },
  // ... Pro and API similarly rewritten
];
```

---

## New Components

| Component | Type | Purpose |
|---|---|---|
| `HeroExplorer.tsx` | Client | Interactive atom sampler for landing page hero |
| `SkillShowcase.tsx` | Client | Tabbed skill cards with brain toggle and `--brain` flag |
| `DualBrainDemo.tsx` | Client | Tabbed demo section showing same question across brains |
| `BrainSelector.tsx` | Client | Compact horizontal brain picker for pricing page |
| `RotatingQuote.tsx` | Client | Random `original_quote` from brain's top atoms |

---

## Implementation Order

### Sprint 1: Copy + Structure (can ship independently)
1. **Change 7** — Copy overhaul (outcomes over ingredients). Touch every page but no new components.
2. **Change 4** — Two-brain landing page. Update stats, founding supporters, add PG to demo section.
3. **Change 5** — Brain detail page reorder (explorer above fold).

### Sprint 2: Interactive Components
4. **Change 2** — Multi-brain skill showcase with `--brain-name` flag throughout.
5. **Change 3** — Brain-first pricing page with brain selector.

### Sprint 3: Delight + Social
6. **Change 1** — Hero explorer (interactive atom sampler).
7. **Change 6** — Social proof (claim counts from Supabase).

---

## Verification Checklist

- [ ] Visitor sees real brain content within first 10 seconds (hero explorer or demo)
- [ ] `--brain-name` flag syntax appears in at least 8 places across the site
- [ ] Skills page/section explicitly says "works with every brain"
- [ ] Pricing page has brain selector; tiers reference selected brain by name
- [ ] PG and Belsky get equal billing on landing page
- [ ] Zero instances of "Knowledge atoms (JSON)" in user-facing copy
- [ ] Brain detail page shows explorer within one scroll
- [ ] At least 2 skills show togglable examples across 2+ brains
- [ ] Claim counts visible on brain cards (or mocked if Supabase query not ready)
- [ ] Mobile responsive on all new components
- [ ] Cross-brain messaging: `/debate --paul-graham --scott-belsky` shown at least once
- [ ] `/advise --paul-graham` and `/advise --scott-belsky` appear as distinct, comparable examples

---

## What This Unlocks

When this ships, the site communicates three things that it currently doesn't:

1. **Skills are universal.** `/advise` is a thinking mode, not a Belsky feature. Load any brain, use any skill. The `--brain` flag makes this viscerally obvious.

2. **Brains are the product.** Pricing, CTAs, and social proof all anchor to specific brains. You're not buying "a subscription" — you're adding Paul Graham's thinking to your AI.

3. **The product is worth experiencing.** The explorer, the surprise atoms, the live demos — these create joyspan. The visitor's first reaction should be "holy shit, this is cool" not "I see, so it's a knowledge graph product."

Per Belsky: *"Products that fail the first mile never get a chance to prove their deeper value."* This overhaul IS the first mile.
