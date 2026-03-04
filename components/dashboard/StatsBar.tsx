"use client";

import { useState } from "react";
import { getDaysInPower, getPromiseStats, getBudgetStats, getOverallGrade } from "@/lib/data";
import { GovernmentPromise, BudgetItem } from "@/lib/types";

interface StatsBarProps {
  guarantees: GovernmentPromise[];
  budget: BudgetItem[];
}

export default function StatsBar({ guarantees, budget }: StatsBarProps) {
  const [showMethodology, setShowMethodology] = useState(false);
  const days = getDaysInPower();
  const promiseStats = getPromiseStats(guarantees);
  const budgetStats = getBudgetStats(budget);
  const grade = getOverallGrade(guarantees);

  // Only use the 6 guarantees for the grade calculation
  const sixGuarantees = guarantees.filter(g => g.category === "guarantee");
  const guaranteeStats = getPromiseStats(sixGuarantees);

  const gradeColor =
    grade === "A" ? "neon-text-green" :
    grade === "B" ? "neon-text-blue" :
    grade === "C" ? "neon-text-yellow" :
    "neon-text-red";

  const stats = [
    { label: "DAYS IN POWER", value: days.toString(), color: "text-text-primary" },
    { label: "FULFILLED", value: `${promiseStats.fulfilled}/${promiseStats.total}`, color: "neon-text-green" },
    { label: "PARTIAL", value: `${promiseStats.partial}/${promiseStats.total}`, color: "neon-text-yellow" },
    { label: "BROKEN", value: `${promiseStats.broken}/${promiseStats.total}`, color: "neon-text-red" },
    { label: "BUDGET USED", value: `${budgetStats.utilization}%`, color: "neon-text-blue" },
    { label: "GUARANTEE GRADE", value: grade, color: gradeColor },
  ];

  return (
    <div className="glow-card p-3 mb-6">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-lg md:text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-[9px] tracking-[0.2em] text-text-muted mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Methodology toggle */}
      <div className="text-center mt-3 border-t border-border-default pt-2">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="text-[9px] text-text-muted hover:text-accent-blue transition-colors tracking-wider"
        >
          {showMethodology ? "▲ HIDE" : "▼ HOW IS THE GRADE CALCULATED?"}
        </button>
      </div>

      {showMethodology && (
        <div className="mt-3 p-3 bg-bg-primary rounded border border-border-default fade-in">
          <h3 className="text-[10px] tracking-wider text-text-secondary font-semibold mb-3">
            GRADING METHODOLOGY
          </h3>
          <p className="text-[10px] text-text-muted mb-3">
            Grade is based on the average completion percentage of the 6 key guarantees (Abhaya Hastham).
            Each guarantee is assessed on verifiable delivery metrics from government data and news sources.
          </p>

          {/* Individual scores */}
          <div className="space-y-2 mb-3">
            {sixGuarantees.map((g) => (
              <div key={g.id} className="flex items-center gap-2">
                <span className="text-[10px] text-text-secondary w-32 truncate">{g.name}</span>
                <div className="flex-1 h-1 bg-bg-card rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${g.progress}%`,
                      backgroundColor: g.progress >= 80 ? "#00ff88" : g.progress >= 40 ? "#ffcc00" : "#ff3333",
                    }}
                  />
                </div>
                <span className="text-[10px] text-text-muted w-8 text-right">{g.progress}%</span>
              </div>
            ))}
          </div>

          {/* Formula */}
          <div className="bg-bg-card rounded p-2 border border-border-default">
            <div className="text-[9px] text-text-muted tracking-wider mb-1">FORMULA</div>
            <div className="text-[10px] text-text-secondary font-mono">
              ({sixGuarantees.map(g => `${g.progress}%`).join(" + ")}) / {sixGuarantees.length} = {guaranteeStats.avgProgress}%
            </div>
            <div className="text-[10px] text-text-muted mt-2">
              A = 80-100% | B = 60-79% | C = 40-59% | D = 20-39% | F = 0-19%
            </div>
            <div className="text-[10px] mt-1">
              <span className="text-text-muted">Result:</span>{" "}
              <span className={gradeColor}>{guaranteeStats.avgProgress}% = Grade {grade}</span>
            </div>
          </div>

          <p className="text-[9px] text-text-muted mt-2">
            As of March 2026. Individual percentages derived from verifiable delivery data.
            Sources linked on each promise card.
          </p>
        </div>
      )}
    </div>
  );
}
