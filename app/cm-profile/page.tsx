"use client";

import cmData from "@/data/cm-profile.json";

const cm = cmData;

export default function CMProfilePage() {
  const daysInOffice = Math.floor(
    (new Date().getTime() - new Date(cm.inOfficeSince).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-[0.15em]">
          CM <span className="neon-text-blue">PROFILE</span>
        </h1>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          FACTUAL RECORD — ALL DATA FROM PUBLIC SOURCES AND ELECTION AFFIDAVITS
        </p>
      </div>

      {/* Header card */}
      <div className="glow-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-text-primary">{cm.name}</h2>
            <p className="text-[11px] text-text-secondary mt-1">{cm.title}</p>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <div className="text-lg font-bold neon-text-blue">
                  {daysInOffice}
                </div>
                <div className="text-[8px] tracking-wider text-text-muted">
                  DAYS IN OFFICE
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-text-primary">
                  {cm.facts[1].value.split(" ")[0]}
                </div>
                <div className="text-[8px] tracking-wider text-text-muted">
                  PENDING CASES
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-text-primary">
                  {cm.facts[3].value.split(" ")[0]}
                </div>
                <div className="text-[8px] tracking-wider text-text-muted">
                  DELHI VISITS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Political trajectory */}
      <div className="glow-card p-4 mb-6">
        <h3 className="text-[10px] tracking-[0.2em] text-text-muted mb-3">
          POLITICAL TRAJECTORY
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {cm.politicalTrajectory.map((party, i) => (
            <div key={party} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-primary bg-bg-primary px-3 py-1.5 rounded border border-border-default">
                {party}
              </span>
              {i < cm.politicalTrajectory.length - 1 && (
                <span className="text-text-muted text-xs">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key facts */}
      <div className="glow-card p-4 mb-6">
        <h3 className="text-[10px] tracking-[0.2em] text-text-muted mb-3">
          KEY FACTS (FROM PUBLIC RECORDS)
        </h3>
        <div className="space-y-3">
          {cm.facts.map((fact, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-2 border-b border-border-default pb-3 last:border-0 last:pb-0">
              <span className="text-[10px] tracking-wider text-accent-blue font-semibold sm:w-48 shrink-0">
                {fact.label.toUpperCase()}
              </span>
              <span className="text-[11px] text-text-secondary">
                {fact.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Documented contradictions */}
      <div className="glow-card p-4 mb-6">
        <h3 className="text-[10px] tracking-[0.2em] text-text-muted mb-3">
          DOCUMENTED CONTRADICTIONS
        </h3>
        <p className="text-[10px] text-text-muted mb-4">
          Public statements compared against subsequent actions. All sourced from news records.
        </p>
        <div className="space-y-3">
          {cm.contradictions.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-bg-primary rounded p-3 border border-border-default"
            >
              <div>
                <div className="text-[9px] tracking-wider text-accent-yellow mb-1">
                  THEN
                </div>
                <p className="text-[11px] text-text-secondary">{item.then}</p>
              </div>
              <div>
                <div className="text-[9px] tracking-wider text-accent-red mb-1">
                  NOW
                </div>
                <p className="text-[11px] text-text-secondary">{item.now}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="flex flex-wrap items-center gap-2">
        {cm.sourceUrls.map((url, i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-accent-blue hover:underline bg-accent-blue/5 px-2 py-1 rounded inline-flex items-center gap-1"
          >
            SOURCE {i + 1} ↗
          </a>
        ))}
        <span className="text-[9px] text-text-muted ml-auto">
          As of {cm.lastUpdated}
        </span>
      </div>

      <div className="mt-6 glow-card p-4">
        <p className="text-[10px] text-text-muted">
          This profile presents documented public record information only.
          Criminal case data from election affidavits filed with the Election
          Commission of India. Asset data from self-declared affidavits.
          Contradictions documented from published news sources. As of March
          2026.
        </p>
      </div>
    </div>
  );
}
