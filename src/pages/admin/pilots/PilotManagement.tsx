import { useState } from "react";
import { Search, Star } from "lucide-react";

type PilotStatus = "Available" | "Busy" | "Offline" | "Online";

interface Pilot {
  id: string;
  name: string;
  initials: string;
  status: PilotStatus;
  license: string;
  drone: string;
  experience: string;
  rating: number;
  missions: number;
  flightHours: string;
  batteryLevel: number;
}

const mockPilots: Pilot[] = [
  {
    id: "1",
    name: "Nimal Perera",
    initials: "NP",
    status: "Available",
    license: "DP-2291",
    drone: "DJI Agras T40",
    experience: "6 yrs",
    rating: 4.9,
    missions: 312,
    flightHours: "1,240",
    batteryLevel: 85,
  },
  {
    id: "2",
    name: "Sanduni Fernando",
    initials: "SF",
    status: "Busy",
    license: "DP-2104",
    drone: "DJI Agras T30",
    experience: "4 yrs",
    rating: 4.7,
    missions: 201,
    flightHours: "860",
    batteryLevel: 70,
  },
  {
    id: "3",
    name: "Amal Jayasuriya",
    initials: "AJ",
    status: "Available",
    license: "DP-2337",
    drone: "XAG P100",
    experience: "3 yrs",
    rating: 4.8,
    missions: 154,
    flightHours: "610",
    batteryLevel: 95,
  },
  {
    id: "4",
    name: "Ruwan Kumara",
    initials: "RK",
    status: "Offline",
    license: "DP-1988",
    drone: "DJI Agras T40",
    experience: "7 yrs",
    rating: 4.6,
    missions: 402,
    flightHours: "1,510",
    batteryLevel: 0,
  },
  {
    id: "5",
    name: "Chathurika Silva",
    initials: "CS",
    status: "Online",
    license: "DP-2410",
    drone: "XAG P100",
    experience: "2 yrs",
    rating: 4.9,
    missions: 98,
    flightHours: "340",
    batteryLevel: 60,
  },
  {
    id: "6",
    name: "Dinesh Rajapaksa",
    initials: "DR",
    status: "Available",
    license: "DP-2055",
    drone: "DJI Agras T30",
    experience: "5 yrs",
    rating: 4.5,
    missions: 267,
    flightHours: "980",
    batteryLevel: 80,
  },
];

export function PilotManagement() {
  const [activeFilter, setActiveFilter] = useState<PilotStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter pilots based on active tab and search query
  const filteredPilots = mockPilots.filter((pilot) => {
    const matchesTab = activeFilter === "All" || pilot.status === activeFilter;
    const matchesSearch =
      pilot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pilot.drone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pilot.license.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs: (PilotStatus | "All")[] = ["All", "Online", "Offline", "Busy", "Available"];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-display">
          Pilot Management
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1 font-normal">
          All registered drone pilots and their current status
        </p>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Pills */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1.5 rounded-xl w-fit gap-1">
          {tabs.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 text-xs font-normal rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-800 border border-slate-200/50 shadow-xs"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search pilots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-800 font-normal"
          />
        </div>
      </div>

      {/* Pilots Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPilots.map((pilot) => (
          <div
            key={pilot.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs"
          >
            {/* Card Top: Initials Avatar, Name & Status */}
            <div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-normal shrink-0">
                  {pilot.initials}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-slate-800 leading-none">{pilot.name}</h4>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-normal border ${
                      pilot.status === "Available"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : pilot.status === "Busy"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : pilot.status === "Online"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    {pilot.status}
                  </span>
                </div>
              </div>

              {/* Card Mid: Stats Info */}
              <div className="space-y-1 my-4 text-xs text-slate-500 font-normal">
                <div>License: {pilot.license}</div>
                <div>Drone: {pilot.drone}</div>
                <div className="flex items-center gap-1">
                  <span>
                    Experience: {pilot.experience} | Rating: {pilot.rating}
                  </span>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  Missions: {pilot.missions} | Flight hrs: {pilot.flightHours} hrs
                </div>
              </div>
            </div>

            {/* Card Bottom: Actions */}
            <div className="flex gap-2 pt-4 border-t border-slate-100 mt-2">
              <button className="flex-1 py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-normal text-slate-700 text-center transition-colors cursor-pointer">
                Details
              </button>
              <button className="flex-1 py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-normal text-slate-700 text-center transition-colors cursor-pointer">
                Disable
              </button>
              {pilot.status === "Busy" ? (
                <button
                  disabled
                  className="flex-1 py-1.5 px-3 bg-[#8da396]/60 text-white rounded-lg text-[11px] font-normal text-center cursor-not-allowed"
                >
                  Assign
                </button>
              ) : (
                <button className="flex-1 py-1.5 px-3 bg-[#14532d] hover:bg-[#166534] text-white rounded-lg text-[11px] font-normal text-center transition-colors cursor-pointer">
                  Assign
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
