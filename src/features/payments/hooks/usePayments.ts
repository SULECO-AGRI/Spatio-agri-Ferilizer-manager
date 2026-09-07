import { useState, useMemo, useEffect, useCallback } from "react";
import { serviceRequestsService } from "@/services/serviceRequestsService";
import { analyticsService } from "@/services/analyticsService";
import type { Transaction, MetricItem, TxnStatus } from "@/types";

export const paymentFilterTabs = ["All", "Invoices", "Pilot Payouts"] as const;
export type PaymentFilterTab = (typeof paymentFilterTabs)[number];

export function usePayments() {
  const [activeFilter, setActiveFilter] = useState<PaymentFilterTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [rawTransactions, setRawTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchPaymentsData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const [requestsRes, revenueRes] = await Promise.allSettled([
        serviceRequestsService.getServiceRequests({ limit: 100 }),
        analyticsService.getRevenueAnalytics(),
      ]);

      const requests =
        requestsRes.status === "fulfilled" && requestsRes.value
          ? requestsRes.value.requests || []
          : [];

      const txns: Transaction[] = [];

      requests.forEach((req) => {
        const reqCode = req.requestCode || `REQ-${req.requestId}`;
        const costNum = Number(req.estimatedCost) || (Number(req.field?.area) || 2.0) * 25000;
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
          party: req.farmer?.fullName || (req.farmer?.userId ? `Farmer #${req.farmer.userId}` : "Farmer"),
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

      setRawTransactions(txns);

      // Compute dynamic revenue and payment metrics
      let totalRevenueNum = 0;
      let pilotPayoutsNum = 0;
      let pendingInvoicesCount = 0;

      if (revenueRes.status === "fulfilled" && revenueRes.value) {
        totalRevenueNum = Number(revenueRes.value.totalRevenue) || 0;
        pilotPayoutsNum = Number(revenueRes.value.pilotEarnings) || 0;
      } else {
        totalRevenueNum = txns
          .filter((t) => t.type === "Invoice" && t.status === "Paid")
          .reduce((sum, t) => sum + (Number(t.amount.replace(/[^0-9.-]+/g, "")) || 0), 0);

        pilotPayoutsNum = txns
          .filter((t) => t.type === "Pilot Payout" && t.status === "Paid")
          .reduce((sum, t) => sum + (Number(t.amount.replace(/[^0-9.-]+/g, "")) || 0), 0);
      }

      pendingInvoicesCount = txns.filter(
        (t) => t.type === "Invoice" && t.status === "Pending",
      ).length;

      const dynamicMetrics: MetricItem[] = [
        {
          title: "Total Invoiced",
          value: `LKR ${totalRevenueNum.toLocaleString()}`,
          footer: `${txns.filter((t) => t.type === "Invoice").length} Total Invoices Generated`,
        },
        {
          title: "Paid Out",
          value: `LKR ${pilotPayoutsNum.toLocaleString()}`,
          footer: `${txns.filter((t) => t.type === "Pilot Payout" && t.status === "Paid").length} Pilot Disbursements Settled`,
        },
        {
          title: "Pending Invoices",
          value: `${pendingInvoicesCount}`,
          footer: `${txns.filter((t) => t.type === "Invoice" && t.status === "Overdue").length} Overdue / Inactive`,
        },
      ];

      setMetrics(dynamicMetrics);
    } catch {
      setIsError(true);
      setRawTransactions([]);
      setMetrics([
        { title: "Total Invoiced", value: "LKR 0", footer: "0 Invoices" },
        { title: "Paid Out", value: "LKR 0", footer: "0 Disbursements" },
        { title: "Pending Invoices", value: "0", footer: "0 Overdue" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentsData();
  }, [fetchPaymentsData]);

  const filteredTransactions = useMemo(() => {
    return rawTransactions.filter((txn) => {
      let matchesTab = true;
      if (activeFilter === "Invoices") matchesTab = txn.type === "Invoice";
      if (activeFilter === "Pilot Payouts") matchesTab = txn.type === "Pilot Payout";

      const matchesSearch =
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.amount.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [rawTransactions, activeFilter, searchQuery]);

  return {
    transactions: filteredTransactions,
    totalCount: rawTransactions.length,
    metrics,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    isError,
    refetch: fetchPaymentsData,
  };
}
