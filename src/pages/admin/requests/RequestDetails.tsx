import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import { detailedRequestsInfo } from "@/data/mockData";

interface RequestDetailsProps {
  requestId: string;
  onBack: () => void;
}

export function RequestDetails({ requestId, onBack }: RequestDetailsProps) {
  // Fallback default details if the requestId is not pre-mocked
  const details = detailedRequestsInfo[requestId] || {
    farmerName: "S. Fernando",
    phone: "+94 75 222 3333",
    email: "s.fernando@mail.com",
    district: "Polonnaruwa District",
    memberSince: "2022",
    fieldName: "Boundary - West Paddy",
    crop: "Rice (BG 352)",
    growthStage: "Tillering",
    service: "Pesticide Spraying",
    prefDate: "Jul 22, 2026 - 02:00 PM",
    duration: "45 minutes",
    drone: "DJI Agras T40",
    weather: "Jul 22: 30°C, Wind 11 km/h, Rain 20%",
    risk: "Low Risk",
    area: "1.8 ha",
    priority: "High",
    status: "Pending Review",
    svgPoints: "120,60 380,80 340,180 80,160",
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Back Link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer select-none"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Service Requests</span>
      </button>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-display">
            Request {requestId}
          </h1>
        </div>
        <StatusBadge status={details.status} size="md" />
      </div>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Detailed Cards (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Farmer Information */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
              Farmer Information
            </h3>

            <div className="flex items-center gap-4 bg-slate-50/50 border border-slate-200/50 p-5 rounded-2xl">
              <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-slate-800 leading-none">
                  {details.farmerName}
                </h4>
                <p className="text-xs text-slate-500 font-normal">
                  {details.phone} <span className="text-slate-300 mx-1.5">|</span> {details.email}
                </p>
                <p className="text-xs text-slate-500 font-normal">
                  {details.district} <span className="text-slate-300 mx-1.5">|</span> Member since{" "}
                  {details.memberSince}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Field Information */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
              Field Information
            </h3>

            {/* SVG Polygon Map Panel */}
            <div className="relative w-full h-[240px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 500 240">
                {/* Background dash lines representing grid mapping */}
                <line x1="0" y1="60" x2="500" y2="60" stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="125" y1="0" x2="125" y2="240" stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="250" y1="0" x2="250" y2="240" stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="375" y1="0" x2="375" y2="240" stroke="#e2e8f0" strokeDasharray="3,3" />

                {/* Dashed outer boundary line */}
                <polygon
                  points={details.svgPoints}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />

                {/* Field Polygon Area */}
                <polygon
                  points={details.svgPoints}
                  fill="rgba(16, 185, 129, 0.08)"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />

                {/* Center Label */}
                <text
                  x="240"
                  y="125"
                  fill="#047857"
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="sans-serif"
                >
                  {details.fieldName}
                </text>
              </svg>

              {/* Map controls (+ and -) overlay */}
              <div className="absolute top-4 right-4 flex flex-col gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-xs select-none">
                <button className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-800 text-xs font-normal border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                  +
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-800 text-xs font-normal hover:bg-slate-50 cursor-pointer">
                  -
                </button>
              </div>
            </div>

            {/* Grid detail metrics */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 text-xs font-normal pt-2">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Crop
                  </span>
                  <span className="text-slate-800 font-medium mt-1 block">{details.crop}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Requested Service
                  </span>
                  <span className="text-slate-800 font-medium mt-1 block">{details.service}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Estimated Duration
                  </span>
                  <span className="text-slate-800 font-medium mt-1 block">{details.duration}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Growth Stage
                  </span>
                  <span className="text-slate-800 font-medium mt-1 block">
                    {details.growthStage}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Preferred Date
                  </span>
                  <span className="text-slate-800 font-medium mt-1 block">{details.prefDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Recommended Drone
                  </span>
                  <span className="text-slate-800 font-medium mt-1 block">{details.drone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Weather Forecast */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
              Weather Forecast
            </h3>

            <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200/50 rounded-xl text-xs font-normal">
              <span className="text-slate-700">{details.weather}</span>
              <StatusBadge status={details.risk} />
            </div>
          </div>
        </div>

        {/* Right Sidebar panels (1/3 width) */}
        <div className="space-y-6">
          {/* Card A: Request Summary */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 font-normal text-xs">
            <h3 className="text-sm font-normal text-slate-800 font-display">Request Summary</h3>

            <div className="divide-y divide-slate-100">
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Request ID</span>
                <span className="text-slate-700">{requestId}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Submitted</span>
                <span className="text-slate-700">Jul 19, 2026</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Area</span>
                <span className="text-slate-700">{details.area}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Priority</span>
                <span className="text-slate-700">{details.priority}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Status</span>
                <span className="text-slate-700">{details.status}</span>
              </div>
            </div>
          </div>

          {/* Card B: Actions panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-normal text-slate-850 font-display">Actions</h3>

            <div className="flex flex-col gap-2.5">
              <button className="w-full py-2.5 px-4 bg-[#14532d] hover:bg-[#166534] text-white rounded-lg text-xs font-normal transition-colors cursor-pointer text-center">
                Approve
              </button>
              <button className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-normal transition-colors cursor-pointer text-center">
                Reject
              </button>
              <button className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-normal transition-colors cursor-pointer text-center">
                Assign Pilot
              </button>
              <button className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-normal transition-colors cursor-pointer text-center">
                Reschedule
              </button>
              <button className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-normal transition-colors cursor-pointer text-center">
                Contact Farmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
