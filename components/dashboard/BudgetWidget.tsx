"use client";

import Link from "next/link";
import { BudgetItem } from "@/lib/types";
import { getBudgetStats } from "@/lib/data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface BudgetWidgetProps {
  budget: BudgetItem[];
}

const COLORS = ["#ff3333", "#0099ff", "#00ff88", "#ffcc00", "#ff6600", "#ff0055"];

export default function BudgetWidget({ budget }: BudgetWidgetProps) {
  const stats = getBudgetStats(budget);

  const chartData = budget.map((item) => ({
    name: item.schemeName,
    allocated: item.allocated,
    spent: item.spent,
  }));

  return (
    <div className="glow-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold">
          BUDGET TRACKER
        </h2>
        <span className="text-[10px] text-text-muted">2024-25</span>
      </div>

      {/* Donut chart */}
      <div className="h-[160px] -my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={2}
              dataKey="allocated"
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#111820",
                border: "1px solid #1e2a3a",
                borderRadius: "4px",
                fontSize: "11px",
                color: "#e6edf3",
              }}
              formatter={(value) => [`₹${Number(value).toLocaleString()} cr`, "Allocated"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="text-center p-2 bg-bg-primary rounded">
          <div className="text-sm font-bold neon-text-blue">
            ₹{stats.totalAllocated.toLocaleString()} cr
          </div>
          <div className="text-[9px] text-text-muted tracking-wider mt-0.5">ALLOCATED</div>
        </div>
        <div className="text-center p-2 bg-bg-primary rounded">
          <div className="text-sm font-bold neon-text-green">
            ₹{stats.totalSpent.toLocaleString()} cr
          </div>
          <div className="text-[9px] text-text-muted tracking-wider mt-0.5">SPENT</div>
        </div>
      </div>

      {/* Utilization bar */}
      <div className="mt-3">
        <div className="flex justify-between text-[9px] text-text-muted mb-1">
          <span>UTILIZATION</span>
          <span>{stats.utilization}%</span>
        </div>
        <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full progress-fill"
            style={{
              width: `${stats.utilization}%`,
              background: `linear-gradient(90deg, var(--accent-red), var(--accent-yellow), var(--accent-green))`,
            }}
          />
        </div>
      </div>

      <Link
        href="/budget"
        className="block mt-4 text-[10px] tracking-wider text-accent-blue hover:underline text-center"
      >
        VIEW FULL BUDGET →
      </Link>
    </div>
  );
}
