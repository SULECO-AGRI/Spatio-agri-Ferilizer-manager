import { useState, useEffect } from "react";
import { RequestDetailsView } from "@/features/requests";
import { serviceRequestsService } from "@/services/serviceRequestsService";
import type { ApiServiceRequestItem } from "@/types/request";

interface RequestDetailsProps {
  requestId: string | number;
  onBack: () => void;
}

export function RequestDetails({ requestId, onBack }: RequestDetailsProps) {
  const [request, setRequest] = useState<ApiServiceRequestItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const idNum =
      typeof requestId === "string"
        ? parseInt(requestId.replace("REQ-", ""), 10) || requestId
        : requestId;

    async function fetchDetails() {
      try {
        const data = await serviceRequestsService.getServiceRequestById(idNum);
        if (isMounted) setRequest(data);
      } catch (err) {
        console.error("Failed to fetch request details:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [requestId]);

  if (isLoading || !request) {
    return (
      <div className="p-8 bg-white border border-slate-200 rounded-2xl animate-pulse space-y-4">
        <div className="h-6 w-48 bg-slate-200 rounded-md" />
        <div className="h-32 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  return <RequestDetailsView request={request} onBack={onBack} />;
}
