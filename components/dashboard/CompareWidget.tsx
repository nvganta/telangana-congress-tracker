"use client";

import Link from "next/link";
import { ComparisonMetric } from "@/lib/types";

interface CompareWidgetProps {
  comparisons: ComparisonMetric[];
}

export default function CompareWidget({ comparisons }: CompareWidgetProps) {
  const featured = comparisons.slice(0, 4);

  function getWinner(metric: ComparisonMetric): "brs" | "congress" | "tie" {
    const brsNum = parseFloat(metric.brsValue.replace(/[₹,%\slakhcr]/g, ""));
    const congressNum = parseFloat(metric.congressValue.replace(/[₹,%\slakhcr]/g, ""));
    if (isNaN(brsNum) || isNaN(congressNum)) return "tie";
    if (metric.betterIs === "higher") return congressNum > brsNum ? "congress" : "brs";
    return congressNum < brsNum ? "congress" : "brs";
  }

  return (
    <div className="glow-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold">
          BRS vs CONGRESS
        </h2>
        <span className="text-[10px] text-text-muted">KEY METRICS</span>
      </div>

      <div className="space-y-3">
        {featured.map((metric) => {
          const winner = getWinner(metric);
          return (
            <div key={metric.id} className="bg-bg-primary rounded p-2">
              <div className="text-[9px] text-text-muted tracking-wider mb-1.5">
                {metric.metric.toUpperCase()}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className={`text-center p-1 rounded ${winner === "brs" ? "bg-accent-orange/10" : ""}`}>
                  <div className={`text-xs font-bold ${winner === "brs" ? "text-accent-orange" : "text-text-secondary"}`}>
                    {metric.brsValue}
                  </div>
                  <div className="text-[8px] text-text-muted">BRS</div>
                </div>
                <div className={`text-center p-1 rounded ${winner === "congress" ? "bg-accent-blue/10" : ""}`}>
                  <div className={`text-xs font-bold ${winner === "congress" ? "text-accent-blue" : "text-text-secondary"}`}>
                    {metric.congressValue}
                  </div>
                  <div className="text-[8px] text-text-muted">CONGRESS</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/compare"
        className="block mt-4 text-[10px] tracking-wider text-accent-blue hover:underline text-center"
      >
        VIEW FULL COMPARISON →
      </Link>
    </div>
  );
}
