"use client";

import Link from "next/link";
import { Controversy } from "@/lib/types";

interface CostCounterProps {
  controversies: Controversy[];
}

export default function CostCounter({ controversies }: CostCounterProps) {
  const totalCost = controversies.reduce(
    (sum, c) => sum + (c.estimatedCost || 0),
    0
  );
  const housingSpent = 800; // Rs 800 crore spent on Indiramma Indlu

  return (
    <div className="glow-card p-4 mb-4 border-accent-red/20">
      <div className="text-[10px] tracking-[0.3em] text-text-muted mb-3">
        COST OF CONTROVERSIES VS HOUSING FOR THE POOR
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="text-center flex-1">
          <div className="text-xl md:text-2xl font-bold neon-text-red">
            Rs {totalCost.toLocaleString("en-IN")} cr
          </div>
          <div className="text-[9px] tracking-wider text-text-muted mt-1">
            ON SPECTACLES
          </div>
        </div>
        <div className="text-text-muted text-xs">VS</div>
        <div className="text-center flex-1">
          <div className="text-xl md:text-2xl font-bold neon-text-yellow">
            Rs {housingSpent.toLocaleString("en-IN")} cr
          </div>
          <div className="text-[9px] tracking-wider text-text-muted mt-1">
            ON HOUSING (14% UTILIZATION)
          </div>
        </div>
      </div>
      <Link
        href="/controversies"
        className="block mt-3 text-[10px] tracking-wider text-accent-red hover:underline text-center"
      >
        VIEW ALL CONTROVERSIES →
      </Link>
    </div>
  );
}
