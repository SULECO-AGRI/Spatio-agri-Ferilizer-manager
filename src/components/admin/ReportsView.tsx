import { Star } from "lucide-react";

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
  { title: "Drone Utilization", value: "72%" }
];

const mockPilotPerformance: PilotPerf[] = [
  { pilot: "Nimal Perera", missions: 312, rating: 4.9, onTime: "98%", flightHours: "1,240 hrs" },
  { pilot: "Sanduni Fernando", missions: 201, rating: 4.7, onTime: "95%", flightHours: "860 hrs" },
  { pilot: "Amal Jayasuriya", missions: 154, rating: 4.8, onTime: "97%", flightHours: "610 hrs" }
];

// Monthly Missions Completed (for the bar chart)
const barChartData = [
  { month: "Jan", value: 160, height: "80px" },
  { month: "Feb", value: 210, height: "105px" },
  { month: "Mar", value: 170, height: "85px" },
  { month: "Apr", value: 260, height: "130px" },
  { month: "May", value: 290, height: "145px" },
  { month: "Jun", value: 230, height: "115px" },
  { month: "Jul", value: 312, height: "156px" }
];

export function ReportsView() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-display">
          Reports
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1 font-normal">
          Analytics dashboard for operations, revenue and performance
        </p>
      </div>

      {/* Metrics Row (5 columns) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {mockMetrics.map((m) => (
          <div key={m.title} className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col shadow-xs">
            <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider block">
              {m.title}
            </span>
            <span className="text-2xl font-medium text-slate-900 mt-2 font-display">
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missions Completed Bar Chart */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-normal text-slate-500 mb-6 uppercase tracking-wider block">
            Monthly Trends — Missions Completed
          </h3>
          {/* Custom CSS Bars Container */}
          <div className="flex items-end justify-between h-[180px] px-4 border-b border-slate-100 pb-2">
            {barChartData.map((data) => (
              <div key={data.month} className="flex flex-col items-center gap-2 group w-full">
                {/* Bar Value Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded-sm mb-1 absolute transform -translate-y-12">
                  {data.value}
                </div>
                {/* Bar element */}
                <div
                  className="w-8 md:w-10 bg-slate-200 border border-slate-300 rounded-t-xs hover:bg-slate-300 transition-colors"
                  style={{ height: data.height }}
                />
              </div>
            ))}
          </div>
          {/* Labels Row */}
          <div className="flex justify-between px-4 pt-2 text-[10px] text-slate-400 font-normal">
            {barChartData.map((data) => (
              <span key={data.month} className="w-8 md:w-10 text-center block">
                {data.month}
              </span>
            ))}
          </div>
        </div>

        {/* Revenue Trend SVG Line Chart */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-normal text-slate-500 mb-6 uppercase tracking-wider block">
            Revenue Trend
          </h3>
          {/* Custom SVG Line Container */}
          <div className="relative h-[180px] w-full flex items-center justify-center">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
              {/* Background grid lines */}
              <line x1="0" y1="25" x2="500" y2="25" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="125" x2="500" y2="125" stroke="#f1f5f9" strokeWidth="1" />
              
              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
                points="35,115 110,85 185,100 260,70 335,80 410,50 475,65"
              />
              
              {/* Data points (circles) */}
              <circle cx="35" cy="115" r="3.5" fill="white" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="110" cy="85" r="3.5" fill="white" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="185" cy="100" r="3.5" fill="white" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="260" cy="70" r="3.5" fill="white" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="335" cy="80" r="3.5" fill="white" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="410" cy="50" r="3.5" fill="white" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="475" cy="65" r="3.5" fill="white" stroke="#64748b" strokeWidth="1.5" />
            </svg>
          </div>
          {/* Labels Row aligned to SVG coordinates */}
          <div className="flex justify-between px-3 pt-2 text-[10px] text-slate-400 font-normal border-t border-slate-100">
            <span className="w-10 text-center">Jan</span>
            <span className="w-10 text-center">Feb</span>
            <span className="w-10 text-center">Mar</span>
            <span className="w-10 text-center">Apr</span>
            <span className="w-10 text-center">May</span>
            <span className="w-10 text-center">Jun</span>
            <span className="w-10 text-center">Jul</span>
          </div>
        </div>
      </div>

      {/* Pilot Performance Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <h3 className="text-xl font-normal text-slate-900 font-display">
          Pilot Performance Table
        </h3>

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
                  <td className="py-4 pl-2 text-slate-850 font-normal">
                    {p.pilot}
                  </td>
                  <td className="py-4 text-slate-600 font-normal">
                    {p.missions}
                  </td>
                  <td className="py-4 text-slate-600 font-normal">
                    <span className="inline-flex items-center gap-1">
                      {p.rating}
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    </span>
                  </td>
                  <td className="py-4 text-slate-600 font-normal">
                    {p.onTime}
                  </td>
                  <td className="py-4 text-slate-600 font-normal">
                    {p.flightHours}
                  </td>
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
