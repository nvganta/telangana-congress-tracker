import metadata from "@/data/districts-metadata.json";

export type Region =
  | "hyderabad-metro"
  | "northern-telangana"
  | "southern-telangana"
  | "eastern-telangana"
  | "western-telangana";

export interface MLA {
  constituency: string;
  name: string;
  party: string;
  since?: string;
}

export interface MP {
  constituency: string;
  name: string;
  party: string;
  since?: string;
}

export interface DistrictSource {
  url: string;
  description: string;
}

export interface OfficialEntry {
  name: string;
  title?: string;
  party?: string;
  since?: string;
  verifiedOn: string;
}

export interface MunicipalBody {
  name: string;
  type:
    | "Municipal Corporation"
    | "Municipality"
    | "Nagar Panchayat"
    | "Gram Panchayat network";
}

export interface DistrictMetadata {
  slug: string;
  name: string;
  nameTelugu: string;
  geojsonName: string;
  dtCode: number;
  hq: string;
  formed: string;
  region: Region;
  population: number;
  populationYear: number;
  populationProjected?: number;
  area: number;
  literacyRate?: number;
  sexRatio?: number;
  tribalPopulation?: number;
  coordinates: [number, number];
  assembly: {
    count: number;
    constituencies: string[];
  };
  lokSabha: string[];
  mlas: MLA[];
  mps: MP[];
  majorTowns: string[];
  neighboringDistricts: string[];
  tags: string[];
  collector?: OfficialEntry;
  policeChief?: OfficialEntry & {
    rank?: "Commissioner" | "Superintendent" | "DCP";
  };
  policeStationsCount?: number;
  mayor?: OfficialEntry;
  municipalBody?: MunicipalBody;
  sources: DistrictSource[];
  lastUpdated: string;
}

export function dominantParty(mlas: MLA[]): string | null {
  if (mlas.length === 0) return null;
  const counts = new Map<string, number>();
  for (const m of mlas) counts.set(m.party, (counts.get(m.party) ?? 0) + 1);
  let top = "";
  let best = 0;
  let tie = false;
  for (const [party, c] of counts.entries()) {
    if (c > best) {
      top = party;
      best = c;
      tie = false;
    } else if (c === best) {
      tie = true;
    }
  }
  return tie ? null : top;
}

const districts = metadata as unknown as Record<string, DistrictMetadata>;

export function getAllDistricts(): DistrictMetadata[] {
  return Object.values(districts).sort((a, b) => a.name.localeCompare(b.name));
}

export function getDistrictSlugs(): string[] {
  return Object.keys(districts);
}

export function getDistrictBySlug(slug: string): DistrictMetadata | null {
  return districts[slug] ?? null;
}

export function getDistrictByGeojsonName(
  geojsonName: string
): DistrictMetadata | null {
  return (
    Object.values(districts).find(
      (d) => d.geojsonName.toLowerCase() === geojsonName.toLowerCase()
    ) ?? null
  );
}

export function getDistrictByName(name: string): DistrictMetadata | null {
  const normalized = name.toLowerCase().trim();
  return (
    Object.values(districts).find(
      (d) =>
        d.name.toLowerCase() === normalized ||
        d.geojsonName.toLowerCase() === normalized
    ) ?? null
  );
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}
