interface RequestFarmerCardProps {
  farmerName: string;
  phone: string;
  email: string;
  district: string;
  memberSince: string;
}

export function RequestFarmerCard({
  farmerName,
  phone,
  email,
  district,
  memberSince,
}: RequestFarmerCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 font-sans">
      <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
        Farmer Information
      </h3>

      <div className="flex items-center gap-4 bg-slate-50/50 border border-slate-200/50 p-5 rounded-2xl">
        <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-slate-800 leading-none">{farmerName}</h4>
          <p className="text-xs text-slate-500 font-normal">
            {phone} <span className="text-slate-300 mx-1.5">|</span> {email}
          </p>
          <p className="text-xs text-slate-500 font-normal">
            {district} <span className="text-slate-300 mx-1.5">|</span> Member since {memberSince}
          </p>
        </div>
      </div>
    </div>
  );
}
