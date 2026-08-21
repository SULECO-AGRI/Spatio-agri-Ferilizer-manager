import type { Farmer, FarmerField, FarmerServiceHistory } from "@/types";

export const mockFarmers: Farmer[] = [
  {
    id: "1",
    name: "Kamal Silva",
    location: "Anuradhapura",
    fields: 3,
    activeRequests: 1,
    totalSpend: "LKR 84,200",
    memberSince: 2024,
    nic: "198823489201",
  },
  {
    id: "2",
    name: "W. Bandara",
    location: "Kandy",
    fields: 2,
    activeRequests: 1,
    totalSpend: "LKR 61,500",
    memberSince: 2023,
    nic: "197548392012",
  },
  {
    id: "3",
    name: "S. Fernando",
    location: "Polonnaruwa",
    fields: 4,
    activeRequests: 0,
    totalSpend: "LKR 112,900",
    memberSince: 2022,
    nic: "199248301290",
  },
  {
    id: "4",
    name: "N. Ratnayake",
    location: "Badulla",
    fields: 1,
    activeRequests: 0,
    totalSpend: "LKR 22,300",
    memberSince: 2025,
    nic: "196849302194",
  },
  {
    id: "5",
    name: "Chathurika Silva",
    location: "Matale",
    fields: 2,
    activeRequests: 0,
    totalSpend: "LKR 45,700",
    memberSince: 2024,
    nic: "199583920194",
  },
];

export const mockFarmerFields: FarmerField[] = [
  { id: "f1", name: "North Paddy Field", size: "2.4 ha", notes: "Rice" },
  { id: "f2", name: "South Maize Plot", size: "1.8 ha", notes: "Maize" },
  { id: "f3", name: "K11 Vegetable Farm", size: "0.9 ha", notes: "Vegetables" },
];

export const mockFarmerServiceHistory: FarmerServiceHistory[] = [
  { date: "Jul 30", field: "South Maize Plot", service: "Mapping", amount: "LKR 4,200" },
  { date: "Jul 28", field: "North Paddy Field", service: "Spraying", amount: "LKR 8,200" },
  { date: "Jun 22", field: "K11 Vegetable Farm", service: "Fertilizing", amount: "LKR 3,800" },
];
