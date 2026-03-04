"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "DASHBOARD" },
  { href: "/promises", label: "PROMISES" },
  { href: "/controversies", label: "CONTROVERSIES" },
  { href: "/sectors", label: "SECTORS" },
  { href: "/budget", label: "BUDGET" },
  { href: "/timeline", label: "TIMELINE" },
  { href: "/development", label: "DEVELOPMENT" },
  { href: "/compare", label: "COMPARE" },
  { href: "/cm-profile", label: "CM PROFILE" },
];

export default function Header() {
  const pathname = usePathname();

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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-[11px] tracking-widest transition-colors rounded ${
                  pathname === item.href
                    ? "text-accent-blue bg-accent-blue/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
                }`}
              >
                {item.label}
              </Link>
            ))}
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

      {/* Mobile nav */}
      <div className="md:hidden border-t border-border-default overflow-x-auto">
        <div className="flex px-4 gap-1 py-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-[10px] tracking-widest whitespace-nowrap transition-colors rounded ${
                pathname === item.href
                  ? "text-accent-blue bg-accent-blue/10"
                  : "text-text-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
