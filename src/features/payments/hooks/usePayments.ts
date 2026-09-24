import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { serviceRequestsService } from "@/services/serviceRequestsService";
import { analyticsService } from "@/services/analyticsService";
import type { Transaction, MetricItem, TxnStatus } from "@/types";

export const paymentFilterTabs = ["All", "Invoices", "Pilot Payouts"] as const;
export type PaymentFilterTab = (typeof paymentFilterTabs)[number];

interface PaymentsRawData {
  transactions: Transaction[];
  metrics: MetricItem[];
}

const defaultPaymentsData: PaymentsRawData = {
  transactions: [],
  metrics: [
    { title: "Total Invoiced", value: "LKR 0", footer: "0 Invoices" },
    { title: "Paid Out", value: "LKR 0", footer: "0 Disbursements" },
    { title: "Pending Invoices", value: "0", footer: "0 Overdue" },
  ],
};

async function fetchPaymentsLedger(): Promise<PaymentsRawData> {
  const [requestsRes] = await Promise.allSettled([
    serviceRequestsService.getServiceRequests({ limit: 100 }),
  ]);

  const requests =
    requestsRes.status === "fulfilled" && requestsRes.value ? requestsRes.value.requests || [] : [];

  const txns: Transaction[] = [];

  requests.forEach((req) => {
    const reqCode = req.requestCode || `REQ-${req.requestId}`;
    const costNum = Number(req.estimatedCost) || 0;
    const dateStr = req.createdAt
      ? new Date(req.createdAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    let invoiceStatus: TxnStatus = "Pending";
    if (req.status === "COMPLETED") {
      invoiceStatus = "Paid";
    } else if (req.status === "CANCELLED") {
      invoiceStatus = "Overdue";
    }

    // 1. Farmer invoice entry
    txns.push({
      id: `INV-${reqCode}`,
      type: "Invoice",
      party:
        req.farmer?.fullName || (req.farmer?.userId ? `Farmer #${req.farmer.userId}` : "Farmer"),
      amount: `LKR ${costNum.toLocaleString()}`,
      status: invoiceStatus,
      date: dateStr,
    });

    // 2. Pilot payout entry (if a pilot is assigned)
    if (req.assignedPilot || req.status === "COMPLETED" || req.status === "IN_PROGRESS") {
      const payoutNum = Math.round(costNum * 0.75);
      let payoutStatus: TxnStatus = "Pending";
      if (req.status === "COMPLETED") {
        payoutStatus = "Paid";
      }

      txns.push({
        id: `PAY-${reqCode}`,
        type: "Pilot Payout",
        party:
          req.assignedPilot?.fullName ||
          (req.assignedPilot?.userId ? `Pilot #${req.assignedPilot.userId}` : "Assigned Pilot"),
        amount: `LKR ${payoutNum.toLocaleString()}`,
        status: payoutStatus,
        date: dateStr,
      });
    }
  });

  // Compute real revenue and payment metrics from live ledger
  const totalInvoicedSum = txns
    .filter((t) => t.type === "Invoice")
    .reduce((sum, t) => sum + (Number(t.amount.replace(/[^0-9.-]+/g, "")) || 0), 0);

  const paidOutSum = txns
    .filter((t) => t.type === "Pilot Payout" && t.status === "Paid")
    .reduce((sum, t) => sum + (Number(t.amount.replace(/[^0-9.-]+/g, "")) || 0), 0);

  const pendingInvoicesCount = txns.filter(
    (t) => t.type === "Invoice" && t.status === "Pending",
  ).length;

  const dynamicMetrics: MetricItem[] = [
    {
      title: "Total Invoiced",
      value: `LKR ${totalInvoicedSum.toLocaleString()}`,
      footer: `${txns.filter((t) => t.type === "Invoice").length} Total Invoices Generated`,
    },
    {
      title: "Paid Out",
      value: `LKR ${paidOutSum.toLocaleString()}`,
      footer: `${txns.filter((t) => t.type === "Pilot Payout" && t.status === "Paid").length} Pilot Disbursements Settled`,
    },
    {
      title: "Pending Invoices",
      value: `${pendingInvoicesCount}`,
      footer: `${txns.filter((t) => t.type === "Invoice" && t.status === "Overdue").length} Overdue / Inactive`,
    },
  ];

  return {
    transactions: txns,
    metrics: dynamicMetrics,
  };
}

export function usePayments() {
  const [activeFilter, setActiveFilter] = useState<PaymentFilterTab>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["paymentsData"],
    queryFn: fetchPaymentsLedger,
    staleTime: 30_000,
  });

  const rawData = data ?? defaultPaymentsData;

  const filteredTransactions = useMemo(() => {
    return rawData.transactions.filter((txn) => {
      let matchesTab = true;
      if (activeFilter === "Invoices") matchesTab = txn.type === "Invoice";
      if (activeFilter === "Pilot Payouts") matchesTab = txn.type === "Pilot Payout";

      const matchesSearch =
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.amount.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [rawData.transactions, activeFilter, searchQuery]);

  return {
    transactions: filteredTransactions,
    totalCount: rawData.transactions.length,
    metrics: rawData.metrics,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
