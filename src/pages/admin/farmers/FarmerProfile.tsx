import { mockFarmers, mockFarmerFields, mockFarmerServiceHistory } from "@/data/mockData";
import { FarmerProfileView } from "@/features/farmers";

interface FarmerProfileProps {
  farmerId: string;
  onBack: () => void;
}

export function FarmerProfile({ farmerId, onBack }: FarmerProfileProps) {
  const farmer = mockFarmers.find((f) => f.id === farmerId);

  if (!farmer) {
    return (
      <div className="p-8 bg-white border border-slate-200 rounded-2xl font-sans">
        Farmer record not found.
      </div>
    );
  }

  return (
    <FarmerProfileView
      farmer={farmer}
      fields={mockFarmerFields}
      serviceHistory={mockFarmerServiceHistory}
      onBack={onBack}
    />
  );
}
