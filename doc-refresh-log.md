# BrainsFor Doc Refresh Log

## Doc Refresh — 2026-04-11

### Changes Applied
- `IMPROVEMENTS.md`: Last updated 2026-04-10 → 2026-04-11

### No Changes Needed
- `brains/index.json`: all 7 brain counts match Supabase exactly (Belsky 284/430, Peter Attia 73/40, Paul Graham 213/409, Steve Jobs 170/792, John Green 205/385, Sun Tzu 207/377, Hank Green 222/366)
- `business-plan.md` Ship Plan: totals still 1,374 atoms / 2,799 connections / 17 cross-connections ✓
- `business-plan.md` voice enrichment: still 20/284 Belsky atoms (7%) ✓
- `business-plan.md` infrastructure: 7 brain_metadata records ✓, 0 brain_requests (form still unwired) ✓
- `CLAUDE.md`: Belsky 284 atoms / 430 connections still accurate — no factual drift
- `IMPROVEMENTS.md` Active Plan checkboxes: no status changes since 2026-04-10

### Quality Scores (audit-brains.py) — avg 90, 2/7 passing
- scott-belsky: 81 (warning: voice 7%, template var unresolved)
- peter-attia: 66 (orphan atoms 36%, voice 0%, 73 atoms, template var)
- paul-graham: 95 ✓
- steve-jobs: 93
- john-green: 100 ✓
- sun-tzu: 99
- hank-green: 96

### Flagged for Human Review
- No new discrepancies since the 2026-04-10 run. All prior flags still open:
  - Unresolved `{{brain_source_ethics}}` template var in scott-belsky + peter-attia pack/SKILL.md — re-run `export-brain.py`
  - Peter Attia voice enrichment at 0%, orphan rate 36%
  - Belsky voice enrichment still at 7% (no change in 24hrs)
  - Live site brainsforsale.com renders all 7 brains ✓ — but local `storefront/landing-page-prototype.html` only has 5 (missing John Green + Hank Green). Prototype has drifted from production; either update the prototype or retire it.
  - Cowork skills registered for only 2/7 brains (scott-belsky + paul-graham); peter-attia, steve-jobs, john-green, sun-tzu, hank-green not symlinked into `~/rob-ai/skills/`
  - `brain_requests` table still 0 rows (form unwired — matches Ship Plan status)

---

## Doc Refresh — 2026-04-10

### Changes Applied
- `brains/index.json`: peter-attia connection_count 0 → 40 (Supabase source of truth)
- `IMPROVEMENTS.md`: Last updated 2026-04-04 → 2026-04-10

### No Changes Needed
- `business-plan.md` Ship Plan: all 7 brain counts match Supabase (Belsky 284/430, Hank Green 222/366, Paul Graham 213/409, Sun Tzu 207/377, John Green 205/385, Steve Jobs 170/792, Peter Attia 73/40)
- `business-plan.md` totals: 1,374 atoms / 2,799 connections / 17 cross-connections ✓
- `business-plan.md` infrastructure stats: 7 brain_metadata records ✓, 5/7 landing page coverage ✓ (John Green + Hank Green still not rendered), voice enrichment 7% (20/284 Belsky) ✓
- `CLAUDE.md`: structural/reference content only, no factual counts to drift
- `IMPROVEMENTS.md` Active Plan checkboxes: voice recovery still at 20/284 (7%), all other items unchanged

### Quality Scores (audit-brains.py)
- scott-belsky: 81 (warning: voice enrichment 7%, template var unresolved)
- peter-attia: 66 (orphan atoms 36%, voice 0%, only 73 atoms, template var unresolved)
- paul-graham: 95 ✓
- (full output truncated — remaining 4 brains not captured in this run)

### Flagged for Human Review
- `peter_attia_connections` table has 40 rows in Supabase but audit JSON shows `declared_connection_count: 40` with `actual_connections_refs: 80` — possible double-counting in export pipeline. Also 26/73 (36%) orphan atoms. Consider running `enrich-connections.py --brain peter-attia --discover --llm --auto-apply`.
- `scott_belsky_connections` shows 430 declared vs 860 actual refs — same 2× pattern, may be expected (each connection references two atoms).
- Unresolved template var `{{brain_source_ethics}}` in pack/SKILL.md files — re-run `export-brain.py` to fix.
- Cowork skills registered in `~/rob-ai/skills/`: only `scott-belsky-brain`, `scott-belsky-brainfight`, `paul-graham-brain`, `paul-graham-brainfight`. The other 5 live brains (peter-attia, steve-jobs, john-green, sun-tzu, hank-green) have pack/ dirs but no registered Cowork skills — distribution gap.
- `brain_requests` table has 0 rows — "Request a Brain" form not yet wired to storefront (expected, still in Ship Plan).

---
