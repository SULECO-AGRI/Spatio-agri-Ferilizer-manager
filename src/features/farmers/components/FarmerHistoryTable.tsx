import type { FarmerServiceHistory } from "@/types";

interface FarmerHistoryTableProps {
  history: FarmerServiceHistory[];
}

export function FarmerHistoryTable({ history }: FarmerHistoryTableProps) {
  return (
    <div className="overflow-x-auto bg-white border border-slate-200/80 rounded-xl font-sans shadow-xs">
      <table className="w-full text-left text-xs font-normal">
        <thead>
          <tr className="text-slate-400 bg-slate-50/50 border-b border-slate-100">
            <th className="p-3 pl-4">Date</th>
            <th className="p-3">Field</th>
            <th className="p-3">Service</th>
            <th className="p-3 pr-4 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/60">
          {history.map((s, i) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="p-3 pl-4 text-slate-700 font-medium">{s.date}</td>
              <td className="p-3 text-slate-600">{s.field}</td>
              <td className="p-3 text-slate-600">{s.service}</td>
              <td className="p-3 pr-4 text-right text-slate-800 font-medium">{s.amount}</td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr>
              <td colSpan={4} className="p-6 text-center text-slate-400">
                No past service history available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
