"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/lib/types";

export default function TimelinePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news?limit=50");
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        }
      } catch {
        // will show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const sources = ["all", ...new Set(news.map((n) => n.source))];
  const filtered = sourceFilter === "all" ? news : news.filter((n) => n.source === sourceFilter);

  return (
    <div className="fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-[0.15em]">
            NEWS <span className="neon-text-green">TIMELINE</span>
          </h1>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="pulse-live absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
            </span>
            <span className="text-[10px] text-accent-green tracking-wider">LIVE</span>
          </span>
        </div>
        <p className="text-[10px] text-text-muted tracking-wider mt-1">
          AUTO-AGGREGATED FROM {sources.length - 1}+ NEWS SOURCES — REFRESHES EVERY 30 MINUTES
        </p>
      </div>

      {/* Source filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sources.map((source) => (
          <button
            key={source}
            onClick={() => setSourceFilter(source)}
            className={`px-3 py-1 text-[10px] tracking-wider rounded transition-colors ${
              sourceFilter === source
                ? "bg-accent-green/20 text-accent-green border border-accent-green/40"
                : "bg-bg-card text-text-secondary border border-border-default hover:border-border-glow"
            }`}
          >
            {source === "all" ? "ALL SOURCES" : source.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="glow-card p-4 animate-pulse">
              <div className="h-3 bg-bg-primary rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-bg-primary rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glow-card p-12 text-center">
          <p className="text-text-muted text-sm">NO NEWS ARTICLES FOUND</p>
          <p className="text-[10px] text-text-muted mt-1">RSS feeds are being aggregated. Check back shortly.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border-default"></div>

          <div className="space-y-3">
            {filtered.map((item, i) => {
              const date = new Date(item.publishedAt);
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <a
                  key={item.id || i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block ml-8 glow-card p-4 group hover:border-accent-blue/30 transition-all"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-[11px] w-2.5 h-2.5 rounded-full border-2 border-bg-primary ${
                      isToday ? "bg-accent-green" : "bg-accent-blue"
                    }`}
                    style={{ marginTop: "6px" }}
                  ></div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-xs text-text-primary group-hover:text-accent-blue transition-colors leading-relaxed">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[9px] text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded">
                          {item.source}
                        </span>
                        <span className="text-[9px] text-text-muted">
                          {date.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[9px] text-text-muted">
                          {date.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <span className="text-text-muted text-xs shrink-0 group-hover:text-accent-blue">↗</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
