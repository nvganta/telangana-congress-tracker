"use client";

import districtsData from "@/data/districts.json";

const { farmerSuicides, cropLoanWaiver, zeroEnrollmentSchools } = districtsData;

function BarRow({ name, count, max }: { name: string; count: number; max: number }) {
  const pct = (count / max) * 100;
  const intensity = count >= 25 ? "#ff3333" : count >= 20 ? "#ff6600" : count >= 15 ? "#ffcc00" : "#0099ff";

  return (
    <div className="flex items-center gap-3 group">
      <span className="text-[10px] text-text-secondary w-40 truncate shrink-0">
        {name}
      </span>
      <div className="flex-1 h-3 bg-bg-primary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: intensity }}
        />
      </div>
      <span className="text-[10px] font-bold w-8 text-right" style={{ color: intensity }}>
        {count}
      </span>
    </div>
  );
}

export default function DistrictsPage() {
  const maxSuicides = Math.max(...farmerSuicides.districts.filter(d => d.name !== "Other Districts").map(d => d.count));

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-[0.15em]">
          DISTRICT <span className="neon-text-yellow">BREAKDOWN</span>
        </h1>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          DATA BY DISTRICT — FROM GOVERNMENT RECORDS AND VERIFIED REPORTS
        </p>
      </div>

      {/* Farmer Suicides Section */}
      <div className="glow-card p-4 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[11px] tracking-[0.2em] text-text-secondary font-semibold">
            {farmerSuicides.title.toUpperCase()}
          </h2>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div>
            <span className="text-2xl font-bold neon-text-red">{farmerSuicides.total}</span>
            <span className="text-[10px] text-text-muted ml-2">total suicides</span>
          </div>
          <div className="text-[10px] text-text-muted">
            Previous period: {farmerSuicides.previousPeriod}
          </div>
        </div>

        <div className="space-y-2">
          {farmerSuicides.districts
            .filter(d => d.name !== "Other Districts")
            .sort((a, b) => b.count - a.count)
            .map((d) => (
              <BarRow key={d.name} name={d.name} count={d.count} max={maxSuicides} />
            ))}
        </div>

        <div className="mt-3 pt-3 border-t border-border-default flex items-center justify-between">
          <span className="text-[10px] text-text-muted">
            Other Districts (combined): {farmerSuicides.districts.find(d => d.name === "Other Districts")?.count}
          </span>
          <div className="flex gap-2">
            {farmerSuicides.sourceUrls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] text-accent-blue hover:underline bg-accent-blue/5 px-2 py-1 rounded"
              >
                SOURCE {i + 1} ↗
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Crop Loan Waiver */}
      <div className="glow-card p-4 mb-6">
        <h2 className="text-[11px] tracking-[0.2em] text-text-secondary font-semibold mb-4">
          CROP LOAN WAIVER COVERAGE
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-bg-primary rounded p-3 border border-border-default">
            <div className="text-[9px] tracking-wider text-text-muted">DISBURSED</div>
            <div className="text-sm font-bold neon-text-green mt-1">{cropLoanWaiver.totalDisbursed}</div>
          </div>
          <div className="bg-bg-primary rounded p-3 border border-border-default">
            <div className="text-[9px] tracking-wider text-text-muted">FARMERS COVERED</div>
            <div className="text-sm font-bold neon-text-yellow mt-1">{cropLoanWaiver.farmersCovered}</div>
          </div>
          <div className="bg-bg-primary rounded p-3 border border-border-default">
            <div className="text-[9px] tracking-wider text-text-muted">STILL WAITING</div>
            <div className="text-sm font-bold neon-text-red mt-1">{cropLoanWaiver.farmersWaiting}</div>
          </div>
          <div className="bg-bg-primary rounded p-3 border border-border-default">
            <div className="text-[9px] tracking-wider text-text-muted">TARGET</div>
            <div className="text-sm font-bold text-text-primary mt-1">{cropLoanWaiver.target}</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-accent-yellow" style={{ width: "50%" }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-text-muted">50% of target covered</span>
            <span className="text-[9px] text-text-muted">As of {cropLoanWaiver.lastUpdated}</span>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          {cropLoanWaiver.sourceUrls.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] text-accent-blue hover:underline bg-accent-blue/5 px-2 py-1 rounded"
            >
              SOURCE {i + 1} ↗
            </a>
          ))}
        </div>
      </div>

      {/* Zero Enrollment Schools */}
      <div className="glow-card p-4 mb-6">
        <h2 className="text-[11px] tracking-[0.2em] text-text-secondary font-semibold mb-4">
          EDUCATION INFRASTRUCTURE BY THE NUMBERS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-bg-primary rounded p-3 border border-border-default text-center">
            <div className="text-2xl font-bold neon-text-red">{zeroEnrollmentSchools.total.toLocaleString()}</div>
            <div className="text-[9px] tracking-wider text-text-muted mt-1">ZERO-ENROLLMENT SCHOOLS</div>
            <div className="text-[10px] text-text-secondary mt-1">{zeroEnrollmentSchools.ranking}</div>
          </div>
          <div className="bg-bg-primary rounded p-3 border border-border-default text-center">
            <div className="text-2xl font-bold neon-text-yellow">{zeroEnrollmentSchools.singleTeacherSchools.toLocaleString()}</div>
            <div className="text-[9px] tracking-wider text-text-muted mt-1">SINGLE-TEACHER SCHOOLS</div>
          </div>
          <div className="bg-bg-primary rounded p-3 border border-border-default text-center">
            <div className="text-2xl font-bold neon-text-blue">53.2%</div>
            <div className="text-[9px] tracking-wider text-text-muted mt-1">SCHOOLS WITH DRINKING WATER</div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          {zeroEnrollmentSchools.sourceUrls.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] text-accent-blue hover:underline bg-accent-blue/5 px-2 py-1 rounded"
            >
              SOURCE {i + 1} ↗
            </a>
          ))}
          <span className="text-[9px] text-text-muted ml-auto">As of {zeroEnrollmentSchools.lastUpdated}</span>
        </div>
      </div>

      <div className="glow-card p-4">
        <p className="text-[10px] text-text-muted">
          District-level data compiled from Telangana government records, Open
          Data Portal, and verified news sources. Farmer suicide data from
          state agriculture department records. As of March 2026.
        </p>
      </div>
    </div>
  );
}
