"use client";

import { getDaysInPower, getPromiseStats, getBudgetStats, getOverallGrade } from "@/lib/data";
import { GovernmentPromise, BudgetItem } from "@/lib/types";

interface StatsBarProps {
  guarantees: GovernmentPromise[];
  budget: BudgetItem[];
}

export default function StatsBar({ guarantees, budget }: StatsBarProps) {
  const days = getDaysInPower();
  const promiseStats = getPromiseStats(guarantees);
  const budgetStats = getBudgetStats(budget);
  const grade = getOverallGrade(guarantees);

  const gradeColor =
    grade === "A" ? "neon-text-green" :
    grade === "B" ? "neon-text-blue" :
    grade === "C" ? "neon-text-yellow" :
    "neon-text-red";

  const stats = [
    { label: "DAYS IN POWER", value: days.toString(), color: "text-text-primary" },
    { label: "FULFILLED", value: `${promiseStats.fulfilled}/${promiseStats.total}`, color: "neon-text-green" },
    { label: "PARTIAL", value: `${promiseStats.partial}/${promiseStats.total}`, color: "neon-text-yellow" },
    { label: "NOT STARTED", value: `${promiseStats.notStarted}/${promiseStats.total}`, color: "neon-text-red" },
    { label: "BUDGET USED", value: `${budgetStats.utilization}%`, color: "neon-text-blue" },
    { label: "OVERALL GRADE", value: grade, color: gradeColor },
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
    </div>
  );
}
