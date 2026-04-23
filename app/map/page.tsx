import type { Metadata } from "next";
import MapView from "@/components/map/MapView";
import {
  GEOJSON_NAME_TO_SLUG,
  getMapProjection,
} from "@/lib/map-projection";
import { fetchNewsByDistrict } from "@/lib/rss";
import districtsMetadata from "@/data/districts-metadata.json";
import type { DistrictMetadata } from "@/lib/districts";

export const metadata: Metadata = {
  title: "Interactive District Map | Telangana Tracker",
  description:
    "Explore Telangana's 33 districts on an interactive map. Click any district to see demographics, representatives, and accountability data.",
};

export default async function MapPage() {
  const projection = getMapProjection(1000, 700);
  const metadataBySlug = districtsMetadata as unknown as Record<
    string,
    DistrictMetadata
  >;

  // Use the canonical geojson→slug map from map-projection.ts so that ALL
  // 33 districts are addressable, not just the ones with metadata filled in.
  const geojsonToSlug: Record<string, string> = { ...GEOJSON_NAME_TO_SLUG };

  // Fetch district-tagged news on the server. Cached 30min via the RSS layer.
  // If fetch fails, fall back to empty map — the UI gracefully shows placeholders.
  let newsByDistrictSlug: Record<string, import("@/lib/types").NewsItem[]> = {};
  try {
    newsByDistrictSlug = await fetchNewsByDistrict(120, 3);
  } catch {
    newsByDistrictSlug = {};
  }

  return (
    <div className="fade-in">
      <div className="mb-4">
        <h1 className="text-lg font-bold tracking-[0.15em]">
          DISTRICT <span className="neon-text-blue">MAP</span>
        </h1>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          33 DISTRICTS — CLICK ANY DISTRICT FOR A PREVIEW · FULL PROFILE ON
          DEDICATED PAGE
        </p>
      </div>

      <MapView
        projection={projection}
        metadataBySlug={metadataBySlug}
        geojsonToSlug={geojsonToSlug}
        newsByDistrictSlug={newsByDistrictSlug}
      />

      <div className="mt-4 text-[10px] text-text-muted/80">
        District boundaries from public GeoJSON (udit-001/india-maps-data,
        derived from Census of India). Names reflect current post-2019
        33-district organization. Farmer suicide data from Telangana state
        records.
      </div>
    </div>
  );
}
