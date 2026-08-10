const schedules = [
  { id: "1", time: "08:30", field: "North Paddy Field", service: "Spraying", pilot: "N. Perera" },
  { id: "2", time: "10:00", field: "South Maize Plot", service: "Mapping", pilot: "S. Fernando" },
  { id: "3", time: "13:30", field: "East Tea Estate", service: "Fertilizing", pilot: "Unassigned" }
];

export function ScheduleTable() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 flex-1 font-sans shadow-xs">
      <h3 className="text-xl font-bold font-display text-slate-900 mb-6">
        Today's Schedule
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold">
              <th className="pb-3">Time</th>
              <th className="pb-3">Field</th>
              <th className="pb-3">Service</th>
              <th className="pb-3">Pilot</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50 text-sm">
            {schedules.map(({ id, time, field, service, pilot }) => (
              <tr key={id}>
                <td className="py-4 font-bold text-slate-800">
                  {time}
                </td>
                <td className="py-4 text-slate-600">
                  {field}
                </td>
                <td className="py-4 text-slate-600">
                  {service}
                </td>
                <td className="py-4">
                  {pilot === "Unassigned" ? (
                    <span className="text-slate-400 font-normal">
                      Unassigned
                    </span>
                  ) : (
                    <span className="text-slate-800 font-bold">
                      {pilot}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
