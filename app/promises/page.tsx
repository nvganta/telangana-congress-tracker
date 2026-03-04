"use client";

import { useState } from "react";
import { GovernmentPromise, PromiseStatus } from "@/lib/types";
import { STATUS_COLORS, STATUS_LABELS, CATEGORIES } from "@/lib/constants";
import guaranteesData from "@/data/guarantees.json";

const allPromises = guaranteesData as GovernmentPromise[];
const guarantees = allPromises.filter(p => p.category === "guarantee");
const manifestoPromises = allPromises.filter(p => p.category === "manifesto");

const statusFilters: { value: PromiseStatus | "all"; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "fulfilled", label: "FULFILLED" },
  { value: "partially_fulfilled", label: "PARTIAL" },
  { value: "in_progress", label: "IN PROGRESS" },
  { value: "not_started", label: "NOT STARTED" },
  { value: "broken", label: "BROKEN" },
];

function PromiseCard({ promise, isExpanded, onToggle }: {
  promise: GovernmentPromise;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const cat = CATEGORIES[promise.subcategory];
  return (
    <div className="glow-card overflow-hidden cursor-pointer" onClick={onToggle}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-lg shrink-0">{cat?.icon || "📋"}</span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-text-primary">
                {promise.name}
                {promise.nameTelugu && (
                  <span className="text-text-muted ml-2 font-normal text-xs">{promise.nameTelugu}</span>
                )}
              </h3>
              <p className="text-[10px] text-text-secondary mt-0.5">{promise.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-2">
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
            style={{ width: `${promise.progress}%`, backgroundColor: STATUS_COLORS[promise.status] }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-text-muted">Completion</span>
          <span className="text-[9px]" style={{ color: STATUS_COLORS[promise.status] }}>{promise.progress}%</span>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border-default p-4 bg-bg-primary/50 fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-[10px] tracking-wider text-accent-blue mb-2">WHAT WAS PROMISED</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">{promise.promised}</p>
            </div>
            <div>
              <h4 className="text-[10px] tracking-wider text-accent-yellow mb-2">CURRENT STATUS</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">{promise.delivered}</p>
            </div>
          </div>

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

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {promise.sourceUrls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[9px] text-accent-blue hover:underline bg-accent-blue/5 px-2 py-1 rounded inline-flex items-center gap-1"
              >
                <span>📎</span> SOURCE {i + 1} ↗
              </a>
            ))}
            <span className="text-[9px] text-text-muted ml-auto">
              As of {promise.lastUpdated}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PromisesPage() {
  const [statusFilter, setStatusFilter] = useState<PromiseStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filterFn = (p: GovernmentPromise) => statusFilter === "all" || p.status === statusFilter;
  const filteredGuarantees = guarantees.filter(filterFn);
  const filteredManifesto = manifestoPromises.filter(filterFn);

  const totalCount = allPromises.length;
  const fulfilledCount = allPromises.filter(p => p.status === "fulfilled").length;
  const partialCount = allPromises.filter(p => p.status === "partially_fulfilled").length;
  const notStartedCount = allPromises.filter(p => p.status === "not_started").length;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-[0.15em]">
          PROMISE <span className="neon-text-red">TRACKER</span>
        </h1>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          TRACKING {totalCount} PROMISES FROM THE 2023 CONGRESS MANIFESTO (ABHAYA HASTHAM)
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glow-card p-3 text-center">
          <div className="text-lg font-bold neon-text-green">{fulfilledCount}</div>
          <div className="text-[8px] tracking-wider text-text-muted">FULFILLED</div>
        </div>
        <div className="glow-card p-3 text-center">
          <div className="text-lg font-bold neon-text-yellow">{partialCount}</div>
          <div className="text-[8px] tracking-wider text-text-muted">PARTIAL</div>
        </div>
        <div className="glow-card p-3 text-center">
          <div className="text-lg font-bold neon-text-red">{notStartedCount}</div>
          <div className="text-[8px] tracking-wider text-text-muted">NOT STARTED</div>
        </div>
        <div className="glow-card p-3 text-center">
          <div className="text-lg font-bold text-text-primary">{totalCount}</div>
          <div className="text-[8px] tracking-wider text-text-muted">TOTAL TRACKED</div>
        </div>
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
            {f.label} {f.value !== "all" && `(${allPromises.filter(p => p.status === f.value).length})`}
          </button>
        ))}
      </div>

      {/* 6 Guarantees section */}
      {filteredGuarantees.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold mb-3 flex items-center gap-2">
            THE 6 KEY GUARANTEES
            <span className="text-[9px] text-text-muted font-normal tracking-normal">
              — flagship promises from the Abhaya Hastham manifesto
            </span>
          </h2>
          <div className="space-y-3">
            {filteredGuarantees.map((promise) => (
              <PromiseCard
                key={promise.id}
                promise={promise}
                isExpanded={expandedId === promise.id}
                onToggle={() => setExpandedId(expandedId === promise.id ? null : promise.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other manifesto promises */}
      {filteredManifesto.length > 0 && (
        <div>
          <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold mb-3 flex items-center gap-2">
            OTHER MANIFESTO PROMISES
            <span className="text-[9px] text-text-muted font-normal tracking-normal">
              — additional commitments from the 2023 campaign
            </span>
          </h2>
          <div className="space-y-3">
            {filteredManifesto.map((promise) => (
              <PromiseCard
                key={promise.id}
                promise={promise}
                isExpanded={expandedId === promise.id}
                onToggle={() => setExpandedId(expandedId === promise.id ? null : promise.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Source reference */}
      <div className="mt-8 glow-card p-4">
        <h3 className="text-[10px] tracking-wider text-text-muted mb-2">REFERENCE DOCUMENT</h3>
        <p className="text-[11px] text-text-secondary">
          All promises measured against the{" "}
          <a
            href="https://www.scribd.com/document/685183153/Cong-Manifesto"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:underline"
          >
            Congress Telangana Manifesto 2023 (42 pages) ↗
          </a>
          {" "}released by AICC President Mallikarjun Kharge on November 17, 2023.
          Status assessments based on government data, budget documents, and verified news reports.
        </p>
        <p className="text-[9px] text-text-muted mt-2">
          As of March 2026. Additional manifesto promises will be added as data becomes available.
        </p>
      </div>
    </div>
  );
}
