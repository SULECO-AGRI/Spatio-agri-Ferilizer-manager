import { StatusBadge } from "@/components/ui";
import type { Transaction } from "@/types";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="overflow-x-auto bg-white border border-slate-200/80 rounded-2xl shadow-xs font-sans">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 text-xs font-normal">
            <th className="p-4 pl-6">ID</th>
            <th className="p-4">Type</th>
            <th className="p-4">Party</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Status</th>
            <th className="p-4 pr-6 text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/50 text-sm">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50/40 transition-colors">
              <td className="p-4 pl-6 text-slate-900 font-medium">{t.id}</td>
              <td className="p-4 text-slate-600 font-normal">{t.type}</td>
              <td className="p-4 text-slate-800 font-normal">{t.party}</td>
              <td className="p-4 text-slate-900 font-medium">{t.amount}</td>
              <td className="p-4">
                <StatusBadge status={t.status} />
              </td>
              <td className="p-4 pr-6 text-right text-slate-500 text-xs">{t.date}</td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-400 font-normal">
                No transactions matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
