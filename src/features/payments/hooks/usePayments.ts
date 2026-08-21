import { useState, useMemo } from "react";
import { mockTransactions, mockPaymentMetrics } from "@/data/mockData";
import type { MetricItem } from "@/types";

export const paymentFilterTabs = ["All", "Invoices", "Pilot Payouts"] as const;
export type PaymentFilterTab = (typeof paymentFilterTabs)[number];

export function usePayments() {
  const [activeFilter, setActiveFilter] = useState<PaymentFilterTab>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((txn) => {
      let matchesTab = true;
      if (activeFilter === "Invoices") matchesTab = txn.type === "Invoice";
      if (activeFilter === "Pilot Payouts") matchesTab = txn.type === "Pilot Payout";

      const matchesSearch =
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.amount.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const metrics: MetricItem[] = useMemo(() => {
    return mockPaymentMetrics;
  }, []);

  return {
    transactions: filteredTransactions,
    totalCount: mockTransactions.length,
    metrics,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
  };
}
