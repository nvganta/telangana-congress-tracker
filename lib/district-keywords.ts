/**
 * Keyword map used to tag news articles to Telangana districts by title matching.
 *
 * Each district has:
 * - slug: URL slug matching data/districts-metadata.json
 * - display: human-readable name
 * - keywords: all-lowercase substrings to search in article titles.
 *   Includes common aliases, historical names (pre-2021 renames), alternate
 *   spellings, and Telugu script for widely-used district names.
 *
 * Rules of thumb when editing:
 * - NEVER include words that are common English (would false-match everything)
 * - Include alternate spellings documented in the GeoJSON / news corpus
 * - Cities inside a district count as district keywords (e.g. Secunderabad → Hyderabad)
 */
export interface DistrictKeywords {
  slug: string;
  display: string;
  keywords: string[];
}

export const DISTRICT_KEYWORDS: DistrictKeywords[] = [
  {
    slug: "adilabad",
    display: "Adilabad",
    keywords: ["adilabad", "ఆదిలాబాద్"],
  },
  {
    slug: "bhadradri-kothagudem",
    display: "Bhadradri Kothagudem",
    keywords: ["bhadradri", "kothagudem", "paloncha", "bhadrachalam"],
  },
  {
    slug: "hanumakonda",
    display: "Hanumakonda",
    keywords: ["hanumakonda", "hanamkonda", "warangal urban"],
  },
  {
    slug: "hyderabad",
    display: "Hyderabad",
    keywords: [
      "hyderabad",
      "secunderabad",
      "charminar",
      "jubilee hills",
      "banjara hills",
      "old city",
      "ghmc",
      "హైదరాబాద్",
    ],
  },
  {
    slug: "jagtial",
    display: "Jagtial",
    keywords: ["jagtial", "jagityal"],
  },
  {
    slug: "jangaon",
    display: "Jangaon",
    keywords: ["jangaon", "jangoan"],
  },
  {
    slug: "jayashankar-bhupalapally",
    display: "Jayashankar Bhupalapally",
    keywords: ["bhupalapally", "jayashankar", "bhupalpally"],
  },
  {
    slug: "jogulamba-gadwal",
    display: "Jogulamba Gadwal",
    keywords: ["jogulamba", "gadwal"],
  },
  {
    slug: "kamareddy",
    display: "Kamareddy",
    keywords: ["kamareddy", "kamareddi"],
  },
  {
    slug: "karimnagar",
    display: "Karimnagar",
    keywords: ["karimnagar", "కరీంనగర్"],
  },
  {
    slug: "khammam",
    display: "Khammam",
    keywords: ["khammam", "ఖమ్మం"],
  },
  {
    slug: "kumuram-bheem-asifabad",
    display: "Kumuram Bheem Asifabad",
    keywords: ["kumuram bheem", "komaram bheem", "asifabad", "kumurambheem"],
  },
  {
    slug: "mahabubabad",
    display: "Mahabubabad",
    keywords: ["mahabubabad", "mahbubabad"],
  },
  {
    slug: "mahabubnagar",
    display: "Mahabubnagar",
    keywords: ["mahabubnagar", "mahbubnagar", "palamuru"],
  },
  {
    slug: "mancherial",
    display: "Mancherial",
    keywords: ["mancherial", "mancheriyal"],
  },
  {
    slug: "medak",
    display: "Medak",
    keywords: ["medak"],
  },
  {
    slug: "medchal-malkajgiri",
    display: "Medchal-Malkajgiri",
    keywords: ["medchal", "malkajgiri", "kompally", "alwal"],
  },
  {
    slug: "mulugu",
    display: "Mulugu",
    keywords: ["mulugu"],
  },
  {
    slug: "nagarkurnool",
    display: "Nagarkurnool",
    keywords: ["nagarkurnool", "nagar kurnool"],
  },
  {
    slug: "nalgonda",
    display: "Nalgonda",
    keywords: ["nalgonda", "నల్గొండ"],
  },
  {
    slug: "narayanpet",
    display: "Narayanpet",
    keywords: ["narayanpet", "narayanpeta"],
  },
  {
    slug: "nirmal",
    display: "Nirmal",
    keywords: ["nirmal"],
  },
  {
    slug: "nizamabad",
    display: "Nizamabad",
    keywords: ["nizamabad", "నిజామాబాద్"],
  },
  {
    slug: "peddapalli",
    display: "Peddapalli",
    keywords: ["peddapalli", "peddapally"],
  },
  {
    slug: "rajanna-sircilla",
    display: "Rajanna Sircilla",
    keywords: ["rajanna sircilla", "sircilla", "rajanna"],
  },
  {
    slug: "rangareddy",
    display: "Rangareddy",
    keywords: ["rangareddy", "ranga reddy", "rr district", "ibrahimpatnam"],
  },
  {
    slug: "sangareddy",
    display: "Sangareddy",
    keywords: ["sangareddy", "sanga reddy", "patancheru", "zaheerabad"],
  },
  {
    slug: "siddipet",
    display: "Siddipet",
    keywords: ["siddipet", "siddipeta"],
  },
  {
    slug: "suryapet",
    display: "Suryapet",
    keywords: ["suryapet", "suryapeta"],
  },
  {
    slug: "vikarabad",
    display: "Vikarabad",
    keywords: ["vikarabad", "vikarabadh"],
  },
  {
    slug: "wanaparthy",
    display: "Wanaparthy",
    keywords: ["wanaparthy", "wanaparthi"],
  },
  {
    slug: "warangal",
    display: "Warangal",
    keywords: ["warangal rural", "warangal district"],
    // Note: "warangal" alone is intentionally NOT here because historical Warangal district
    // was split into Warangal + Hanumakonda in 2021; plain "warangal" in headlines is ambiguous
    // and usually refers to the urban Hanumakonda side. Deliberate conservative tagging.
  },
  {
    slug: "yadadri-bhuvanagiri",
    display: "Yadadri Bhuvanagiri",
    keywords: ["yadadri", "bhuvanagiri", "bhongir"],
  },
];

/**
 * Given a news article title, return the slugs of every district it mentions.
 * Matches substrings (case-insensitive) against every district's keyword list.
 * A single article may be tagged to multiple districts.
 */
export function tagDistricts(title: string): string[] {
  const lower = title.toLowerCase();
  const hits: string[] = [];
  for (const d of DISTRICT_KEYWORDS) {
    for (const kw of d.keywords) {
      if (lower.includes(kw)) {
        hits.push(d.slug);
        break;
      }
    }
  }
  return hits;
}
