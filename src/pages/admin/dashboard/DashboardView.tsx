import { MetricCard } from "@/pages/admin/components/MetricCard";
import { RecentActivity } from "@/pages/admin/dashboard/RecentActivity";
import { ScheduleTable } from "@/pages/admin/dashboard/ScheduleTable";
import { QuickActions } from "@/pages/admin/components/QuickActions";

export function DashboardView() {
  const todayStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Header Title */}
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-display">
          Dashboard
        </h1>
        <p className="text-slate-400 text-xs md:text-sm font-normal mt-1 font-sans">
          Overview of drone service operations — Today, {todayStr}
        </p>
      </div>

      {/* Row 1 Metrics: 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Pending Requests"
          value={14}
          footer="Need review"
        />
        <MetricCard
          title="Active Missions"
          value={5}
          footer="Live now"
        />
        <MetricCard
          title="Available Pilots"
          value={9}
          footer="of 32 total"
        />
        <MetricCard
          title="Today's Revenue"
          value="LKR 128,400"
          footer="+12% vs yesterday"
        />
      </div>

      {/* Row 2 Metrics: 1 column aligned to the left */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Mission Success Rate"
          value="96%"
          footer="Last 90 days"
        />
      </div>

      {/* Activity and Schedule Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 items-start">
        <RecentActivity />
        <ScheduleTable />
      </div>

      {/* Quick Actions Panel */}
      <QuickActions />
    </div>
  );
}
