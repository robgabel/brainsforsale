# Brainsfor.com — 0-Person Business Plan

*Written in the style of Greg Isenberg. April 4, 2026.*

---

## The Insight

Here's something nobody's talking about: we're entering the age of **portable intelligence**.

Every AI-native builder I know does the same thing. They spend hours curating system prompts, stuffing context windows, building custom GPTs. They're manually assembling the "brain" of an expert every time they start a new project. It's like hand-coding HTML in 1998.

What if you could just... buy the brain?

Not a chatbot. Not a character you roleplay with. A **structured knowledge pack** — atomic ideas, beliefs, mental models, frameworks, and connections — that you drop into Claude, ChatGPT, Cursor, or your own RAG pipeline. The expert's entire public intellectual output, decomposed into a semantic graph you can query, remix, and build on top of.

### The Hero (Gary Vee × Jason Calacanis)

**Line 1 (emotional hook):** "Load a genius into your AI."

**Line 2 (clarity + payoff):** "Knowledge graphs of the world's best thinkers, packaged as 8 AI skills you actually use. Think better in seconds."

**Line 3 (the how — one command):**
```
npx skills add brainsfor/belsky
```

**Line 4 (the live demo — Jason's "show, don't tell"):**
```
> /advise "Should I raise my Series A or stay bootstrapped?"

🧠 Belsky Brain (3 relevant atoms, confidence: 0.95)

Belsky would push you toward staying small. His core thesis is
"revenue per employee" as the new status metric — he believes
resourcefulness outperforms resources, and AI-native tools let
small teams scale ambition without proportionate headcount growth.

His "scaling without growing" framework argues that every function
of an organization will be refactored to allow small teams to
scale reach. Raising a Series A to hire people may be solving
yesterday's problem.

The counterpoint from his own thinking: moats of graphs, security,
coordination, and shared memory matter — and those sometimes
require investment to build fast.

Sources: "Scaling Without Growing" (Implications), "Premium of
Originality" (Implications), "Exponential Code" (Implications)

💡 Try /debate to stress-test this advice, or /coach to explore
what questions Belsky would ask about your specific business.
```

**That demo IS the landing page.** Everything else is supporting evidence.

---

## Why This Works (The Inversion)

Everyone else in this space is building **walled gardens**. Delphi raised $16M to let you *chat* with an AI clone of Steve Jobs. Character.AI has 20M users talking to fictional characters. Meta wants every Instagram creator to have an AI chatbot.

They're all building **destinations**. You visit their platform, you interact inside their walls.

We're building **infrastructure**. A brain pack is a portable artifact. You own it. You load it wherever you want. You combine Einstein's physics intuition with Peter Attia's longevity frameworks and Scott Belsky's product taste. You build mashups. You integrate it into your own tools.

**Delphi monetizes access. We monetize ownership.**

That's the inversion. And it's a better product for builders — which is the only audience that matters right now, because builders will tell other builders, and builders will build things on top of your brains.

---

## The Product

### What the customer gets

A **Brain Pack** is a downloadable bundle containing:

1. **Knowledge atoms** — Atomic ideas extracted from all public content (blog posts, newsletters, podcasts, books, interviews, tweets). Each atom is a discrete belief, framework, insight, or principle. Tagged by topic, dated, with source links.

2. **Mental model map** — How the person's ideas connect. What supports what, what contradicts what, what evolved over time. A semantic graph, not a flat list.

3. **Visual brain dashboard** — A single interactive HTML file that visualizes the entire knowledge graph. Nodes for topics, edges for connections, hover to see the atom text. This IS the unboxing moment. It's what people screenshot and share. (Built with D3.js or similar, ships in the pack, opens in any browser.)

4. **BRAIN-INSTRUCTIONS.md — The 5-mode thinking tool.** This is the file that turns a data dump into a mentor. A ready-to-use LLM instruction file the buyer drops into Claude Projects, ChatGPT custom instructions, or Cursor rules. Includes five operational modes:
   - **Advisor Mode:** "I'm facing [decision]. What would this thinker recommend?" → Pulls relevant atoms, synthesizes a position, cites sources.
   - **Teacher Mode:** "Explain [concept] using this brain's frameworks." → Builds an explanation from the person's own language and mental models.
   - **Debate Mode:** "Argue against [my position] from this thinker's perspective." → Stress-tests your thinking using their worldview.
   - **Connector Mode:** "What does this brain say that relates to [topic I'm working on]?" → Semantic search across atoms for unexpected connections.
   - **Evolution Mode:** "How has this thinker's view on [topic] changed over time?" → Time-series analysis of atoms by source date.

5. **Topic lenses** — Pre-built slices of the brain by topic cluster. "Belsky on Product Design" (46 atoms + connections), "Belsky on AI Agents" (23 atoms), etc. These serve as free samples AND as focused tools for specific decisions.

6. **Embeddings** (premium) — Pre-computed 1536-dim vectors for semantic search. For builders who want to wire a brain into their own RAG pipeline or app.

7. **Brain Score** — Completeness metric. Belsky has 284 atoms from all 77 Implications editions (100% newsletter coverage). Every brain shows a completeness bar. Transparency builds trust. Updates become re-engagement events. Voice enrichment (original_quote + implication) at 7% — next quality milestone.

### Brain mashups (multi-brain buyers)

When a buyer owns 2+ brains, the instruction file supports loading multiple brains simultaneously for cross-perspectives: "What would Belsky and Thiel disagree about regarding this strategy?" Atoms have topic tags — mashups write themselves. This is how you sell brain #2 and #3 to the same customer.

### 🧠 Brain Skills Pack — The Impeccable Model Applied to Thinking

*Inspired by [impeccable.style](https://impeccable.style) — Paul Bakaus built 20 design skills that chain together. We build 8 thinking skills that chain together. The skills ARE the product. The atoms are just the fuel.*

Every brain ships with a **skill pack** — a set of installable Claude/Cursor/ChatGPT skills that give the buyer an interactive interface to the knowledge graph. Not just "here's a file" but "here are 8 commands that make this brain useful."

Install: `npx skills add brainsfor/belsky` (or download the skill pack manually)

#### The 8 Brain Skills

| # | Skill | Command | What It Does |
|---|-------|---------|-------------|
| 1 | **Advise** | `/advise` | "I'm facing [decision]." → Pulls relevant atoms, synthesizes this thinker's perspective, cites sources, flags confidence level. Includes deep-dive depth and actionable frameworks. The core use case. |
| 2 | **Teach** | `/teach` | "Explain [concept] using this brain." → Builds explanation using the person's own language, frameworks, and mental models. Like having them tutor you. |
| 3 | **Debate** | `/debate` | "Argue against [my position]." → Stress-tests your thinking from this thinker's worldview. Uses their actual beliefs, not generic counterarguments. Supports head-to-head brain comparisons. |
| 4 | **Connect** | `/connect` | "What does this brain say about [my topic]?" → Semantic search across atoms for unexpected connections to whatever you're working on. Supports cross-brain synthesis when 2+ brains are loaded. |
| 5 | **Evolve** | `/evolve` | "How has this thinker's view on [topic] changed?" → Time-series analysis of atoms by source date. Shows intellectual evolution, not just latest take. |
| 6 | **Surprise** | `/surprise` | "Show me something unexpected." → Random serendipity. Surfaces a high-confidence atom you probably haven't seen. Great for daily inspiration or breaking out of tunnel vision. |
| 7 | **Coach** | `/coach` | "Help me think through [problem]." → Socratic questioning from the thinker's perspective. Asks the questions they would ask to sharpen your thinking, rather than giving you answers directly. |
| 8 | **Predict** | `/predict` | "Where does this thinking lead?" → Extrapolates the thinker's logic forward. Builds implication chains from their frameworks to show likely consequences and second-order effects. |

**Meta skill:**
| | **Brain Setup** | `/brain-setup` | One-time setup. Detects your AI tool (Claude, Cursor, ChatGPT), loads the brain context, configures the 8 skills, and verifies everything works. Like Impeccable's `/teach-impeccable`. |

#### Skill chaining (the Impeccable pattern)

Skills aren't isolated — they chain into workflows:

- **Decision workflow:** `/advise` → `/debate` (stress-test) → `/coach` (sharpen your thinking) → decide
- **Learning workflow:** `/teach` → `/advise` (go deeper) → `/evolve` (see how thinking changed)
- **Creative workflow:** `/surprise` (inspiration) → `/connect` (link to your work) → `/predict` (follow implications)
- **Research workflow:** `/advise` (deep topic lens) → `/connect` (cross-brain synthesis) → `/debate` (find disagreements)
- **Daily ritual:** `/surprise` each morning → 1 unexpected atom to start the day

#### Why skills > static files

A markdown file is a reference. A skill pack is a **workflow tool**. The difference:

| Static file | Skill pack |
|-------------|-----------|
| Read and search manually | Interactive commands |
| One-time use, then forgotten | Daily utility — `/surprise` alone creates a habit |
| Hard to combine with other brains | `/connect` and `/debate` support cross-brain |
| No guidance on how to use | `/brain-setup` onboards you |
| Same experience for everyone | Skills adapt to YOUR context |

**The skill pack is what makes the brain worth $29.** Without it, you're selling a JSON file. With it, you're selling a thinking partner.

#### Technical implementation

Each skill is a `SKILL.md` file (Claude/Cowork format) — no code, just structured instructions that Claude reads and follows. Total skill pack is ~15 files:

```
brainsfor-belsky/
  SKILL.md              ← brain-setup (meta skill, loads everything)
  brain-context.md      ← the full knowledge atom context file
  brain-atoms.json      ← structured atom data (topics, dates, sources, connections)
  brain-visual.html     ← interactive D3.js knowledge graph visualization
  skills/
    advise.md           ← /advise skill
    teach.md            ← /teach skill
    debate.md           ← /debate skill
    connect.md          ← /connect skill
    evolve.md           ← /evolve skill
    surprise.md         ← /surprise skill
    coach.md            ← /coach skill
    predict.md          ← /predict skill
  embeddings/           ← (Pro tier only)
    atoms-1536.json     ← pre-computed vectors
```

Total download: ~2-5MB per brain. Installs in seconds. Works with Claude Code, Cursor, Cowork, Gemini CLI, Codex CLI — same multi-provider pattern as Impeccable.

#### The distribution unlock

**Skills are installable via `npx skills add`.** This means:
- Brain packs show up in the same ecosystem as Impeccable and other skill packs
- Developers discover them through the skills registry
- The install command IS the distribution channel
- Every skill pack installed is a potential word-of-mouth referral

This is the Greg Isenberg play: **don't build a marketplace — plug into an existing distribution channel.** The `npx skills` ecosystem is nascent. Being the first "knowledge" skill pack (vs. Impeccable's "design" skill pack) establishes a new category.

### Formats (updated with skills)

| Tier | What You Get | Price |
|------|-------------|-------|
| **Standard** | Full skill pack (8 skills) + knowledge atoms (JSON) + brain context (MD) + visual dashboard (HTML) + mental model map | $29/brain |
| **Pro** | Everything in Standard + embeddings + API access + auto-updates when new content is ingested | $79/brain |
| **API** | Programmatic access to any brain. For companies building products. | $199/mo (all brains) |

### Why these prices

$29 is an impulse buy for a founder who's about to spend 4 hours trying to manually summarize Scott Belsky's newsletter. That's the value prop: **your time is worth more than $29**.

$79 gets you the embeddings, which saves a developer 2-3 days of pipeline work. Easy ROI math.

$199/mo API is for the lazy-but-smart company that wants to offer "Ask [Expert]" features without building the ingestion pipeline. They exist. There are thousands of them.

---

## The Brains (Current Inventory — April 2026)

### Live — 7 brains built, packaged, and in Supabase

| Brain | Atoms | Connections | Content Sources | Why Buyers Want This |
|-------|-------|-------------|-----------------|---------------------|
| **Scott Belsky** | 284 | 430 | All 77 Implications newsletter editions, books, talks | Product intuition, creative leadership, Adobe/VC lens |
| **Hank Green** | 222 | 366 | 600+ SciShow episodes, 18yr Vlogbrothers, Crash Course, Dear Hank & John, TikTok (7M+), TED talks, 2 novels | Science communication, creator business, internet culture |
| **Paul Graham** | 213 | 409 | 220+ paulgraham.com essays | Startup wisdom, essay-form thinking, YC founder lens |
| **Sun Tzu** | 207 | 377 | 13 chapters of The Art of War + centuries of attributed commentary | Strategy, competition, decision-making under uncertainty |
| **John Green** | 205 | 385 | Anthropocene Reviewed (podcast + book), Everything is Tuberculosis, Vlogbrothers, TED talks | Humanist perspective, storytelling, reviewing the world |
| **Steve Jobs** | 170 | 792 | Speeches, interviews, keynotes & public appearances (1976–2011) | Product taste, reality distortion field, design philosophy |
| **Peter Attia** | 73 | 40 | The Drive podcast, Outlive book reviews | Longevity science, health optimization frameworks |
| **TOTAL** | **1,374** | **2,799** | | **+ 17 cross-brain connections** |

**Infrastructure stats:** 7 `brain_metadata` records in Supabase. Full export pipeline operational (`build-brain.py` → one command, 7 stages). All 7 brains have complete pack/ directories with brain-context.md, brain-atoms.json, explore.html, README.md, and 8 skill SKILL.md files. Design system (DESIGN.md) and brand guide (BRAND.md) documented and agent-readable. Landing page prototype exists (5/7 brains rendered — John Green and Hank Green not yet added). `install-brains.sh` handles local installation with symlinks. `audit-brains.py` validates structure + quality scoring.

### Next Wave — High-demand candidates

| Brain | Why Builders Want This | Content Sources |
|-------|----------------------|-----------------|
| **Scott Galloway (Prof G)** | Business strategy frameworks, T Algorithm, brand economics | No Mercy / No Malice newsletter, Prof G Pod, NYU lectures, 5+ books |
| **Marc Andreessen** | Tech investing thesis, "it's time to build" worldview | Blog archive, pmarca tweets, interviews, a16z content |
| **Peter Thiel** | Contrarian thinking, Zero to One frameworks | Books, lectures, Founders Fund letters, interviews |
| **Mr Beast** | Creator economy playbook, viral mechanics, business scaling | Interviews, podcast appearances, public business docs |
| **Jason Calacanis** | Angel investing, startup evaluation, founder networking | This Week in Startups (1500+ episodes), books, tweets. **Rob knows Jason. Offer 100% rev share — buy a case study and megaphone.** |
| **Brené Brown** | Leadership, vulnerability research, organizational culture | 6 books, TED talks, Dare to Lead podcast |
| **Malcolm Gladwell** | Pattern recognition, storytelling as analysis | 7 books, Revisionist History podcast, New Yorker archive |
| **Kara Swisher** | Tech industry BS detector, power dynamics | Pivot + On with Kara Swisher podcasts, Burn Book |
| **Einstein** | Timeless physics intuition + philosophy of science | Public domain books, letters, papers — **free sample brain candidate** |

### Professional Use Cases — "Know Them Before the Room"

Beyond the builder/founder audience, brain packs have high-value professional applications where **getting inside someone's head** is worth far more than $29:

**1. Customer & BD Intelligence — "Brain your whale"**
Sales teams and BD leads chasing a major account or partnership want to understand how the decision-maker thinks — their frameworks, pet peeves, public positions, what they've said about your space. A brain pack of a target customer or BD counterpart (built from their talks, interviews, LinkedIn posts, podcast appearances) lets you `/advise "How would [CEO] evaluate our proposal?"` or `/debate` your pitch from their perspective before the meeting. This is competitive intel packaged as a thinking tool. **Pricing implication:** Enterprise teams would pay $200-500/brain for custom builds of specific executives, not $29 for a catalog pick.

**2. Board Member Prep — "Know your board"**
Founders and executives prep for board meetings by reading old decks. What if instead you could `/advise "How would [board member] react to our pivot?"` for each director? A brain of each board member — built from their public writing, investment theses, conference talks, prior board letters — gives you a simulation layer for pre-meeting strategy. **Go-to-market:** Sell as a bundle ("Board Brain Pack — up to 7 members") to VC-backed startups. The founder's EA or Chief of Staff is the buyer. **Pricing implication:** $500-1,000/board as a custom engagement. Recurring — refresh quarterly as board members publish new content.

**3. Creator Intelligence — Fan brains & competitor brains**
Two flavors here. *Fan brain:* A creator superfan who wants a thinking partner modeled on their favorite creator — `/coach` from MrBeast's perspective on their next video, `/advise` from Lex Fridman on interview technique. This is the $29 impulse buy, and it's the most natural fit for the existing catalog model. *Competitor brain:* A creator or their team builds a brain of a rival creator to understand their content strategy, positioning, recurring themes, and blind spots. `/advise "What would [competitor] do with this trend?"` is strategic intelligence. **Pricing implication:** Fan brains are catalog ($29-79). Competitor brains are custom ($200+) and probably sold via DM, not storefront.

**What these three share:** The buyer isn't trying to "think better" in the abstract — they're preparing for a *specific interaction* with a specific person or entity. That's a higher-urgency, higher-WTP use case than intellectual curiosity. It also opens up a **custom brain building service** as a revenue line: "Send us a person, we build their brain in 48 hours." Could charge $500-2,000 per custom brain depending on depth.

### The "Request a Brain" pipeline

Users can request any public figure. We track requests. When a brain hits 50+ requests, we build it. This creates a demand signal that drives product roadmap AND validates which brains to prioritize for claiming outreach.

---

## Distribution (How We Get Customers)

This is the part most people skip. The product doesn't matter if nobody finds it.

### Channel 1: Twitter/X launch (Week 1)

Post the concept. "I cloned Scott Belsky's brain and I'm selling it for $29." This is inherently viral — it's provocative, it's novel, it's a screenshot-worthy concept. Tag the people whose brains you've cloned. Some will be annoyed (free PR). Some will be intrigued (future claiming partners).

**Expected outcome:** 500-2K visitors, 20-50 purchases, validates pricing.

### Channel 2: Hacker News / ProductHunt (Week 2)

"Show HN: I built a marketplace for downloadable AI knowledge packs of famous thinkers." This is catnip for the HN audience — technical, novel, slightly controversial. The embeddings/API angle gives it technical credibility.

**Expected outcome:** Front page potential. 5K-20K visitors. This is where the API customers come from.

### Channel 3: AI builder communities (Ongoing)

Reddit (r/ChatGPT, r/ClaudeAI, r/LocalLLaMA), Discord servers, AI Twitter. These people are already hand-building context packs. You're selling them a shortcut.

### Channel 4: LinkedIn (Rob's unfair advantage)

Rob has an established LinkedIn presence with a builder audience. "I built this thing over a weekend" posts perform well. The Belsky brain is a natural story — "I've been reading Scott Belsky's newsletter for a year. Then I fed every edition into a knowledge graph..."

### Channel 5: The brain subjects themselves

Every person whose brain you clone becomes a potential distribution partner. If Scott Belsky tweets "someone cloned my brain and it's... actually pretty good?" — that's worth more than any ad spend. This is why Tier 1 selection matters: pick people who would find this interesting, not threatening.

### Channel 6: Newsletter / content

"This Week in Brains" — weekly breakdown of one interesting insight from a brain in the catalog. Free content that drives paid purchases. Can be 100% AI-generated from the knowledge atoms you already have.

### Channel 7: "Brain Fights" — the debate content format (Gary Vee play)

Take one topic — say "will brands die?" — and pull one brain's atom against another brain's atom on the same topic. "BRAIN FIGHT: Belsky vs. Galloway on brands." Post it as a LinkedIn carousel, X thread, or short-form video. This is attention GOLD because: (a) people love debates, (b) it sells TWO brains in one post, (c) you tag both people, and (d) the argument about who's right IS the engagement. Every brain has 25 topic clusters. Every pair of brains creates dozens of potential fights. This is a content engine that scales with inventory.

### Channel 8: Atom-level micro-content (Gary Vee play)

Every brain has 100+ atoms. Each atom is a self-contained social post. One Belsky atom = one LinkedIn carousel slide, one X post, one short-form video clip with 10 seconds of commentary. With 7 brains today, that's already 1,374 micro-content pieces. At 20 brains × 200 atoms avg = 4,000+. You will never run out of content. And every piece sells the product with a CTA: "This is 1 of 284 atoms in the Belsky brain. Get the full brain for $29."

### Channel 9: Leaderboard as social proof

Public leaderboard on the landing page: most-purchased brains, most-queried topics, trending atoms this week. Creates FOMO ("the Attia brain sold 500 copies this month and you don't have it?"). Also feeds "This Week in Brains" with real data.

### Channel 10: First 100 buyers per brain (MrBeast play)

First 100 buyers of each brain get their name embedded in a "founding supporters" section of the brain pack. They get free updates forever. They get to vote on the next brain to build. They're not customers — they're members. This creates urgency ("only 37 founding spots left for the Galloway brain") and turns early buyers into evangelists.

---

## The 0-Person Operating Model

Here's why this is a Greg Isenberg-style business: **it runs itself.**

### What's automated

| Function | How It Runs | Human Input |
|----------|------------|-------------|
| **Brain building** | Cowork skill (`blog-ingest`) + custom pipeline. Firecrawl scrapes, Haiku extracts atoms, OpenAI embeds. | Select the person, kick off the pipeline |
| **Packaging** | Script converts Supabase knowledge graph → downloadable formats (MD, JSON, embeddings) | None after initial template |
| **Storefront** | Static site (Vercel) + Stripe for payments + Supabase for user/order management | None |
| **Delivery** | Automated email with download links post-purchase (Stripe webhook → edge function) | None |
| **API** | Supabase edge function serving knowledge atoms via REST. API key auth. | None |
| **Content marketing** | Scheduled task generates weekly "brain highlight" from existing atoms → posts to social | Review/approve (5 min/week) |
| **Brain requests** | Form on site → Supabase table → dashboard shows demand | Check weekly |
| **Customer support** | AI-generated FAQ + email autoresponder for common questions | Escalation only |

### What Rob does (< 2 hours/week once launched)

1. Review brain request queue, decide what to build next (15 min)
2. Kick off new brain ingestion pipelines (30 min)
3. Review and approve auto-generated social content (15 min)
4. Check revenue dashboard (5 min)
5. Respond to any claiming/partnership inquiries (as needed)

---

## Usage Tracking (The Anti-Vibe-Revenue Insurance Policy)

The biggest risk is novelty purchases — people buy a brain, never use it, never come back. We kill that risk by tracking usage from day one and using the data to improve the product.

### What we track

| Metric | How | Why It Matters |
|--------|-----|---------------|
| **Download count** per brain | Stripe webhook + Supabase | Basic demand signal — which brains sell |
| **Context file loads** | Unique download link with tracking param, or API key usage logs | Are buyers actually loading brains into their AI tools? |
| **API call volume** per brain | Supabase edge function logs | Which brains get queried most? What topics? |
| **Return purchases** | User buys 2nd brain within 30 days | Product-market fit signal — if nobody comes back, it's novelty |
| **Brain request volume** | Form submissions → Supabase table | Demand pipeline for new brains |
| **Time-to-first-use** | Gap between purchase and first API call or re-download | If it's >7 days, onboarding is broken |
| **Search queries within brains** | API query logs (what topics users search for) | Tells you what people actually want from each brain — informs packaging |

### Usage-driven product decisions

- **If downloads are high but API usage is low:** The context file format is the product, not the API. Double down on making the markdown pack amazing.
- **If one brain outsells others 5:1:** Clone that brain's format/depth for all others. The market is telling you what "good" looks like.
- **If return purchase rate is <10%:** The product is a novelty. Pivot to subscription (brain updates) or bundle pricing.
- **If API queries cluster around specific topics:** Build "topic packs" — not the whole brain, but "[Person] on [Topic]" for $9.

### Implementation

All tracking lives in Supabase. One table: `brain_events` with columns: `event_type`, `brain_id`, `user_id`, `metadata` (JSONB), `created_at`. Edge function logs every purchase, download, and API call. Weekly summary auto-generated. Takes 30 minutes to build on day one.

---

## "This Week in Brains" — The Content Flywheel

Free weekly newsletter / social series. Each edition spotlights one insight from one brain in the catalog. 100% auto-generated from existing knowledge atoms.

**Format:**
- **Subject line:** "This Week in Brains: What Scott Galloway thinks about [topic]"
- **Body:** 3-5 atoms on the topic, connected to current news or trends, with a CTA to buy the full brain
- **Distribution:** Email (free subscribers), LinkedIn post, X thread

**Why this works:**
- Zero marginal cost — the content already exists in the knowledge graph
- Every edition is a free sample that sells the full product
- Builds an email list of qualified buyers (people who want to think like experts)
- Creates a weekly touchpoint that keeps the brand alive between launches
- **The newsletter IS the SEO strategy** — "What does Peter Thiel think about AI regulation?" becomes a search-optimized post that drives organic traffic

**Automation:** Scheduled Cowork task. Pick a brain → pick a trending topic → pull relevant atoms → generate newsletter draft → Rob approves (2 min) → send.

---

## Revenue Model

### Phase 1 — Consumer + Professional (first 90 days)

**Conservative scenario:**

| Revenue Stream | Assumption | Revenue |
|---------------|-----------|---------|
| Standard brains ($29) | 200 purchases | $5,800 |
| Pro brains ($79) | 50 purchases | $3,950 |
| Custom brain builds ($500-2K) | 5 builds | $5,000 |
| API subscriptions ($199/mo) | 5 subscribers × 2 months | $1,990 |
| **Total** | | **$16,740** |

**Optimistic scenario (viral launch):**

| Revenue Stream | Assumption | Revenue |
|---------------|-----------|---------|
| Standard brains ($29) | 1,000 purchases | $29,000 |
| Pro brains ($79) | 200 purchases | $15,800 |
| Custom brain builds ($500-2K) | 20 builds | $20,000 |
| API subscriptions ($199/mo) | 20 subscribers × 2 months | $7,960 |
| **Total** | | **$72,760** |

### Phase 2-3 — Platform Licensing (year 1-2)

| Revenue Stream | Assumption | Annual Revenue |
|---------------|-----------|---------|
| Consumer direct (ongoing) | $5-10K/mo steady state | $60-120K |
| Custom brain builds | $5-15K/mo | $60-180K |
| Platform licensing (per brain) | 10 brains × 2 platforms × $25K avg | $500K |
| Platform catalog deal | 1 platform at $200K/yr | $200K |
| Enterprise API | 20 subscribers × $499/mo avg | $120K |
| **Annual potential** | | **$940K-1.12M** |

The consumer business funds operations. The platform licensing business is where this becomes a real company. The exclusive rights are the moat — without them, any platform can build their own brains. With them, BrainsFor is the only authorized source.

### Costs (monthly)

| Cost | Amount |
|------|--------|
| Supabase (Pro) | $25 |
| Vercel (Hobby → Pro) | $0-20 |
| Firecrawl (scraping) | $19 |
| OpenAI embeddings | ~$5-10 |
| Claude API (atom extraction) | ~$10-20 |
| Stripe fees (2.9% + $0.30) | Variable |
| Domain (brainsfor.dev) | ~$12/yr |
| **Total fixed** | **~$75-95/mo** |

**Margin: 95%+.** This is a digital goods business with near-zero COGS once the brain is built.

---

## The v2+ Revenue Unlock: Brain Licensing to AI Platforms

### The idea

BrainsFor doesn't just sell brain packs to end users. It **acquires exclusive packaging and distribution rights** from thinkers, then **licenses those structured brains to AI platforms** — OpenAI, Anthropic, Google DeepMind, Apple, and anyone else building AI assistants.

### Why AI platforms want this

Every major AI lab is trying to differentiate their assistant with better domain expertise. OpenAI has "GPTs," Anthropic has Projects, Google has Gems. But they're all dependent on users building the context themselves. A pre-built, verified, structured knowledge graph of Peter Attia's longevity science or Paul Graham's startup wisdom — with the thinker's endorsement and ongoing curation — is exactly the premium content these platforms want to offer.

**The pitch:** "We have exclusive rights to package Scott Belsky's thinking as a structured AI brain. Your users can load it natively in ChatGPT / Claude / Gemini. We license it to you for $X/month per brain, or $Y for a catalog deal."

### How the rights work

1. **BrainsFor signs exclusive "brain packaging" agreements** with thinkers. The thinker grants BrainsFor the right to structure, package, and distribute their public intellectual output as AI-ready knowledge graphs.
2. **The thinker gets:** Revenue share (50% from direct sales, negotiable % from platform licensing), editorial control (approve atoms, flag misrepresentations), verified badge, and their brain promoted across all channels.
3. **BrainsFor gets:** Exclusive right to package and sublicense that brain to AI platforms. No other company can sell a "Paul Graham brain pack" to OpenAI.
4. **AI platforms get:** Licensed, structured, verified brains they can offer natively — with ongoing updates as the thinker publishes new content.

### Revenue model

| Channel | Pricing | Notes |
|---------|---------|-------|
| **Direct to consumer** | $29-79/brain | Current model — skills + atoms |
| **Custom brain builds** | $500-2,000/brain | Professional use cases (see above) |
| **Platform licensing (per brain)** | $5K-50K/yr per brain per platform | Depends on brain demand + exclusivity |
| **Platform catalog deal** | $100K-500K/yr | Full catalog access for a platform |
| **Enterprise API** | $199-999/mo | Companies building products on brains |

### Why this could be massive

If BrainsFor locks up exclusive packaging rights to 50 notable thinkers, and 3-4 AI platforms each want access — that's a licensing business worth millions/year with near-zero marginal cost. The brain packs are already built. The pipeline already runs. The only new work is the legal agreements and platform integration.

**The killer insight:** The thinkers are the supply. The AI platforms are the demand. BrainsFor is the exclusive middleman with the packaging technology and the relationships. This is the music licensing model applied to structured knowledge — ASCAP for brains.

### Sequence

1. **v1 (now):** Sell direct to consumers. Build the catalog. Prove demand.
2. **v2 (claim your brain):** Sign thinkers to exclusive packaging agreements. Revenue share aligns incentives.
3. **v3 (platform licensing):** License the catalog to AI platforms. This is where the real money is.

The consumer product is the proof-of-demand that makes the platform licensing pitch credible. "50,000 people bought brain packs last year — your users want this natively in your product."

---

## The v2 Moat: "Claim Your Brain"

This is the move that turns a product into a platform.

### How it works

1. You build a brain from public content. You sell it.
2. The subject notices (because you tagged them, or customers tell them, or it goes viral).
3. You email them: "Hey — people are buying your brain. We built it from your public content. Want to claim it?"
4. **Claiming means:**
   - They verify and improve the knowledge graph (correct misinterpretations, add private insights, prioritize their best ideas)
   - They set their own price (floor: $29, no ceiling)
   - They keep 50% of all revenue from their brain
   - They get a "Verified Brain" badge on the site
   - They can promote it to their own audience (distribution flywheel)

### Why this is defensible

Once a thinker has claimed and curated their brain on your platform, they have:
- Revenue flowing in (switching cost)
- A curated knowledge product they spent time on (sunk cost)
- A verified brand asset they can link to from their own site (identity cost)

**The claiming mechanic turns every brain subject into a distribution partner with aligned incentives.** This is the community moat Greg Isenberg talks about — except instead of a Discord server, it's a marketplace where the "community members" are the product.

### Claiming rollout plan

1. **Soft launch:** Launch with 7 brains already built (all from public content, fair use for transformative analysis)
2. **Signal demand:** Show the brain subject that people are paying for their knowledge
3. **Outreach:** "People are buying your brain for $29. Want to claim it, improve it, and keep 50%?"
4. **First claimer = case study:** Get one notable person to claim. Use that as social proof for the next 10.

**Target first claimers:** Scott Belsky (Rob has a relationship via the knowledge graph work), Jason Calacanis (loves this kind of thing), Angela Duckworth (academic who'd appreciate structured knowledge).

---

## `npx skills add` — The Distribution Architecture

### How it works today (Impeccable's model)

Paul Bakaus built `npx skills` as a universal installer for AI skill packs. One command, works across every AI harness:

```bash
npx skills add pbakaus/impeccable
```

This auto-detects whether you're running Claude Code, Cursor, Gemini CLI, Codex CLI, VS Code Copilot, or others — and drops the skill files in the right directory for each tool:

| Tool | Skill directory |
|------|----------------|
| Claude Code | `.claude/skills/` |
| Cursor | `.cursor/skills/` |
| Gemini CLI | `.gemini/skills/` |
| Codex CLI | `.codex/skills/` |
| VS Code Copilot / Antigravity | `.agents/skills/` |
| Cowork | `~/.claude/skills/` (global mount) |

### How Brainsfor plugs in

We publish each brain as a skill pack to the same registry:

```bash
# Install a single brain
npx skills add brainsfor/belsky
npx skills add brainsfor/galloway
npx skills add brainsfor/attia

# Update all installed brains
npx skills update

# Check what's new
npx skills check
```

After install, the user's AI tool instantly has access to all 10 brain skills. In Claude Code, they type `/advise` and it just works. In Cursor, the skills auto-apply when the agent detects a relevant context. In Cowork, the skills show up in the available skills list.

### The free vs. paid gate

The `npx skills add` command installs the **skill files** (the 10 `.md` instruction files). These are free — they're the interface.

The **brain data** (atoms, connections, embeddings) is what costs money. On first run of any skill, `/brain-setup` checks for a valid license key:

```
> /advise "Should I raise a Series A?"

🧠 Brain Setup: No Belsky brain data found.
   → Purchase at brainsfor.dev/belsky ($29)
   → Enter license key: ________
```

Once the key is entered, the brain data downloads from our API and caches locally. All subsequent skill calls work offline.

**Why this matters:** The skills themselves are viral — anyone can install them, see the commands, understand what they do. The paywall is on the data, not the interface. This is the freemium model applied to knowledge: free to try, pay to think.

### Package structure on the registry

```
brainsfor/belsky/
  package.json            ← npm-compatible metadata (name, version, description)
  SKILL.md                ← /brain-setup (meta skill, onboarding + license check)
  brain-visual.html       ← interactive knowledge graph dashboard (always free)
  skills/
    advise.md             ← /advise
    teach.md              ← /teach
    debate.md             ← /debate
    connect.md            ← /connect
    evolve.md             ← /evolve
    surprise.md           ← /surprise
    coach.md              ← /coach
    predict.md            ← /predict
  data/                   ← downloaded after purchase (not in registry)
    brain-context.md      ← full knowledge atom context file
    brain-atoms.json      ← structured atom data
    connections.json      ← cross-references between atoms
    embeddings/           ← Pro tier only
      atoms-1536.json
```

### Multi-brain discovery

The `/connect` and `/debate` skills auto-discover other installed brains by scanning the skill directory for other `brainsfor/*` packages. No config needed. If you have Belsky and Galloway installed, `/debate` automatically offers both for cross-brain comparisons.

### Updates

When new content is ingested (e.g., Belsky publishes a new Implications edition → we run the pipeline → 10 new atoms), Pro tier users run `npx skills update` and get the new atoms. Standard tier users get skills updates but not new atoms — they'd need to re-purchase or upgrade to Pro.

---

## Ship Plan (Updated April 2026 — What's Left)

### What's DONE ✅

- [x] Register brainsfor.dev (owned, on Vercel)
- [x] Build brain pipeline (`build-brain.py` — one command, 7 stages)
- [x] Build 7 brains: Belsky, Paul Graham, Steve Jobs, Peter Attia, Sun Tzu, John Green, Hank Green
- [x] 1,374 atoms + 2,799 connections in Supabase
- [x] Complete pack/ for all 7 (brain-context.md, brain-atoms.json, explore.html, 8 skills each)
- [x] Design system (DESIGN.md) + brand guide (BRAND.md)
- [x] Landing page prototype (5/7 brains rendered)
- [x] `install-brains.sh` for local distribution
- [x] `audit-brains.py` for quality validation
- [x] Supabase tables: `brain_metadata`, `brain_requests`, `brain_request_votes`, `brain_access`

### What's LEFT to ship v1

**Storefront (1 day):**
- [ ] Add John Green + Hank Green to landing page (or make catalog dynamic from index.json)
- [ ] Wire Stripe checkout (3 products: Standard $29, Pro $79, API $199/mo)
- [ ] Build delivery edge function (Stripe webhook → email download link)
- [ ] Wire "Request a Brain" form to `brain_requests` table

**Distribution (half day):**
- [ ] Wire `npx skills add brainsfor/{slug}` to registry (install-brains.sh is the local fallback)
- [ ] Register brain packs in skills ecosystem

**Quality (1 day):**
- [ ] Voice enrichment: currently 7% (20/284 Belsky atoms have original_quote). Target: 100% across all brains.
- [ ] Reclassify Belsky's "Other & Miscellaneous" cluster (110/284 atoms = 39% in catch-all)
- [ ] Fix atom count references in skill files (some still say "104 atoms" — actual is 284 for Belsky)

**Go-to-market (1 day):**
- [ ] Get 5 beta users (currently: ZERO — critical gap)
- [ ] Write launch tweet thread
- [ ] Write HN "Show HN" post
- [ ] Draft LinkedIn post (use linkedin-post skill)
- [ ] Set up analytics (Plausible or Vercel Analytics)
- [ ] Launch on Twitter/X + AI builder communities

**Total remaining: ~3.5 days of focused work.**

---

## Legal Considerations

**The good news:** Building knowledge packs from publicly available content (published articles, newsletters, podcast transcripts, books, public speeches) is transformative use. You're not reproducing their content — you're extracting and restructuring ideas, which is commentary and analysis.

**The gray area:** Using someone's name and likeness commercially. Right of publicity laws vary by state. Mitigation:
- Frame as "analysis of [Person]'s published ideas" not "this IS [Person]"
- Include clear disclaimers: "This knowledge pack is derived from publicly available content and is not endorsed by [Person]"
- The claiming mechanism actually solves this — once they claim, it's explicitly authorized
- Deceased public figures (Einstein, Kissinger) have weaker publicity rights

**The CYA move:** Have a simple takedown process. If someone objects, remove their brain promptly. Most won't object — it's flattering and potentially profitable for them.

**Bottom line:** Ship it. The legal risk is low for v1 (public content, clear disclaimers). The claiming mechanism in v2 eliminates most concerns.

---

## Success Metrics

### Week 1 (launch week)
- [x] 7 brains built and packaged ✅ (done pre-launch)
- [ ] Storefront live with checkout
- [ ] 100+ site visitors
- [ ] 10+ purchases (any tier)
- [ ] 5 beta users providing feedback

### Month 1
- [ ] 10+ brains in catalog (add 3 from Next Wave list)
- [ ] $2,000+ in revenue (consumer + first custom build)
- [ ] 50+ email subscribers (for "This Week in Brains")
- [ ] 1 API subscriber
- [ ] 25+ brain requests in the queue
- [ ] 1 exclusive packaging agreement signed (claim outreach started)

### Month 3
- [ ] 15+ brains in catalog
- [ ] $5,000+/month in revenue
- [ ] 1 claimed/verified brain
- [ ] 3+ custom brain builds completed (enterprise use cases)
- [ ] First platform licensing conversation initiated
- [ ] Featured in 1+ AI newsletter or podcast

### Month 6 (platform licensing)
- [ ] 5+ exclusive packaging agreements signed
- [ ] 1 platform licensing deal closed (or in final negotiation)
- [ ] $10,000+/month blended revenue (consumer + custom + licensing)
- [ ] "Request a Brain" pipeline driving roadmap decisions

---

## Why Rob Is Uniquely Positioned

This isn't a random idea. Rob has **unfair advantages** that make this a 4-5 on his Rob's Edge scale:

1. **The pipeline already exists.** `build-brain.py` is a one-command, 7-stage pipeline (generate → merge → synthesize → YouTube → connections → export → validate). `export-brain.py`, `enrich-connections.py`, `enrich-voice.py`, `ingest-youtube.py`, `audit-brains.py` — all operational. Most people would need 3 months just to build the infrastructure.

2. **Proof of concept is done — seven times over.** 7 brains live with 1,374 atoms and 2,799 connections across Supabase. Each has a complete pack (brain-context.md, brain-atoms.json, explore.html, 8 skills). That's not a concept — that's a catalog.

3. **Creator economy expertise.** Rob understands the creator-as-business model from Tubular, TubeBuddy, and Spotter. The "claim your brain" rev-share model is natural for someone who's spent a decade in creator monetization.

4. **Distribution.** LinkedIn following + AI network + Spotter connections. Rob can get this in front of the right people day one.

5. **Technical chops.** Claude Code + Supabase + Cowork means Rob can build, iterate, and operate this without hiring anyone. True 0-person business.

---

## The One Thing That Could Kill This

**Vibe revenue risk.** Greg Isenberg would ask: "Is this solving a real problem or is it a novelty purchase?"

The honest answer: v1 might be novelty-driven. "Oh cool, I can download Peter Thiel's brain for $29" is a fun impulse buy, but will people come back? Will they actually use the brain packs in their workflows?

**How to mitigate:** Track usage, not just purchases. Do buyers load the context files? Do API users make repeat calls? If usage is low, the product needs to be more actionable — not just "here are 200 atoms" but "here's how to use Peter Attia's decision framework for your specific health question."

The evolution path is: **knowledge pack → interactive advisor → platform** — but only if step 1 validates real utility, not just curiosity.

---

## TL;DR

**What:** Brainsfor.com — installable AI skill packs built from the world's most interesting minds. `npx skills add brainsfor/belsky` gives you 8 thinking tools powered by a real knowledge graph.

**Current state (April 2026):** 7 brains live (Belsky, Paul Graham, Steve Jobs, Peter Attia, Sun Tzu, John Green, Hank Green). 1,374 atoms, 2,799 connections. Full build pipeline, design system, brand guide, landing page prototype. Storefront and checkout not yet wired.

**Who:** Three audiences: (1) Builders/founders who want expert-level context without hand-curating it ($29-79). (2) Professionals prepping for high-stakes interactions — sales teams brain-ing a target customer, founders brain-ing board members, creators studying competitors ($500-2K custom). (3) AI platforms who want premium knowledge content for their users (licensing deals).

**How much:** $29 (standard) / $79 (pro) / $199/mo (API) / $500-2K (custom builds) / $5K-50K/yr (platform licensing per brain).

**Product:** Not a chatbot. Not a PDF. An 8-skill thinking partner: `/advise`, `/teach`, `/debate`, `/connect`, `/evolve`, `/surprise`, `/coach`, `/predict`. Skills chain into workflows. Works with Claude Code, Cursor, Cowork, Gemini CLI, Codex CLI.

**Moat:** Exclusive brain packaging rights. "Claim your brain" rev-share turns subjects into distribution partners who grant exclusive rights. Then sublicense those brains to AI platforms. ASCAP for structured knowledge.

**Why now:** Everyone's building with AI. Nobody's selling portable expertise. The skills ecosystem is nascent — first knowledge skill pack wins the category. AI platforms are desperate for premium differentiated content. The infrastructure exists (Rob built it). The market is wide open.

**Why Rob:** Pipeline is built. Seven brains are done. Creator economy DNA. Distribution ready. Zero employees needed.

**Next step:** Wire the storefront + checkout. Get 5 beta users. Launch. Start claiming conversations with brain subjects. Begin platform licensing outreach once consumer demand is proven.

---

*"Products can be copied, but communities can't." — Greg Isenberg*

*A marketplace of verified, curated minds is a community that gets more valuable with every brain that joins.*

---

## Product Roadmap

Unified roadmap merging the original feature map (Greg × Gary × MrBeast × Rob × Impeccable) with improvements identified from hands-on Belsky brain pack review (April 4, 2026).

### v1 — Ship It

Core product. The skill pack IS the product. The atoms are the fuel.

| # | Feature | Source | Status |
|---|---------|--------|--------|
| 1 | **Brain Skills Pack** — 8 installable skills: `/advise`, `/debate`, `/teach`, `/connect`, `/evolve`, `/surprise`, `/coach`, `/predict`. THE product differentiator. | Rob × Impeccable | Architecture complete |
| 2 | **BRAIN-INSTRUCTIONS.md** — 5-mode LLM instruction file (Advise, Teach, Debate, Connect, Evolve) | Greg | Design complete |
| 3 | **Topic Lenses** — Pre-built slices by topic cluster ("Belsky on Product Design") | Greg | Design complete |
| 4 | **"What Would X Say?" Decision Mode** — Built into `/advise` skill | Greg | Design complete |
| 5 | **Brain Mashups** — Load 2+ brains, cross-perspectives. Built into `/connect` + `/debate` | Greg | Design complete |
| 6 | **Visual Brain Dashboard** — Interactive HTML/D3.js knowledge graph. THE unboxing moment. THE screenshot people share. | MrBeast | Design complete |
| 7 | **Brain Score** — Completeness meter (Belsky: 23%). Transparency + re-engagement hook ("just hit 50%!") | MrBeast | Design complete |
| 8 | **First 100 Founding Supporters** — Name embedded in brain pack. Free updates forever. Vote on next brain. | MrBeast | Ready to implement |
| 9 | **`npx skills add` distribution** — Plugs into skills ecosystem. Install command = distribution channel. | Rob × Impeccable | Architecture complete |
| 10 | **Usage Tracking** — `brain_events` table in Supabase. Track downloads, API calls, return purchases, time-to-first-use. Anti-vibe-revenue insurance. | Greg | Spec complete |
| 11 | **Jason Calacanis at 100%** — First claimer. Case study + megaphone. Not a customer, a launch partner. | Rob | Ready for outreach |
| 12 | **Atom-Level Micro-Content** — Each atom = 1 social post. 100+ per brain. 2,000+ at 20 brains. Content engine. | Gary Vee | Ready to execute |
| 13 | **Brain Fights** — Debate format: Brain A vs Brain B on a topic. Tag both people. Engagement gold. | Gary Vee | Ready to execute |

### v1.1 — Brain Pack Quality Pass

Fixes identified from reviewing the actual Belsky brain pack files vs. the Supabase source of truth.

| # | Feature | Source | Status |
|---|---------|--------|--------|
| 14 | **Ship the 161 Belsky connections in brain-atoms.json** — The connections graph already exists in Supabase (supports: 103, related: 29, extends: 22, contradicts: 7). The shipped brain pack has zero. Single biggest gap between promise and delivery. | Review | Supabase data ready |
| 15 | **Fix atom count discrepancy** — SKILL.md and all 8 skill files reference "104 atoms." Actual count is 284. | Review | Fix required |
| 16 | **Fix the "Other & Miscellaneous" cluster** — 110 of 284 atoms (39%) in the catch-all. Reclassify into: Superhumanity, Vibe Coding, OSINT, Longevity, Philosophy. | Review | Reclassification needed |
| 17 | **Include people graph in export** — 97 people with 368 atom-person links exist in Supabase. Powers "who does Belsky reference most?" | Review | Supabase data ready |
| 18 | **Eliminate atom duplication in brain-context.md** — Some atoms appear in multiple topic sections, wasting LLM context tokens. | Review | Fix required |
| 19 | **Remove 30-atom-per-cluster cap in brain-context.md** — Truncates clusters with "see JSON for more." Ship complete or build smarter loading. | Review | Fix required |

### v1.5 — Cross-Brain Connections + Content Flywheel

The "Your Brain + Their Brain" feature. Plus recurring content engine.

| # | Feature | Source | Status |
|---|---------|--------|--------|
| 20 | **"Where Your Thinking Meets Theirs"** — Surface cross-connections when a buyer loads a brain alongside their own atoms. Proven: Rob's graph has 17 cross-connections between his atoms and Belsky's. No other knowledge product does this. | Review | Prototype proven |
| 21 | **Personal atom ingestion pipeline** — Let buyers add their own atoms (notes, Slack, docs) into a personal graph. Cross-connections auto-generate via embedding similarity. | Review | Architecture clear |
| 22 | **Cross-connection surfacing in skills** — `/advise`, `/connect`, `/surprise` pull from both the brain AND user's personal atoms. "Belsky thinks X, and you wrote something similar 3 weeks ago." | Review | Spec needed |
| 23 | **Leaderboard** — Most-purchased brains, most-queried topics, trending atoms. FOMO machine on landing page. | Gary Vee | Spec complete |
| 24 | **This Week in Brains** — Auto-generated weekly newsletter/social from existing atoms. Zero marginal cost content flywheel + SEO engine. | Greg | Spec complete |

### v2 — Platform + Delivery Evolution

From product to marketplace. From flat files to graph infrastructure.

| # | Feature | Source | Status |
|---|---------|--------|--------|
| 25 | **Claim Your Brain** — Rev-share marketplace. Subjects verify, curate, set price, keep 50%. The platform moat. | All | Spec complete |
| 26 | **Claimable Brain = UGC** — When subjects claim and curate, their audience comes. The argument about accuracy IS the marketing. | Gary Vee | Spec complete |
| 27 | **SQLite brain format** — Portable SQLite with sqlite-vec for embeddings, connections, people. Solves "flat files can't carry a graph." | Review | Architecture clear |
| 28 | **Hosted semantic search API** — Brain stays in Supabase. Skills call edge function for vector search + graph traversal. Real-time updates + usage tracking built in. | Review | Architecture clear |
| 29 | **Hybrid delivery** — Flat files for offline context + API key for semantic search online. Best of both. | Review | Spec needed |

---

## Open Questions

- [x] ~~Is brainsfor.dev available?~~ ✅ Owned. Already on Vercel.
- [x] ~~Is there a "brain comparison" feature?~~ ✅ Yes — `/debate` (head-to-head) and `/connect` (cross-brain synthesis) skills.
- [x] ~~How do you handle contradictions within a brain?~~ ✅ `/evolve` skill shows thinking evolution over time.
- [x] ~~Should brains have a "freshness" dimension?~~ ✅ Brain Score + auto-updates for Pro tier.
- [ ] Should book content be handled differently than blog/newsletter content? (Copyright is clearer for direct quotes vs. extracted ideas)
- [ ] What's the minimum number of atoms for a brain to feel "worth $29"? (Hypothesis: 75-100 atoms with a clear mental model map + working skill pack)
- [ ] Partnership play: Could Anthropic, OpenAI, or Cursor feature brain packs in their skill marketplaces? (`npx skills add` is the wedge)
- [ ] International brains: Is there demand for non-English thinkers? (Yuval Noah Harari, etc.)
- [ ] Should there be a free "sample brain" to reduce purchase friction? (Maybe: Einstein or another public domain figure — no rights issues, fully free, demonstrates the skill pack)
- [ ] Can the `/surprise` skill be wired into a daily email or Slack message? ("Your daily brain atom from Peter Thiel") — turns a one-time purchase into a daily habit
- [ ] Cowork plugin packaging: Should brain packs also be `.claude-plugin` format for the Anthropic plugin marketplace? (See PAOS notes on `.claude-plugin` format study)
