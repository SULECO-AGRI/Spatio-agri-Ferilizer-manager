import type { ApiFarmerItem } from "@/types/farmer";

interface FarmerOverviewCardProps {
  farmer: ApiFarmerItem;
}

export function FarmerOverviewCard({ farmer }: FarmerOverviewCardProps) {
  const initials =
    farmer.fullName
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "FR";

  const memberYear = farmer.memberSince
    ? new Date(farmer.memberSince).getFullYear() || farmer.memberSince
    : "N/A";

  return (
    <div className="flex flex-col items-center gap-4 font-sans">
      <div className="w-28 h-28 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-2xl text-emerald-800 font-sans shadow-xs font-medium">
        {initials}
      </div>
      <div className="text-center">
        <div className="text-lg font-medium text-slate-900">{farmer.fullName}</div>
        <div className="text-slate-500 text-xs">{farmer.email}</div>
      </div>

      <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-600 space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">NIC:</span>
          <span className="text-slate-800 font-medium font-mono">{farmer.nic || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Mobile:</span>
          <span className="text-slate-800 font-medium">{farmer.mobile || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Location:</span>
          <span className="text-slate-800 font-medium">{farmer.address || "Sri Lanka"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Member Since:</span>
          <span className="text-slate-800 font-medium">{memberYear}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Registered Parcels:</span>
          <span className="text-slate-800 font-medium">{farmer.totalFields ?? 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Total Area:</span>
          <span className="text-slate-800 font-medium">
            {Number(farmer.totalArea ?? 0).toFixed(1)} ha
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Service Requests:</span>
          <span className="text-emerald-700 font-medium">{farmer.totalServiceRequests ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
