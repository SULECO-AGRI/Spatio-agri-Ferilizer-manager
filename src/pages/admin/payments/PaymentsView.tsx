import { useState } from "react";
import { ChevronRight } from "lucide-react";

type TxnType = "Invoice" | "Pilot Payout";
type TxnStatus = "Paid" | "Pending" | "Overdue";

interface Transaction {
  id: string;
  type: TxnType;
  party: string;
  amount: string;
  status: TxnStatus;
  date: string;
}

const mockMetrics = [
  { title: "Pending Payments", value: "LKR 42,100", footer: "8 invoices" },
  { title: "Completed Payments", value: "LKR 2.1M", footer: "this year" },
  { title: "Pilot Earnings (MTD)", value: "LKR 318,000", footer: "14 pilots" },
];

const mockTransactions: Transaction[] = [
  {
    id: "TXN-3312",
    type: "Invoice",
    party: "Kamal Silva",
    amount: "LKR 9,800",
    status: "Paid",
    date: "Jul 19",
  },
  {
    id: "TXN-3311",
    type: "Pilot Payout",
    party: "Nimal Perera",
    amount: "LKR 6,200",
    status: "Pending",
    date: "Jul 19",
  },
  {
    id: "TXN-3309",
    type: "Invoice",
    party: "W. Bandara",
    amount: "LKR 4,500",
    status: "Overdue",
    date: "Jul 12",
  },
  {
    id: "TXN-3305",
    type: "Pilot Payout",
    party: "S. Fernando",
    amount: "LKR 5,100",
    status: "Paid",
    date: "Jul 10",
  },
];

const filters = [
  "Invoices",
  "Pending Payments",
  "Completed Payments",
  "Pilot Earnings",
  "Farmer Payments",
];

export function PaymentsView() {
  const [activeFilter, setActiveFilter] = useState("Invoices");

  // Local filter mock logic (for realistic interactive behavior)
  const filteredTransactions = mockTransactions.filter((txn) => {
    if (activeFilter === "Invoices") return txn.type === "Invoice";
    if (activeFilter === "Pending Payments") return txn.status === "Pending";
    if (activeFilter === "Completed Payments")
      return txn.status === "Paid" && txn.type === "Invoice";
    if (activeFilter === "Pilot Earnings") return txn.type === "Pilot Payout";
    return true; // Farmer Payments shows all or invoices
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-display">
          Payments
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1 font-normal">
          Invoices, pilot earnings and farmer transaction history
        </p>
      </div>

      {/* Metrics Row (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockMetrics.map((m) => (
          <div
            key={m.title}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col shadow-xs"
          >
            <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider block">
              {m.title}
            </span>
            <span className="text-2xl font-medium text-slate-900 mt-2 font-display">{m.value}</span>
            <span className="text-xs text-slate-400 mt-1 font-normal">{m.footer}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-wrap gap-2 pt-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-xs font-normal rounded-lg border transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#1e293b] text-white border-[#1e293b]"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Transaction History Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <h3 className="text-xl font-normal text-slate-900 font-display">Transaction History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-normal">
                <th className="pb-3 pl-2">Txn ID</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Party</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 text-sm">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/20 transition-colors cursor-pointer">
                  <td className="py-4 pl-2 text-slate-850 font-normal">{txn.id}</td>
                  <td className="py-4 text-slate-600 font-normal">{txn.type}</td>
                  <td className="py-4 text-slate-600 font-normal">{txn.party}</td>
                  <td className="py-4 text-slate-850 font-normal">{txn.amount}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-normal border ${
                        txn.status === "Paid"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : txn.status === "Pending"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-4 text-slate-600 font-normal">{txn.date}</td>
                  <td className="py-4 pr-2 text-right">
                    <button className="inline-flex items-center gap-1 text-slate-800 hover:text-slate-900 text-xs font-normal cursor-pointer">
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-normal">
                    No transactions found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
