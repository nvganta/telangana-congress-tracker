# Telangana Tracker — Deep Research Brief for Claude Web

Paste this entire file as the prompt to Claude (web, with deep research / browsing enabled). It will produce a single document with structured data for 27 Telangana districts that we'll drop into our tracker.

---

## Context

We're building [telanganatracker.in](https://www.telanganatracker.in), a public accountability dashboard that tracks the Congress government in Telangana state, India. Each of Telangana's 33 districts has its own page showing who represents it (MLAs, MPs), who runs it (District Collector, Police Commissioner/SP, Mayor where applicable), basic demographics, political geography, and tagged news.

6 districts already have complete data in our system and should **NOT** be re-researched:

> **Skip these:** Adilabad · Hyderabad · Jagtial · Khammam · Warangal · Rangareddy

We need you to research the remaining **27 districts** listed below and return a single markdown document containing one entry per district, using the exact structure in the "Output format" section.

---

## Districts to research (27)

Alphabetical order:

1. Bhadradri Kothagudem
2. Hanumakonda (formerly Warangal Urban, renamed 2021)
3. Jangaon
4. Jayashankar Bhupalapally
5. Jogulamba Gadwal
6. Kamareddy
7. Karimnagar
8. Kumuram Bheem Asifabad
9. Mahabubabad
10. Mahabubnagar
11. Mancherial
12. Medak
13. Medchal-Malkajgiri
14. Mulugu
15. Nagarkurnool
16. Nalgonda
17. Narayanpet
18. Nirmal
19. Nizamabad
20. Peddapalli
21. Rajanna Sircilla
22. Sangareddy
23. Siddipet
24. Suryapet
25. Vikarabad
26. Wanaparthy
27. Yadadri Bhuvanagiri

---

## Fields to collect per district

For each district, gather these fields. Fields marked **(required)** are essential — omit the district entirely if you can't find them. Fields marked **(optional)** should be included when available, omitted when you genuinely can't find a verifiable answer. **Never invent data** — if you're not confident, say "unknown" rather than guess.

### Identity
- `name` — **(required)** — Current official name. For renamed districts, use the post-2021 name (e.g. "Hanumakonda" not "Warangal Urban").
- `nameTelugu` — **(required)** — Name in Telugu script (e.g. `కరీంనగర్`)
- `hq` — **(required)** — Headquarters city/town
- `formed` — **(required)** — Date district took its current shape, YYYY-MM-DD. Most are `2016-10-11` (31-district reorganization) or `2019-02-17` (2-new-district addition) or `2021-08-12` (Hanumakonda/Warangal split). Use `1978-08-15` for original pre-existing ones.

### Geography
- `region` — **(required)** — One of exactly: `hyderabad-metro`, `northern-telangana`, `southern-telangana`, `eastern-telangana`, `western-telangana`. Pick the one that matches the district's location in the state.
- `coordinates` — **(required)** — [latitude, longitude] of the HQ city as a decimal pair (e.g. `[18.4386, 79.1288]`)
- `area` — **(required)** — Area in square kilometers (integer), from Census 2011 or Wikipedia
- `neighboringDistricts` — **(required)** — Array of slugs of adjacent districts (within Telangana only — don't include neighbors in other states). Slugs use lowercase hyphenated names, e.g. `kumuram-bheem-asifabad`, `medchal-malkajgiri`, `jayashankar-bhupalapally`. See "Slug reference" at the end.
- `majorTowns` — **(required)** — Array of up to **3** largest towns/cities in the district by population
- `tags` — **(optional)** — Array of descriptive tags like `"tribal-majority"`, `"agricultural"`, `"border-district"`, `"suburban"`, `"it-corridor"`, `"congress-sweep-2023"`, etc.

### Demographics (Census 2011)
- `population` — **(required)** — 2011 census population (integer)
- `populationYear` — **(required)** — Always `2011` for the above
- `populationProjected` — **(optional)** — 2024 estimated population if available from state govt or reliable projection
- `literacyRate` — **(optional)** — Percentage, 1 decimal place (e.g. `60.26`)
- `sexRatio` — **(optional)** — Females per 1000 males (integer, e.g. `1009`)
- `tribalPopulation` — **(optional)** — ST population as percentage (e.g. `28.07`). Only include for districts where ST % is significant (>5%).

### Political geography
- `assembly.count` — **(required)** — Number of Legislative Assembly (MLA) constituencies in the district
- `assembly.constituencies` — **(required)** — Array of AC names (e.g. `["Karimnagar", "Choppadandi", "Manakondur", "Huzurabad"]`)
- `lokSabha` — **(required)** — Array of Lok Sabha (MP) constituency names that this district falls under. Most districts fall under 1 LS seat; some (like Rangareddy) fall under 2+.

### Current representatives
- `mlas` — **(required)** — Array of current MLAs (winners of the December 2023 Telangana Assembly election). Each entry:
  - `constituency` — name of the AC
  - `name` — full name of the winning MLA
  - `party` — one of exactly: `INC` (Congress), `BRS`, `BJP`, `AIMIM`, `CPI`, `CPI(M)`, `Independent`, or other. Use these exact codes.
  - `since` — `2023-12-07` (date government was formed)

- `mps` — **(required)** — Array of current MPs (winners of the June 2024 Lok Sabha election) for every LS constituency overlapping this district. Each entry:
  - `constituency`, `name`, `party` (same codes as MLAs), `since` — always `2024-06-04`

### Administration (transfer-prone — include a verification date)
- `collector` — **(optional)** — Current District Collector (IAS officer):
  - `name` — full name
  - `title` — usually `"IAS"` or `"IAS (2010 batch)"` if you know the batch year
  - `since` — date they assumed office, YYYY-MM-DD, if known
  - `verifiedOn` — the date you verified this (today's date in the research)

- `policeChief` — **(optional)** — Current District SP (Superintendent of Police) or Commissioner of Police for the district:
  - `name`, `title` (e.g. `"IPS"` or `"IPS (1996 batch)"`)
  - `rank` — one of: `Commissioner` | `Superintendent` | `DCP`
  - `since` — YYYY-MM-DD if known
  - `verifiedOn` — date verified

- `policeStationsCount` — **(optional)** — Total number of law & order police stations in the district commissionerate/SP jurisdiction

- `mayor` — **(optional, only if the district has a Municipal Corporation)** — Current Mayor:
  - `name`, `title` (e.g. `"Mayor"` or `"Municipal Chairperson"`), `party`, `since`, `verifiedOn`

- `municipalBody` — **(optional)** — Primary urban local body:
  - `name` — e.g. `"Karimnagar Municipal Corporation"`
  - `type` — one of exactly: `"Municipal Corporation"` | `"Municipality"` | `"Nagar Panchayat"` | `"Gram Panchayat network"`

### Sources
- `sources` — **(required)** — Array of the URLs you used. Each entry: `url` + `description` (short, one line). Aim for 3–6 sources per district.

---

## Output format

Return a single document with one section per district, in this exact markdown template:

```markdown
## Karimnagar

- slug: karimnagar
- name: Karimnagar
- nameTelugu: కరీంనగర్
- hq: Karimnagar
- formed: 2016-10-11
- region: northern-telangana
- coordinates: [18.4386, 79.1288]
- area: 2128
- neighboringDistricts: [jagtial, rajanna-sircilla, siddipet, peddapalli, sangareddy]
- majorTowns: [Karimnagar, Huzurabad, Jammikunta]
- tags: [northern-tg, agricultural, historically-brs]

### Demographics (2011)
- population: 1005711
- populationYear: 2011
- literacyRate: 64.65
- sexRatio: 997

### Political geography
- assembly.count: 4
- assembly.constituencies: [Karimnagar, Choppadandi, Manakondur, Huzurabad]
- lokSabha: [Karimnagar]

### MLAs (2023)
- Karimnagar — Gangula Kamalakar — BRS — 2023-12-07
- Choppadandi — Medipalli Satyam — BRS — 2023-12-07
- Manakondur — Kavvampally Satyanarayana — INC — 2023-12-07
- Huzurabad — Padi Kaushik Reddy — INC — 2023-12-07

### MPs (2024)
- Karimnagar — Bandi Sanjay Kumar — BJP — 2024-06-04

### Administration
- collector: { name: "Pamela Satpathy", title: "IAS", verifiedOn: 2026-04-23 }
- policeChief: { name: "[name]", rank: "Superintendent", title: "IPS", verifiedOn: 2026-04-23 }
- policeStationsCount: 34
- municipalBody: { name: "Karimnagar Municipal Corporation", type: "Municipal Corporation" }

### Sources
1. https://karimnagar.telangana.gov.in/ — Karimnagar District official portal
2. https://en.wikipedia.org/wiki/Karimnagar_district — Wikipedia
3. https://www.myneta.info/Telangana2023/index.php?action=show_winners — MyNeta 2023 winners
4. https://results.eci.gov.in/ — Election Commission of India
5. https://tspolice.gov.in/ — Telangana State Police

---
```

**Important:**
- Use YAML-like `key: value` format for simple fields
- Use the `{ key: "value" }` inline object form only for the administrative fields (`collector`, `policeChief`, `mayor`, `municipalBody`)
- Keep arrays in `[item, item, item]` form
- Separate each district with a `---` horizontal rule so I can parse them individually
- **If a required field isn't verifiable, omit the entire district from the output and list it in a "Could not complete" section at the end**

---

## Primary sources to use (in priority order)

1. **District government portal** — `https://<slug>.telangana.gov.in/` (e.g. `https://karimnagar.telangana.gov.in/`) — best source for HQ, demographics, current Collector (look at "Who's Who" pages)
2. **Wikipedia** (English) — `https://en.wikipedia.org/wiki/<District>_district` — good cross-check for demographics, neighbors, ACs, LS constituency
3. **MyNeta.info** — `https://www.myneta.info/Telangana2023/index.php?action=show_winners` — authoritative 2023 Assembly winners with party
4. **Election Commission of India** — `https://results.eci.gov.in/` — 2024 Lok Sabha winners per constituency
5. **Telangana State Police** — `https://tspolice.gov.in/` — current SPs and station counts
6. **Telangana Legislative Assembly** — `https://telanganalegislature.gov.in/` — current MLA list
7. **MyNeta LS 2024** — `https://www.myneta.info/LokSabha2024/` — 2024 MP winners

**Transfer-prone caveat:** Collector, Police chief, and Mayor rotate frequently (typically 2-year postings). If the district portal's "Who's Who" page is older than 12 months, flag it as unverifiable rather than guessing.

---

## Slug reference (use these exact strings for `neighboringDistricts`)

```
adilabad, bhadradri-kothagudem, hanumakonda, hyderabad, jagtial, jangaon,
jayashankar-bhupalapally, jogulamba-gadwal, kamareddy, karimnagar, khammam,
kumuram-bheem-asifabad, mahabubabad, mahabubnagar, mancherial, medak,
medchal-malkajgiri, mulugu, nagarkurnool, nalgonda, narayanpet, nirmal,
nizamabad, peddapalli, rajanna-sircilla, rangareddy, sangareddy, siddipet,
suryapet, vikarabad, wanaparthy, warangal, yadadri-bhuvanagiri
```

---

## Quality standards

- **Accuracy first.** A missing field is much better than a wrong field. Voters read this site; wrong MLA names are a real problem.
- **Use official sources over news for facts.** For an MLA's name, trust ECI > Assembly website > MyNeta > news articles.
- **Party code consistency.** Use `INC` everywhere for Congress, not `Congress` or `Indian National Congress`. Same for `BRS`, `BJP`, `AIMIM`.
- **Cross-reference when possible.** If Wikipedia and the district portal disagree on population, check Census 2011 directly.
- **When unsure, mark `unknown` and move on.** Do not invent.

---

Return the full document when complete. I'll parse it and populate the tracker's metadata file.
