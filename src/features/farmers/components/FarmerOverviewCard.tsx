import type { Farmer } from "@/types";

interface FarmerOverviewCardProps {
  farmer: Farmer;
}

export function FarmerOverviewCard({ farmer }: FarmerOverviewCardProps) {
  const initials = farmer.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="flex flex-col items-center gap-4 font-sans">
      <div className="w-32 h-32 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl text-slate-500 font-sans shadow-xs">
        {initials}
      </div>
      <div className="text-center">
        <div className="text-lg font-medium text-slate-900">{farmer.name}</div>
        <div className="text-slate-500 text-sm">{farmer.location}</div>
      </div>

      <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-600 space-y-2">
        <div>
          NIC: <span className="text-slate-800 font-medium">{farmer.nic}</span>
        </div>
        <div>
          Member since: <span className="text-slate-800 font-medium">{farmer.memberSince}</span>
        </div>
        <div>
          Fields: <span className="text-slate-800 font-medium">{farmer.fields}</span>
        </div>
        <div>
          Total spend: <span className="text-slate-800 font-medium">{farmer.totalSpend}</span>
        </div>
      </div>
    </div>
  );
}
