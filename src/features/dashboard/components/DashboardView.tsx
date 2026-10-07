import { memo } from "react";
import { PageHeader, MetricCard } from "@/components/common";
import { QuickActions } from "@/components/layout";
import { RecentActivity } from "./RecentActivity";
import { ScheduleTable } from "./ScheduleTable";
import { LiveMissionMap } from "./LiveMissionMap";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useLanguage } from "@/context/LanguageContext";
import type { TabId } from "@/types";

interface DashboardViewProps {
  onNavigate?: (tab: TabId) => void;
}

export const DashboardView = memo(function DashboardView({ onNavigate }: DashboardViewProps) {
  const { metrics, isLoading } = useDashboardStats();
  const { dict, isSinhala } = useLanguage();

  const todayStr = new Date().toLocaleDateString(isSinhala ? "si-LK" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={`space-y-6 md:space-y-8 animate-in fade-in duration-300 ${isSinhala ? "font-sinhala" : ""}`}>
      {/* Header Title */}
      <PageHeader
        title={dict.admin.dashboard.title}
        description={`${dict.admin.dashboard.description} — ${todayStr}`}
      />

      {/* Metrics Row: 5 Key Performance Indicators with Real Backend Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title={dict.admin.dashboard.pendingRequests}
          value={isLoading ? "..." : metrics.pendingRequests}
          footer={dict.admin.dashboard.pendingFooter}
        />
        <MetricCard
          title={dict.admin.dashboard.activeMissions}
          value={isLoading ? "..." : metrics.activeMissions}
          footer={dict.admin.dashboard.activeFooter}
        />
        <MetricCard
          title={dict.admin.dashboard.availablePilots}
          value={isLoading ? "..." : `${metrics.availablePilots} / ${metrics.totalPilots}`}
          footer={`${metrics.onlinePilots} ${dict.admin.dashboard.pilotsOnline}`}
        />
        <MetricCard
          title={dict.admin.dashboard.totalRevenue}
          value={isLoading ? "..." : metrics.todayRevenueFormatted}
          trend={metrics.revenueTrend}
        />
        <MetricCard
          title={dict.admin.dashboard.missionSuccessRate}
          value={isLoading ? "..." : `${metrics.successRate}%`}
          footer={dict.admin.dashboard.successFooter}
        />
      </div>

      {/* Quick Action Shortcut Ribbon */}
      {onNavigate && <QuickActions onNavigate={onNavigate} />}

      {/* Main Interactive Geo-Telemetry Map */}
      <LiveMissionMap />

      {/* Operations Overview: Mission Schedule and Live System Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScheduleTable recentRequests={metrics.recentRequests} />
        <RecentActivity recentRequests={metrics.recentRequests} />
      </div>
    </div>
  );
});

export default DashboardView;

