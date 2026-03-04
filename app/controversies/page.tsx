"use client";

import { useState } from "react";
import { Controversy } from "@/lib/types";
import controversiesData from "@/data/controversies.json";

const controversies = controversiesData as Controversy[];

function formatCost(crore: number): string {
  if (crore >= 100000) return `Rs ${(crore / 100000).toFixed(1)} lakh crore`;
  if (crore >= 1000) return `Rs ${(crore / 1000).toFixed(0)},${String(crore % 1000).padStart(3, "0")} crore`;
  return `Rs ${crore.toLocaleString("en-IN")} crore`;
}

function ControversyCard({ controversy }: { controversy: Controversy }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glow-card overflow-hidden">
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] tracking-wider text-text-muted">
                {new Date(controversy.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {controversy.estimatedCost ? (
                <span className="text-[9px] tracking-wider font-bold px-1.5 py-0.5 rounded bg-accent-red/10 text-accent-red">
                  {formatCost(controversy.estimatedCost)}
                </span>
              ) : null}
            </div>
            <h3 className="text-sm font-semibold text-text-primary">
              {controversy.title}
            </h3>
            <p className="text-[11px] text-text-secondary mt-1">
              {controversy.summary}
            </p>
          </div>
          <span className="text-text-muted text-sm shrink-0">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border-default p-4 bg-bg-primary/50 fade-in space-y-4">
          <div>
            <h4 className="text-[10px] tracking-wider text-accent-red mb-2">
              WHAT HAPPENED
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              {controversy.whatHappened}
            </p>
          </div>

          <div>
            <h4 className="text-[10px] tracking-wider text-accent-blue mb-2">
              GOVERNMENT RESPONSE
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              {controversy.governmentResponse}
            </p>
          </div>

          <div>
            <h4 className="text-[10px] tracking-wider text-accent-yellow mb-2">
              WHAT THE DATA SHOWS
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              {controversy.whatDataShows}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-default">
            {controversy.sourceUrls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[9px] text-accent-blue hover:underline bg-accent-blue/5 px-2 py-1 rounded inline-flex items-center gap-1"
              >
                SOURCE {i + 1} ↗
              </a>
            ))}
            <span className="text-[9px] text-text-muted ml-auto">
              As of {controversy.lastUpdated}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ControversiesPage() {
  const totalCost = controversies.reduce(
    (sum, c) => sum + (c.estimatedCost || 0),
    0
  );
  const withCost = controversies.filter((c) => c.estimatedCost && c.estimatedCost > 0);

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-[0.15em]">
          CONTROVERSY <span className="neon-text-red">TRACKER</span>
        </h1>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          DOCUMENTED CONTROVERSIES SINCE DECEMBER 2023 — ALL SOURCED FROM
          PUBLIC RECORDS
        </p>
      </div>

      {/* Cost counter banner */}
      <div className="glow-card p-4 mb-6 border-accent-red/30">
        <div className="text-[10px] tracking-[0.3em] text-text-muted mb-2">
          COST OF CONTROVERSIES
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold neon-text-red">
              Rs {totalCost.toLocaleString("en-IN")} cr
            </div>
            <div className="text-[9px] text-text-muted tracking-wider mt-1">
              ESTIMATED SPENDING ON SPECTACLES
            </div>
            <div className="text-[10px] text-text-secondary mt-2">
              {withCost.map((c) => (
                <span key={c.id} className="block">
                  {c.title}: Rs {(c.estimatedCost || 0).toLocaleString("en-IN")} cr
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-[10px] tracking-wider text-text-muted">VS</div>
          </div>
          <div>
            <div className="text-2xl font-bold neon-text-yellow">
              Rs 800 cr
            </div>
            <div className="text-[9px] text-text-muted tracking-wider mt-1">
              SPENT ON INDIRAMMA INDLU HOUSING
            </div>
            <div className="text-[10px] text-text-secondary mt-2">
              <span className="block">Allocated: Rs 5,800 crore</span>
              <span className="block">Utilization: 14%</span>
              <span className="block">Status: 5% implementation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controversy cards */}
      <div className="space-y-3">
        {controversies.map((controversy) => (
          <ControversyCard key={controversy.id} controversy={controversy} />
        ))}
      </div>

      <div className="mt-6 glow-card p-4">
        <p className="text-[10px] text-text-muted">
          All controversies documented from verified news sources. Each entry
          includes the government&apos;s stated position alongside factual data.
          Cost figures are estimates compiled from multiple sources. As of March
          2026.
        </p>
      </div>
    </div>
  );
}
