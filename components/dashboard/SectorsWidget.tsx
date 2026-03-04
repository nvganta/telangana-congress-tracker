"use client";

import Link from "next/link";
import { WelfareScheme } from "@/lib/types";

interface SectorsWidgetProps {
  welfareSchemes: WelfareScheme[];
}

const TIER_COLORS = {
  fully_implemented: "#00ff88",
  partially_implemented: "#ffcc00",
  zero_implementation: "#ff3333",
};

const TIER_LABELS = {
  fully_implemented: "DELIVERED",
  partially_implemented: "PARTIAL",
  zero_implementation: "ZERO",
};

export default function SectorsWidget({ welfareSchemes }: SectorsWidgetProps) {
  const fullyCount = welfareSchemes.filter(s => s.tier === "fully_implemented").length;
  const partialCount = welfareSchemes.filter(s => s.tier === "partially_implemented").length;
  const zeroCount = welfareSchemes.filter(s => s.tier === "zero_implementation").length;

  return (
    <div className="glow-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold">
          WELFARE SCORECARD
        </h2>
        <span className="text-[10px] text-text-muted">12 SCHEMES</span>
      </div>

      {/* Tier summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 rounded bg-accent-green/5 border border-accent-green/20">
          <div className="text-lg font-bold neon-text-green">{fullyCount}</div>
          <div className="text-[8px] tracking-wider text-text-muted">DELIVERED</div>
        </div>
        <div className="text-center p-2 rounded bg-accent-yellow/5 border border-accent-yellow/20">
          <div className="text-lg font-bold neon-text-yellow">{partialCount}</div>
          <div className="text-[8px] tracking-wider text-text-muted">PARTIAL</div>
        </div>
        <div className="text-center p-2 rounded bg-accent-red/5 border border-accent-red/20">
          <div className="text-lg font-bold neon-text-red">{zeroCount}</div>
          <div className="text-[8px] tracking-wider text-text-muted">ZERO</div>
        </div>
      </div>

      {/* Scheme list */}
      <div className="space-y-1.5">
        {welfareSchemes.slice(0, 8).map((scheme) => {
          const color = TIER_COLORS[scheme.tier];
          const label = TIER_LABELS[scheme.tier];
          return (
            <div key={scheme.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] text-text-primary truncate">
                  {scheme.name}
                </span>
              </div>
              <span
                className="text-[8px] tracking-wider font-semibold px-1.5 py-0.5 rounded shrink-0"
                style={{ color, backgroundColor: `${color}15` }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <Link
        href="/sectors"
        className="block mt-4 text-[10px] tracking-wider text-accent-blue hover:underline text-center"
      >
        VIEW FULL SCORECARD + SECTOR DATA →
      </Link>
    </div>
  );
}
