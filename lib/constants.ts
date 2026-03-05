import { PromiseStatus, ProjectStatus } from "./types";

export const ELECTION_DATE = "2023-12-03";
export const GOVERNMENT_FORMATION_DATE = "2023-12-07";

export const RSS_FEEDS = [
  {
    url: "https://news.google.com/rss/search?q=Telangana+Congress+government&hl=en-IN&gl=IN&ceid=IN:en",
    name: "Google News (English)",
    language: "en",
  },
  {
    url: "https://news.google.com/rss/search?q=%E0%B0%A4%E0%B1%86%E0%B0%B2%E0%B0%82%E0%B0%97%E0%B0%BE%E0%B0%A3+%E0%B0%95%E0%B0%BE%E0%B0%82%E0%B0%97%E0%B1%8D%E0%B0%B0%E0%B1%86%E0%B0%B8%E0%B1%8D&hl=te&gl=IN&ceid=IN:te",
    name: "Google News (Telugu)",
    language: "te",
  },
  {
    url: "https://news.google.com/rss/search?q=Telangana+government+policy+scheme+budget&hl=en-IN&gl=IN&ceid=IN:en",
    name: "Google News (Governance)",
    language: "en",
  },
  {
    url: "https://news.google.com/rss/search?q=Revanth+Reddy+Telangana&hl=en-IN&gl=IN&ceid=IN:en",
    name: "Google News (CM)",
    language: "en",
  },
  {
    url: "https://telanganatoday.com/feed",
    name: "Telangana Today",
    language: "en",
  },
  {
    url: "https://www.thehindu.com/news/national/telangana/feeder/default.rss",
    name: "The Hindu (Telangana)",
    language: "en",
  },
  {
    url: "https://www.thehindu.com/news/cities/Hyderabad/feeder/default.rss",
    name: "The Hindu (Hyderabad)",
    language: "en",
  },
  {
    url: "https://indianexpress.com/section/cities/hyderabad/feed/",
    name: "Indian Express",
    language: "en",
  },
];

export const STATUS_COLORS: Record<PromiseStatus, string> = {
  fulfilled: "#00ff88",
  partially_fulfilled: "#ffcc00",
  in_progress: "#0099ff",
  not_started: "#ff3333",
  broken: "#ff0055",
};

export const STATUS_LABELS: Record<PromiseStatus, string> = {
  fulfilled: "FULFILLED",
  partially_fulfilled: "PARTIAL",
  in_progress: "IN PROGRESS",
  not_started: "NOT STARTED",
  broken: "BROKEN",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  announced: "#0099ff",
  in_progress: "#ffcc00",
  stalled: "#ff6600",
  completed: "#00ff88",
  cancelled: "#ff0055",
};

export const CATEGORIES = {
  women: { label: "Women", icon: "♀" },
  farmers: { label: "Farmers", icon: "🌾" },
  electricity: { label: "Electricity", icon: "⚡" },
  housing: { label: "Housing", icon: "🏠" },
  jobs: { label: "Jobs", icon: "💼" },
  pension: { label: "Pension", icon: "👴" },
  education: { label: "Education", icon: "📚" },
  health: { label: "Health", icon: "🏥" },
  infrastructure: { label: "Infrastructure", icon: "🏗️" },
  other: { label: "Other", icon: "📋" },
};
