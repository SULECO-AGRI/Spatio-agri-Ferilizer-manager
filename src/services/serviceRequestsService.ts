import { apiClient } from "@/lib/apiClient";
import { pilotService } from "./pilotService";
import type {
  ApiServiceRequestItem,
  ServiceRequestsListResponse,
  ServiceRequestDetailsResponse,
  ServiceRequestQueryParams,
  CandidatePilot,
  CandidatePilotsResponse,
  AssignPilotResponse,
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

  /**
   * Fetches ranked candidate pilots for a specific service request from GET /service-requests/:id/candidate-pilots
   */
  async getCandidatePilots(requestId: number | string): Promise<CandidatePilot[]> {
    const response = await apiClient.get<CandidatePilotsResponse>(
      `/service-requests/${requestId}/candidate-pilots`,
    );

    const rawData = response.data;
    let list: unknown[] = [];

    if (Array.isArray(rawData)) {
      list = rawData;
    } else if (rawData && typeof rawData === "object") {
      const obj = rawData as Record<string, unknown>;
      if (Array.isArray(obj.candidates)) {
        list = obj.candidates;
      } else if (Array.isArray(obj.candidatePilots)) {
        list = obj.candidatePilots;
      } else if (Array.isArray(obj.pilots)) {
        list = obj.pilots;
      }
    }

    // Direct mapping from backend suggestion engine
    const normalized: CandidatePilot[] = list.map((item: unknown, index: number) => {
      const c = (item || {}) as Record<string, unknown>;
      const user = (c.user || {}) as Record<string, unknown>;
      const profile = (c.profile || user.profile || {}) as Record<string, unknown>;

      const pilotId = Number(c.pilotId || c.userId || user.userId || c.id || index + 1);
      const fullName = String(
        c.fullName ||
          user.fullName ||
          (c.firstName ? `${c.firstName} ${c.lastName || ""}` : "") ||
          (user.firstName ? `${user.firstName} ${user.lastName || ""}` : "") ||
          c.name ||
          `Pilot #${pilotId}`,
      ).trim();

      const email = String(c.email || user.email || "");
      const mobile = String(c.mobile || user.mobile || c.phone || "");
      const licenceNumber = String(
        c.licenceNumber || c.licenseNumber || profile.licenceNumber || c.license || "N/A",
      );

      const rawDistance = Number(c.distanceKm ?? c.distance_km ?? c.distance ?? 0);
      const distanceKm = !isNaN(rawDistance) ? Number(rawDistance.toFixed(2)) : 0;

      const rawRating = Number(c.rating ?? c.starRating ?? profile.rating ?? c.ratings ?? 0);
      const rating = !isNaN(rawRating) ? Number(rawRating.toFixed(1)) : 0;

      const rawMissions = Number(
        c.completedMissions ??
          c.totalMissions ??
          profile.completedMissions ??
          profile.totalMissions ??
          0,
      );
      const completedMissions = !isNaN(rawMissions) ? rawMissions : 0;
      const totalFlightHours = Number(c.totalFlightHours ?? profile.totalFlightHours ?? 0);

      const rawMatchScore = Number(c.matchScore ?? c.matchPercentage ?? c.match ?? 0);
      const matchScore = !isNaN(rawMatchScore) ? Math.min(100, Math.max(0, rawMatchScore)) : 0;

      const recommendationBadge = c.recommendationBadge
        ? String(c.recommendationBadge)
        : undefined;

      const coverageType = c.coverageType ? String(c.coverageType) : undefined;

      const scoreBreakdown =
        c.scoreBreakdown && typeof c.scoreBreakdown === "object"
          ? (c.scoreBreakdown as any)
          : undefined;

      return {
        pilotId,
        fullName,
        email,
        mobile,
        licenceNumber,
        distanceKm,
        rating,
        totalMissions: completedMissions,
        completedMissions,
        totalFlightHours,
        matchScore: Math.round(matchScore * 100) / 100,
        coverageType,
        recommendationBadge,
        scoreBreakdown,
        status: String(c.status || "ACTIVE"),
        availabilityStatus: String(c.availabilityStatus || "READY"),
      };
    });

    return normalized;
  },

  /**
   * Assigns a candidate pilot to a service request via POST /service-requests/:id/assign
   */
  async assignPilot(
    requestId: number | string,
    pilotId: number | string,
  ): Promise<ApiServiceRequestItem> {
    const payload = { pilotId: Number(pilotId) };

    try {
      const response = await apiClient.post<AssignPilotResponse>(
        `/service-requests/${requestId}/assign`,
        payload,
      );
      const req = response.data?.serviceRequest || response.data?.request;
      if (req) return req;
    } catch {
      try {
        const fallback = await apiClient.post<AssignPilotResponse>(
          `/admin/service-requests/${requestId}/assign`,
          payload,
        );
        const req = fallback.data?.serviceRequest || fallback.data?.request;
        if (req) return req;
      } catch {
        // Alternative PATCH endpoint
        await apiClient.patch(`/service-requests/${requestId}`, {
          status: "ASSIGNED",
          assignedPilotId: Number(pilotId),
        });
      }
    }

    // Refresh and return latest full request
    return await serviceRequestsService.getServiceRequestById(requestId);
  },

  /**
   * Deletes a service request by ID via DELETE /service-requests/:id
   */
  async deleteServiceRequest(
    requestId: number | string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await apiClient.delete(`/service-requests/${requestId}`);
      return { success: true, message: "Service request deleted successfully" };
    } catch {
      try {
        await apiClient.delete(`/api/service-requests/${requestId}`);
        return { success: true, message: "Service request deleted successfully" };
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to delete service request.";
        throw new Error(message);
      }
    }
  },
};
