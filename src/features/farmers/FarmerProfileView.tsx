import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Farmer, FarmerField, FarmerServiceHistory } from "@/types";
import { FarmerOverviewCard } from "./components/FarmerOverviewCard";
import { FarmerFieldsGrid } from "./components/FarmerFieldsGrid";
import { FarmerHistoryTable } from "./components/FarmerHistoryTable";

interface FarmerProfileViewProps {
  farmer: Farmer;
  fields: FarmerField[];
  serviceHistory: FarmerServiceHistory[];
  onBack: () => void;
}

const profileTabs = ["Fields", "Drone History", "Payment History", "Service Notes"] as const;

export function FarmerProfileView({
  farmer,
  fields,
  serviceHistory,
  onBack,
}: FarmerProfileViewProps) {
  const [activeTab, setActiveTab] = useState<(typeof profileTabs)[number]>("Fields");

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer select-none group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Farmers</span>
        </button>
        <h1 className="text-3xl font-medium tracking-tight text-slate-900 mt-3 font-display">
          {farmer.name}
        </h1>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left card */}
          <div className="col-span-1">
            <FarmerOverviewCard farmer={farmer} />
          </div>

          {/* Right content */}
          <div className="col-span-2 space-y-6">
            {/* Pill Tabs */}
            <div className="flex gap-2 flex-wrap">
              {profileTabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-normal transition-colors cursor-pointer ${
                      isActive
                        ? "bg-slate-100 text-slate-900 font-medium"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            {activeTab === "Fields" ? (
              <div className="space-y-4">
                <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
                  Registered Parcels
                </h3>
                <FarmerFieldsGrid fields={fields} />
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs text-slate-400">
                {activeTab} records synchronized with central GIS database.
              </div>
            )}

            {/* Service History */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
                Recent Service History
              </h3>
              <FarmerHistoryTable history={serviceHistory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
