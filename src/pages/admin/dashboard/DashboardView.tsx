import { PageHeader, MetricCard } from "@/components/ui";
import { RecentActivity } from "@/pages/admin/dashboard/RecentActivity";
import { ScheduleTable } from "@/pages/admin/dashboard/ScheduleTable";
import { LiveMissionMap } from "@/pages/admin/dashboard/LiveMissionMap";
import { QuickActions } from "@/pages/admin/components/QuickActions";
import { useDashboardStats } from "@/pages/admin/dashboard/hooks/useDashboardStats";
import type { TabId } from "@/types";

interface DashboardViewProps {
  onNavigate?: (tab: TabId) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <MetricCard
          title="Pending Requests"
          value={isLoading ? "..." : metrics.pendingRequests}
          footer="Need review"
        />
        <MetricCard
          title="Active Missions"
          value={isLoading ? "..." : metrics.activeMissions}
          footer="Live in flight"
        />
        <MetricCard
          title="Available Pilots"
          value={isLoading ? "..." : metrics.availablePilots}
          footer={`of ${metrics.totalPilots} registered`}
        />
        <MetricCard
          title="Today's Revenue"
          value={isLoading ? "..." : metrics.todayRevenueFormatted}
          trend={metrics.revenueTrend}
        />
        <MetricCard
          title="Mission Success Rate"
          value={isLoading ? "..." : `${metrics.successRate}%`}
          footer="Last 90 days"
        />
      </div>

      {/* Live Geospatial Active Drone Missions Map */}
      <LiveMissionMap />

      {/* Activity and Schedule Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 items-start">
        <RecentActivity recentRequests={metrics.recentRequests} />
        <ScheduleTable recentRequests={metrics.recentRequests} />
      </div>

      {/* Quick Actions Panel */}
      <QuickActions onNavigate={onNavigate} />
    </div>
  );
}

export default DashboardView;
