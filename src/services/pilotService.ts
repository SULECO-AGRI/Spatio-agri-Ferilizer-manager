import { apiClient } from "@/lib/apiClient";
import type {
  ApiPilotItem,
  PilotsListResponse,
  PilotQueryParams,
  PilotProfileDetailDTO,
  PilotDetailsResponse,
} from "@/types/pilot";

export const pilotService = {
  /**
   * Fetches paginated, searchable, and filterable list of pilots from GET /pilots
   */
  async getPilots(params: PilotQueryParams = {}): Promise<PilotsListResponse["data"]> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};

    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.status && params.status !== "All" && params.status !== "ALL") {
      queryParams.status = params.status;
    }
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;

    const response = await apiClient.get<PilotsListResponse>("/pilots", {
      params: queryParams,
    });

    return response.data;
  },

  /**
   * Fetches single pilot comprehensive profile and stats from GET /pilots/:id
   */
  async getPilotById(id: number | string): Promise<PilotProfileDetailDTO> {
    const response = await apiClient.get<PilotDetailsResponse>(`/pilots/${id}`);
    return response.data.pilot;
  },

  /**
   * Updates pilot operational duty status via PATCH /pilots/:id/status
   */
  async updatePilotStatus(
    id: number | string,
    status: "ACTIVE" | "INACTIVE" | "ON_MISSION" | "SUSPENDED" | string,
  ): Promise<ApiPilotItem> {
    const response = await apiClient.patch<{ status: string; data: ApiPilotItem }>(
      `/pilots/${id}/status`,
      { status },
    );
    return response.data;
  },
};
