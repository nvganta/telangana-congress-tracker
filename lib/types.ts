export type PromiseStatus = "fulfilled" | "partially_fulfilled" | "in_progress" | "not_started" | "broken";
export type PromiseCategory = "guarantee" | "manifesto";
export type PromiseSubcategory = "women" | "farmers" | "electricity" | "housing" | "jobs" | "pension" | "education" | "health" | "infrastructure" | "other";

export interface GovernmentPromise {
  id: string;
  name: string;
  nameTelugu?: string;
  category: PromiseCategory;
  subcategory: PromiseSubcategory;
  description: string;
  status: PromiseStatus;
  progress: number;
  promised: string;
  delivered: string;
  promisedDate: string;
  lastUpdated: string;
  sourceUrls: string[];
  keyMetrics?: { label: string; promised: string; actual: string }[];
}

export interface BudgetItem {
  id: string;
  schemeName: string;
  category: string;
  allocated: number;
  spent: number;
  year: string;
  sourceUrl: string;
  lastUpdated: string;
}

export type ProjectStatus = "announced" | "in_progress" | "stalled" | "completed" | "cancelled";
export type ProjectCategory = "road" | "metro" | "irrigation" | "building" | "industrial" | "other";

export interface DevelopmentProject {
  id: string;
  name: string;
  district: string;
  category: ProjectCategory;
  status: ProjectStatus;
  estimatedCost: number;
  actualCost?: number;
  startDate?: string;
  expectedCompletion?: string;
  description: string;
  sourceUrls: string[];
  lastUpdated: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: "policy" | "budget" | "controversy" | "development" | "promise" | "general";
  imageUrl?: string;
  /** Slugs of Telangana districts mentioned in the title. Empty array = state-level or untagged. */
  districts: string[];
}

export interface ComparisonMetric {
  id: string;
  metric: string;
  category: string;
  brsValue: string;
  congressValue: string;
  unit?: string;
  betterIs: "higher" | "lower";
  context?: string;
  sourceUrl: string;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  category: "government" | "news_english" | "news_telugu" | "rti" | "budget" | "reports" | "social_media";
  description: string;
  credibility: "official" | "established" | "independent" | "social";
}

export interface Controversy {
  id: string;
  title: string;
  date: string;
  estimatedCost?: number;
  summary: string;
  whatHappened: string;
  governmentResponse: string;
  whatDataShows: string;
  sourceUrls: string[];
  lastUpdated: string;
}

export interface SectorData {
  id: string;
  sector: "agriculture" | "education" | "realestate" | "fiscal" | "employment";
  title: string;
  metrics: { label: string; value: string; context?: string }[];
  narrative: string;
  sourceUrls: string[];
  lastUpdated: string;
}

export type WelfareTier = "fully_implemented" | "partially_implemented" | "zero_implementation";

export interface WelfareScheme {
  id: string;
  name: string;
  tier: WelfareTier;
  description: string;
  keyMetric: string;
  sourceUrl: string;
}
