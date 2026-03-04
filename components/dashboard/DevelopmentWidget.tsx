"use client";

import Link from "next/link";
import { DevelopmentProject } from "@/lib/types";
import { PROJECT_STATUS_COLORS } from "@/lib/constants";

interface DevelopmentWidgetProps {
  projects: DevelopmentProject[];
}

export default function DevelopmentWidget({ projects }: DevelopmentWidgetProps) {
  const statusCounts = {
    announced: projects.filter(p => p.status === "announced").length,
    in_progress: projects.filter(p => p.status === "in_progress").length,
    stalled: projects.filter(p => p.status === "stalled").length,
    completed: projects.filter(p => p.status === "completed").length,
  };

  const totalCost = projects.reduce((sum, p) => sum + p.estimatedCost, 0);

  return (
    <div className="glow-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold">
          DEVELOPMENT TRACKER
        </h2>
        <span className="text-[10px] text-text-muted">{projects.length} PROJECTS</span>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {(["announced", "in_progress", "stalled", "completed"] as const).map((status) => (
          <div key={status} className="text-center p-2 bg-bg-primary rounded">
            <div className="text-sm font-bold" style={{ color: PROJECT_STATUS_COLORS[status] }}>
              {statusCounts[status]}
            </div>
            <div className="text-[8px] tracking-wider text-text-muted mt-0.5">
              {status.replace("_", " ").toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Total investment */}
      <div className="text-center p-2 bg-bg-primary rounded mb-4">
        <div className="text-[9px] text-text-muted tracking-wider">TOTAL ESTIMATED INVESTMENT</div>
        <div className="text-lg font-bold neon-text-blue mt-1">
          ₹{(totalCost / 1000).toFixed(0)}K cr
        </div>
      </div>

      {/* Recent projects */}
      <div className="space-y-2">
        {projects.slice(0, 3).map((project) => (
          <div key={project.id} className="flex items-center justify-between py-1 border-b border-border-default last:border-0">
            <div className="min-w-0">
              <span className="text-[11px] text-text-primary truncate block">
                {project.name}
              </span>
              <span className="text-[9px] text-text-muted">{project.district}</span>
            </div>
            <span
              className="text-[8px] tracking-wider font-semibold px-1.5 py-0.5 rounded shrink-0 ml-2"
              style={{
                color: PROJECT_STATUS_COLORS[project.status],
                backgroundColor: `${PROJECT_STATUS_COLORS[project.status]}15`,
              }}
            >
              {project.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/development"
        className="block mt-4 text-[10px] tracking-wider text-accent-blue hover:underline text-center"
      >
        VIEW ALL PROJECTS & MAP →
      </Link>
    </div>
  );
}
