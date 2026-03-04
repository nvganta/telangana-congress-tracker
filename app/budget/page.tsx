"use client";

import { BudgetItem } from "@/lib/types";
import { getBudgetStats } from "@/lib/data";
import budgetData from "@/data/budget.json";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";

const budget = budgetData as BudgetItem[];
const stats = getBudgetStats(budget);

const COLORS = ["#ff3333", "#0099ff", "#00ff88", "#ffcc00", "#ff6600", "#ff0055"];

const tooltipStyle = {
  background: "#111820",
  border: "1px solid #1e2a3a",
  borderRadius: "4px",
  fontSize: "11px",
  color: "#e6edf3",
};

export default function BudgetPage() {
  const barData = budget.map((b) => ({
    name: b.schemeName.length > 15 ? b.schemeName.slice(0, 15) + "..." : b.schemeName,
    fullName: b.schemeName,
    allocated: b.allocated,
    spent: b.spent,
  }));

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-[0.15em]">
          BUDGET <span className="neon-text-blue">DASHBOARD</span>
        </h1>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          ₹53,196 CRORE ALLOCATED FOR 6 GUARANTEES — TRACKING ACTUAL SPENDING
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glow-card p-4 text-center">
          <div className="text-xl font-bold neon-text-blue">₹{stats.totalAllocated.toLocaleString()}</div>
          <div className="text-[9px] text-text-muted tracking-wider mt-1">CRORE ALLOCATED</div>
        </div>
        <div className="glow-card p-4 text-center">
          <div className="text-xl font-bold neon-text-green">₹{stats.totalSpent.toLocaleString()}</div>
          <div className="text-[9px] text-text-muted tracking-wider mt-1">CRORE SPENT</div>
        </div>
        <div className="glow-card p-4 text-center">
          <div className="text-xl font-bold neon-text-yellow">{stats.utilization}%</div>
          <div className="text-[9px] text-text-muted tracking-wider mt-1">UTILIZATION RATE</div>
        </div>
        <div className="glow-card p-4 text-center">
          <div className="text-xl font-bold neon-text-red">₹{(stats.totalAllocated - stats.totalSpent).toLocaleString()}</div>
          <div className="text-[9px] text-text-muted tracking-wider mt-1">CRORE UNSPENT</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Bar chart: Allocated vs Spent */}
        <div className="glow-card p-4">
          <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold mb-4">
            ALLOCATED vs SPENT (₹ CRORE)
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fill: "#8b949e", fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#8b949e", fontSize: 9 }} width={100} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="allocated" fill="#0099ff" opacity={0.4} name="Allocated" radius={[0, 2, 2, 0]} />
                <Bar dataKey="spent" fill="#00ff88" name="Spent" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart: Allocation split */}
        <div className="glow-card p-4">
          <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold mb-4">
            ALLOCATION BREAKDOWN
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={barData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="allocated"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {barData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Scheme-wise breakdown */}
      <div className="glow-card p-4">
        <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold mb-4">
          SCHEME-WISE BREAKDOWN
        </h2>
        <div className="space-y-4">
          {budget.map((item, i) => {
            const utilization = Math.round((item.spent / item.allocated) * 100);
            return (
              <div key={item.id} className="bg-bg-primary rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xs font-semibold text-text-primary">{item.schemeName}</h3>
                    <span className="text-[9px] text-text-muted">{item.category}</span>
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: COLORS[i % COLORS.length] }}>
                    {utilization}% UTILIZED
                  </span>
                </div>
                <div className="h-2 bg-bg-card rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full progress-fill"
                    style={{
                      width: `${utilization}%`,
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-text-muted">
                  <span>Allocated: ₹{item.allocated.toLocaleString()} cr</span>
                  <span>Spent: ₹{item.spent.toLocaleString()} cr</span>
                  <span>Unspent: ₹{(item.allocated - item.spent).toLocaleString()} cr</span>
                </div>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] text-accent-blue hover:underline mt-1 inline-block"
                >
                  SOURCE ↗
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
