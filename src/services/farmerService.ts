import { apiClient } from "@/lib/apiClient";
import type { ApiFarmerItem, FarmersListResponse, FarmerQueryParams } from "@/types/farmer";

export const farmerService = {
  /**
   * Fetches paginated and filtered farmers directory from GET /farmers
   */
  async getFarmers(params: FarmerQueryParams = {}): Promise<FarmersListResponse["data"]> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};

    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.search && params.search.trim() !== "") queryParams.search = params.search.trim();
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;

    const response = await apiClient.get<FarmersListResponse>("/farmers", {
      params: queryParams,
    });

    return response.data;
  },

  /**
   * Fetches single farmer details (if endpoint available or fallback)
   */
  async getFarmerById(id: number | string): Promise<ApiFarmerItem | null> {
    try {
      const response = await apiClient.get<{ status: string; data: { farmer: ApiFarmerItem } }>(
        `/farmers/${id}`,
      );
      return response.data.farmer;
    } catch {
      return null;
    }
  },
};
