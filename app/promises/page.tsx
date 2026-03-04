"use client";

import { useState } from "react";
import { GovernmentPromise, PromiseStatus } from "@/lib/types";
import { STATUS_COLORS, STATUS_LABELS, CATEGORIES } from "@/lib/constants";
import guaranteesData from "@/data/guarantees.json";

const guarantees = guaranteesData as GovernmentPromise[];

const statusFilters: { value: PromiseStatus | "all"; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "fulfilled", label: "FULFILLED" },
  { value: "partially_fulfilled", label: "PARTIAL" },
  { value: "in_progress", label: "IN PROGRESS" },
  { value: "not_started", label: "NOT STARTED" },
  { value: "broken", label: "BROKEN" },
];

export default function PromisesPage() {
  const [statusFilter, setStatusFilter] = useState<PromiseStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = statusFilter === "all"
    ? guarantees
    : guarantees.filter((g) => g.status === statusFilter);

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-[0.15em]">
          PROMISE <span className="neon-text-red">TRACKER</span>
        </h1>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          TRACKING ALL 6 KEY GUARANTEES FROM THE 2023 MANIFESTO
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1 text-[10px] tracking-wider rounded transition-colors ${
              statusFilter === f.value
                ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/40"
                : "bg-bg-card text-text-secondary border border-border-default hover:border-border-glow"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Promise cards */}
      <div className="space-y-3">
        {filtered.map((promise) => {
          const isExpanded = expandedId === promise.id;
          const cat = CATEGORIES[promise.subcategory];
          return (
            <div
              key={promise.id}
              className="glow-card overflow-hidden cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : promise.id)}
            >
              {/* Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{cat?.icon || "📋"}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">
                        {promise.name}
                        {promise.nameTelugu && (
                          <span className="text-text-muted ml-2 font-normal text-xs">
                            {promise.nameTelugu}
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-text-secondary mt-0.5">{promise.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="text-[10px] tracking-wider font-bold px-2 py-1 rounded"
                      style={{
                        color: STATUS_COLORS[promise.status],
                        backgroundColor: `${STATUS_COLORS[promise.status]}15`,
                        boxShadow: `0 0 10px ${STATUS_COLORS[promise.status]}20`,
                      }}
                    >
                      {STATUS_LABELS[promise.status]}
                    </span>
                    <span className="text-text-muted text-sm">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-bg-primary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-fill"
                    style={{
                      width: `${promise.progress}%`,
                      backgroundColor: STATUS_COLORS[promise.status],
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-text-muted">Progress</span>
                  <span className="text-[9px]" style={{ color: STATUS_COLORS[promise.status] }}>
                    {promise.progress}%
                  </span>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-border-default p-4 bg-bg-primary/50 fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Promised vs Delivered */}
                    <div>
                      <h4 className="text-[10px] tracking-wider text-accent-blue mb-2">WHAT WAS PROMISED</h4>
                      <p className="text-[11px] text-text-secondary leading-relaxed">{promise.promised}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] tracking-wider text-accent-yellow mb-2">WHAT WAS DELIVERED</h4>
                      <p className="text-[11px] text-text-secondary leading-relaxed">{promise.delivered}</p>
                    </div>
                  </div>

                  {/* Key metrics */}
                  {promise.keyMetrics && (
                    <div className="mt-4">
                      <h4 className="text-[10px] tracking-wider text-text-muted mb-2">KEY METRICS</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {promise.keyMetrics.map((metric, i) => (
                          <div key={i} className="bg-bg-card rounded p-2 border border-border-default">
                            <div className="text-[9px] text-text-muted tracking-wider">{metric.label}</div>
                            <div className="text-[11px] text-accent-blue mt-1">Promised: {metric.promised}</div>
                            <div className="text-[11px] text-accent-yellow mt-0.5">Actual: {metric.actual}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sources */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {promise.sourceUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[9px] text-accent-blue hover:underline bg-accent-blue/5 px-2 py-1 rounded"
                      >
                        SOURCE {i + 1} ↗
                      </a>
                    ))}
                  </div>

                  <div className="mt-2 text-[9px] text-text-muted">
                    Last updated: {promise.lastUpdated}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
