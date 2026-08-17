import { ArrowLeft } from "lucide-react";
import { mockFarmers } from "./mockFarmers";

interface FarmerProfileProps {
  farmerId: string;
  onBack: () => void;
}

export function FarmerProfile({ farmerId, onBack }: FarmerProfileProps) {
  const farmer = mockFarmers.find((f) => f.id === farmerId);

  if (!farmer) {
    return <div className="p-8 bg-white border border-slate-200 rounded-2xl">Farmer not found</div>;
  }

  const mockFields = [
    { id: "f1", name: "North Paddy Field", size: "2.4 ha", notes: "Rice" },
    { id: "f2", name: "South Maize Plot", size: "1.8 ha", notes: "Maize" },
    { id: "f3", name: "K11 Vegetable Farm", size: "0.9 ha", notes: "Vegetables" },
  ];

  const serviceHistory = [
    { date: "Jul 30", field: "South Maize Plot", service: "Mapping", amount: "LKR 4,200" },
    { date: "Jul 28", field: "North Paddy Field", service: "Spraying", amount: "LKR 8,200" },
    { date: "Jun 22", field: "K11 Vegetable Farm", service: "Fertilizing", amount: "LKR 3,800" },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Farmers
          </button>
          <h1 className="text-3xl font-medium tracking-tight text-slate-900 mt-3 font-display">
            {farmer.name}
          </h1>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left card */}
          <div className="col-span-1 flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl text-slate-500 font-sans">
              {farmer.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-slate-900">{farmer.name}</div>
              <div className="text-slate-500 text-sm">{farmer.location}</div>
            </div>

            <div className="w-full bg-slate-50 border border-slate-100 rounded-lg p-4 text-sm text-slate-600">
              <div>
                NIC: <span className="text-slate-800">{farmer.nic}</span>
              </div>
              <div className="mt-2">
                Member since: <span className="text-slate-800">{farmer.memberSince}</span>
              </div>
              <div className="mt-2">
                Fields: <span className="text-slate-800">{farmer.fields}</span>
              </div>
              <div className="mt-2">
                Total spend: <span className="text-slate-800">{farmer.totalSpend}</span>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="col-span-2 space-y-4">
            <div className="flex gap-3 flex-wrap">
              <button className="px-3 py-1 rounded-lg bg-slate-100 text-sm text-slate-700">
                Fields
              </button>
              <button className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                Drone History
              </button>
              <button className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                Payment History
              </button>
              <button className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                Service Notes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockFields.map((f) => (
                <div key={f.id} className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                  <div className="font-medium text-slate-900">{f.name}</div>
                  <div className="text-sm text-slate-600">
                    {f.size} • {f.notes}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm text-slate-600 mb-2">Recent Service History</h3>
              <div className="overflow-x-auto bg-white border border-slate-100 rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-400 text-xs">
                      <th className="p-3">Date</th>
                      <th className="p-3">Field</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    {serviceHistory.map((s, i) => (
                      <tr key={i}>
                        <td className="p-3 text-slate-700">{s.date}</td>
                        <td className="p-3 text-slate-600">{s.field}</td>
                        <td className="p-3 text-slate-600">{s.service}</td>
                        <td className="p-3 text-slate-700">{s.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
