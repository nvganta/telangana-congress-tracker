"use client";

import { ComparisonMetric } from "@/lib/types";
import comparisonData from "@/data/comparison.json";

const comparisons = comparisonData as ComparisonMetric[];

function getWinner(metric: ComparisonMetric): "brs" | "congress" | "tie" {
  const brsNum = parseFloat(metric.brsValue.replace(/[₹,%\slakhcr]/g, ""));
  const congressNum = parseFloat(metric.congressValue.replace(/[₹,%\slakhcr]/g, ""));
  if (isNaN(brsNum) || isNaN(congressNum)) return "tie";
  if (metric.betterIs === "higher") return congressNum > brsNum ? "congress" : "brs";
  return congressNum < brsNum ? "congress" : "brs";
}

export default function ComparePage() {
  const categories = [...new Set(comparisons.map(c => c.category))];

  const brsWins = comparisons.filter(c => getWinner(c) === "brs").length;
  const congressWins = comparisons.filter(c => getWinner(c) === "congress").length;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-[0.15em]">
          BRS vs <span className="neon-text-blue">CONGRESS</span>
        </h1>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          SIDE-BY-SIDE COMPARISON ON KEY METRICS
        </p>
      </div>

      {/* Scoreboard */}
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
    </div>
  );
}
