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
