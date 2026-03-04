"use client";

import { useState } from "react";
import { ComparisonMetric } from "@/lib/types";
import comparisonData from "@/data/comparison.json";
import karnatakaData from "@/data/karnataka-comparison.json";

const comparisons = comparisonData as ComparisonMetric[];

interface KarnatakaGuarantee {
  id: string;
  guarantee: string;
  karnatakaName: string;
  telanganaName: string;
  karnatakaStatus: string;
  telanganaStatus: string;
  karnatakaDetail: string;
  telanganaDetail: string;
  winner: "karnataka" | "telangana" | "tie";
}

const karnatakaComparisons = karnatakaData as KarnatakaGuarantee[];

function getWinner(metric: ComparisonMetric): "brs" | "congress" | "tie" {
  const brsNum = parseFloat(metric.brsValue.replace(/[₹,%\slakhcr]/g, ""));
  const congressNum = parseFloat(metric.congressValue.replace(/[₹,%\slakhcr]/g, ""));
  if (isNaN(brsNum) || isNaN(congressNum)) return "tie";
  if (metric.betterIs === "higher") return congressNum > brsNum ? "congress" : "brs";
  return congressNum < brsNum ? "congress" : "brs";
}

export default function ComparePage() {
  const [tab, setTab] = useState<"brs" | "karnataka">("brs");
  const categories = [...new Set(comparisons.map(c => c.category))];

  const brsWins = comparisons.filter(c => getWinner(c) === "brs").length;
  const congressWins = comparisons.filter(c => getWinner(c) === "congress").length;

  const kWins = karnatakaComparisons.filter(c => c.winner === "karnataka").length;
  const tWins = karnatakaComparisons.filter(c => c.winner === "telangana").length;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-[0.15em]">
          COMPARISON <span className="neon-text-blue">DASHBOARD</span>
        </h1>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          SIDE-BY-SIDE COMPARISONS ON KEY METRICS
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("brs")}
          className={`px-4 py-2 text-[10px] tracking-wider rounded transition-colors ${
            tab === "brs"
              ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/40"
              : "bg-bg-card text-text-secondary border border-border-default hover:border-border-glow"
          }`}
        >
          BRS vs CONGRESS
        </button>
        <button
          onClick={() => setTab("karnataka")}
          className={`px-4 py-2 text-[10px] tracking-wider rounded transition-colors ${
            tab === "karnataka"
              ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/40"
              : "bg-bg-card text-text-secondary border border-border-default hover:border-border-glow"
          }`}
        >
          KARNATAKA vs TELANGANA
        </button>
      </div>

      {tab === "brs" && (
        <>
          {/* BRS Scoreboard */}
          <div className="glow-card p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-accent-orange">{brsWins}</div>
                <div className="text-[10px] tracking-wider text-text-muted mt-1">BRS LEADS</div>
              </div>
              <div>
                <div className="text-lg text-text-muted font-bold">VS</div>
                <div className="text-[9px] tracking-wider text-text-muted mt-1">
                  {comparisons.length} METRICS
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-blue">{congressWins}</div>
                <div className="text-[10px] tracking-wider text-text-muted mt-1">CONGRESS LEADS</div>
              </div>
            </div>
          </div>

          {/* Comparison by category */}
          {categories.map((category) => {
            const metrics = comparisons.filter(c => c.category === category);
            return (
              <div key={category} className="mb-6">
                <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold mb-3">
                  {category.toUpperCase()}
                </h2>
                <div className="space-y-2">
                  {metrics.map((metric) => {
                    const winner = getWinner(metric);
                    return (
                      <div key={metric.id} className="glow-card p-4">
                        <div className="text-[10px] text-text-muted tracking-wider mb-3">
                          {metric.metric.toUpperCase()}
                          {metric.unit && <span className="text-text-muted ml-1">({metric.unit})</span>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            className={`text-center p-3 rounded border ${
                              winner === "brs"
                                ? "border-accent-orange/40 bg-accent-orange/5"
                                : "border-border-default bg-bg-primary"
                            }`}
                          >
                            <div className={`text-sm font-bold ${winner === "brs" ? "text-accent-orange" : "text-text-secondary"}`}>
                              {metric.brsValue}
                            </div>
                            <div className="text-[9px] text-text-muted mt-1">BRS (2014-2023)</div>
                            {winner === "brs" && (
                              <div className="text-[8px] text-accent-orange mt-1 tracking-wider">★ BETTER</div>
                            )}
                          </div>
                          <div
                            className={`text-center p-3 rounded border ${
                              winner === "congress"
                                ? "border-accent-blue/40 bg-accent-blue/5"
                                : "border-border-default bg-bg-primary"
                            }`}
                          >
                            <div className={`text-sm font-bold ${winner === "congress" ? "text-accent-blue" : "text-text-secondary"}`}>
                              {metric.congressValue}
                            </div>
                            <div className="text-[9px] text-text-muted mt-1">CONGRESS (2023-NOW)</div>
                            {winner === "congress" && (
                              <div className="text-[8px] text-accent-blue mt-1 tracking-wider">★ BETTER</div>
                            )}
                          </div>
                        </div>
                        <a
                          href={metric.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] text-accent-blue hover:underline mt-2 inline-block"
                        >
                          SOURCE ↗
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}

      {tab === "karnataka" && (
        <>
          {/* Karnataka context */}
          <div className="glow-card p-4 mb-6">
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Congress governs both Telangana and Karnataka. Telangana&apos;s 6 guarantees were modeled
              after Karnataka&apos;s 5 guarantees. This comparison tracks delivery rates of similar
              schemes across both states.
            </p>
          </div>

          {/* Karnataka Scoreboard */}
          <div className="glow-card p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-accent-green">{kWins}</div>
                <div className="text-[10px] tracking-wider text-text-muted mt-1">KARNATAKA LEADS</div>
              </div>
              <div>
                <div className="text-lg text-text-muted font-bold">VS</div>
                <div className="text-[9px] tracking-wider text-text-muted mt-1">
                  {karnatakaComparisons.length} GUARANTEES
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-blue">{tWins}</div>
                <div className="text-[10px] tracking-wider text-text-muted mt-1">TELANGANA LEADS</div>
              </div>
            </div>
          </div>

          {/* Karnataka comparisons */}
          <div className="space-y-3">
            {karnatakaComparisons.map((item) => (
              <div key={item.id} className="glow-card p-4">
                <div className="text-[10px] text-text-muted tracking-wider mb-3">
                  {item.guarantee.toUpperCase()}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-3 rounded border ${
                      item.winner === "karnataka"
                        ? "border-accent-green/40 bg-accent-green/5"
                        : "border-border-default bg-bg-primary"
                    }`}
                  >
                    <div className="text-[9px] tracking-wider text-text-muted mb-1">
                      KARNATAKA — {item.karnatakaName}
                    </div>
                    <div className={`text-xs font-semibold ${item.winner === "karnataka" ? "text-accent-green" : "text-text-secondary"}`}>
                      {item.karnatakaStatus}
                    </div>
                    <p className="text-[10px] text-text-muted mt-2">{item.karnatakaDetail}</p>
                    {item.winner === "karnataka" && (
                      <div className="text-[8px] text-accent-green mt-2 tracking-wider">★ BETTER</div>
                    )}
                  </div>
                  <div
                    className={`p-3 rounded border ${
                      item.winner === "telangana"
                        ? "border-accent-blue/40 bg-accent-blue/5"
                        : "border-border-default bg-bg-primary"
                    }`}
                  >
                    <div className="text-[9px] tracking-wider text-text-muted mb-1">
                      TELANGANA — {item.telanganaName}
                    </div>
                    <div className={`text-xs font-semibold ${item.winner === "telangana" ? "text-accent-blue" : "text-text-secondary"}`}>
                      {item.telanganaStatus}
                    </div>
                    <p className="text-[10px] text-text-muted mt-2">{item.telanganaDetail}</p>
                    {item.winner === "telangana" && (
                      <div className="text-[8px] text-accent-blue mt-2 tracking-wider">★ BETTER</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 glow-card p-4">
            <p className="text-[10px] text-text-muted">
              Karnataka data compiled from public government records and verified news reports.
              Both states are governed by the Indian National Congress. As of March 2026.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
