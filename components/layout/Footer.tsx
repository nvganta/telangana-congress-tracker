import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-default bg-bg-secondary/50 mt-12">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Top: brand + tagline + quick links. Stacks on mobile, side-by-side on desktop. */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-6 border-b border-border-default/40">
          {/* Brand + tagline */}
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="pulse-live absolute inline-flex h-full w-full rounded-full bg-accent-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-red"></span>
              </span>
              <span className="text-sm font-bold tracking-wider text-text-primary">
                TELANGANA<span className="text-accent-red">TRACKER</span>
                <span className="text-text-muted">.IN</span>
              </span>
            </Link>
            <p className="text-[11px] text-text-secondary mt-3 leading-relaxed">
              A public accountability tracker monitoring the Congress
              government&apos;s promises, budget, and performance in
              Telangana. All data sourced from public records.
            </p>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-1 text-[11px]">
            <div>
              <div className="text-[9px] tracking-[0.25em] text-text-muted mb-2">
                EXPLORE
              </div>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/map"
                    className="text-text-secondary hover:text-accent-blue transition-colors"
                  >
                    District Map
                  </Link>
                </li>
                <li>
                  <Link
                    href="/promises"
                    className="text-text-secondary hover:text-accent-blue transition-colors"
                  >
                    Promises
                  </Link>
                </li>
                <li>
                  <Link
                    href="/budget"
                    className="text-text-secondary hover:text-accent-blue transition-colors"
                  >
                    Budget
                  </Link>
                </li>
                <li>
                  <Link
                    href="/timeline"
                    className="text-text-secondary hover:text-accent-blue transition-colors"
                  >
                    News Timeline
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-[9px] tracking-[0.25em] text-text-muted mb-2">
                DATA
              </div>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/sources"
                    className="text-accent-blue hover:underline"
                  >
                    All Sources
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compare"
                    className="text-text-secondary hover:text-accent-blue transition-colors"
                  >
                    BRS vs Congress
                  </Link>
                </li>
                <li>
                  <Link
                    href="/controversies"
                    className="text-text-secondary hover:text-accent-blue transition-colors"
                  >
                    Controversies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sectors"
                    className="text-text-secondary hover:text-accent-blue transition-colors"
                  >
                    Sectors
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom: disclaimer + attribution */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-5 text-[10px] text-text-muted tracking-wider">
          <p className="text-center sm:text-left">
            NOT AFFILIATED WITH ANY POLITICAL PARTY · INDEPENDENT PUBLIC
            INTEREST PROJECT
          </p>
          <p className="text-center sm:text-right text-text-muted/60">
            GOVT PORTALS · NEWS OUTLETS · ELECTION COMMISSION
          </p>
        </div>
      </div>
    </footer>
  );
}
