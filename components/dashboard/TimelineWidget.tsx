"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NewsItem } from "@/lib/types";

export default function TimelineWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news?limit=6");
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        }
      } catch {
        // Fallback — will show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="glow-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] tracking-[0.3em] text-text-secondary font-semibold">
          LATEST NEWS
        </h2>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="pulse-live absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-green"></span>
          </span>
          <span className="text-[9px] text-accent-green tracking-wider">AUTO-UPDATING</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-2 bg-bg-primary rounded w-3/4 mb-1"></div>
              <div className="h-1.5 bg-bg-primary rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-8 text-text-muted text-[11px]">
          <p>NEWS FEED LOADING...</p>
          <p className="mt-1 text-[9px]">RSS feeds will populate automatically</p>
        </div>
      ) : (
        <div className="space-y-3">
          {news.map((item, i) => (
            <a
              key={item.id || i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="flex items-start gap-2">
                <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-accent-blue"></span>
                <div className="min-w-0">
                  <p className="text-[11px] text-text-primary group-hover:text-accent-blue transition-colors line-clamp-2 leading-relaxed">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-text-muted">{item.source}</span>
                    <span className="text-[9px] text-text-muted">
                      {new Date(item.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <Link
        href="/timeline"
        className="block mt-4 text-[10px] tracking-wider text-accent-blue hover:underline text-center"
      >
        VIEW FULL TIMELINE →
      </Link>
    </div>
  );
}
