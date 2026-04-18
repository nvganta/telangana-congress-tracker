# District-Level Data Sources — Telangana

A catalog of public sources we can use to research each of the 33 districts. Organized by what each source provides. Before we go district-by-district, we pick which sources are canonical for which fields.

---

## 1. Official government portals

### 1a. District government websites
Every district has a subdomain of `telangana.gov.in`. Pattern:
```
https://<district-slug>.telangana.gov.in/
```
Examples:
- https://adilabad.telangana.gov.in/
- https://hyderabad.telangana.gov.in/
- https://karimnagar.telangana.gov.in/
- https://warangal.telangana.gov.in/

**What's there:** About page, District Collector name + photo, district profile (population, area, HQ), administrative structure (mandals, revenue divisions), tourism, schemes, "Who's Who" of district officers, contact directory.
**Reliability:** High — primary source.
**Freshness:** Moderate — Collector photos often outdated, but basic district data stable.

### 1b. Telangana Open Data Portal
https://data.telangana.gov.in/
**What's there:** 658+ datasets at district / mandal / village granularity — budget, transport, education, agriculture, health. API access available.
**Reliability:** High — govt published.
**Freshness:** Varies per dataset.

### 1c. Directorate of Economics & Statistics, Telangana
https://ecostat.telangana.gov.in/
**What's there:** District Statistical Handbooks — annual publications with per-district demographic, economic, agricultural data.
**Reliability:** High.
**Freshness:** Annual.

### 1d. Revenue Department, Telangana
**What's there:** Revenue divisions, mandals, village lists per district; land records via Dharani (dharani.telangana.gov.in).

---

## 2. Elected representatives (MLAs, MPs)

### 2a. Election Commission of India
https://eci.gov.in/
https://results.eci.gov.in/
**What's there:** Candidate lists, winners, vote shares, turnout — all constituencies, all elections. Archived election results.
**Reliability:** Highest — authoritative.
**Freshness:** Current until next election.

### 2b. Chief Electoral Officer, Telangana
https://ceotelangana.nic.in/
**What's there:** State-specific electoral data — constituency-wise voters, polling stations, voter rolls.

### 2c. Telangana Legislative Assembly
https://telanganalegislature.gov.in/
**What's there:** Current MLAs (with photos, contacts, constituencies), committees, bills, debates.
**Reliability:** Highest — official assembly source.
**Freshness:** Current.

### 2d. Lok Sabha (Indian Parliament)
https://sansad.in/ls
**What's there:** Current MPs with photos, constituencies, debates, party affiliations.
**Reliability:** Highest.
**Freshness:** Current.

### 2e. MyNeta.info (Association for Democratic Reforms)
https://myneta.info/
**What's there:** MLA/MP affidavits — assets, liabilities, education, pending criminal cases. Searchable by constituency or candidate.
**Reliability:** High — based on self-submitted affidavits.
**Freshness:** Per election cycle.

### 2f. PRS Legislative Research
https://prsindia.org/
**What's there:** Policy analysis, bill tracking, legislative performance metrics. Good for "what has this MLA voted on."

---

## 3. Police & law enforcement

### 3a. Telangana State Police
https://tspolice.gov.in/
**What's there:** Police hierarchy, commissionerates (Hyderabad, Cyberabad, Rachakonda have CPs — other districts have SPs), station locations, officers.
**Reliability:** Highest.
**Freshness:** Moderate — transfers happen every 2–3 years.

### 3b. Bureau of Police Research & Development
https://bprd.nic.in/
**What's there:** Police station counts per state / district, crime statistics. Data usually a year or two behind.

### 3c. National Crime Records Bureau
https://ncrb.gov.in/
**What's there:** Crime data per state and city — annual reports with per-district breakdowns.
**Freshness:** Annual, ~18 month lag.

---

## 4. Local government / urban bodies

### 4a. Telangana State Election Commission
https://tsec.cgg.gov.in/
**What's there:** Local body elections — mayors, municipal chairpersons, ward members, sarpanches, ZPTC / MPTC members.
**Reliability:** Highest.
**Freshness:** Per local election cycle.

### 4b. Greater Hyderabad Municipal Corporation
https://ghmc.gov.in/
**What's there:** Hyderabad-specific — mayor, corporators (150 wards), zones, budgets, ward officers.
**Relevance:** Hyderabad + parts of Rangareddy / Medchal-Malkajgiri.

### 4c. Commissioner & Director of Municipal Administration (CDMA)
https://cdma.telangana.gov.in/
**What's there:** ~140 municipalities — municipal chairpersons, commissioners, ward info for every city/town except Hyderabad.

### 4d. Panchayat Raj Department
https://tspri.cgg.gov.in/
**What's there:** ~12,700 gram panchayats, sarpanches, panchayat secretaries, mandal development officers (MPDOs).

---

## 5. Census & demographics

### 5a. Census of India (2011)
https://censusindia.gov.in/
**What's there:** Definitive per-district population, literacy, sex ratio, tribal population, urban/rural split.
**Caveat:** 2011 data — we need to note the year and supplement with NFHS-5 (2019–21) or government projections for current estimates.

### 5b. National Family Health Survey (NFHS-5)
https://rchiips.org/nfhs/nfhs5.shtml
**What's there:** District-level health and demographic indicators (more recent than Census 2011). Useful for infant mortality, women's health, nutrition.

### 5c. Agricultural Census
https://agcensus.dacnet.nic.in/
**What's there:** District-wise landholdings, crop patterns, farmer categories (for farm-heavy districts).

---

## 6. Audit & oversight

### 6a. Comptroller & Auditor General of India
https://cag.gov.in/en/audit-report?state=telangana
**What's there:** Independent audits of state finances and scheme implementation — sometimes broken down by district.

---

## 7. News & current affairs (per-district tagging)

### 7a. Telangana Today
https://telanganatoday.com/
Has city/district-specific sections.

### 7b. The Hindu — Telangana
https://www.thehindu.com/news/national/telangana/
Respected national daily with strong Hyderabad bureau + district coverage.

### 7c. Deccan Chronicle
https://www.deccanchronicle.com/
Hyderabad-based, deep state coverage.

### 7d. The South First
https://thesouthfirst.com/telangana/
Digital-first with investigative reporting on specific districts.

### 7e. Eenadu (Telugu) + Sakshi (Telugu)
https://www.eenadu.net/telangana
https://www.sakshi.com/telangana
Widest reach in regional language — crucial for local news.

### 7f. Google News RSS queries
Per-district queries already used in existing `lib/rss.ts` (step 10 in the plan extends this to per-district tagging).

---

## 8. Secondary / aggregator sources

### 8a. Wikipedia (English)
Per-district pages generally well-referenced; useful for cross-checking an official source but never primary.

### 8b. Wikipedia (Telugu)
Often has more local detail than the English version for Telangana districts.

### 8c. IndiaVotes
https://www.indiavotes.com/
Constituency-level election history with charts.

### 8d. Telangana Navanirmana Vedika / local civic groups
Varies by district; surface via news archives.

---

## 9. Geospatial

### 9a. OpenStreetMap
Amenities (police stations, hospitals, schools) as POIs with geo-coordinates. Queryable via Overpass.

### 9b. ISRO Bhuvan
https://bhuvan.nrsc.gov.in/
Official Indian GIS platform — administrative boundaries, thematic layers.

---

## Proposed source-to-field mapping (what we use for what)

| Field | Primary source | Backup |
|---|---|---|
| District name (EN/Telugu), HQ | District `.gov.in` portal | Wikipedia |
| Population, area, literacy, sex ratio | Census 2011 + NFHS-5 | District portal "About" |
| Assembly constituencies (list) | Telangana Legislative Assembly | ECI |
| MLAs (name, party, since) | Telangana Legislative Assembly | ECI results |
| Lok Sabha constituencies | ECI | Sansad.in |
| MPs | Sansad.in | ECI |
| Collector (name, since) | District `.gov.in` portal | News transfer reports |
| Police chief (CP / SP, rank, since) | tspolice.gov.in | News |
| Police stations count | tspolice.gov.in or BPRD | NCRB |
| Mayor / Municipal Chairperson | GHMC / CDMA / TSEC | News |
| Major towns | District `.gov.in` portal | Wikipedia |
| Farmer suicides | Existing `data/districts.json` (from Telangana Today reporting) | CAG |
| News headlines | Google News RSS (per-district keyword) — existing infra | Direct feeds |

---

## Open questions on freshness

Three fields are **transfer-prone** and will go stale unless we update them:
1. **District Collector** — typically 2-year tenure, but cadre-dependent
2. **Police chief (CP / SP)** — often 1.5–2 year tenure
3. **Mayor / Municipal Chairperson** — 5-year term but by-elections happen

For these three fields, we should:
- Include a `verifiedOn: YYYY-MM-DD` field in the schema per entry
- Flag on the district page if the date is >6 months old
- Accept that these may be stale in the public-facing UI rather than pretend we're real-time

---

## Proposed research workflow (once user approves)

1. Pick a pilot district (e.g. Adilabad — already partially done).
2. Walk through Sources 1a → 9b in order, fill metadata JSON as we go.
3. Document *where each value came from* in the `sources[]` array per district.
4. Lock the pattern.
5. Scale to the remaining 32 districts in batches (5–8 at a time for review).
