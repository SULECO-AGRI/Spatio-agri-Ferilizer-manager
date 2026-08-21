import { PageHeader, MetricCard } from "@/components/ui";
import { RecentActivity } from "@/pages/admin/dashboard/RecentActivity";
import { ScheduleTable } from "@/pages/admin/dashboard/ScheduleTable";
import { LiveMissionMap } from "@/pages/admin/dashboard/LiveMissionMap";
import { QuickActions } from "@/pages/admin/components/QuickActions";
import type { TabId } from "@/types";

interface DashboardViewProps {
  onNavigate?: (tab: TabId) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
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

      {/* Metrics Row: 5 Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <MetricCard title="Pending Requests" value={14} footer="Need review" />
        <MetricCard title="Active Missions" value={5} footer="Live in flight" />
        <MetricCard title="Available Pilots" value={9} footer="of 32 registered" />
        <MetricCard
          title="Today's Revenue"
          value="LKR 128,400"
          trend={{ value: "+12% vs yesterday", isPositive: true }}
        />
        <MetricCard title="Mission Success Rate" value="96%" footer="Last 90 days" />
      </div>

      {/* Live Geospatial Active Drone Missions Map */}
      <LiveMissionMap />

      {/* Activity and Schedule Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 items-start">
        <RecentActivity />
        <ScheduleTable />
      </div>

      {/* Quick Actions Panel */}
      <QuickActions onNavigate={onNavigate} />
    </div>
  );
}

export default DashboardView;
