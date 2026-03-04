"use client";

import { useState } from "react";
import { DevelopmentProject, ProjectStatus } from "@/lib/types";
import { PROJECT_STATUS_COLORS } from "@/lib/constants";
import projectsData from "@/data/projects.json";

const projects = projectsData as DevelopmentProject[];

const statusFilters: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "announced", label: "ANNOUNCED" },
  { value: "in_progress", label: "IN PROGRESS" },
  { value: "stalled", label: "STALLED" },
  { value: "completed", label: "COMPLETED" },
  { value: "cancelled", label: "CANCELLED" },
];

const categoryIcons: Record<string, string> = {
  road: "🛣️",
  metro: "🚇",
  irrigation: "💧",
  building: "🏗️",
  industrial: "🏭",
  other: "📋",
};

export default function DevelopmentPage() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = statusFilter === "all"
    ? projects
    : projects.filter((p) => p.status === statusFilter);

  const totalCost = projects.reduce((sum, p) => sum + p.estimatedCost, 0);

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-[0.15em]">
          DEVELOPMENT <span className="neon-text-yellow">TRACKER</span>
        </h1>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          {projects.length} PROJECTS — ₹{(totalCost / 1000).toFixed(0)}K CRORE TOTAL ESTIMATED INVESTMENT
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {statusFilters.filter(f => f.value !== "all").map((f) => {
          const count = projects.filter(p => p.status === f.value).length;
          return (
            <div key={f.value} className="glow-card p-3 text-center">
              <div
                className="text-lg font-bold"
                style={{ color: PROJECT_STATUS_COLORS[f.value as ProjectStatus] }}
              >
                {count}
              </div>
              <div className="text-[8px] tracking-wider text-text-muted mt-0.5">{f.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1 text-[10px] tracking-wider rounded transition-colors ${
              statusFilter === f.value
                ? "bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/40"
                : "bg-bg-card text-text-secondary border border-border-default hover:border-border-glow"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Project cards */}
      <div className="space-y-3">
        {filtered.map((project) => {
          const isExpanded = expandedId === project.id;
          return (
            <div
              key={project.id}
              className="glow-card overflow-hidden cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : project.id)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{categoryIcons[project.category] || "📋"}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">{project.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-text-muted">{project.district}</span>
                        <span className="text-[9px] text-text-muted">•</span>
                        <span className="text-[9px] text-text-muted">
                          Est. ₹{project.estimatedCost.toLocaleString()} cr
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="text-[10px] tracking-wider font-bold px-2 py-1 rounded"
                      style={{
                        color: PROJECT_STATUS_COLORS[project.status],
                        backgroundColor: `${PROJECT_STATUS_COLORS[project.status]}15`,
                      }}
                    >
                      {project.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="text-text-muted text-sm">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border-default p-4 bg-bg-primary/50 fade-in">
                  <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
                    {project.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-bg-card rounded p-2">
                      <div className="text-[9px] text-text-muted">EST. COST</div>
                      <div className="text-xs text-accent-blue font-bold">₹{project.estimatedCost.toLocaleString()} cr</div>
                    </div>
                    {project.startDate && (
                      <div className="bg-bg-card rounded p-2">
                        <div className="text-[9px] text-text-muted">START DATE</div>
                        <div className="text-xs text-text-primary">{new Date(project.startDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</div>
                      </div>
                    )}
                    {project.expectedCompletion && (
                      <div className="bg-bg-card rounded p-2">
                        <div className="text-[9px] text-text-muted">EXPECTED COMPLETION</div>
                        <div className="text-xs text-text-primary">{new Date(project.expectedCompletion).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</div>
                      </div>
                    )}
                    <div className="bg-bg-card rounded p-2">
                      <div className="text-[9px] text-text-muted">LAST UPDATED</div>
                      <div className="text-xs text-text-primary">{project.lastUpdated}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.sourceUrls.map((url, i) => (
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
