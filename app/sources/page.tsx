"use client";

import { Source } from "@/lib/types";
import sourcesData from "@/data/sources.json";

const sources = sourcesData as Source[];

const categoryLabels: Record<string, string> = {
  government: "GOVERNMENT & OFFICIAL",
  news_english: "NEWS (ENGLISH)",
  news_telugu: "NEWS (TELUGU)",
  rti: "RTI RESPONSES",
  budget: "BUDGET DOCUMENTS",
  reports: "AUDIT & REPORTS",
  social_media: "SOCIAL MEDIA",
};

const credibilityBadge: Record<string, { label: string; color: string }> = {
  official: { label: "OFFICIAL", color: "#00ff88" },
  established: { label: "ESTABLISHED", color: "#0099ff" },
  independent: { label: "INDEPENDENT", color: "#ffcc00" },
  social: { label: "SOCIAL", color: "#ff6600" },
};

export default function SourcesPage() {
  const categories = [...new Set(sources.map(s => s.category))];

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-[0.15em]">
          DATA <span className="neon-text-blue">SOURCES</span>
        </h1>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          EVERY DATA POINT ON THIS SITE IS SOURCED FROM PUBLIC RECORDS AND VERIFIED NEWS OUTLETS
        </p>
      </div>

      {/* Credibility legend */}
      <div className="glow-card p-4 mb-6">
        <h2 className="text-[10px] tracking-wider text-text-muted mb-3">CREDIBILITY INDICATORS</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(credibilityBadge).map(([key, badge]) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className="text-[9px] tracking-wider font-bold px-2 py-0.5 rounded"
                style={{ color: badge.color, backgroundColor: `${badge.color}15` }}
              >
                {badge.label}
              </span>
              <span className="text-[9px] text-text-muted">
                {key === "official" && "— Government sources & official documents"}
                {key === "established" && "— Major news organizations"}
                {key === "independent" && "— Independent journalism"}
                {key === "social" && "— Social media / user-generated"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sources by category */}
      {categories.map((category) => {
        const categorySources = sources.filter(s => s.category === category);
        return (
          <div key={category} className="mb-6">
            <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold mb-3">
              {categoryLabels[category] || category.toUpperCase()}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categorySources.map((source) => {
                const badge = credibilityBadge[source.credibility];
                return (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glow-card p-4 group hover:border-accent-blue/30 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
                          {source.name}
                        </h3>
                        <p className="text-[10px] text-text-secondary mt-1">{source.description}</p>
                      </div>
                      <span
                        className="text-[8px] tracking-wider font-bold px-1.5 py-0.5 rounded shrink-0 ml-2"
                        style={{ color: badge.color, backgroundColor: `${badge.color}15` }}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <div className="mt-2 text-[9px] text-text-muted truncate">{source.url}</div>
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
