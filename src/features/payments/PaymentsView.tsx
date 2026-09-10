import { PageHeader, FilterPills, TableToolbar } from "@/components/ui";
import { usePayments, paymentFilterTabs } from "./hooks/usePayments";
import { PaymentsMetricsRow } from "./components/PaymentsMetricsRow";
import { TransactionsTable } from "./components/TransactionsTable";
import { RefreshCw, AlertCircle } from "lucide-react";

export function PaymentsView() {
  const {
    transactions,
    totalCount,
    metrics,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    isError,
    refetch,
  } = usePayments();

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Payments & Invoices"
          description="Farmer service billing, pilot payout ledgers, and dynamic accounts status"
        />

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium shadow-2xs transition-all cursor-pointer disabled:opacity-60"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-emerald-600 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>{isLoading ? "Syncing..." : "Sync Ledgers"}</span>
        </button>
      </div>

      {isError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Notice: Unable to sync ledger entries directly from backend server.</span>
        </div>
      )}

      {/* Top 3 Metric Cards */}
      <PaymentsMetricsRow metrics={metrics} />

      {/* Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <FilterPills items={paymentFilterTabs} active={activeFilter} onChange={setActiveFilter} />

        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by ID, party, or amount..."
        />
      </div>

      {/* Main Transactions Table */}
      {isLoading ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500" />
          Loading transactions & payout ledgers...
        </div>
      ) : (
        <TransactionsTable transactions={transactions} />
      )}

      <div className="text-xs text-slate-400 font-normal">
        Showing {transactions.length} of {totalCount} ledger entries
      </div>
    </div>
  );
}

export default PaymentsView;
