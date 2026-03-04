"use client";

import Link from "next/link";
import { GovernmentPromise } from "@/lib/types";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";

interface GuaranteesWidgetProps {
  guarantees: GovernmentPromise[];
}

function StatusIcon({ status }: { status: GovernmentPromise["status"] }) {
  switch (status) {
    case "fulfilled":
      return <span className="text-accent-green">&#10003;</span>;
    case "partially_fulfilled":
      return <span className="text-accent-yellow">&#126;</span>;
    case "in_progress":
      return <span className="text-accent-blue">&#9654;</span>;
    case "not_started":
      return <span className="text-accent-red">&#10007;</span>;
    case "broken":
      return <span className="text-accent-pink">&#10007;</span>;
  }
}

export default function GuaranteesWidget({ guarantees }: GuaranteesWidgetProps) {
  // Only show the 6 key guarantees in the widget
  const sixGuarantees = guarantees.filter(g => g.category === "guarantee");
  const totalTracked = guarantees.length;

  return (
    <div className="glow-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold">
          THE 6 GUARANTEES
        </h2>
        <span className="text-[10px] text-text-muted">ABHAYA HASTHAM</span>
      </div>

      <div className="space-y-3">
        {sixGuarantees.map((g) => (
          <div key={g.id} className="group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon status={g.status} />
                <span className="text-xs font-medium text-text-primary group-hover:text-accent-blue transition-colors">
                  {g.name}
                </span>
                {g.nameTelugu && (
                  <span className="text-[10px] text-text-muted hidden sm:inline">{g.nameTelugu}</span>
                )}
              </div>
              <span
                className="text-[9px] tracking-wider font-semibold px-1.5 py-0.5 rounded"
                style={{
                  color: STATUS_COLORS[g.status],
                  backgroundColor: `${STATUS_COLORS[g.status]}15`,
                }}
              >
                {STATUS_LABELS[g.status]}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-1.5 h-1 bg-bg-primary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full progress-fill"
                style={{ width: `${g.progress}%`, backgroundColor: STATUS_COLORS[g.status] }}
              />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[9px] text-text-muted">{g.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/promises"
        className="block mt-4 text-[10px] tracking-wider text-accent-blue hover:underline text-center"
      >
        VIEW ALL {totalTracked} TRACKED PROMISES →
      </Link>
    </div>
  );
}
