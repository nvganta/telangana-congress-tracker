import { getGuarantees, getBudget, getProjects, getComparison, getControversies, getWelfareScorecard } from "@/lib/data";
import StatsBar from "@/components/dashboard/StatsBar";
import GuaranteesWidget from "@/components/dashboard/GuaranteesWidget";
import BudgetWidget from "@/components/dashboard/BudgetWidget";
import TimelineWidget from "@/components/dashboard/TimelineWidget";
import DevelopmentWidget from "@/components/dashboard/DevelopmentWidget";
import CompareWidget from "@/components/dashboard/CompareWidget";
import CostCounter from "@/components/dashboard/CostCounter";
import SectorsWidget from "@/components/dashboard/SectorsWidget";

export default function DashboardPage() {
  const guarantees = getGuarantees();
  const budget = getBudget();
  const projects = getProjects();
  const comparisons = getComparison();
  const controversies = getControversies();
  const welfareSchemes = getWelfareScorecard();

  return (
    <div className="fade-in">
      {/* Page title */}
      <div className="text-center mb-6">
        <h1 className="text-lg md:text-2xl font-bold tracking-[0.15em] text-text-primary">
          <span className="neon-text-red">TELANGANA&apos;S</span> GOVERNMENT,
          TRACKED IN PUBLIC.
        </h1>
        <p className="text-[10px] tracking-[0.3em] text-text-muted mt-1">
          ACCOUNTABILITY DASHBOARD — ALL DATA FROM PUBLIC SOURCES
        </p>
      </div>

      {/* Stats bar */}
      <StatsBar guarantees={guarantees} budget={budget} />

      {/* Cost of Controversies banner */}
      <CostCounter controversies={controversies} />

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <GuaranteesWidget guarantees={guarantees} />
        <BudgetWidget budget={budget} />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <SectorsWidget welfareSchemes={welfareSchemes} />
        <TimelineWidget />
        <DevelopmentWidget projects={projects} />
      </div>

      {/* Third row */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <CompareWidget comparisons={comparisons} />
      </div>
    </div>
  );
}
