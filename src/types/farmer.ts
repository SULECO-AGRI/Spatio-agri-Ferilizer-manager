export interface Farmer {
  id: string;
  name: string;
  location: string;
  fields: number;
  activeRequests: number;
  totalSpend: string;
  memberSince: number;
  nic: string;
}

export interface FarmerField {
  id: string;
  name: string;
  size: string;
  notes: string;
}

export interface FarmerServiceHistory {
  date: string;
  field: string;
  service: string;
  amount: string;
}
