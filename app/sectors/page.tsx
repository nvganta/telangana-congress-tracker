"use client";

import { useState } from "react";
import Link from "next/link";
import { SectorData, WelfareScheme } from "@/lib/types";
import agricultureData from "@/data/agriculture.json";
import educationData from "@/data/education.json";
import realestateData from "@/data/realestate.json";
import fiscalData from "@/data/fiscal.json";
import employmentData from "@/data/employment.json";
import welfareScorecardData from "@/data/welfare-scorecard.json";

const agriculture = agricultureData as SectorData;
const education = educationData as SectorData;
const realestate = realestateData as SectorData;
const fiscal = fiscalData as SectorData;
const employment = employmentData as SectorData;
const welfareSchemes = welfareScorecardData as WelfareScheme[];

const TIER_CONFIG = {
  fully_implemented: {
    label: "FULLY IMPLEMENTED",
    color: "#00ff88",
    bg: "bg-accent-green/10",
  },
  partially_implemented: {
    label: "PARTIALLY IMPLEMENTED",
    color: "#ffcc00",
    bg: "bg-accent-yellow/10",
  },
  zero_implementation: {
    label: "ZERO IMPLEMENTATION",
    color: "#ff3333",
    bg: "bg-accent-red/10",
  },
};

function MetricCard({
  metric,
}: {
  metric: { label: string; value: string; context?: string };
}) {
  return (
    <div className="glow-card p-3">
      <div className="text-[9px] tracking-wider text-text-muted mb-1">
        {metric.label}
      </div>
      <div className="text-sm font-bold text-text-primary">{metric.value}</div>
      {metric.context && (
        <div className="text-[10px] text-text-secondary mt-1">
          {metric.context}
        </div>
      )}
    </div>
  );
}

function SectorSection({ data }: { data: SectorData }) {
  const [expanded, setExpanded] = useState(true);
  const sectorConfig: Record<string, { color: string; icon: string }> = {
    agriculture: { color: "neon-text-yellow", icon: "🌾" },
    education: { color: "neon-text-blue", icon: "📚" },
    realestate: { color: "neon-text-red", icon: "🏗️" },
    fiscal: { color: "neon-text-yellow", icon: "💰" },
    employment: { color: "neon-text-blue", icon: "💼" },
  };
  const cfg = sectorConfig[data.sector] || { color: "neon-text-blue", icon: "📊" };
  const sectorColor = cfg.color;
  const sectorIcon = cfg.icon;

  return (
    <div className="mb-8">
      <div
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-[12px] tracking-[0.2em] font-semibold flex items-center gap-2">
          <span>{sectorIcon}</span>
          <span className={sectorColor}>{data.title.toUpperCase()}</span>
        </h2>
        <span className="text-text-muted text-sm">
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {expanded && (
        <div className="fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {data.metrics.map((metric, i) => (
              <MetricCard key={i} metric={metric} />
            ))}
          </div>

          <div className="glow-card p-4 mb-3">
            <p className="text-[11px] text-text-secondary leading-relaxed">
              {data.narrative}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {data.sourceUrls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] text-accent-blue hover:underline bg-accent-blue/5 px-2 py-1 rounded inline-flex items-center gap-1"
              >
                SOURCE {i + 1} ↗
              </a>
            ))}
            <span className="text-[9px] text-text-muted ml-auto">
              As of {data.lastUpdated}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function WelfareScorecard() {
  const tiers = [
    "fully_implemented",
    "partially_implemented",
    "zero_implementation",
  ] as const;

  return (
    <div className="mb-8">
      <h2 className="text-[12px] tracking-[0.2em] font-semibold mb-4 flex items-center gap-2">
        <span>📊</span>
        <span className="neon-text-green">WELFARE SCHEME SCORECARD</span>
      </h2>

      <div className="space-y-6">
        {tiers.map((tier) => {
          const config = TIER_CONFIG[tier];
          const schemes = welfareSchemes.filter((s) => s.tier === tier);
          if (schemes.length === 0) return null;

          return (
            <div key={tier}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span
                  className="text-[10px] tracking-wider font-semibold"
                  style={{ color: config.color }}
                >
                  {config.label} ({schemes.length})
                </span>
              </div>

              <div className="space-y-2">
                {schemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="glow-card p-3 flex flex-col sm:flex-row sm:items-center gap-2"
                    style={{
                      borderColor: `${config.color}20`,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-text-primary">
                        {scheme.name}
                      </div>
                      <div className="text-[10px] text-text-secondary mt-0.5">
                        {scheme.description}
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <div
                        className="text-[10px] font-medium"
                        style={{ color: config.color }}
                      >
                        {scheme.keyMetric}
                      </div>
                      <a
                        href={scheme.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] text-accent-blue hover:underline"
                      >
                        SOURCE ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SectorsPage() {
  const fullyCount = welfareSchemes.filter(
    (s) => s.tier === "fully_implemented"
  ).length;
  const partialCount = welfareSchemes.filter(
    (s) => s.tier === "partially_implemented"
  ).length;
  const zeroCount = welfareSchemes.filter(
    (s) => s.tier === "zero_implementation"
  ).length;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-[0.15em]">
          SECTOR <span className="neon-text-blue">ANALYSIS</span>
        </h1>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          WELFARE, AGRICULTURE, EDUCATION, REAL ESTATE, FISCAL & EMPLOYMENT — ALL FROM PUBLIC RECORDS
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glow-card p-3 text-center">
          <div className="text-lg font-bold neon-text-green">{fullyCount}</div>
          <div className="text-[8px] tracking-wider text-text-muted">
            FULLY DELIVERED
          </div>
        </div>
        <div className="glow-card p-3 text-center">
          <div className="text-lg font-bold neon-text-yellow">
            {partialCount}
          </div>
          <div className="text-[8px] tracking-wider text-text-muted">
            PARTIAL
          </div>
        </div>
        <div className="glow-card p-3 text-center">
          <div className="text-lg font-bold neon-text-red">{zeroCount}</div>
          <div className="text-[8px] tracking-wider text-text-muted">
            ZERO DELIVERY
          </div>
        </div>
      </div>

      {/* Link to district breakdown */}
      <Link
        href="/districts"
        className="block glow-card p-4 mb-6 hover:border-accent-yellow/30 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] tracking-[0.2em] text-accent-yellow font-semibold">
              DISTRICT-LEVEL BREAKDOWN
            </div>
            <p className="text-[10px] text-text-muted mt-1">
              Farmer suicides by district, crop loan waiver coverage, education infrastructure
            </p>
          </div>
          <span className="text-text-muted group-hover:text-accent-yellow transition-colors">→</span>
        </div>
      </Link>

      <WelfareScorecard />
      <SectorSection data={agriculture} />
      <SectorSection data={education} />
      <SectorSection data={employment} />
      <SectorSection data={realestate} />
      <SectorSection data={fiscal} />
    </div>
  );
}
