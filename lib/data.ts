import { GovernmentPromise, BudgetItem, DevelopmentProject, ComparisonMetric, Source } from "./types";
import guaranteesData from "@/data/guarantees.json";
import budgetData from "@/data/budget.json";
import projectsData from "@/data/projects.json";
import comparisonData from "@/data/comparison.json";
import sourcesData from "@/data/sources.json";
import { GOVERNMENT_FORMATION_DATE } from "./constants";

export function getGuarantees(): GovernmentPromise[] {
  return guaranteesData as GovernmentPromise[];
}

export function getBudget(): BudgetItem[] {
  return budgetData as BudgetItem[];
}

export function getProjects(): DevelopmentProject[] {
  return projectsData as DevelopmentProject[];
}

export function getComparison(): ComparisonMetric[] {
  return comparisonData as ComparisonMetric[];
}

export function getSources(): Source[] {
  return sourcesData as Source[];
}

export function getDaysInPower(): number {
  const start = new Date(GOVERNMENT_FORMATION_DATE);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function getPromiseStats(guarantees: GovernmentPromise[]) {
  const fulfilled = guarantees.filter(g => g.status === "fulfilled").length;
  const partial = guarantees.filter(g => g.status === "partially_fulfilled").length;
  const notStarted = guarantees.filter(g => g.status === "not_started").length;
  const broken = guarantees.filter(g => g.status === "broken").length;
  const inProgress = guarantees.filter(g => g.status === "in_progress").length;
  const avgProgress = Math.round(guarantees.reduce((sum, g) => sum + g.progress, 0) / guarantees.length);
  return { fulfilled, partial, notStarted, broken, inProgress, total: guarantees.length, avgProgress };
}

export function getBudgetStats(budget: BudgetItem[]) {
  const totalAllocated = budget.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budget.reduce((sum, b) => sum + b.spent, 0);
  const utilization = Math.round((totalSpent / totalAllocated) * 100);
  return { totalAllocated, totalSpent, utilization };
}

export function getOverallGrade(allPromises: GovernmentPromise[]): string {
  // Grade based on the 6 key guarantees only
  const sixGuarantees = allPromises.filter(g => g.category === "guarantee");
  const stats = getPromiseStats(sixGuarantees);
  const score = stats.avgProgress;
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  if (score >= 20) return "D";
  return "F";
}
