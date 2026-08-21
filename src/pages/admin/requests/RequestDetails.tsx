import { detailedRequestsInfo } from "@/data/mockData";
import { RequestDetailsView } from "@/features/requests";

interface RequestDetailsProps {
  requestId: string;
  onBack: () => void;
}

export function RequestDetails({ requestId, onBack }: RequestDetailsProps) {
  const details = detailedRequestsInfo[requestId] || {
    farmerName: "S. Fernando",
    phone: "+94 75 222 3333",
    email: "s.fernando@mail.com",
    district: "Polonnaruwa District",
    memberSince: "2022",
    fieldName: "Boundary - West Paddy",
    crop: "Rice (BG 352)",
    growthStage: "Tillering",
    service: "Pesticide Spraying",
    prefDate: "Jul 22, 2026 - 02:00 PM",
    duration: "45 minutes",
    drone: "DJI Agras T40",
    weather: "Jul 22: 30°C, Wind 11 km/h, Rain 20%",
    risk: "Low Risk",
    area: "1.8 ha",
    priority: "High",
    status: "Pending Review",
    svgPoints: "120,60 380,80 340,180 80,160",
  };

  return <RequestDetailsView requestId={requestId} details={details} onBack={onBack} />;
}
