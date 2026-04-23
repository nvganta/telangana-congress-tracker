import fs from "node:fs";
import path from "node:path";
import { geoMercator, geoPath } from "d3-geo";
import type {
  Feature,
  FeatureCollection,
  Geometry,
  Polygon,
  MultiPolygon,
  Position,
} from "geojson";

/**
 * Ramer-Douglas-Peucker line simplification.
 * Reduces vertex count while preserving shape within the given tolerance.
 * Tolerance is in the same units as the input coordinates (degrees for lng/lat).
 */
function rdp(points: Position[], tolerance: number): Position[] {
  if (points.length < 3) return points;
  let maxDist = 0;
  let maxIndex = 0;
  const last = points.length - 1;
  for (let i = 1; i < last; i++) {
    const d = perpendicularDistance(points[i], points[0], points[last]);
    if (d > maxDist) {
      maxDist = d;
      maxIndex = i;
    }
  }
  if (maxDist > tolerance) {
    const left = rdp(points.slice(0, maxIndex + 1), tolerance);
    const right = rdp(points.slice(maxIndex), tolerance);
    return [...left.slice(0, -1), ...right];
  }
  return [points[0], points[last]];
}

function perpendicularDistance(
  p: Position,
  a: Position,
  b: Position
): number {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  const mag = Math.hypot(dx, dy);
  if (mag === 0) return Math.hypot(px - ax, py - ay);
  const u = ((px - ax) * dx + (py - ay) * dy) / (mag * mag);
  const cx = ax + u * dx;
  const cy = ay + u * dy;
  return Math.hypot(px - cx, py - cy);
}

function simplifyRing(ring: Position[], tolerance: number): Position[] {
  if (ring.length < 4) return ring;
  // Preserve closure: simplify an open version, re-close
  const first = ring[0];
  const last = ring[ring.length - 1];
  const isClosed = first[0] === last[0] && first[1] === last[1];
  const open = isClosed ? ring.slice(0, -1) : ring;
  const simplified = rdp(open, tolerance);
  if (simplified.length < 3) return ring;
  return [...simplified, simplified[0]];
}

/**
 * Chaikin's corner-cutting algorithm.
 * Each iteration replaces every vertex with two new points at 25% and 75%
 * along its adjacent edges. Produces visibly smoother curves from angular
 * polygons. 2 iterations is the sweet spot — smooth curves without
 * significant shape shrinkage.
 */
function chaikin(ring: Position[], iterations: number): Position[] {
  if (ring.length < 3 || iterations <= 0) return ring;
  let result: Position[] = ring;
  for (let k = 0; k < iterations; k++) {
    const n = result.length;
    const first = result[0];
    const last = result[n - 1];
    const isClosed = first[0] === last[0] && first[1] === last[1];
    const pts = isClosed ? result.slice(0, -1) : result;
    const m = pts.length;
    const next: Position[] = [];
    for (let i = 0; i < m; i++) {
      const p0 = pts[i];
      const p1 = pts[(i + 1) % m];
      next.push([
        0.75 * p0[0] + 0.25 * p1[0],
        0.75 * p0[1] + 0.25 * p1[1],
      ]);
      next.push([
        0.25 * p0[0] + 0.75 * p1[0],
        0.25 * p0[1] + 0.75 * p1[1],
      ]);
    }
    if (isClosed) next.push(next[0]);
    result = next;
  }
  return result;
}

/**
 * Reverse a ring's winding direction (preserving the closing point).
 * Used when GeoJSON data has rings wound opposite to d3-geo's expectation
 * (d3-geo follows the GeoJSON spec: outer rings CCW, holes CW; some source
 * files violate this and need to be flipped).
 */
function reverseRing(ring: Position[]): Position[] {
  if (ring.length < 2) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  const isClosed = first[0] === last[0] && first[1] === last[1];
  if (!isClosed) return [...ring].reverse();
  // Keep the ring closed with the same start/end point after reversal.
  const open = ring.slice(0, -1);
  const reversed = [...open].reverse();
  return [...reversed, reversed[0]];
}

function smoothRing(
  ring: Position[],
  tolerance: number,
  chaikinIterations: number
): Position[] {
  const simplified = simplifyRing(ring, tolerance);
  return chaikin(simplified, chaikinIterations);
}

function smoothGeometry<G extends Geometry>(
  geom: G,
  tolerance: number,
  chaikinIterations: number,
  reverseWinding = false
): G {
  const processRing = (ring: Position[]) => {
    const r = reverseWinding ? reverseRing(ring) : ring;
    return smoothRing(r, tolerance, chaikinIterations);
  };
  if (geom.type === "Polygon") {
    const poly = geom as unknown as Polygon;
    return {
      ...poly,
      coordinates: poly.coordinates.map(processRing),
    } as unknown as G;
  }
  if (geom.type === "MultiPolygon") {
    const multi = geom as unknown as MultiPolygon;
    return {
      ...multi,
      coordinates: multi.coordinates.map((poly) => poly.map(processRing)),
    } as unknown as G;
  }
  return geom;
}

export interface DistrictShape {
  dtCode: number;
  geojsonName: string;
  svgPath: string;
  centroid: [number, number];
  bounds: [[number, number], [number, number]];
}

export interface MandalShape {
  /** Slug of the parent district (from spatial join against current 33-district map) */
  districtSlug: string;
  /** Original mandal name (Title Cased for display) */
  name: string;
  /** Mandal code from source data (stable ID) */
  mandalCode: string;
  svgPath: string;
  centroid: [number, number];
}

export interface MapProjection {
  width: number;
  height: number;
  districts: DistrictShape[];
  /** Mandals grouped by district slug. Populated only if mandal data is available. */
  mandalsBySlug: Record<string, MandalShape[]>;
}

/**
 * Map from the GeoJSON district name to our canonical slug.
 *
 * Source: datta07/INDIAN-SHAPEFILES (MIT, derived from official Census 2016
 * shape files). The file uses some name variants — e.g. "Jagitial" instead
 * of "Jagtial", "Jangoan" instead of "Jangaon", "Jayashankar" instead of
 * "Jayashankar Bhupalapally". Also keeps pre-2021 Warangal Urban/Rural
 * split which maps to Hanumakonda/Warangal respectively.
 *
 * We keep ALL known variants here so the mapping is resilient across
 * source-file swaps.
 */
export const GEOJSON_NAME_TO_SLUG: Record<string, string> = {
  Adilabad: "adilabad",
  "Bhadradri Kothagudem": "bhadradri-kothagudem",
  Hyderabad: "hyderabad",
  Jagtial: "jagtial",
  Jagitial: "jagtial",
  Jangaon: "jangaon",
  Jangoan: "jangaon",
  "Jayashankar Bhupalapally": "jayashankar-bhupalapally",
  Jayashankar: "jayashankar-bhupalapally",
  "Jogulamba Gadwal": "jogulamba-gadwal",
  Kamareddy: "kamareddy",
  Karimnagar: "karimnagar",
  Khammam: "khammam",
  "Komaram Bheem": "kumuram-bheem-asifabad",
  "Kumuram Bheem Asifabad": "kumuram-bheem-asifabad",
  Mahabubabad: "mahabubabad",
  Mahabubnagar: "mahabubnagar",
  Mancherial: "mancherial",
  Medak: "medak",
  "Medchal Malkajgiri": "medchal-malkajgiri",
  "Medchal-Malkajgiri": "medchal-malkajgiri",
  Mulugu: "mulugu",
  Nagarkurnool: "nagarkurnool",
  Nalgonda: "nalgonda",
  Narayanpet: "narayanpet",
  Nirmal: "nirmal",
  Nizamabad: "nizamabad",
  Peddapalli: "peddapalli",
  "Rajanna Sircilla": "rajanna-sircilla",
  "Ranga Reddy": "rangareddy",
  Rangareddy: "rangareddy",
  Sangareddy: "sangareddy",
  Siddipet: "siddipet",
  Suryapet: "suryapet",
  Vikarabad: "vikarabad",
  Wanaparthy: "wanaparthy",
  "Warangal Rural": "warangal",
  Warangal: "warangal",
  "Warangal Urban": "hanumakonda",
  Hanumakonda: "hanumakonda",
  "Yadadri Bhuvanagiri": "yadadri-bhuvanagiri",
};

/** Title-case a SHOUTY mandal name like "ACHAMPET" → "Achampet". */
function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

let cached: MapProjection | null = null;

export function getMapProjection(
  width = 1000,
  height = 700,
  padding = 16
): MapProjection {
  if (cached && cached.width === width && cached.height === height) {
    return cached;
  }

  // Property schema for datta07/INDIAN-SHAPEFILES Telangana data:
  // - districts: { dtname, dtcode11, Dist_LGD, ... }
  // - mandals:   { sdtname, dtname, dtcode11, Subdt_LGD, Dist_LGD, ... }
  // Same source → district + mandal boundaries share vertices = alignment is clean.

  type DistrictProps = {
    dtname: string;
    dtcode11: string;
    Dist_LGD?: number;
  };
  type MandalProps = {
    sdtname: string;
    dtname: string;
    dtcode11: string;
    Subdt_LGD?: number;
  };

  const geojsonPath = path.join(
    process.cwd(),
    "public",
    "geo",
    "telangana-districts.geojson"
  );
  const raw = fs.readFileSync(geojsonPath, "utf-8");
  const collection = JSON.parse(raw) as FeatureCollection<
    Geometry,
    DistrictProps
  >;

  // Smooth geometry for soft-feeling edges.
  // Step 1: RDP simplification at 0.004° (~400m) removes jagged noise vertices.
  // Step 2: 2 iterations of Chaikin's corner-cutting rounds remaining sharp
  //         direction changes into smooth curves.
  // The datta07 source data uses reverse ring winding compared to what
  // d3-geo expects (GeoJSON spec: outer rings CCW, holes CW). Without
  // reversing, d3-geo treats each ring as a hole-of-the-world and appends
  // the viewport rectangle to every feature's path. We flip the winding
  // during preprocessing.
  // Step 1: RDP simplification at 0.004° (~400m) removes jagged vertices.
  // Step 2: 2 Chaikin iterations rounds sharp corners into smooth curves.
  const simplifiedCollection: FeatureCollection<Geometry, DistrictProps> = {
    ...collection,
    features: collection.features.map((f) => ({
      ...f,
      geometry: smoothGeometry(f.geometry, 0.004, 2, true),
    })),
  };

  const projection = geoMercator().fitExtent(
    [
      [padding, padding],
      [width - padding, height - padding],
    ],
    simplifiedCollection
  );

  const pathGen = geoPath(projection);

  // Build a dtcode11 → slug map. District codes (dtcode11) are the stable
  // Census 2011 identifiers — the same in both the district and mandal files.
  // Names are unreliable because the mandal file has inconsistent casing and
  // occasionally different variants ("Mahbubnagar" vs "Mahabubnagar").
  const codeToSlug: Record<string, string> = {};
  for (const feature of simplifiedCollection.features) {
    const code = String(feature.properties.dtcode11);
    const slug = GEOJSON_NAME_TO_SLUG[feature.properties.dtname];
    if (slug) codeToSlug[code] = slug;
  }

  const districts: DistrictShape[] = simplifiedCollection.features.map(
    (feature) => {
      const svgPath = pathGen(feature as Feature<Geometry>) ?? "";
      const centroid = pathGen.centroid(feature as Feature<Geometry>);
      const bounds = pathGen.bounds(feature as Feature<Geometry>);
      return {
        dtCode: Number(feature.properties.dtcode11),
        geojsonName: feature.properties.dtname,
        svgPath,
        centroid: [centroid[0], centroid[1]],
        bounds: [
          [bounds[0][0], bounds[0][1]],
          [bounds[1][0], bounds[1][1]],
        ],
      };
    }
  );

  // ─── Mandals ──────────────────────────────────────────────────────────
  // Mandals come from the SAME authoritative source as districts, so
  // boundaries share vertices (no alignment mismatch). Each mandal declares
  // its parent district via the `dtname` field — no spatial join needed.
  const mandalsBySlug: Record<string, MandalShape[]> = {};
  const mandalsPath = path.join(
    process.cwd(),
    "public",
    "geo",
    "telangana-mandals.geojson"
  );
  let mandalRaw: string | null = null;
  try {
    mandalRaw = fs.readFileSync(mandalsPath, "utf-8");
  } catch {
    // Mandal file missing — return districts-only projection.
  }
  if (mandalRaw) {
    const mandalCollection = JSON.parse(mandalRaw) as FeatureCollection<
      Geometry,
      MandalProps
    >;

    for (const mandal of mandalCollection.features) {
      const mandalName = mandal.properties.sdtname;
      const mandalCode = String(mandal.properties.Subdt_LGD ?? "");
      const parentCode = String(mandal.properties.dtcode11);
      if (!mandalName) continue;

      // Join by dtcode11 (stable Census 2011 code, identical in both files)
      // rather than by name (mandal file has inconsistent casing / variants).
      const parentSlug = codeToSlug[parentCode] ?? null;
      if (!parentSlug) continue;

      // Smooth + project the mandal polygon using the SAME projection as the
      // districts. Also flip ring winding (same reason as districts — source
      // data violates the GeoJSON outer-ring-CCW convention).
      const smoothedGeom = smoothGeometry(mandal.geometry, 0.003, 2, true);
      const smoothedFeature: Feature<Geometry> = {
        ...mandal,
        geometry: smoothedGeom,
      };
      const svgPath = pathGen(smoothedFeature) ?? "";
      const centroid = pathGen.centroid(smoothedFeature);

      if (!mandalsBySlug[parentSlug]) mandalsBySlug[parentSlug] = [];
      mandalsBySlug[parentSlug].push({
        districtSlug: parentSlug,
        name: titleCase(mandalName),
        mandalCode,
        svgPath,
        centroid: [centroid[0], centroid[1]],
      });
    }
  }

  cached = { width, height, districts, mandalsBySlug };
  return cached;
}
