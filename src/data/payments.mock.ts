import type { Transaction, MetricItem } from "@/types";

export const mockTransactions: Transaction[] = [
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

export const mockPaymentMetrics: MetricItem[] = [
  { title: "Pending Payments", value: "LKR 42,100", footer: "8 invoices" },
  { title: "Completed Payments", value: "LKR 2.1M", footer: "this year" },
  { title: "Pilot Earnings (MTD)", value: "LKR 318,000", footer: "14 pilots" },
];
