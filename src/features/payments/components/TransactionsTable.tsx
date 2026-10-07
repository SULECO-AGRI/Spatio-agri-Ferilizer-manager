import { StatusBadge } from "@/components/common";
import { useLanguage } from "@/context/LanguageContext";
import type { Transaction } from "@/types";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const { isSinhala } = useLanguage();

  return (
    <div className={`overflow-x-auto bg-white border border-slate-200/80 rounded-2xl shadow-xs font-sans ${isSinhala ? "font-sinhala" : ""}`}>
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 text-xs font-normal">
            <th className="p-4 pl-6">{isSinhala ? "හැඳුනුම්පත" : "ID"}</th>
            <th className="p-4">{isSinhala ? "වර්ගය" : "Type"}</th>
            <th className="p-4">{isSinhala ? "පාර්ශ්වය" : "Party"}</th>
            <th className="p-4">{isSinhala ? "මුදල" : "Amount"}</th>
            <th className="p-4">{isSinhala ? "තත්ත්වය" : "Status"}</th>
            <th className="p-4 pr-6 text-right">{isSinhala ? "දිනය" : "Date"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/50 text-sm">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50/40 transition-colors">
              <td className="p-4 pl-6 text-slate-900 font-medium font-mono text-xs">{t.id}</td>
              <td className="p-4 text-slate-600 font-normal">
                {isSinhala
                  ? t.type === "Invoice"
                    ? "ඉන්වොයිසිය"
                    : t.type === "Pilot Payout"
                      ? "නියමු ගෙවීම"
                      : t.type
                  : t.type}
              </td>
              {/* Party name (farmer or pilot) kept raw */}
              <td className="p-4 text-slate-800 font-normal">{t.party}</td>
              <td className="p-4 text-slate-900 font-medium font-mono text-xs">{t.amount}</td>
              <td className="p-4">
                <StatusBadge status={t.status} />
              </td>
              <td className="p-4 pr-6 text-right text-slate-500 text-xs font-mono">{t.date}</td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-400 font-normal">
                {isSinhala ? "ඔබේ සෙවුමට ගැළපෙන ගනුදෙනු හමු නොවීය." : "No transactions matching your criteria."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
