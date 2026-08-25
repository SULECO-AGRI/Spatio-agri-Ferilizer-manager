import { apiClient } from "@/lib/apiClient";
import type {
  ApiServiceRequestItem,
  ServiceRequestsListResponse,
  ServiceRequestDetailsResponse,
  ServiceRequestQueryParams,
} from "@/types/request";

export const serviceRequestsService = {
  /**
   * Fetches paginated and filtered service requests from GET /service-requests
   */
  async getServiceRequests(
    params: ServiceRequestQueryParams = {},
  ): Promise<ServiceRequestsListResponse["data"]> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};

    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.status && params.status !== "ALL") queryParams.status = params.status;
    if (params.priority && params.priority !== "ALL") queryParams.priority = params.priority;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
    if (params.search) queryParams.search = params.search;

    const response = await apiClient.get<ServiceRequestsListResponse>("/service-requests", {
      params: queryParams,
    });

    return response.data;
  },

  /**
   * Fetches full details for a single service request from GET /service-requests/:id
   */
  async getServiceRequestById(id: number | string): Promise<ApiServiceRequestItem> {
    const response = await apiClient.get<ServiceRequestDetailsResponse>(`/service-requests/${id}`);
    return response.data.serviceRequest;
  },
};
