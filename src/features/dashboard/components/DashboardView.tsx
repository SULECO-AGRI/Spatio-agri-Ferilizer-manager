import { memo } from "react";
import { PageHeader, MetricCard } from "@/components/common";
import { QuickActions } from "@/components/layout";
import { RecentActivity } from "./RecentActivity";
import { ScheduleTable } from "./ScheduleTable";
import { LiveMissionMap } from "./LiveMissionMap";
import { useDashboardStats } from "../hooks/useDashboardStats";
import type { TabId } from "@/types";

interface DashboardViewProps {
  onNavigate?: (tab: TabId) => void;
}

export const DashboardView = memo(function DashboardView({ onNavigate }: DashboardViewProps) {
  const { metrics, isLoading } = useDashboardStats();

  const todayStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Header Title */}
      <PageHeader
        title="Dashboard"
        description={`Overview of drone service operations — Today, ${todayStr}`}
      />

      {/* Metrics Row: 5 Key Performance Indicators with Real Backend Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Pending Requests"
          value={isLoading ? "..." : metrics.pendingRequests}
          footer="Awaiting operator assignment"
        />
        <MetricCard
          title="Active Missions"
          value={isLoading ? "..." : metrics.activeMissions}
          footer="Live telemetry tracking"
        />
        <MetricCard
          title="Available Pilots"
          value={isLoading ? "..." : `${metrics.availablePilots} / ${metrics.totalPilots}`}
          footer={`${metrics.onlinePilots} online`}
        />
        <MetricCard
          title="Total Revenue"
          value={isLoading ? "..." : metrics.todayRevenueFormatted}
          trend={metrics.revenueTrend}
        />
        <MetricCard
          title="Mission Success Rate"
          value={isLoading ? "..." : `${metrics.successRate}%`}
          footer="All completed flights"
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
