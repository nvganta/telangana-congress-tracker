import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-default bg-bg-secondary/50 mt-12">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-text-muted">
          <div className="flex items-center gap-4">
            <Link
              href="/sources"
              className="text-accent-blue hover:underline tracking-wider"
            >
              [ALL SOURCES]
            </Link>
            <Link
              href="/admin"
              className="text-text-muted hover:text-text-secondary tracking-wider"
            >
              [ADMIN]
            </Link>
          </div>

          <p className="text-center tracking-wide">
            BUILT WITH PUBLIC DATA — NOT AFFILIATED WITH ANY POLITICAL PARTY
          </p>

          <p className="tracking-wide">
            DATA SOURCED FROM GOVT PORTALS, NEWS OUTLETS & PUBLIC RECORDS
          </p>
        </div>
      </div>
    </footer>
  );
}
