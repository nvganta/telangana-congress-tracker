import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  dominantParty,
  getAllDistricts,
  getDistrictBySlug,
  type DistrictMetadata,
  type MLA,
  type MP,
} from "@/lib/districts";
import { fetchNewsByDistrict } from "@/lib/rss";
import type { NewsItem } from "@/lib/types";
import districtsData from "@/data/districts.json";
import ReportIncorrectData from "@/components/ReportIncorrectData";

const TELANGANA_DISTRICTS = [
  "Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial",
  "Jangaon", "Jayashankar Bhupalapally", "Jogulamba Gadwal", "Kamareddy",
  "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad",
  "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu",
  "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad",
  "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet",
  "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri",
];

const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export function generateStaticParams() {
  return TELANGANA_DISTRICTS.map((name) => ({ slug: slugify(name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const district = getDistrictBySlug(slug);
  const displayName =
    district?.name ??
    TELANGANA_DISTRICTS.find((d) => slugify(d) === slug);

  if (!displayName) {
    return { title: "District not found | Telangana Tracker" };
  }

  return {
    title: `${displayName} District | Telangana Tracker`,
    description: district
      ? `Demographics, representatives, and accountability data for ${displayName} district, Telangana.`
      : `${displayName} district — full profile coming soon. Telangana accountability tracker.`,
  };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const district = getDistrictBySlug(slug);

  if (!district) {
    const placeholderName = TELANGANA_DISTRICTS.find(
      (d) => slugify(d) === slug
    );
    if (!placeholderName) notFound();
    return <DistrictPlaceholder name={placeholderName!} slug={slug} />;
  }

  const farmerSuicideRow = districtsData.farmerSuicides.districts.find(
    (d) => d.name.toLowerCase() === district.geojsonName.toLowerCase()
  );

  // Fetch district-tagged news. Fallback to empty array if RSS is down —
  // the UI gracefully shows "no recent headlines" text.
  let districtNews: NewsItem[] = [];
  try {
    const byDistrict = await fetchNewsByDistrict(120, 6);
    districtNews = byDistrict[district.slug] ?? [];
  } catch {
    districtNews = [];
  }

  return (
    <div className="fade-in">
      <BackLink />
      <DistrictHeader district={district} />
      <QuickStatsRow
        district={district}
        farmerSuicides={farmerSuicideRow?.count}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 space-y-4">
          <OfficialsBlock district={district} />
          <RepresentativesBlock mlas={district.mlas} mps={district.mps} />
          <DemographicsBlock district={district} />
        </div>
        <div className="space-y-4">
          <FactBlock district={district} />
          <NeighborsBlock slugs={district.neighboringDistricts} />
          <DistrictNewsBlock districtName={district.name} news={districtNews} />
        </div>
      </div>
      <SourcesBlock district={district} />
      <ReportIncorrectData districtName={district.name} />
    </div>
  );
}

function BackLink() {
  return (
    <div className="mb-3">
      <Link
        href="/map"
        className="text-[10px] tracking-widest text-text-muted hover:text-accent-blue transition-colors"
      >
        ← BACK TO MAP
      </Link>
    </div>
  );
}

function DistrictHeader({ district }: { district: DistrictMetadata }) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline gap-3 flex-wrap">
        <h1 className="text-2xl font-bold tracking-[0.12em]">
          {district.name.toUpperCase()}{" "}
          <span className="text-text-muted text-xl">DISTRICT</span>
        </h1>
        <span className="text-base text-text-secondary">
          {district.nameTelugu}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-2 flex-wrap">
        <Badge label={district.region.replace(/-/g, " ").toUpperCase()} />
        {district.tags.map((tag) => (
          <Badge key={tag} label={tag.replace(/-/g, " ").toUpperCase()} dim />
        ))}
      </div>
    </div>
  );
}

function Badge({ label, dim }: { label: string; dim?: boolean }) {
  return (
    <span
      className={`text-[9px] tracking-widest px-2 py-0.5 rounded border ${
        dim
          ? "text-text-muted border-border-default bg-bg-card"
          : "text-accent-blue border-accent-blue/40 bg-accent-blue/5"
      }`}
    >
      {label}
    </span>
  );
}

function QuickStatsRow({
  district,
  farmerSuicides,
}: {
  district: DistrictMetadata;
  farmerSuicides?: number;
}) {
  const pop = district.populationProjected ?? district.population;
  const popLabel = district.populationProjected
    ? "EST. POPULATION"
    : `POPULATION (${district.populationYear})`;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
      <QuickStat label="HEADQUARTERS" value={district.hq} />
      <QuickStat
        label={popLabel}
        value={pop.toLocaleString("en-IN")}
      />
      <QuickStat
        label="AREA (SQ KM)"
        value={district.area.toLocaleString("en-IN")}
      />
      <QuickStat
        label="ASSEMBLY SEATS"
        value={String(district.assembly.count)}
      />
      {farmerSuicides !== undefined && (
        <QuickStat
          label="FARMER SUICIDES"
          value={String(farmerSuicides)}
          accent="red"
        />
      )}
    </div>
  );
}

function QuickStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "red" | "green" | "yellow";
}) {
  const valueClass =
    accent === "red"
      ? "neon-text-red"
      : accent === "green"
      ? "neon-text-green"
      : accent === "yellow"
      ? "neon-text-yellow"
      : "text-text-primary";

  return (
    <div className="bg-bg-card rounded p-3 border border-border-default">
      <div className="text-[9px] tracking-widest text-text-muted truncate">
        {label}
      </div>
      <div className={`text-lg font-bold mt-1 ${valueClass}`}>{value}</div>
    </div>
  );
}

function OfficialsBlock({ district }: { district: DistrictMetadata }) {
  const ruling = dominantParty(district.mlas);
  const hasAny =
    district.collector ||
    district.policeChief ||
    district.mayor ||
    district.municipalBody;

  return (
    <div className="glow-card p-4">
      <h2 className="text-[11px] tracking-[0.2em] text-text-secondary font-semibold mb-3">
        WHO RUNS THIS DISTRICT
      </h2>

      {ruling && (
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-border-default">
          <div>
            <div className="text-[9px] tracking-widest text-text-muted">
              MAJORITY PARTY (MLAS)
            </div>
            <div className="text-sm text-text-primary mt-0.5">
              {district.mlas.filter((m) => m.party === ruling).length} of{" "}
              {district.mlas.length} seats held by {ruling}
            </div>
          </div>
          <PartyBadge party={ruling} />
        </div>
      )}

      {hasAny ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {district.collector && (
            <OfficialCard
              role="District Collector"
              entry={district.collector}
            />
          )}
          {district.policeChief && (
            <OfficialCard
              role={
                district.policeChief.rank
                  ? `Police ${district.policeChief.rank}`
                  : "Police chief"
              }
              entry={district.policeChief}
            />
          )}
          {district.mayor && (
            <OfficialCard role="Mayor" entry={district.mayor} />
          )}
          {district.municipalBody && (
            <div className="bg-bg-primary border border-border-default rounded p-3">
              <div className="text-[9px] tracking-widest text-text-muted">
                MUNICIPAL BODY
              </div>
              <div className="text-sm text-text-primary mt-0.5">
                {district.municipalBody.name}
              </div>
              <div className="text-[10px] text-text-muted">
                {district.municipalBody.type}
              </div>
            </div>
          )}
          {district.policeStationsCount !== undefined && (
            <div className="bg-bg-primary border border-border-default rounded p-3">
              <div className="text-[9px] tracking-widest text-text-muted">
                POLICE STATIONS
              </div>
              <div className="text-lg font-bold text-text-primary mt-0.5">
                {district.policeStationsCount}
              </div>
              <div className="text-[10px] text-text-muted">
                Law & order stations in the commissionerate/district
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-[10px] text-text-muted italic">
          Collector, police chief, and municipal body data being compiled from
          official sources (district portal, tspolice.gov.in, GHMC/CDMA).
        </div>
      )}
    </div>
  );
}

function OfficialCard({
  role,
  entry,
}: {
  role: string;
  entry: { name: string; title?: string; party?: string; since?: string; verifiedOn: string };
}) {
  const verifiedAgo = daysSince(entry.verifiedOn);
  const stale = verifiedAgo > 180;
  return (
    <div className="bg-bg-primary border border-border-default rounded p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[9px] tracking-widest text-text-muted">
            {role.toUpperCase()}
          </div>
          <div className="text-sm font-bold text-text-primary mt-0.5">
            {entry.name}
          </div>
          {entry.title && (
            <div className="text-[10px] text-text-secondary">{entry.title}</div>
          )}
          {entry.since && (
            <div className="text-[10px] text-text-muted mt-0.5">
              In post since {entry.since}
            </div>
          )}
        </div>
        {entry.party && <PartyBadge party={entry.party} />}
      </div>
      <div
        className={`text-[9px] mt-2 ${
          stale ? "text-accent-yellow/80" : "text-text-muted/70"
        }`}
      >
        Verified on {entry.verifiedOn}
        {stale && " · may be out of date"}
      </div>
    </div>
  );
}

function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function DistrictNewsBlock({
  districtName,
  news,
}: {
  districtName: string;
  news: NewsItem[];
}) {
  return (
    <div className="glow-card p-4">
      <h2 className="text-[11px] tracking-[0.2em] text-text-secondary font-semibold mb-3">
        LATEST HEADLINES
      </h2>
      {news.length > 0 ? (
        <div className="space-y-2">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border-b border-border-default/50 last:border-b-0 pb-2 last:pb-0 group"
            >
              <div className="text-[11px] leading-snug text-text-primary group-hover:text-accent-blue transition-colors line-clamp-3">
                {item.title}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[9px] text-text-muted/70">
                <span>{item.source}</span>
                <span>·</span>
                <span>
                  {new Date(item.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="ml-auto uppercase tracking-widest text-accent-blue/70">
                  {item.category}
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-[10px] text-text-muted italic">
          No recent headlines tagged to {districtName} in the current news
          window. Aggregated from Telangana Today, The Hindu, Deccan Chronicle,
          Indian Express, and Google News queries. Check the full{" "}
          <Link href="/timeline" className="text-accent-blue hover:underline">
            Timeline
          </Link>{" "}
          for state-level news.
        </div>
      )}
    </div>
  );
}

function RepresentativesBlock({ mlas, mps }: { mlas: MLA[]; mps: MP[] }) {
  return (
    <div className="glow-card p-4">
      <h2 className="text-[11px] tracking-[0.2em] text-text-secondary font-semibold mb-3">
        REPRESENTATIVES
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] tracking-widest text-text-muted mb-2">
            MLAS ({mlas.length})
          </div>
          <div className="space-y-1.5">
            {mlas.map((mla) => (
              <div
                key={mla.constituency}
                className="flex items-center justify-between bg-bg-primary border border-border-default rounded px-2.5 py-1.5"
              >
                <div>
                  <div className="text-sm font-semibold text-text-primary">
                    {mla.name}
                  </div>
                  <div className="text-[10px] text-text-muted">
                    {mla.constituency}
                  </div>
                </div>
                <PartyBadge party={mla.party} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-widest text-text-muted mb-2">
            MPS ({mps.length})
          </div>
          <div className="space-y-1.5">
            {mps.length === 0 ? (
              <div className="text-[10px] text-text-muted italic">
                No dedicated Lok Sabha constituency
              </div>
            ) : (
              mps.map((mp) => (
                <div
                  key={mp.constituency}
                  className="flex items-center justify-between bg-bg-primary border border-border-default rounded px-2.5 py-1.5"
                >
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      {mp.name}
                    </div>
                    <div className="text-[10px] text-text-muted">
                      {mp.constituency}
                    </div>
                  </div>
                  <PartyBadge party={mp.party} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PartyBadge({ party }: { party: string }) {
  const colors: Record<string, string> = {
    BJP: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30",
    INC: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
    Congress: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
    BRS: "bg-accent-pink/10 text-accent-pink border-accent-pink/30",
    AIMIM: "bg-accent-green/10 text-accent-green border-accent-green/30",
  };
  const cls =
    colors[party] ||
    "bg-bg-card text-text-secondary border-border-default";
  return (
    <span
      className={`text-[10px] tracking-widest px-2 py-0.5 rounded border ${cls}`}
    >
      {party}
    </span>
  );
}

function DemographicsBlock({ district }: { district: DistrictMetadata }) {
  const rows: { label: string; value: string }[] = [];
  if (district.literacyRate !== undefined)
    rows.push({ label: "Literacy rate", value: `${district.literacyRate}%` });
  if (district.sexRatio !== undefined)
    rows.push({
      label: "Sex ratio",
      value: `${district.sexRatio} females / 1000 males`,
    });
  if (district.tribalPopulation !== undefined)
    rows.push({
      label: "Tribal population",
      value: `${district.tribalPopulation}%`,
    });
  if (district.majorTowns.length > 0)
    rows.push({ label: "Major towns", value: district.majorTowns.join(", ") });
  rows.push({
    label: "Lok Sabha constituencies",
    value: district.lokSabha.join(", "),
  });
  rows.push({
    label: "Assembly constituencies",
    value: district.assembly.constituencies.join(", "),
  });

  return (
    <div className="glow-card p-4">
      <h2 className="text-[11px] tracking-[0.2em] text-text-secondary font-semibold mb-3">
        DEMOGRAPHICS &amp; POLITICAL GEOGRAPHY
      </h2>
      <div className="divide-y divide-border-default">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-start justify-between gap-4 py-1.5 text-[11px]"
          >
            <span className="text-text-muted tracking-wide">{r.label}</span>
            <span className="text-text-primary text-right">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FactBlock({ district }: { district: DistrictMetadata }) {
  return (
    <div className="glow-card p-4">
      <h2 className="text-[11px] tracking-[0.2em] text-text-secondary font-semibold mb-3">
        AT A GLANCE
      </h2>
      <div className="space-y-1.5 text-[11px]">
        <KV label="Current shape since" value={district.formed} />
        <KV label="Region" value={district.region.replace(/-/g, " ")} />
        <KV
          label="Coordinates"
          value={`${district.coordinates[0].toFixed(
            3
          )}°N, ${district.coordinates[1].toFixed(3)}°E`}
        />
        <KV
          label="Last updated"
          value={district.lastUpdated}
        />
      </div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-text-muted">{label}</span>
      <span className="text-text-primary text-right">{value}</span>
    </div>
  );
}

function NeighborsBlock({ slugs }: { slugs: string[] }) {
  if (slugs.length === 0) return null;
  const all = getAllDistricts();
  const byName = new Map(all.map((d) => [d.slug, d.name]));

  return (
    <div className="glow-card p-4">
      <h2 className="text-[11px] tracking-[0.2em] text-text-secondary font-semibold mb-3">
        NEIGHBORING DISTRICTS
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {slugs.map((slug) => (
          <Link
            key={slug}
            href={`/districts/${slug}`}
            className="text-[10px] tracking-widest px-2 py-1 rounded border border-border-default bg-bg-primary text-text-secondary hover:text-accent-blue hover:border-accent-blue/40 transition-colors"
          >
            {(byName.get(slug) ?? slug).toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SourcesBlock({ district }: { district: DistrictMetadata }) {
  return (
    <div className="glow-card p-4">
      <h2 className="text-[11px] tracking-[0.2em] text-text-secondary font-semibold mb-3">
        SOURCES
      </h2>
      <div className="flex flex-wrap gap-2">
        {district.sources.map((src, i) => (
          <a
            key={i}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-accent-blue hover:underline bg-accent-blue/5 px-2 py-1 rounded border border-accent-blue/20"
          >
            {src.description} ↗
          </a>
        ))}
      </div>
    </div>
  );
}

function DistrictPlaceholder({ name, slug }: { name: string; slug: string }) {
  return (
    <div className="fade-in">
      <BackLink />
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-[0.12em]">
          {name.toUpperCase()}{" "}
          <span className="text-text-muted text-xl">DISTRICT</span>
        </h1>
      </div>
      <div className="glow-card p-6 text-center">
        <div className="text-[10px] tracking-[0.3em] text-accent-yellow/80 mb-2">
          — DATA COMING SOON —
        </div>
        <div className="text-sm text-text-secondary max-w-md mx-auto">
          The full profile for {name} district is being compiled. This page
          will include demographics, current representatives (MLAs and MPs),
          political geography, major towns, and accountability data as we
          populate it.
        </div>
        <Link
          href="/map"
          className="inline-block mt-4 text-[11px] tracking-widest bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue border border-accent-blue/30 rounded px-3 py-2 transition-colors"
        >
          ← EXPLORE MAP
        </Link>
      </div>
      <div className="mt-3 text-[9px] text-text-muted/60 text-center">
        /districts/{slug}
      </div>
    </div>
  );
}
