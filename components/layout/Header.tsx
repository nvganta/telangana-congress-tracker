"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };

const governmentItems: NavLink[] = [
  { href: "/promises", label: "PROMISES" },
  { href: "/budget", label: "BUDGET" },
  { href: "/development", label: "DEVELOPMENT" },
  { href: "/controversies", label: "CONTROVERSIES" },
  { href: "/sectors", label: "SECTORS" },
  { href: "/compare", label: "COMPARE" },
  { href: "/cm-profile", label: "CM PROFILE" },
];

const TELANGANA_DISTRICTS = [
  "Adilabad",
  "Bhadradri Kothagudem",
  "Hanumakonda",
  "Hyderabad",
  "Jagtial",
  "Jangaon",
  "Jayashankar Bhupalapally",
  "Jogulamba Gadwal",
  "Kamareddy",
  "Karimnagar",
  "Khammam",
  "Kumuram Bheem Asifabad",
  "Mahabubabad",
  "Mahabubnagar",
  "Mancherial",
  "Medak",
  "Medchal-Malkajgiri",
  "Mulugu",
  "Nagarkurnool",
  "Nalgonda",
  "Narayanpet",
  "Nirmal",
  "Nizamabad",
  "Peddapalli",
  "Rajanna Sircilla",
  "Rangareddy",
  "Sangareddy",
  "Siddipet",
  "Suryapet",
  "Vikarabad",
  "Wanaparthy",
  "Warangal",
  "Yadadri Bhuvanagiri",
];

const districtSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-");

const districtItems: NavLink[] = TELANGANA_DISTRICTS.map((name) => ({
  href: `/districts/${districtSlug(name)}`,
  label: name.toUpperCase(),
}));

function TopLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-[11px] tracking-widest transition-colors rounded ${
        active
          ? "text-accent-blue bg-accent-blue/10"
          : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
      }`}
    >
      {label}
    </Link>
  );
}

function Dropdown({
  label,
  items,
  active,
  columns = 1,
  widthClass = "w-56",
}: {
  label: string;
  items: NavLink[];
  active: boolean;
  columns?: number;
  widthClass?: string;
}) {
  return (
    <div className="relative group">
      <button
        type="button"
        className={`flex items-center gap-1 px-3 py-1.5 text-[11px] tracking-widest transition-colors rounded ${
          active
            ? "text-accent-blue bg-accent-blue/10"
            : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
        }`}
      >
        <span>{label}</span>
        <span className="text-[8px] opacity-60">▾</span>
      </button>

      <div
        className={`absolute top-full left-0 pt-2 ${widthClass} invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-150 z-50`}
      >
        <div
          className={`bg-bg-secondary border border-border-default rounded shadow-xl backdrop-blur-sm p-1 grid gap-0.5`}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-2.5 py-1.5 text-[10px] tracking-widest text-text-secondary hover:text-text-primary hover:bg-bg-card rounded transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();

  const inGovernment = governmentItems.some((i) => pathname === i.href);
  const inDistricts =
    pathname === "/districts" || pathname?.startsWith("/districts/");

  return (
    <header className="border-b border-border-default bg-bg-secondary/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo + Live indicator */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="pulse-live absolute inline-flex h-full w-full rounded-full bg-accent-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-red"></span>
            </span>
            <span className="text-sm font-bold tracking-wider text-text-primary">
              CONGRESS<span className="text-accent-red">TRACKER</span>
              <span className="text-text-muted">.TS</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <TopLink href="/" label="DASHBOARD" active={pathname === "/"} />
            <Dropdown
              label="GOVERNMENT"
              items={governmentItems}
              active={inGovernment}
            />
            <TopLink
              href="/map"
              label="MAP"
              active={pathname === "/map"}
            />
            <Dropdown
              label="DISTRICTS"
              items={districtItems}
              active={inDistricts}
              columns={3}
              widthClass="w-[540px]"
            />
            <TopLink
              href="/timeline"
              label="TIMELINE"
              active={pathname === "/timeline"}
            />
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4 text-[11px] text-text-muted">
            <span className="hidden sm:inline">TELANGANA, INDIA</span>
            <Link
              href="/sources"
              className="text-accent-blue hover:text-accent-blue/80 transition-colors"
            >
              [SOURCES]
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile nav — primary sections first, then gov sub-items in a separate
          scroll row. Much easier to parse than one long undifferentiated scroll. */}
      <div className="md:hidden border-t border-border-default">
        {/* Primary row — the 4 top-level destinations */}
        <div className="flex px-4 gap-1 py-1.5 whitespace-nowrap overflow-x-auto">
          <MobileLink href="/" label="DASHBOARD" pathname={pathname} />
          <MobileLink href="/map" label="MAP" pathname={pathname} />
          <MobileLink href="/districts" label="DISTRICTS" pathname={pathname} />
          <MobileLink href="/timeline" label="TIMELINE" pathname={pathname} />
        </div>
        {/* Secondary row — government track-record pages */}
        <div className="flex px-4 gap-1 pb-1.5 whitespace-nowrap overflow-x-auto border-t border-border-default/40">
          <MobileSectionLabel label="GOVT" />
          {governmentItems.map((item) => (
            <MobileLink
              key={item.href}
              href={item.href}
              label={item.label}
              pathname={pathname}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

function MobileLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string | null;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-[10px] tracking-widest whitespace-nowrap transition-colors rounded ${
        pathname === href
          ? "text-accent-blue bg-accent-blue/10"
          : "text-text-secondary"
      }`}
    >
      {label}
    </Link>
  );
}

function MobileDivider() {
  return <span className="text-text-muted/40 text-[10px] self-center">·</span>;
}

function MobileSectionLabel({ label }: { label: string }) {
  return (
    <span className="px-2 py-1.5 text-[9px] tracking-widest text-text-muted/60 self-center">
      {label}
    </span>
  );
}
