# BrainsForSale — Improvement Backlog

Captured from expert critique panel (April 4, 2026): Calacanis, Bartlett, Hassid, Amodei, Belsky, MrBeast.

---

## In Active Plan (see plan file)

- [x] Voice recovery: add original_quote + implication fields, re-extract top 80 atoms
- [x] Context window optimization: cluster-level files + manifest + targeted loading
- [x] Connection enrichment: 161 → 800+ connections, hunt contradictions
- [x] Thin topic graceful degradation in all skills
- [x] Skill template compression (1,317 → ~500 lines)
- [x] Confidence simplification (numeric → high/medium/low tiers)

---

## Product & Packaging (Not Yet Started)

- [ ] **Launch with /advise + /surprise only** (MrBeast) — Ship 2 skills first, phase in rest. Reduce cognitive load. "No one is going to install 10 skills."
- [ ] **Free sample brain** — Build Einstein or another public domain figure as a fully free brain. Eliminates purchase friction. Demonstrates the skill pack without risk.
- [ ] **Working `npx skills add` command** — Currently specced but not built. Requires publishing to the skills registry. This IS the distribution channel.
- [ ] **Naming review** — "brainsforsale" sounds like a zombie movie (MrBeast). Test alternatives. "Load a genius into your AI" is the only good copy.
- [ ] **Minimum atom threshold** — What's the minimum for a brain to feel "worth $29"? Hypothesis: 75-100 atoms with connections + working skills. Validate with beta users.

## Retention & Engagement

- [ ] **Daily /surprise email or Slack** (MrBeast) — The retention loop. `/surprise` sends a daily atom via email or Slack webhook. Turns one-time purchase into daily habit. Build before storefront.
- [ ] **Social proof in product** (MrBeast) — Show real-time usage: "This brain loaded in 847 AI sessions this week. Most-asked: Should I raise a Series A?" In the skill output, not on a separate page.
- [ ] **Brain Score as re-engagement** — "Belsky brain just hit 50%!" notifications. Progress bars are addictive. Ship with v1.
- [ ] **Founding Supporters program** — First 100 buyers per brain get names embedded, free updates forever, vote on next brain. Creates urgency + evangelists.

## Voice & Quality (Beyond Phase 1)

- [ ] **Full corpus ingestion** — Only 11 of ~77 Implications editions ingested (~14%). Belsky has 12 years of content. The brain should cover at least 50% of editions.
- [ ] **Story preservation** — Atoms stripped stories/examples. Belsky's persuasion comes from narrative, not just thesis statements. Consider a `story` or `example` field on atoms.
- [ ] **Curation layer** — If/when Belsky claims his brain, he should be able to curate: "these 50 atoms are my best work." Editorial control, not just fact-check. (Belsky feedback)
- [ ] **Contradiction mining** — Belsky contradicts himself constantly — that's the point. Tensions are the most interesting content. Target: every brain should have at minimum 15% "contradicts" connections.

## Architecture & Distribution

- [ ] **SQLite brain format** — Portable SQLite with sqlite-vec for embeddings, connections, people. Solves "flat files can't carry a graph." (v2 roadmap item)
- [ ] **Hosted semantic search API** — Brain stays in Supabase. Skills call edge function for vector search + graph traversal. Real-time updates + usage tracking built in.
- [ ] **Hybrid delivery** — Flat files for offline context + API key for semantic search online. Best of both.
- [ ] **Cowork plugin packaging** — Should brain packs also be `.claude-plugin` format for the Anthropic plugin marketplace?

## Cross-Brain Features

- [ ] **Cross-connection surfacing in skills** (Calacanis — "the REAL product") — `/advise`, `/connect`, `/surprise` should pull from both the brain AND user's personal atoms. "Belsky thinks X, and you wrote something similar 3 weeks ago." 17 Rob-Belsky cross-connections already exist.
- [ ] **Personal atom ingestion** — Let buyers add their own atoms (notes, Slack, docs) into a personal graph. Cross-connections auto-generate via embedding similarity.
- [ ] **Brain Fights content series** — Debate format: Brain A vs Brain B on a topic. Tag both people. 20 brains x 25 clusters = hundreds of debates. Content engine that sells two brains per post.

## Go-to-Market

- [ ] **Get 5 beta users this week** — Zero users, zero feedback. Critical. (Calacanis: "Show me someone who isn't you using /advise and getting value.")
- [ ] **Jason Calacanis outreach** — First claimer. 100% rev share offer. Buy a case study and megaphone, not a customer.
- [ ] **Build storefront** — Static site on Vercel + Stripe checkout. Not built yet.
- [ ] **"This Week in Brains" newsletter** — Auto-generated weekly from atoms. Zero marginal cost content flywheel.
- [ ] **Context window future-proofing** (Amodei) — In 12-18 months, 2M+ token windows are standard. "Why wouldn't I just paste the full newsletter archive?" Answer: connections, evolution tracking, cross-brain, and skills. Make sure THAT is the value prop, not "pre-chunked knowledge."

## Ethics & Legal

- [ ] **Ethics of building without consent** (Amodei) — "Fair use" is legal, not ethical. Consider asking first, not building-then-inviting. The power dynamic matters.
- [ ] **Book content handling** — Copyright is clearer for direct quotes vs. extracted ideas. Establish guidelines before building book-sourced brains.
- [ ] **International brains** — Is there demand for non-English thinkers? (Yuval Noah Harari, etc.)

---

*Last updated: 2026-04-04*
