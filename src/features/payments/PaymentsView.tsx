import { PageHeader, FilterPills, TableToolbar, RefreshButton } from "@/components/common";
import { usePayments, paymentFilterTabs } from "./hooks/usePayments";
import { PaymentsMetricsRow } from "./components/PaymentsMetricsRow";
import { TransactionsTable } from "./components/TransactionsTable";
import { useLanguage } from "@/context/LanguageContext";
import { AlertCircle, Loader2 } from "lucide-react";

export function PaymentsView() {
  const { dict, isSinhala } = useLanguage();
  const {
    transactions,
    totalCount,
    metrics,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = usePayments();

  return (
    <div className={`space-y-6 font-sans animate-in fade-in duration-300 ${isSinhala ? "font-sinhala" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title={dict.admin.payments.title || (isSinhala ? "ගෙවීම් සහ ඉන්වොයිස්" : "Payments & Invoices")}
          description={dict.admin.payments.description || (isSinhala ? "ගොවි සේවා බිල්පත්, නියමු ගෙවීම් ලෙජර සහ ගිණුම් තත්ත්වය" : "Farmer service billing, pilot payout ledgers, and dynamic accounts status")}
        />

        <RefreshButton
          onRefresh={() => refetch()}
          isLoading={isLoading}
          isFetching={isFetching}
          label={isSinhala ? "ලෙජර සමමුහුර්ත කරන්න" : "Sync Ledgers"}
          title={isSinhala ? "ලෙජර සහ ගනුදෙනු දත්ත යාවත්කාලීන කරන්න" : "Refresh ledger and transactions data"}
          className="self-start sm:self-auto"
        />
      </div>

      {isError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {isSinhala
              ? "දැනුම්දීම: පසුපස සේවාදායකයෙන් ලෙජර් සටහන් සෘජුවම සමමුහුර්ත කළ නොහැක."
              : "Notice: Unable to sync ledger entries directly from backend server."}
          </span>
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
          searchPlaceholder={isSinhala ? "හැඳුනුම්පත, පාර්ශ්වය හෝ මුදල අනුව සොයන්න..." : "Search by ID, party, or amount..."}
        />
      </div>

      {/* Main Transactions Table */}
      {isLoading ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500" />
          {isSinhala ? "ගනුදෙනු සහ ගෙවීම් ලෙජර පූරණය වෙමින්..." : "Loading transactions & payout ledgers..."}
        </div>
      ) : (
        <TransactionsTable transactions={transactions} />
      )}

      <div className="text-xs text-slate-400 font-normal">
        {isSinhala ? (
          <>
            ලෙජර් සටහන් <span className="font-semibold text-slate-700">{totalCount}</span> න්{" "}
            <span className="font-semibold text-slate-700">{transactions.length}</span> ක් පෙන්වයි
          </>
        ) : (
          <>Showing {transactions.length} of {totalCount} ledger entries</>
        )}
      </div>
    </div>
  );
}

export default PaymentsView;
