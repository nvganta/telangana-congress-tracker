"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/lib/types";

const CATEGORIES = [
  { key: "all", label: "All Stories" },
  { key: "controversy", label: "Controversy", color: "#e53e3e" },
  { key: "budget", label: "Budget", color: "#d69e2e" },
  { key: "promise", label: "Promises", color: "#38a169" },
  { key: "development", label: "Development", color: "#3182ce" },
  { key: "policy", label: "Policy", color: "#805ad5" },
  { key: "general", label: "General", color: "#718096" },
];

const CATEGORY_COLORS: Record<string, string> = {
  controversy: "#e53e3e",
  budget: "#d69e2e",
  promise: "#38a169",
  development: "#3182ce",
  policy: "#805ad5",
  general: "#718096",
};

function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] || "#718096";
  const label = CATEGORIES.find((c) => c.key === category)?.label || category;
  return (
    <span
      className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: `${color}22`, color, fontFamily: "system-ui, sans-serif" }}
    >
      {label}
    </span>
  );
}

function CardImage({
  imageUrl,
  title,
  category,
  className,
}: {
  imageUrl?: string;
  title: string;
  category: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const color = CATEGORY_COLORS[category] || "#718096";

  if (!imageUrl || failed) {
    return (
      <div
        className={className}
        style={{
          background: `linear-gradient(135deg, ${color}14 0%, ${color}04 100%)`,
        }}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className={`${className} object-cover`}
      onError={() => setFailed(true)}
    />
  );
}

function HeroCard({ item }: { item: NewsItem }) {
  const date = new Date(item.publishedAt);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl overflow-hidden border border-white/8 hover:border-white/16 transition-all duration-300"
      style={{ background: "#111820", fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="grid md:grid-cols-5">
        <div className="md:col-span-3 relative overflow-hidden">
          <CardImage
            imageUrl={item.imageUrl}
            title={item.title}
            category={item.category}
            className="w-full aspect-video md:aspect-auto md:h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
        </div>
        <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <CategoryBadge category={item.category} />
            <h2 className="text-xl md:text-2xl font-bold leading-snug text-white/90 group-hover:text-white transition-colors">
              {item.title}
            </h2>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-white/40">
              <span className="font-medium text-white/60">{item.source}</span>
              <span>·</span>
              <span>
                {date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <span className="text-white/30 group-hover:text-white/70 transition-colors text-base">↗</span>
          </div>
        </div>
      </div>
    </a>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const date = new Date(item.publishedAt);
  const color = CATEGORY_COLORS[item.category] || "#718096";
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl overflow-hidden border border-white/8 hover:border-white/16 transition-all duration-300 hover:translate-y-[-2px]"
      style={{ background: "#111820", fontFamily: "system-ui, -apple-system, sans-serif", borderTop: `2px solid ${color}` }}
    >
      <div className="relative overflow-hidden">
        <CardImage
          imageUrl={item.imageUrl}
          title={item.title}
          category={item.category}
          className="w-full aspect-video"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="text-sm font-semibold leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-3 flex-1">
          {item.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-white/30 pt-1 border-t border-white/5">
          <span className="text-white/50 font-medium">{item.source}</span>
          <span>·</span>
          <span>
            {date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
          <span className="ml-auto text-white/20 group-hover:text-white/50 transition-colors">↗</span>
        </div>
      </div>
    </a>
  );
}

export default function TimelinePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const categoryCounts: Record<string, number> = {};
  for (const item of news) {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  }

  const filtered =
    categoryFilter === "all"
      ? news
      : news.filter((n) => n.category === categoryFilter);

  const [hero, ...rest] = filtered;

  return (
    <div className="fade-in" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-white/90">
              News
            </h1>
            <span className="flex items-center gap-1.5 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="pulse-live absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green" />
              </span>
              <span className="text-xs text-accent-green font-medium">Live</span>
            </span>
          </div>
          <p className="text-sm text-white/30">
            Auto-aggregated from Telangana news sources
          </p>
        </div>
        {!loading && (
          <span className="text-sm text-white/30 mt-1">
            {filtered.length} stories
          </span>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const count = cat.key === "all" ? news.length : (categoryCounts[cat.key] || 0);
          const active = categoryFilter === cat.key;
          const color = cat.key === "all" ? "#e2e8f0" : cat.color;
          return (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: active ? `${color}22` : "transparent",
                color: active ? color : "rgba(255,255,255,0.35)",
                border: `1px solid ${active ? `${color}44` : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {cat.label}
              <span className="ml-1.5 opacity-60 text-xs">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-6">
          <div className="rounded-2xl overflow-hidden border border-white/8 animate-pulse" style={{ background: "#111820" }}>
            <div className="h-72 bg-white/5" />
            <div className="p-8 space-y-3">
              <div className="h-4 bg-white/5 rounded w-24" />
              <div className="h-6 bg-white/5 rounded w-3/4" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-white/8 animate-pulse" style={{ background: "#111820" }}>
                <div className="aspect-video bg-white/5" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-20" />
                  <div className="h-4 bg-white/5 rounded" />
                  <div className="h-4 bg-white/5 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/8 p-16 text-center" style={{ background: "#111820" }}>
          <p className="text-white/40 text-lg mb-2">No stories found</p>
          <p className="text-white/20 text-sm">RSS feeds are being aggregated. Check back shortly.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {hero && <HeroCard item={hero} />}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((item, i) => (
              <NewsCard key={item.id || i} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
