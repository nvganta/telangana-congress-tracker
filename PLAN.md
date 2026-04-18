# Telangana Tracker — Master Plan

This is the source of truth for what we're building, in what order, and why. Detail specs live in separate files and are linked here.

---

## The Line (do not cross)

> We are **not** a speech platform. We are a **structured civic information + reporting platform** with social features on structured submissions only.

- Neutrality is the project's moat. Features that break it get vetoed.
- No free-form posting, no political opinions hosted, no follower graph.
- Every data point traceable to a public source.

---

## Version 1 — Interactive District Information Layer

**Goal:** Turn the site from a state-level scoreboard into a map-driven, district-aware civic information tool. No user-generated content, no database, no auth.

### Scope (IN)

1. **Header restructure** to 5 top-level items:
   ```
   DASHBOARD  |  GOVERNMENT ▾  |  MAP  |  DISTRICTS ▾  |  TIMELINE
   ```
   `GOVERNMENT ▾` contains: Promises, Budget, Development, Controversies, Sectors, Compare, CM Profile.
   `DISTRICTS ▾` contains: alphabetical list of all 33 districts (may upgrade to mini-map + search in a later pass).
   `[SOURCES]` remains in the top-right.

2. **Interactive SVG map of Telangana** — hand-built SVG with 33 clickable district shapes, dark surveillance aesthetic matching the rest of the site. Hover glow, click-to-focus, dim-others-on-click.

3. **Side panel on district click** — slides in from the right. Preview content:
   - District name (EN + Telugu), HQ, population, area
   - Key metric block (farmer suicides, MLAs count, promise delivery score if available)
   - 1–2 latest news headlines tagged to this district
   - Big `SEE FULL DETAILS →` button → dedicated district page

4. **Dedicated district page** at `/districts/[slug]` — full canvas per district:
   - All metadata + Telugu name
   - MLA list with party + constituency
   - Lok Sabha constituencies overlapping
   - Promise-delivery signals (where data permits)
   - Projects located in this district
   - All news tagged to this district (not just 1–2)
   - Controversies tied to this district
   - District-level stats (farmer suicides, crop loan waiver reach, etc.)

5. **Per-district metadata JSON** — new data file, `data/districts-metadata.json`, one entry per district with the structure above. Seeded from public sources (Wikipedia, TG govt portal, Election Commission).

6. **News district-tagging** — extend the existing `lib/rss.ts` filter to tag articles with district names when they appear in headlines. Tagging happens at filter time, stateless, no DB.

7. **Heatmap overlay on map** — default: farmer suicide count (data we already have). Toggleable later.

8. **Mobile variant** — bottom sheet panel instead of side panel; pinch-to-zoom map; searchable fallback list.

9. **Freebie fixes**:
   - Fix homepage headline `WHAT'S CONGRESS IS DOING IN TELANGANA?` → `WHAT IS CONGRESS DOING IN TELANGANA?`
   - Surface the existing `/districts` page into the nav (currently orphaned).

### Scope (OUT of V1 — deferred to V2)

- Database / persistent storage
- User authentication
- User-generated content, submissions, comments, likes, shares
- Citizen reporting / infra issue submissions
- LLM-based action routing
- Officials directory (municipal / ward / sarpanch / MLA contacts)
- Historical news archive
- Constituency-level drill-down
- Time-slider / historical views
- Third-party service integrations

### Open label / naming questions (DEFERRED — revisit after V1 ships)
- "Budget" → possibly rename to "Budget Spend" or similar
- "Controversies" → possibly rename
- Other Government ▾ items — review once the grouping is live

---

## Version 2 — Citizen Reporting (PARKED)

See [SPEC-CITIZEN-REPORTING.md](./SPEC-CITIZEN-REPORTING.md).

**Scope summary:** Structured infrastructure-issue reports (potholes, streetlights, garbage, water, drainage, toilets). Video-mandatory capture. Anonymous phone-OTP submission. LLM-assisted action bundles pointing to relevant officials. Social features (likes, comments, shares) on *issues only*. Tier 2 (scheme-delivery grievances) and Tier 3 (governance grievances) explicitly out of V2.

**Starts only after V1 ships.** Database (most likely Supabase) introduced at the start of V2.

---

## Build order for V1

1. Header restructure — half day.
2. Fix homepage grammar bug — 5 minutes.
3. Find and verify 33-district GeoJSON (DataMeet / OSM / govt source) — half day research.
4. Design and agree on `districts-metadata.json` structure — half day.
5. Build map SVG + hover/click behavior — 1–2 days.
6. Build side panel (preview) component — 1 day.
7. Build dynamic district page route `/districts/[slug]` — 1 day.
8. Seed metadata for 2–3 pilot districts (Warangal, Karimnagar, Hyderabad or Rangareddy) — half day.
9. User reviews pilot districts before we replicate → checkpoint.
10. Seed metadata for remaining 30 districts — scales with desired depth, 1 day to several days.
11. News district-tagging in RSS filter — half day.
12. Farmer-suicide heatmap overlay — half day.
13. Mobile polish — 1–2 days.
14. Ship.

Rough total: **1.5–2 focused weeks**. User checkpoints at steps 4 and 9.

---

## What I (assistant) need from the user to build V1

**Not blocking anything right now.** I can start on 1 → 8 without any input.

**Things I'll need the user to decide (not do) as we go:**
- Approve `districts-metadata.json` structure before I seed all 33 (step 4 checkpoint).
- Spot-check the first 2–3 district pages for completeness / accuracy before I scale the pattern (step 9 checkpoint).
- Approve the mobile behavior once there's a prototype.

**Things the user should NOT do right now:**
- Don't start collecting district data manually — data shape must be designed first, otherwise we'll gather in the wrong format.
- Don't rename "Budget" or "Controversies" yet — deferred decision.

---

## What I (assistant) will NOT do without explicit approval

- Change URLs of existing pages (`/promises`, `/budget`, etc.) — SEO risk. Header grouping changes nav only, not URLs.
- Remove any existing page or data.
- Introduce a database, auth, or third-party service in V1.
- Begin any V2 work.
