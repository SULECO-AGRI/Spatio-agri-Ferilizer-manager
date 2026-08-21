import { PageHeader, FilterPills, TableToolbar } from "@/components/ui";
import { usePayments, paymentFilterTabs } from "./hooks/usePayments";
import { PaymentsMetricsRow } from "./components/PaymentsMetricsRow";
import { TransactionsTable } from "./components/TransactionsTable";

export function PaymentsView() {
  const {
    transactions,
    totalCount,
    metrics,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
  } = usePayments();

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Payments & Invoices"
        description="Farmer service billing, pilot payout ledgers, and accounts status"
      />

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
      <TransactionsTable transactions={transactions} />

      <div className="text-xs text-slate-400 font-normal">
        Showing {transactions.length} of {totalCount} ledger entries
      </div>
    </div>
  );
}
