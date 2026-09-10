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
   * Fetches registered fields for a specific farmer from GET /farmers/:id/fields
   */
  async getFarmerFields(farmerId: number | string): Promise<any[]> {
    try {
      const response = await apiClient.get<{ status: string; data: { fields: any[] } }>(
        `/farmers/${farmerId}/fields`,
      );
      return response.data?.fields || [];
    } catch {
      try {
        const fallback = await apiClient.get<{ status: string; data: { fields: any[] } }>(
          `/api/farmers/${farmerId}/fields`,
        );
        return fallback.data?.fields || [];
      } catch {
        return [];
      }
    }
  },

  /**
   * Deletes a farmer by ID via DELETE /farmers/:id
   */
  async deleteFarmer(farmerId: number | string): Promise<{ success: boolean; message?: string }> {
    try {
      await apiClient.delete(`/farmers/${farmerId}`);
      return { success: true, message: "Farmer deleted successfully" };
    } catch {
      try {
        await apiClient.delete(`/api/farmers/${farmerId}`);
        return { success: true, message: "Farmer deleted successfully" };
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to delete farmer. The farmer may have active field parcels or service requests.";
        throw new Error(message);
      }
    }
  },
};
