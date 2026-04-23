"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const inGovernment = governmentItems.some((i) => pathname === i.href);
  const inDistricts =
    pathname === "/districts" || pathname?.startsWith("/districts/");

  // Close the drawer whenever the route changes (so tapping a link dismisses it)
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open so the page doesn't scroll underneath
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [drawerOpen]);

  // ESC key closes the drawer — standard keyboard affordance for modals
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

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
              TELANGANA<span className="text-accent-red">TRACKER</span>
              <span className="text-text-muted">.IN</span>
            </span>
          </Link>

          {/* Desktop nav */}
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

          {/* Right side — desktop */}
          <div className="hidden md:flex items-center gap-4 text-[11px] text-text-muted">
            <span className="hidden sm:inline">TELANGANA, INDIA</span>
            <Link
              href="/sources"
              className="text-accent-blue hover:text-accent-blue/80 transition-colors"
            >
              [SOURCES]
            </Link>
          </div>

          {/* Mobile hamburger — opens the drawer */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            className="md:hidden p-2 -mr-2 text-text-primary hover:bg-bg-card rounded transition-colors"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
        inGovernment={inGovernment}
        inDistricts={inDistricts}
      />
    </header>
  );
}

function MobileDrawer({
  open,
  onClose,
  pathname,
  inGovernment,
  inDistricts,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string | null;
  inGovernment: boolean;
  inDistricts: boolean;
}) {
  const [govExpanded, setGovExpanded] = useState(inGovernment);
  const [distExpanded, setDistExpanded] = useState(inDistricts);

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-[60]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
      />

      {/* Drawer panel — slides in from the right */}
      <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-[340px] bg-bg-secondary border-l border-border-default overflow-y-auto animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between h-14 px-4 border-b border-border-default sticky top-0 bg-bg-secondary z-10">
          <span className="text-[10px] tracking-[0.3em] text-text-muted">
            NAVIGATION
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 -mr-2 text-text-primary hover:bg-bg-card rounded transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        <nav className="py-2 flex-1">
          <DrawerLink href="/" label="DASHBOARD" pathname={pathname} />

          <DrawerSection
            label="GOVERNMENT"
            expanded={govExpanded}
            setExpanded={setGovExpanded}
            active={inGovernment}
          >
            {governmentItems.map((item) => (
              <DrawerSubLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}
          </DrawerSection>

          <DrawerLink href="/map" label="MAP" pathname={pathname} />

          <DrawerSection
            label="DISTRICTS"
            expanded={distExpanded}
            setExpanded={setDistExpanded}
            active={inDistricts}
          >
            <DrawerSubLink
              href="/districts"
              label="ALL DISTRICTS"
              pathname={pathname}
            />
            {districtItems.map((item) => (
              <DrawerSubLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}
          </DrawerSection>

          <DrawerLink href="/timeline" label="TIMELINE" pathname={pathname} />
          <DrawerLink href="/sources" label="SOURCES" pathname={pathname} />
        </nav>

        <div className="border-t border-border-default px-4 py-3 text-[9px] tracking-[0.25em] text-text-muted/70">
          TELANGANA, INDIA
        </div>
      </div>
    </div>
  );
}

function DrawerLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string | null;
}) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`block px-4 py-3 text-[12px] tracking-widest border-b border-border-default/30 ${
        active
          ? "text-accent-blue bg-accent-blue/10"
          : "text-text-primary hover:bg-bg-card"
      }`}
    >
      {label}
    </Link>
  );
}

function DrawerSection({
  label,
  expanded,
  setExpanded,
  active,
  children,
}: {
  label: string;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border-default/30">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between px-4 py-3 text-[12px] tracking-widest ${
          active ? "text-accent-blue" : "text-text-primary"
        }`}
        aria-expanded={expanded}
      >
        <span>{label}</span>
        <span className="text-text-muted text-[10px]">
          {expanded ? "▾" : "▸"}
        </span>
      </button>
      {expanded && (
        <div className="bg-bg-primary/40 pb-1">{children}</div>
      )}
    </div>
  );
}

function DrawerSubLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string | null;
}) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`block px-6 py-2 text-[11px] tracking-wider ${
        active
          ? "text-accent-blue bg-accent-blue/10"
          : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
      }`}
    >
      {label}
    </Link>
  );
}

