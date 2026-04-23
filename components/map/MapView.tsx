"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type {
  DistrictShape,
  MandalShape,
  MapProjection,
} from "@/lib/map-projection";
import type {
  DistrictMetadata,
  MLA,
  MP,
  OfficialEntry,
} from "@/lib/districts";
import { dominantParty } from "@/lib/districts";
import type { NewsItem } from "@/lib/types";

interface DistrictLike {
  slug: string | null;
  name: string;
  nameTelugu?: string;
  hq?: string;
  assemblyCount?: number;
  mlas?: MLA[];
  mps?: MP[];
  rulingParty?: string | null;
  collector?: OfficialEntry;
  policeChief?: (OfficialEntry & { rank?: string }) | undefined;
  policeStationsCount?: number;
  mayor?: OfficialEntry;
  hasFullData: boolean;
  region?: string;
}

interface MapViewProps {
  projection: MapProjection;
  metadataBySlug: Record<string, DistrictMetadata>;
  geojsonToSlug: Record<string, string>;
  newsByDistrictSlug: Record<string, NewsItem[]>;
}

export default function MapView({
  projection,
  metadataBySlug,
  geojsonToSlug,
  newsByDistrictSlug,
}: MapViewProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredMandal, setHoveredMandal] = useState<string | null>(null);
  const [selectedGeojsonName, setSelectedGeojsonName] = useState<string | null>(
    null
  );

  const resolveDistrict = useCallback(
    (geojsonName: string): DistrictLike => {
      const slug = geojsonToSlug[geojsonName] ?? null;
      const meta = slug ? metadataBySlug[slug] : null;
      if (meta) {
        return {
          slug: meta.slug,
          name: meta.name,
          nameTelugu: meta.nameTelugu,
          hq: meta.hq,
          assemblyCount: meta.assembly.count,
          mlas: meta.mlas,
          mps: meta.mps,
          rulingParty: dominantParty(meta.mlas),
          collector: meta.collector,
          policeChief: meta.policeChief,
          policeStationsCount: meta.policeStationsCount,
          mayor: meta.mayor,
          hasFullData: true,
          region: meta.region,
        };
      }
      return {
        slug,
        name: geojsonName,
        hasFullData: false,
      };
    },
    [geojsonToSlug, metadataBySlug]
  );

  const selectedDistrict = useMemo<DistrictLike | null>(
    () => (selectedGeojsonName ? resolveDistrict(selectedGeojsonName) : null),
    [selectedGeojsonName, resolveDistrict]
  );

  const hoveredDistrict = useMemo<DistrictLike | null>(
    () => (hovered ? resolveDistrict(hovered) : null),
    [hovered, resolveDistrict]
  );

  const zoomTransform = useMemo(() => {
    if (!selectedGeojsonName) return "translate(0px, 0px) scale(1)";
    const shape = projection.districts.find(
      (d) => d.geojsonName === selectedGeojsonName
    );
    if (!shape) return "translate(0px, 0px) scale(1)";
    const [[minX, minY], [maxX, maxY]] = shape.bounds;
    const dWidth = Math.max(maxX - minX, 1);
    const dHeight = Math.max(maxY - minY, 1);
    const padding = 40;
    const scaleX = (projection.width - 2 * padding) / dWidth;
    const scaleY = (projection.height - 2 * padding) / dHeight;
    const scale = Math.min(scaleX, scaleY, 6);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const tx = projection.width / 2 - cx * scale;
    const ty = projection.height / 2 - cy * scale;
    return `translate(${tx}px, ${ty}px) scale(${scale})`;
  }, [selectedGeojsonName, projection]);

  const isZoomed = Boolean(selectedGeojsonName);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedGeojsonName(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Clear mandal hover when district selection changes
  useEffect(() => {
    setHoveredMandal(null);
  }, [selectedGeojsonName]);

  const handleClick = (geojsonName: string) => {
    setSelectedGeojsonName((prev) => (prev === geojsonName ? null : geojsonName));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 relative">
      {/* Map */}
      <div className="glow-card p-2 relative overflow-hidden">
        <svg
          viewBox={`0 0 ${projection.width} ${projection.height}`}
          className="w-full h-auto"
          role="img"
          aria-label="Map of Telangana districts"
        >
          {/* Background rect catches outside clicks — always full viewport */}
          <rect
            x={0}
            y={0}
            width={projection.width}
            height={projection.height}
            fill="transparent"
            onClick={() => setSelectedGeojsonName(null)}
          />

          {/* Zoomable group — contains all district paths and labels.
              Scales and translates to frame the selected district. */}
          <g
            style={{
              transform: zoomTransform,
              transformOrigin: "0px 0px",
              transition:
                "transform 650ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {projection.districts.map((d) => {
              const isSelected = selectedGeojsonName === d.geojsonName;
              const isHovered = hovered === d.geojsonName;
              const isDimmed = selectedGeojsonName && !isSelected;

              return (
                <DistrictPath
                  key={d.dtCode}
                  shape={d}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  isDimmed={Boolean(isDimmed)}
                  onEnter={() => setHovered(d.geojsonName)}
                  onLeave={() =>
                    setHovered((cur) => (cur === d.geojsonName ? null : cur))
                  }
                  onClick={() => handleClick(d.geojsonName)}
                />
              );
            })}

            {/* Mandal overlay — only when zoomed into a district.
                Renders the sub-divisions of the selected district on top
                of the district shape. */}
            {isZoomed && selectedDistrict?.slug && (
              <g className="mandal-layer">
                {(projection.mandalsBySlug[selectedDistrict.slug] ?? []).map(
                  (mandal) => {
                    const isMandalHovered =
                      hoveredMandal === mandal.mandalCode;
                    return (
                      <path
                        key={mandal.mandalCode}
                        d={mandal.svgPath}
                        fill={
                          isMandalHovered
                            ? "rgba(0, 153, 255, 0.35)"
                            : "rgba(0, 153, 255, 0.1)"
                        }
                        stroke={
                          isMandalHovered
                            ? "#ffffff"
                            : "rgba(230, 237, 243, 0.55)"
                        }
                        strokeWidth={isMandalHovered ? 1.8 : 1.1}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        className="district-path"
                        style={{
                          cursor: "pointer",
                          outline: "none",
                          transition:
                            "fill 0.2s ease-out, stroke 0.2s ease-out, stroke-width 0.2s ease-out",
                        }}
                        onMouseEnter={() => setHoveredMandal(mandal.mandalCode)}
                        onMouseLeave={() =>
                          setHoveredMandal((cur) =>
                            cur === mandal.mandalCode ? null : cur
                          )
                        }
                      />
                    );
                  }
                )}

                {/* Mandal label — show only the hovered one, at its centroid */}
                {(projection.mandalsBySlug[selectedDistrict.slug] ?? [])
                  .filter((m) => m.mandalCode === hoveredMandal)
                  .map((mandal) => (
                    <g
                      key={`mandal-label-${mandal.mandalCode}`}
                      transform={`translate(${mandal.centroid[0]}, ${mandal.centroid[1]})`}
                      pointerEvents="none"
                    >
                      <text
                        x={0}
                        y={0}
                        textAnchor="middle"
                        className="fill-text-primary"
                        style={{
                          fontSize: "9px",
                          fontWeight: 600,
                          letterSpacing: "0.03em",
                          textShadow:
                            "0 0 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85)",
                        }}
                      >
                        {mandal.name}
                      </text>
                    </g>
                  ))}
              </g>
            )}

            {/* Centroid labels — only on hover when NOT zoomed.
                When zoomed, the side panel serves as the label. */}
            {!isZoomed &&
              projection.districts.map((d) => {
                const isHovered = hovered === d.geojsonName;
                if (!isHovered) return null;
                const info = resolveDistrict(d.geojsonName);
                return (
                  <g
                    key={`label-${d.dtCode}`}
                    transform={`translate(${d.centroid[0]}, ${d.centroid[1]})`}
                    pointerEvents="none"
                  >
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      className="fill-text-primary"
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        textShadow:
                          "0 0 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.9)",
                      }}
                    >
                      {info.name.toUpperCase()}
                    </text>
                  </g>
                );
              })}
          </g>
        </svg>

        {/* Hover tooltip (bottom-left) — only when not zoomed */}
        {/* Hover tooltip — hidden on touch devices since hover is unreliable there
            (mouseLeave doesn't fire consistently after tap). */}
        {hoveredDistrict && !selectedDistrict && (
          <div className="absolute bottom-3 left-3 bg-bg-secondary/95 border border-border-default rounded px-3 py-2 backdrop-blur-sm pointer-events-none no-touch-show">
            <div className="text-[10px] tracking-widest text-text-muted">
              DISTRICT
            </div>
            <div className="text-sm font-bold neon-text-blue">
              {hoveredDistrict.name}
            </div>
            {hoveredDistrict.nameTelugu && (
              <div className="text-[10px] text-text-secondary">
                {hoveredDistrict.nameTelugu}
              </div>
            )}
          </div>
        )}

        {/* Back-to-state button (top-left) — only when zoomed */}
        {isZoomed && (
          <button
            onClick={() => setSelectedGeojsonName(null)}
            className="absolute top-3 left-3 bg-bg-secondary/95 border border-accent-blue/40 text-accent-blue hover:bg-accent-blue/10 hover:border-accent-blue rounded px-3 py-1.5 text-[10px] tracking-widest backdrop-blur-sm transition-colors"
          >
            ← BACK TO STATE
          </button>
        )}

        {/* Helper text (top-right) */}
        <div className="absolute top-3 right-3 text-[9px] tracking-widest text-text-muted/70 pointer-events-none">
          {isZoomed ? (
            <>
              <span className="no-touch-show">ESC · BACK · OR CLICK OUTSIDE</span>
              <span className="touch-only-show hidden">TAP BACK OR OUTSIDE</span>
            </>
          ) : (
            <>
              <span className="no-touch-show">HOVER · CLICK A DISTRICT</span>
              <span className="touch-only-show hidden">TAP A DISTRICT</span>
            </>
          )}
        </div>
      </div>

      {/* Side panel
          - Desktop (lg+): always visible in the right column; shows the
            "no district selected" placeholder when nothing is picked.
          - Mobile: stacks below the map (no overlay, no fixed positioning)
            and only renders when a district is selected — so the zoomed
            map at top stays visible and the info flows below it. */}
      <div className={selectedDistrict ? "" : "hidden lg:block"}>
        <DistrictSidePanel
          district={selectedDistrict}
          news={
            selectedDistrict?.slug
              ? newsByDistrictSlug[selectedDistrict.slug] ?? []
              : []
          }
          onClose={() => setSelectedGeojsonName(null)}
        />
      </div>
    </div>
  );
}

function DistrictPath({
  shape,
  isSelected,
  isHovered,
  isDimmed,
  onEnter,
  onLeave,
  onClick,
}: {
  shape: DistrictShape;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  let fill = "#111820";
  let stroke = "#2a3a4e";
  let strokeWidth = 0.9;
  let opacity = 1;
  let dropShadow: string | undefined;

  if (isSelected) {
    // When selected, the mandal overlay renders on top and becomes the
    // visible boundary. The district's own stroke is hidden to avoid a
    // visual mismatch (mandal and district geometries come from different
    // source datasets and don't share vertices). The drop-shadow still
    // provides ambient "selected" glow.
    fill = "rgba(0, 153, 255, 0.03)";
    stroke = "transparent";
    strokeWidth = 0;
    dropShadow = "drop-shadow(0 0 10px rgba(0, 153, 255, 0.45))";
  } else if (isHovered) {
    fill = "rgba(0, 153, 255, 0.09)";
    stroke = "#3bb0ff";
    strokeWidth = 1.2;
    dropShadow = "drop-shadow(0 0 4px rgba(0, 153, 255, 0.35))";
  } else if (isDimmed) {
    opacity = 0.35;
  }

  return (
    <path
      d={shape.svgPath}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      opacity={opacity}
      vectorEffect="non-scaling-stroke"
      shapeRendering="geometricPrecision"
      className="district-path"
      style={{
        cursor: "pointer",
        filter: dropShadow,
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        transition:
          "fill 0.25s ease-out, stroke 0.25s ease-out, opacity 0.25s ease-out, filter 0.25s ease-out",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={shape.geojsonName}
    />
  );
}

function DistrictSidePanel({
  district,
  news,
  onClose,
}: {
  district: DistrictLike | null;
  news: NewsItem[];
  onClose: () => void;
}) {
  if (!district) {
    return (
      <div className="glow-card p-4 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="text-[10px] tracking-[0.3em] text-text-muted mb-3">
          — NO DISTRICT SELECTED —
        </div>
        <div className="text-sm text-text-secondary max-w-[240px]">
          Hover a district to preview, click to open details.
        </div>
      </div>
    );
  }

  const topMla = district.mlas?.[0];
  const topMp = district.mps?.[0];

  return (
    <div className="glow-card p-4 flex flex-col min-h-[400px]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-text-muted">
            DISTRICT
          </div>
          <div className="text-xl font-bold neon-text-blue mt-0.5">
            {district.name}
          </div>
          {district.nameTelugu && (
            <div className="text-sm text-text-secondary">
              {district.nameTelugu}
            </div>
          )}
          {district.hq && (
            <div className="text-[10px] text-text-muted mt-1">
              HQ · {district.hq}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary text-xs tracking-widest px-2 py-1 rounded hover:bg-bg-card transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {!district.hasFullData && (
        <div className="text-[10px] text-accent-yellow/80 bg-accent-yellow/5 border border-accent-yellow/20 rounded px-2 py-1.5 mb-3">
          Full district profile coming soon. Metadata being compiled.
        </div>
      )}

      {/* Civic identity card */}
      <div className="bg-bg-primary border border-border-default rounded p-3 mb-3">
        <div className="text-[9px] tracking-[0.3em] text-text-muted mb-2">
          WHO RUNS THIS DISTRICT
        </div>

        {district.rulingParty && (
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-border-default">
            <span className="text-[10px] text-text-muted">
              Majority party (MLAs)
            </span>
            <PartyBadge party={district.rulingParty} />
          </div>
        )}

        <div className="space-y-1.5 text-[11px]">
          {topMla && (
            <RoleRow
              role={`MLA${
                district.mlas && district.mlas.length > 1
                  ? ` (${district.mlas.length})`
                  : ""
              }`}
              name={topMla.name}
              extra={topMla.constituency}
              party={topMla.party}
            />
          )}
          {topMp && (
            <RoleRow
              role="MP"
              name={topMp.name}
              extra={topMp.constituency}
              party={topMp.party}
            />
          )}
          {district.mayor && (
            <RoleRow
              role="Mayor"
              name={district.mayor.name}
              extra={district.mayor.title}
              party={district.mayor.party}
            />
          )}
          {district.collector && (
            <RoleRow
              role="Collector"
              name={district.collector.name}
              extra={district.collector.title ?? "IAS"}
            />
          )}
          {district.policeChief && (
            <RoleRow
              role={district.policeChief.rank ?? "Police chief"}
              name={district.policeChief.name}
              extra={district.policeChief.title ?? "IPS"}
            />
          )}
        </div>

        {(district.assemblyCount !== undefined ||
          district.policeStationsCount !== undefined) && (
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border-default">
            {district.assemblyCount !== undefined && (
              <MiniStat
                label="ASSEMBLY SEATS"
                value={String(district.assemblyCount)}
              />
            )}
            {district.policeStationsCount !== undefined && (
              <MiniStat
                label="POLICE STATIONS"
                value={String(district.policeStationsCount)}
              />
            )}
          </div>
        )}

        {district.hasFullData &&
          !district.collector &&
          !district.policeChief &&
          !district.mayor && (
            <div className="text-[9px] text-text-muted/60 mt-2 italic">
              Collector, police chief, mayor — data being collected from
              tspolice.gov.in and district portals.
            </div>
          )}
      </div>

      {/* News section — tagged to this district */}
      <div className="bg-bg-primary border border-border-default rounded p-3 mb-3">
        <div className="text-[9px] tracking-[0.3em] text-text-muted mb-2">
          LATEST HEADLINES
        </div>
        {news.length > 0 ? (
          <div className="space-y-1.5">
            {news.slice(0, 3).map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[11px] leading-snug text-text-primary hover:text-accent-blue transition-colors"
              >
                <div className="line-clamp-2">{item.title}</div>
                <div className="text-[9px] text-text-muted/70 mt-0.5">
                  {item.source} ·{" "}
                  {new Date(item.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-[10px] text-text-muted/70 italic">
            No recent headlines mention {district.name} specifically. State-level
            news lives in the <Link href="/timeline" className="text-accent-blue hover:underline">Timeline</Link>.
          </div>
        )}
      </div>

      {district.slug ? (
        <Link
          href={`/districts/${district.slug}`}
          className="mt-auto block text-center text-[11px] tracking-widest bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue border border-accent-blue/30 hover:border-accent-blue rounded px-3 py-2 transition-colors"
        >
          SEE FULL DETAILS →
        </Link>
      ) : (
        <div className="mt-auto text-center text-[10px] tracking-widest text-text-muted/60 py-2">
          FULL DETAILS NOT YET AVAILABLE
        </div>
      )}
    </div>
  );
}

function RoleRow({
  role,
  name,
  extra,
  party,
}: {
  role: string;
  name: string;
  extra?: string;
  party?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1">
        <div className="text-[9px] tracking-widest text-text-muted uppercase">
          {role}
        </div>
        <div className="text-text-primary truncate">
          {name}
          {extra && (
            <span className="text-text-muted"> · {extra}</span>
          )}
        </div>
      </div>
      {party && <PartyBadge party={party} />}
    </div>
  );
}

function PartyBadge({ party }: { party: string }) {
  const colors: Record<string, string> = {
    BJP: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30",
    INC: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
    Congress: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
    BRS: "bg-accent-pink/10 text-accent-pink border-accent-pink/30",
    AIMIM: "bg-accent-green/10 text-accent-green border-accent-green/30",
  };
  const cls =
    colors[party] ||
    "bg-bg-card text-text-secondary border-border-default";
  return (
    <span
      className={`text-[9px] tracking-widest px-1.5 py-0.5 rounded border shrink-0 ${cls}`}
    >
      {party}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] tracking-widest text-text-muted">{label}</div>
      <div className="text-sm font-bold text-text-primary">{value}</div>
    </div>
  );
}

