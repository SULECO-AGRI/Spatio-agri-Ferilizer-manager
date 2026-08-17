import { Star } from "lucide-react";
import { PageHeader, MetricCard } from "@/components/ui";
import { BarChart, LineChart } from "@/components/charts";

interface PilotPerf {
  pilot: string;
  missions: number;
  rating: number;
  onTime: string;
  flightHours: string;
}

const mockMetrics = [
  { title: "Completed Missions", value: "312" },
  { title: "Revenue", value: "LKR 2.4M" },
  { title: "Pilot Performance", value: "4.7 avg" },
  { title: "Farmer Growth", value: "+18%" },
  { title: "Drone Utilization", value: "72%" },
];

const mockPilotPerformance: PilotPerf[] = [
  { pilot: "Nimal Perera", missions: 312, rating: 4.9, onTime: "98%", flightHours: "1,240 hrs" },
  { pilot: "Sanduni Fernando", missions: 201, rating: 4.7, onTime: "95%", flightHours: "860 hrs" },
  { pilot: "Amal Jayasuriya", missions: 154, rating: 4.8, onTime: "97%", flightHours: "610 hrs" },
];

const barChartData = [
  { label: "Jan", value: 160 },
  { label: "Feb", value: 210 },
  { label: "Mar", value: 170 },
  { label: "Apr", value: 260 },
  { label: "May", value: 290 },
  { label: "Jun", value: 230 },
  { label: "Jul", value: 312 },
];

const lineChartPoints = [
  { label: "Jan", x: 35, y: 115 },
  { label: "Feb", x: 110, y: 85 },
  { label: "Mar", x: 185, y: 100 },
  { label: "Apr", x: 260, y: 70 },
  { label: "May", x: 335, y: 80 },
  { label: "Jun", x: 410, y: 50 },
  { label: "Jul", x: 475, y: 65 },
];

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
        {mockMetrics.map((m) => (
          <MetricCard key={m.title} title={m.title} value={m.value} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missions Completed Bar Chart */}
        <BarChart title="Monthly Trends — Missions Completed" data={barChartData} />

        {/* Revenue Trend SVG Line Chart */}
        <LineChart title="Revenue Trend" points={lineChartPoints} />
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
