import { StatusBadge } from "@/components/ui";
import type { PilotMission } from "@/types";

interface MissionHistoryCardProps {
  missions: PilotMission[];
}

export function MissionHistoryCard({ missions }: MissionHistoryCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs font-sans space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
          Mission History
        </h3>
        <span className="text-xs text-slate-400 font-normal">
          {missions.length} recorded missions
        </span>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left text-xs font-normal">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 bg-slate-50/50">
              <th className="py-3 px-4 font-normal">Mission</th>
              <th className="py-3 px-4 font-normal">Field</th>
              <th className="py-3 px-4 font-normal">Date</th>
              <th className="py-3 px-4 font-normal text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60">
            {missions.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/40 transition-colors">
                <td className="py-3 px-4 text-slate-800 font-medium">{m.id}</td>
                <td className="py-3 px-4 text-slate-600">{m.field}</td>
                <td className="py-3 px-4 text-slate-500">{m.date}</td>
                <td className="py-3 px-4 text-right">
                  <StatusBadge status={m.result} size="sm" />
                </td>
              </tr>
            ))}
            {missions.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-400 font-normal">
                  No mission records found for this pilot.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
