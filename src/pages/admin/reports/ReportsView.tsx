import { Star } from "lucide-react";
import { PageHeader, MetricCard } from "@/components/ui";
import { BarChart, LineChart } from "@/components/charts";
import {
  mockReportsMetrics,
  mockPilotPerformance,
  mockBarChartData,
  mockLineChartPoints,
} from "@/data/mockData";

export function ReportsView() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header Info */}
      <PageHeader
        title="Reports"
        description="Analytics dashboard for operations, revenue and performance"
      />

      {/* Metrics Row (5 columns) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {mockReportsMetrics.map((m) => (
          <MetricCard key={m.title} title={m.title} value={m.value} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missions Completed Bar Chart */}
        <BarChart title="Monthly Trends — Missions Completed" data={mockBarChartData} />

        {/* Revenue Trend SVG Line Chart */}
        <LineChart title="Revenue Trend" points={mockLineChartPoints} />
      </div>

      {/* Pilot Performance Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <h3 className="text-xl font-normal text-slate-900 font-display">Pilot Performance Table</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-normal">
                <th className="pb-3 pl-2">Pilot</th>
                <th className="pb-3">Missions</th>
                <th className="pb-3">Avg Rating</th>
                <th className="pb-3">On-Time %</th>
                <th className="pb-3">Flight Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 text-sm">
              {mockPilotPerformance.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                  <td className="py-4 pl-2 text-slate-850 font-normal">{p.pilot}</td>
                  <td className="py-4 text-slate-600 font-normal">{p.missions}</td>
                  <td className="py-4 text-slate-600 font-normal">
                    <span className="inline-flex items-center gap-1">
                      {p.rating}
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    </span>
                  </td>
                  <td className="py-4 text-slate-600 font-normal">{p.onTime}</td>
                  <td className="py-4 text-slate-600 font-normal">{p.flightHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Download Buttons */}
      <div className="flex gap-4 pt-2">
        <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-normal transition-colors cursor-pointer">
          Download PDF
        </button>
        <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-normal transition-colors cursor-pointer">
          Download Excel
        </button>
      </div>
    </div>
  );
}
