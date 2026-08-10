import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Construction, ArrowRight } from "lucide-react";
import { Sidebar, TabId } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { MetricCard } from "@/components/admin/MetricCard";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { ScheduleTable } from "@/components/admin/ScheduleTable";
import { QuickActions } from "@/components/admin/QuickActions";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate quick dynamic loading for page-mount and tab-switches to enhance usability
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timer);
  }, [activeTab]);
  
  const todayStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex relative overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-sky-500/10 blur-[130px]" />
        <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 min-h-screen flex flex-col transition-all duration-300">
        {isLoading ? (
          /* Sleek & Lightweight Loading Spinner */
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#14532d] animate-spin" />
            <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase font-sans">
              Loading...
            </span>
          </div>
        ) : (
          <div className="flex-1 p-6 md:p-8 lg:p-10 space-y-6 md:space-y-8 max-w-7xl w-full mx-auto">
            {/* Top Header Section */}
            <Topbar />

          {activeTab === "dashboard" ? (
            <div className="space-y-6 md:space-y-8">
              {/* Header Title */}
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                  Dashboard
                </h1>
                <p className="text-slate-400 text-xs md:text-sm font-semibold mt-1 font-sans">
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
          ) : (
            // Fallback screen for other tabs
            <div className="flex-1 py-12 flex items-center justify-center">
              <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-8 md:p-12 text-center shadow-xs font-sans">
                <div className="mx-auto w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-6">
                  <Construction className="w-8 h-8 text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 capitalize font-display">
                  {activeTab.replace("-", " ")} Section
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                  This segment of the SpatioAgri portal is under configuration. The database, shapefile generation services, and telemetry feeds will map directly to this view.
                </p>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#14532d] hover:bg-[#166534] text-white font-semibold px-6 py-2.5 transition-colors duration-200 cursor-pointer text-xs"
                >
                  Return to Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
