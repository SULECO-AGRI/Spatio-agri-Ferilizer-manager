export type TxnType = "Invoice" | "Pilot Payout";
export type TxnStatus = "Paid" | "Pending" | "Overdue";

export interface Transaction {
  id: string;
  type: TxnType;
  party: string;
  amount: string;
  status: TxnStatus;
  date: string;
}
