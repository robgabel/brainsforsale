# Design System: BrainsForSale

## 1. Visual Theme & Atmosphere

BrainsForSale sells packaged intelligence — curated knowledge graphs of the world's best thinkers, installed into AI assistants. The design system must feel like a **rare bookshop designed by a type foundry**: intellectual, premium, warm enough to invite exploration, precise enough to signal "this data is structured and trustworthy." The product is not a chatbot, not a SaaS dashboard, not a dev tool. It's a knowledge artifact. The design should honor that.

The page opens on a clean white canvas (`#ffffff`) with deep ink headings (`#0f172a`) — not pure black, but a blue-black that reads as thoughtful rather than harsh. The brand anchor is **Brain Indigo** (`#6366f1`), a saturated violet that signals depth, wisdom, and premium quality without corporate coldness. This isn't enterprise purple; it's the color of a thought you can't shake.

The typography uses Space Grotesk — a geometric sans-serif with just enough personality to feel designed, not default. At display sizes (48-64px), it runs at weight 300 with tight negative letter-spacing, creating headlines that whisper with authority rather than shouting. The lightness says: "This knowledge is so good it doesn't need to be loud." At body sizes, Inter takes over for maximum readability in long-form content (atom descriptions, synthesis text, skill explanations).

What distinguishes BrainsForSale's visual language is the **indigo-tinted shadow system** — borrowed from Stripe's approach but tuned to the brand palette. Multi-layer shadows using `rgba(99, 102, 241, 0.15)` create depth that feels brand-colored, like elements floating in a field of concentrated thought. Combined with warm alternating sections (`#f8f7f4`, a paper-toned off-white), the overall feel is: precision engineering meets intellectual warmth.

**Key Characteristics:**
- Space Grotesk at weight 300 for display, weight 500 for UI — lightness as intellectual confidence
- Negative letter-spacing at display sizes (-1.5px at 56px, progressive relaxation downward)
- Deep ink headings (`#0f172a`) instead of black — warm, authoritative, scholarly
- Brain Indigo (`#6366f1`) as the singular accent — CTAs, links, interactive elements, brain identity
- Indigo-tinted multi-layer shadows using `rgba(99, 102, 241, 0.15)` — elevation that feels on-brand
- Warm paper sections (`#f8f7f4`) alternating with white for visual rhythm
- Knowledge Gold (`#d97706`) reserved for premium moments — brain scores, completeness bars, "golden insight" callouts
- JetBrains Mono as the monospace companion for code blocks, install commands, atom IDs
- Conservative border-radius (6px-10px) for cards, pill shapes (9999px) for badges and tags only

## 2. Color Palette & Roles

### Primary
- **Brain Indigo** (`#6366f1`): Primary brand color, CTA backgrounds, link text, interactive highlights. The intellectual anchor of the entire system.
- **Deep Ink** (`#0f172a`): Primary heading color. A blue-black that adds warmth and depth — never use pure `#000000`.
- **Pure White** (`#ffffff`): Page background, card surfaces, button text on indigo.

### Brand & Immersive
- **Brand Deep** (`#312e81`): Dark immersive sections, footer, hero dark variants. Deep indigo-black for moments of total brand immersion.
- **Brand Night** (`#1e1b4b`): The darkest brand surface — used sparingly for premium feature showcases and "brain loading" experiences.

### Accent Colors
- **Indigo Light** (`#818cf8`): Hover states on indigo elements, secondary interactive highlights, lighter brand moments.
- **Indigo Mist** (`#e0e7ff`): Tinted surface for indigo-themed cards, badge backgrounds, selected states.
- **Knowledge Gold** (`#d97706`): Premium highlights — brain completeness scores, golden insight callouts, "featured brain" badges. Never for CTAs or links.
- **Gold Light** (`#fef3c7`): Tinted surface for gold-themed cards and premium callouts.

### Interactive
- **Primary Indigo** (`#6366f1`): Primary link color, active states, selected elements.
- **Indigo Hover** (`#4f46e5`): Darker indigo for hover states on primary elements.
- **Indigo Deep** (`#3730a3`): Dark indigo for icon hover states, active borders.
- **Indigo Soft** (`#c7d2fe`): Subdued hover backgrounds, pill badge borders.
- **Focus Ring** (`#6366f1` with 3px offset): Keyboard focus indicator.

### Neutral Scale
- **Heading** (`#0f172a`): Primary headings, nav text, strong labels.
- **Label** (`#334155`): Form labels, secondary headings, card titles.
- **Body** (`#64748b`): Secondary text, descriptions, atom metadata.
- **Muted** (`#94a3b8`): Placeholder text, disabled states, tertiary labels.
- **Success** (`#059669`): Active status, completeness, "brain loaded" states.
- **Caution** (`#d97706`): Warnings, incomplete states (also serves as Knowledge Gold).

### Surface & Borders
- **Warm Paper** (`#f8f7f4`): Alternating section backgrounds. Yellow-cream undertone creates warmth — NOT cool gray.
- **Cool Surface** (`#f1f5f9`): Secondary surface for code blocks, technical panels.
- **Border Default** (`#e2e8f0`): Standard border for cards, dividers, containers.
- **Border Indigo** (`#c7d2fe`): Active/selected state borders on interactive elements.
- **Border Whisper** (`rgba(0, 0, 0, 0.08)`): Ultra-subtle dividers — barely there.

### Shadow Colors
- **Shadow Indigo** (`rgba(99, 102, 241, 0.15)`): The signature — brand-tinted primary shadow.
- **Shadow Deep** (`rgba(30, 27, 75, 0.12)`): Deeper indigo shadow for elevated elements.
- **Shadow Neutral** (`rgba(0, 0, 0, 0.06)`): Secondary shadow layer for depth reinforcement.
- **Shadow Soft** (`rgba(0, 0, 0, 0.04)`): Minimal ambient shadow for light lift.

## 3. Typography Rules

### Font Family
- **Display**: `Space Grotesk`, with fallback: `-apple-system, system-ui, sans-serif`
- **Body/UI**: `Inter`, with fallback: `-apple-system, system-ui, sans-serif`
- **Monospace**: `JetBrains Mono`, with fallback: `SF Mono, Consolas, monospace`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | Space Grotesk | 56px (3.50rem) | 300 | 1.05 (tight) | -1.5px | Maximum size, whispered authority — the "Load a genius" headline |
| Display Secondary | Space Grotesk | 48px (3.00rem) | 300 | 1.10 (tight) | -1.2px | Secondary hero, brain name displays |
| Section Heading | Space Grotesk | 36px (2.25rem) | 400 | 1.15 (tight) | -0.75px | Feature section titles |
| Sub-heading Large | Space Grotesk | 28px (1.75rem) | 400 | 1.20 | -0.5px | Card headings, brain pack titles |
| Sub-heading | Space Grotesk | 22px (1.38rem) | 500 | 1.25 | -0.25px | Skill names, sub-sections |
| Body Large | Inter | 18px (1.13rem) | 400 | 1.60 | normal | Feature descriptions, atom content, synthesis text |
| Body | Inter | 16px (1.00rem) | 400 | 1.60 | normal | Standard reading text |
| Body Medium | Inter | 16px (1.00rem) | 500 | 1.60 | normal | Navigation, emphasized UI text |
| Button | Inter | 15px (0.94rem) | 600 | 1.00 | normal | Primary button text |
| Button Small | Inter | 13px (0.81rem) | 600 | 1.00 | 0.025em | Secondary/compact buttons |
| Caption | Inter | 14px (0.88rem) | 500 | 1.40 | normal | Metadata, atom source refs, dates |
| Caption Light | Inter | 14px (0.88rem) | 400 | 1.40 | normal | Secondary labels, descriptions |
| Badge | Inter | 12px (0.75rem) | 600 | 1.33 | 0.05em | Pill badges, topic tags, cluster labels |
| Code Body | JetBrains Mono | 14px (0.88rem) | 400 | 1.70 | normal | Code blocks, install commands, skill invocations |
| Code Inline | JetBrains Mono | 13px (0.81rem) | 500 | inherit | normal | Inline code, atom IDs, CLI commands |
| Micro | Inter | 11px (0.69rem) | 500 | 1.30 | 0.05em | Fine print, atom counts, timestamps |

### Principles
- **Light weight as intellectual confidence**: Weight 300 at display sizes is BrainsForSale's typographic signature. The text is so confident in the knowledge it represents that it doesn't need weight to command attention.
- **Two-font clarity**: Space Grotesk for personality (headings, brand moments), Inter for utility (body, UI, data). Never mix them within a single text block.
- **Progressive tracking**: Letter-spacing tightens proportionally with size: -1.5px at 56px, -1.2px at 48px, -0.75px at 36px, normal at 16px and below.
- **Generous line height for content**: Body text at 1.60 line-height because atom descriptions and synthesis text are meant to be read carefully, not scanned.
- **Badge micro-tracking**: 12px badge text uses positive letter-spacing (0.05em) for wider, more legible small text on pill shapes.

## 4. Component Stylings

### Buttons

**Primary Indigo**
- Background: `#6366f1`
- Text: `#ffffff`
- Padding: 10px 20px
- Radius: 8px
- Font: 15px Inter weight 600
- Hover: `#4f46e5` background
- Active: `#3730a3` background, scale(0.98)
- Shadow: `rgba(99, 102, 241, 0.25) 0px 4px 12px`
- Use: Primary CTA ("Get this brain", "Install now", "Try the demo")

**Secondary / Ghost**
- Background: transparent
- Text: `#6366f1`
- Padding: 10px 20px
- Radius: 8px
- Border: `1.5px solid #c7d2fe`
- Font: 15px Inter weight 600
- Hover: background `rgba(99, 102, 241, 0.05)`, border `#6366f1`
- Use: Secondary actions ("View atoms", "See connections", "Compare brains")

**Dark Surface CTA** (for dark/immersive sections)
- Background: `#ffffff`
- Text: `#0f172a`
- Padding: 10px 20px
- Radius: 8px
- Font: 15px Inter weight 600
- Hover: `rgba(255, 255, 255, 0.9)` background
- Use: CTA on dark brand sections

**Neutral Ghost**
- Background: transparent
- Text: `#64748b`
- Padding: 10px 20px
- Radius: 8px
- Border: `1px solid #e2e8f0`
- Font: 15px Inter weight 500
- Hover: text `#0f172a`, border `#cbd5e1`
- Use: Tertiary actions, filters, toggles

### Cards & Containers

**Standard Card**
- Background: `#ffffff`
- Border: `1px solid #e2e8f0`
- Radius: 10px
- Shadow: `rgba(99, 102, 241, 0.08) 0px 8px 24px -4px, rgba(0, 0, 0, 0.04) 0px 4px 12px -4px`
- Hover: shadow intensifies to `rgba(99, 102, 241, 0.15) 0px 12px 32px -4px, rgba(0, 0, 0, 0.06) 0px 6px 16px -4px`
- Transition: `box-shadow 0.2s ease, transform 0.2s ease`
- Hover transform: `translateY(-2px)`

**Brain Pack Card** (featured, on catalog pages)
- Background: `#ffffff`
- Border: `1.5px solid #c7d2fe`
- Radius: 12px
- Shadow: `rgba(99, 102, 241, 0.12) 0px 12px 32px -8px, rgba(0, 0, 0, 0.05) 0px 6px 16px -4px`
- Top accent: `4px solid #6366f1` top border (the "brain identity" stripe)
- Internal: brain name at 28px Space Grotesk weight 400, atom count badge, topic pills

**Atom Card** (individual knowledge atom display)
- Background: `#ffffff`
- Border: `1px solid #e2e8f0`
- Radius: 8px
- Left accent: `3px solid` in cluster color (varies by topic)
- Internal: content at 16px Inter, original_quote in `font-style: italic` with `#334155` color, source_ref as linked caption
- Hover: left accent widens to 4px, subtle shadow appears

**Dark Immersive Card** (on dark sections)
- Background: `rgba(255, 255, 255, 0.06)`
- Border: `1px solid rgba(255, 255, 255, 0.12)`
- Radius: 10px
- Backdrop-filter: `blur(8px)`
- Text: white headings, `rgba(255, 255, 255, 0.7)` body

### Badges / Tags / Pills

**Topic Pill**
- Background: `#e0e7ff`
- Text: `#3730a3`
- Padding: 3px 10px
- Radius: 9999px
- Font: 12px Inter weight 600, letter-spacing 0.05em
- Use: Cluster tags, topic labels on atom cards

**Brain Score Badge**
- Background: `#fef3c7`
- Text: `#92400e`
- Padding: 3px 10px
- Radius: 9999px
- Font: 12px Inter weight 600
- Icon: small star or brain icon prefix
- Use: Completeness score, quality tier indicators

**Skill Badge**
- Background: `#f1f5f9`
- Text: `#334155`
- Padding: 4px 12px
- Radius: 9999px
- Font: 13px JetBrains Mono weight 500
- Use: Skill names ("/advise", "/debate", "/connect")

**Status Badge**
- Active: background `rgba(5, 150, 105, 0.1)`, text `#059669`, border `rgba(5, 150, 105, 0.2)`
- Pending: background `rgba(217, 119, 6, 0.1)`, text `#d97706`
- New: background `#e0e7ff`, text `#4f46e5`

### Inputs & Forms
- Background: `#ffffff`
- Border: `1px solid #e2e8f0`
- Radius: 8px
- Padding: 10px 14px
- Focus: `2px solid #6366f1`, shadow `rgba(99, 102, 241, 0.15) 0px 0px 0px 3px`
- Label: `#334155`, 14px Inter weight 500
- Text: `#0f172a`
- Placeholder: `#94a3b8`

### Navigation
- Clean horizontal nav on white, sticky with `backdrop-filter: blur(12px)` and `rgba(255, 255, 255, 0.85)` background
- Brand logotype: "brainsforsale" in Space Grotesk 16px weight 600, `#0f172a` with `.com` in `#6366f1`
- Links: Inter 15px weight 500, `#64748b` text, hover `#0f172a`
- CTA: indigo button ("Get a brain") right-aligned
- Border: `1px solid rgba(0, 0, 0, 0.06)` bottom
- Mobile: hamburger toggle, 8px radius

### Code Blocks (Install Commands, Skill Demos)
- Background: `#0f172a` (dark ink)
- Text: `#e2e8f0` (light)
- Border: none
- Radius: 10px
- Padding: 20px 24px
- Font: JetBrains Mono 14px weight 400, line-height 1.70
- Syntax highlighting: keywords in `#818cf8` (indigo light), strings in `#34d399` (emerald), comments in `#64748b`
- Copy button: top-right, ghost style, `rgba(255, 255, 255, 0.1)` background

### Decorative Elements

**Brain Identity Stripe**
- `4px solid #6366f1` top or left border on brain pack cards — the signature accent that marks "this is a brain"

**Cluster Color System** (for atom cards and topic visualization)
- Product & Design: `#6366f1` (indigo)
- AI & Technology: `#0ea5e9` (sky)
- Leadership: `#d97706` (amber)
- Creativity: `#ec4899` (pink)
- Business Models: `#059669` (emerald)
- Culture & Teams: `#8b5cf6` (violet)
- Each cluster gets its own tinted background variant at 10% opacity for surfaces

**Section Dividers**
- No hard lines between sections. Separation comes from background color alternation (white ↔ warm paper) and generous vertical spacing.

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 2px, 4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px
- Section vertical padding: 80px (desktop), 48px (mobile)
- Card internal padding: 24px (standard), 32px (featured)
- Component gap: 16px (tight), 24px (standard), 32px (comfortable)

### Grid & Container
- Max content width: 1140px, centered with `auto` horizontal margins
- Hero: centered single-column, 64px top padding, generous bottom
- Feature sections: 2-column (text + visual) or 3-column card grids
- Brain catalog: 3-column card grid with 24px gap
- Atom lists: single-column, max-width 720px for readability
- Full-width warm paper sections for testimonials, trust signals, feature deep-dives

### Whitespace Philosophy
- **Intellectual breathing room**: Generous vertical spacing (80-96px between sections) creates a measured, confident pace. This is a site for considered reading, not scrolling past content.
- **Content islands**: Body text blocks (max-width 640-720px) float in generous horizontal space, creating focused reading zones. Atom content should never feel wall-to-wall.
- **Warm alternation**: White sections alternate with warm paper (`#f8f7f4`) sections, creating gentle visual rhythm without harsh breaks. This is borrowed from editorial design — think high-end magazine layouts.
- **Dense data, generous chrome**: Atom cards and brain stats can be information-dense, but the surrounding UI chrome is spacious. The frame is elegant; the content is rich.

### Border Radius Scale
- Subtle (4px): Small inline elements, code inline
- Standard (6px): Badges, small interactive elements
- Comfortable (8px): Buttons, inputs, atom cards
- Relaxed (10px): Standard cards, containers, code blocks
- Generous (12px): Featured cards, brain pack cards, hero elements
- Pill (9999px): Topic tags, status badges, cluster pills — round elements ONLY

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, inline text, section backgrounds |
| Whisper (Level 1) | `rgba(0, 0, 0, 0.04) 0px 2px 8px` | Subtle lift on hover hints, atom cards at rest |
| Standard (Level 2) | `rgba(99, 102, 241, 0.08) 0px 8px 24px -4px, rgba(0, 0, 0, 0.04) 0px 4px 12px -4px` | Standard cards, content panels |
| Elevated (Level 3) | `rgba(99, 102, 241, 0.15) 0px 16px 40px -8px, rgba(0, 0, 0, 0.06) 0px 8px 20px -4px` | Featured brain cards, dropdowns, popovers |
| Deep (Level 4) | `rgba(30, 27, 75, 0.20) 0px 24px 48px -12px, rgba(0, 0, 0, 0.08) 0px 12px 24px -8px` | Modals, floating panels, hero demo boxes |
| Focus Ring | `0px 0px 0px 3px rgba(99, 102, 241, 0.2)` + `2px solid #6366f1` | Keyboard focus on all interactive elements |

**Shadow Philosophy**: BrainsForSale's shadow system uses indigo-tinted primary shadows (`rgba(99, 102, 241, ...)`) paired with neutral secondary layers. This creates shadows that carry the brand color into the depth dimension — elements don't just float, they float in a field of concentrated thought. The negative spread values ensure shadows stay tight and controlled. On hover, shadows deepen rather than spread, creating a "drawn closer" effect rather than a "lifted away" one.

### Decorative Depth
- Warm paper sections (`#f8f7f4`) create tonal depth through background contrast
- Dark brand sections (`#1e1b4b`) for hero moments and immersive brain showcases
- Code blocks use `#0f172a` background as recessed surfaces — content "sunk into" the page
- Brain identity stripes (4px indigo borders) create visual anchoring on card edges

## 7. Do's and Don'ts

### Do
- Use Space Grotesk weight 300 for all display headlines — lightness is intellectual confidence
- Apply indigo-tinted shadows (`rgba(99, 102, 241, ...)`) for all elevated elements
- Use `#0f172a` (deep ink) for headings instead of `#000000` — warmth matters
- Use `#6366f1` (Brain Indigo) as the primary interactive/CTA color consistently
- Keep Knowledge Gold (`#d97706`) reserved for premium moments only — scores, featured badges
- Alternate white and warm paper (`#f8f7f4`) sections for editorial rhythm
- Use pill shapes (9999px) ONLY for badges and tags — buttons use 8px radius
- Let content breathe — 80px+ between sections, 640-720px max-width for body text
- Use JetBrains Mono for all code, commands, and skill invocations (`/advise`, `npx skills add`)
- Show atom content in Inter at generous line-height (1.60) for careful reading

### Don't
- Don't use weight 600-700 for Space Grotesk display headlines — weight 300-400 is the brand voice
- Don't use pure black (`#000000`) for text or backgrounds in light sections
- Don't use neutral gray shadows — always tint with indigo (`rgba(99, 102, 241, ...)`)
- Don't use Knowledge Gold for buttons, links, or CTAs — it's decorative/premium only
- Don't use large border-radius (16px+) on cards or buttons — keep it conservative (8-12px)
- Don't mix Space Grotesk and Inter within a single text block — one font per element
- Don't use warm accent colors (orange, red) for interactive elements — indigo is primary
- Don't create dense, wall-to-wall layouts — every content block needs surrounding space
- Don't use pill-shaped buttons — pills are for badges/tags only
- Don't use cool grays for alternating sections — always use the warm paper tone (`#f8f7f4`)

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, 36px hero heading, stacked cards, hamburger nav |
| Tablet | 640-1024px | 2-column grids, moderate padding, reduced section spacing |
| Desktop | 1024-1280px | Full layout, 3-column brain catalog, side-by-side features |
| Large Desktop | >1280px | Centered content (1140px max), generous margins |

### Touch Targets
- Buttons: 10px 20px padding minimum, 44px minimum touch height
- Navigation links: 15px text with 12px vertical padding
- Pill badges: 10px horizontal padding for adequate tap targets
- Mobile nav toggle: 44x44px minimum with 8px radius

### Collapsing Strategy
- Hero: 56px display -> 48px -> 36px on mobile, weight 300 maintained
- Navigation: horizontal links + CTA -> hamburger toggle
- Brain catalog: 3-column -> 2-column -> single column stacked
- Feature sections: side-by-side (text + visual) -> stacked vertically
- Atom lists: maintain single-column, reduce horizontal padding
- Dark brand sections: maintain full-width, reduce internal padding
- Section spacing: 80px -> 48px on mobile
- Code blocks: maintain JetBrains Mono treatment, horizontal scroll if needed
- Card grid gap: 24px -> 16px on mobile

### Image Behavior
- Brain visualizations maintain aspect ratio, scale within containers
- Skill demo screenshots preserve indigo-tinted shadows at all sizes
- Cluster color coding remains consistent across breakpoints
- Brain pack header images use 12px top radius, full-width within card

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: Brain Indigo (`#6366f1`)
- CTA Hover: Indigo Dark (`#4f46e5`)
- Background: Pure White (`#ffffff`)
- Alt Background: Warm Paper (`#f8f7f4`)
- Heading text: Deep Ink (`#0f172a`)
- Label text: Slate (`#334155`)
- Body text: Cool Gray (`#64748b`)
- Muted text: Silver (`#94a3b8`)
- Border: Soft (`#e2e8f0`)
- Link: Brain Indigo (`#6366f1`)
- Dark section: Brand Night (`#1e1b4b`)
- Premium accent: Knowledge Gold (`#d97706`)
- Success: Emerald (`#059669`)

### Example Component Prompts
- "Create a hero section on white background. Headline 'Load a genius into your AI' at 56px Space Grotesk weight 300, line-height 1.05, letter-spacing -1.5px, color #0f172a. Subtitle at 18px Inter weight 400, line-height 1.60, color #64748b. Primary CTA button (#6366f1 bg, white text, 8px radius, 10px 20px padding, shadow rgba(99,102,241,0.25) 0px 4px 12px) and ghost button (transparent, 1.5px solid #c7d2fe, #6366f1 text, 8px radius)."
- "Design a brain pack card: white background, 1.5px solid #c7d2fe border, 12px radius, 4px solid #6366f1 top border. Shadow: rgba(99,102,241,0.12) 0px 12px 32px -8px. Brain name at 28px Space Grotesk weight 400, letter-spacing -0.5px, color #0f172a. Atom count as pill badge (#e0e7ff bg, #3730a3 text, 9999px radius). Description at 16px Inter weight 400, #64748b."
- "Build a topic pill badge: #e0e7ff background, #3730a3 text, 9999px radius, 3px 10px padding, 12px Inter weight 600, letter-spacing 0.05em."
- "Create a code block for install command: #0f172a background, 10px radius, 20px 24px padding. Code in JetBrains Mono 14px weight 400, #e2e8f0 text. Command keyword in #818cf8. Copy button top-right with rgba(255,255,255,0.1) background."
- "Design an atom card: white background, 1px solid #e2e8f0 border, 8px radius, 3px solid left border in cluster color. Content at 16px Inter weight 400, line-height 1.60, #0f172a. Original quote in italic #334155. Source ref as 14px caption link in #6366f1."
- "Design a dark immersive section: #1e1b4b background, white text. Headline 48px Space Grotesk weight 300, letter-spacing -1.2px. Body 18px Inter weight 400, rgba(255,255,255,0.7). Cards inside use rgba(255,255,255,0.06) background with 1px solid rgba(255,255,255,0.12) border, 10px radius, backdrop-filter blur(8px)."
- "Create navigation: white sticky header with backdrop-filter blur(12px), rgba(255,255,255,0.85) background. Logo 'brainsforsale' in Space Grotesk 16px weight 600, #0f172a with '.com' in #6366f1. Links in Inter 15px weight 500, #64748b, hover #0f172a. Indigo CTA button right-aligned. Bottom border 1px solid rgba(0,0,0,0.06)."

### Iteration Guide
1. Display headlines always use Space Grotesk weight 300 with negative letter-spacing — this IS the brand
2. Body text always uses Inter at 1.60 line-height — knowledge content is meant to be read, not scanned
3. Shadow formula: `rgba(99, 102, 241, opacity) 0px Y1 B1 -S1, rgba(0, 0, 0, opacity) 0px Y2 B2 -S2` — indigo far + neutral close
4. Heading color is `#0f172a` (deep ink), body is `#64748b`, labels are `#334155`
5. Knowledge Gold (`#d97706`) is NEVER for interactive elements — only premium decorative moments
6. Warm paper sections use `#f8f7f4` (yellow-cream undertone) — never cool gray
7. Border-radius stays 6-12px range for cards/buttons — pill shapes (9999px) only for badges
8. Code/commands always use JetBrains Mono on `#0f172a` background — recessed, not elevated
9. Brain identity stripe: 4px solid `#6366f1` on top or left edge of brain pack cards
10. Dark sections use `#1e1b4b` (brand night) — deep branded indigo, not generic black or gray
