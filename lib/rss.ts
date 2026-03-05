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
    "cheyutha", "yuva vikasam", "kcr", "brs", "bhatti vikramarka",
    "tspsc", "tsrtc", "hydraa", "musi river", "kaleshwaram",
    "secunderabad", "warangal", "karimnagar", "nizamabad", "khammam",
    "nalgonda", "medak", "adilabad", "mahbubnagar", "sangareddy",
    "siddipet", "mancherial", "bhongir", "suryapet", "gadwal",
    "తెలంగాణ", "హైదరాబాద్", "కాంగ్రెస్", "రేవంత్",
  ];
  const lowerTitle = title.toLowerCase();
  return keywords.some((kw) => lowerTitle.includes(kw));
}

function isGovernanceRelated(title: string): boolean {
  const lower = title.toLowerCase();

  // Block non-governance topics outright
  const blockKeywords = [
    "cricket", "ipl", "volleyball", "kabaddi", "badminton", "tennis", "sports",
    "tollywood", "bollywood", "movie", "film", "actress", "actor", "box office",
    "celebrity", "entertainment", "song", "trailer", "ott", "web series",
    "drowning", "drowned", "road accident", "car crash", "bike accident",
    "dies by suicide", "found dead", "body found", "murder case", "honour killing",
    "drug bust", "mdma", "ganja seized", "narcotics", "drug peddl",
    "weather forecast", "temperature", "rainfall warning", "heatwave",
    "recipe", "food festival", "restaurant", "lifestyle",
    "iit jee", "neet result", "exam result", "admit card",
    "t20", "odi ", "test match", "world cup", "premier league",
    "wedding", "engagement", "birthday", "funeral",
  ];
  if (blockKeywords.some((kw) => lower.includes(kw))) return false;

  // Require at least one governance/political keyword
  const governanceKeywords = [
    // Political actors & parties
    "government", "govt", "congress", "brs", "bjp", "trs", "minister",
    "cm ", "chief minister", "revanth", "kcr", "bhatti", "rahul gandhi",
    "mla", "mp ", "speaker", "governor", "collector",
    // Government actions
    "policy", "scheme", "budget", "bill", "legislation", "order", "notification",
    "reform", "regulation", "ordinance", "cabinet", "assembly", "parliament",
    "election", "vote", "poll", "campaign", "manifesto",
    // Governance topics
    "welfare", "subsidy", "pension", "loan waiver", "free electricity",
    "free bus", "ration", "housing scheme", "land reform",
    "guarantee", "promise", "inaugurat", "launch", "allocat",
    "crore", "fiscal", "tax", "revenue", "expenditure", "debt",
    // Specific schemes & programs
    "mahalakshmi", "rythu bharosa", "gruha jyothi", "indiramma",
    "cheyutha", "yuva vikasam", "abhaya hastham", "dharani",
    "kaleshwaram", "musi river", "hydraa", "pharma city",
    "metro", "outer ring road", "regional ring road",
    // Government bodies
    "tspsc", "tsrtc", "ghmc", "hmda", "tsgenco", "tsspdcl",
    "high court", "supreme court", "tribunal",
    // Accountability
    "scam", "corruption", "probe", "investigation", "arrest",
    "controversy", "allegation", "accused", "chargesheet",
    "audit", "cag report", "white paper", "opposition",
    // Telugu governance terms
    "ప్రభుత్వ", "పథకం", "బడ్జెట్", "సంక్షేమ", "హామీ",
  ];
  return governanceKeywords.some((kw) => lower.includes(kw));
}

function categorizeNews(title: string): NewsItem["category"] {
  const lower = title.toLowerCase();

  const controversyKeywords = ["hydraa", "demolish", "demolition", "messi", "gandhi sarovar", "musi river", "scam", "arrest", "phone tap", "deepfake", "miss world", "formula e", "controversy", "allegation", "accused", "probe", "investigation"];
  if (controversyKeywords.some(k => lower.includes(k))) return "controversy";

  const budgetKeywords = ["budget", "allocation", "crore", "fiscal", "tax", "gst", "revenue", "expenditure", "spending", "debt", "borrowing"];
  if (budgetKeywords.some(k => lower.includes(k))) return "budget";

  const promiseKeywords = ["mahalakshmi", "rythu bharosa", "gruha jyothi", "indiramma", "cheyutha", "yuva vikasam", "guarantee", "promise", "scheme", "welfare", "pension", "loan waiver", "free electricity", "free bus"];
  if (promiseKeywords.some(k => lower.includes(k))) return "promise";

  const devKeywords = ["metro", "road", "highway", "pharma city", "infrastructure", "construction", "project", "irrigation", "ring road", "airport"];
  if (devKeywords.some(k => lower.includes(k))) return "development";

  const policyKeywords = ["policy", "bill", "assembly", "legislation", "order", "notification", "reform", "regulation"];
  if (policyKeywords.some(k => lower.includes(k))) return "policy";

  return "general";
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
        category: categorizeNews(item.title!),
      }));
  });

  const results = await Promise.allSettled(feedPromises);
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  // Two-pass filter:
  // 1. Must be Telangana-related (location/people keywords)
  // 2. Must be governance-related (political/policy content, not sports/entertainment/accidents)
  const filtered = allItems.filter(
    (item) => isTelanganRelated(item.title) && isGovernanceRelated(item.title)
  );

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
