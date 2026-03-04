import { NewsItem } from "./types";
import { RSS_FEEDS } from "./constants";

interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  creator?: string;
  contentSnippet?: string;
  isoDate?: string;
}

interface RSSFeed {
  items: RSSItem[];
}

async function parseFeed(url: string): Promise<RSSFeed> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 }, // 30 min cache
      headers: { "User-Agent": "TelanganaTracker/1.0" },
    });
    if (!res.ok) return { items: [] };

    const xml = await res.text();
    const items: RSSItem[] = [];

    // Simple XML parser for RSS items
    const itemMatches = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
    for (const itemXml of itemMatches) {
      const title = itemXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim();
      const link = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim();
      const pubDate = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim();
      items.push({ title, link, pubDate });
    }

    return { items };
  } catch {
    return { items: [] };
  }
}

function isTelanganRelated(title: string): boolean {
  const keywords = [
    "telangana", "hyderabad", "revanth", "congress", "ts govt",
    "mahalakshmi", "rythu bharosa", "gruha jyothi", "indiramma",
    "cheyutha", "yuva vikasam", "kcr", "brs",
    "తెలంగాణ", "హైదరాబాద్", "కాంగ్రెస్",
  ];
  const lowerTitle = title.toLowerCase();
  return keywords.some((kw) => lowerTitle.includes(kw));
}

export async function fetchAllNews(limit: number = 30): Promise<NewsItem[]> {
  const allItems: NewsItem[] = [];

  const feedPromises = RSS_FEEDS.map(async (feed) => {
    const parsed = await parseFeed(feed.url);
    return parsed.items
      .filter((item) => item.title && item.link)
      .map((item, i) => ({
        id: `${feed.name}-${i}-${item.pubDate || Date.now()}`,
        title: item.title!.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"'),
        source: feed.name,
        url: item.link!,
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        category: "general" as const,
      }));
  });

  const results = await Promise.allSettled(feedPromises);
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  // Filter for Telangana-related news from general feeds
  const filtered = allItems.filter((item) => {
    const source = item.source.toLowerCase();
    // Always include items from Telangana-specific feeds
    if (source.includes("telangana") || source.includes("google news")) return true;
    // For general feeds, filter by relevance
    return isTelanganRelated(item.title);
  });

  // Sort by date, newest first
  filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Deduplicate by similar titles
  const seen = new Set<string>();
  const deduped = filtered.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped.slice(0, limit);
}
