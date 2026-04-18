# Interactive District Map — v1 Spec

Status: **In progress** — current focus for the project.

## The vision

A visually rich, interactive map of Telangana's 33 districts. Click a district → side panel slides in with everything that's happening in that district. The map should feel *alive* — hover states, smooth transitions, heatmap overlays, keyboard navigation. Not a static SVG with click handlers.

This is the feature that makes the site feel local instead of state-level. A voter from Nizamabad should open the map, click Nizamabad, and instantly see: who represents me, what promises were made here, what's being delivered, what's not, what's in the news about my district.

---

## Two parallel workstreams

### A) Map UI / UX
The visual and interactive layer.

### B) Per-district data layer
The content that populates the side panel. Without this, the map is empty rooms.

**Both must ship together.** Either alone is useless.

---

## Current data state (reality check)

As of now, `data/districts.json` contains:
- Farmer suicides by district (20 districts listed + "Other Districts")
- Crop loan waiver — state-level, not per-district
- Zero-enrollment schools — state-level, not per-district

**Per-district data we need to build from scratch:**
- District metadata (population, area, literacy, sex ratio — from Census 2011 + projections)
- Assembly constituencies in each district + current MLA + party
- Lok Sabha constituencies overlap
- Promise-delivery signals (which schemes are reaching this district, at what rate)
- Projects located in this district
- News tagged to this district
- Controversies tied to this district
- District collector, municipal commissioner (for the future citizen-reporting phase)

---

## Open decisions (to resolve in this planning pass)

### 1. GeoJSON source
Telangana was redrawn in 2016 (10 → 31 districts) and again in 2019 (31 → 33). Many public GeoJSONs are outdated. We need the **33-district version**.
- Options: DataMeet Telangana, OSM export, GoI survey data, GitHub community repos
- Action item: verify one source has all 33 current districts before we commit

### 2. Map tech
- **(a) Hand-built SVG + React** — maximum control, best animations, most work
- **(b) react-simple-maps** — D3-based, click/hover built in, choropleth support, less custom animation
- **(c) Leaflet + GeoJSON** — real-world map tiles, zoomable, feels less "dashboard"

### 3. Heatmap / choropleth overlays
Which metrics color the districts on the map?
- Farmer suicides (red intensity)
- Promise delivery score (green-red gradient)
- Budget spent per capita (blue intensity)
- News density (heatmap)
- Controversies count
- Toggle between views, or one default?

### 4. Side panel content structure
What goes in the panel when you click a district?
- Header: District name (EN + Telugu), population, MLA count, parliamentary seats
- Tabs: Overview / Representatives / Promises / Projects / News / Data
- Or single scrollable view?

### 5. Mobile strategy
33 districts on a 390px screen is tricky. Options:
- Same map, pinch to zoom, tap to open panel (panel as bottom sheet)
- List view fallback below a simpler map
- Search-first on mobile (type district name → open panel directly)

### 6. MVP data scope
To ship a first usable version, which per-district metrics do we populate first?
- Minimum viable: District name + metadata + MLA list + existing farmer suicide data
- Stretch: + promise-delivery signals + projects + news tagging

---

## Proposed order of work (draft)

1. Lock GeoJSON source (verify 33 districts) — half day
2. Decide map tech — one call
3. Build per-district metadata file (33 rows: name, Telugu name, population, area, HQ, MLAs) — one day of content work
4. Build static map + click handler + empty side panel — one day
5. Wire up side panel to per-district data — one day
6. Add first heatmap overlay (farmer suicides, since we have the data) — half day
7. Add mobile variant — one day
8. Tag existing news / projects / controversies by district where possible — ongoing content work

---

## Non-goals for v1 of the map
- Real-time updates (data refresh is fine on deploy)
- Citizen-submitted content on the map (that's SPEC-CITIZEN-REPORTING.md, later)
- Constituency-level granularity (districts only for v1; constituencies come later)
- Historical time-slider (interesting but not for v1)
