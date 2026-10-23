import { apiClient } from "@/lib/apiClient";

export interface SystemSettings {
  pilotCommissionPercentage: number;
  costPerHectare: number;
  minimumDispatchFee?: number;
  operationRates?: Record<string, number>;
  currency: string;
  updatedAt?: string;
}

export interface UpdateSystemSettingsPayload {
  pilotCommissionPercentage?: number;
  costPerHectare?: number;
  minimumDispatchFee?: number;
  operationRates?: Record<string, number>;
}

interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export const settingsService = {
  /**
   * Fetch current system settings (pilot commission % and cost per hectare)
   */
  async getSettings(): Promise<SystemSettings> {
    try {
      const response = await apiClient.get<ApiResponse<SystemSettings>>("/admin/settings");
      return (
        response.data || {
          pilotCommissionPercentage: 70,
          costPerHectare: 6200,
          minimumDispatchFee: 3500,
          currency: "LKR",
        }
      );
    } catch {
      // Fallback to public /settings endpoint if needed
      try {
        const fallbackRes = await apiClient.get<ApiResponse<SystemSettings>>("/settings");
        return fallbackRes.data;
      } catch {
        return {
          pilotCommissionPercentage: 70,
          costPerHectare: 6200,
          minimumDispatchFee: 3500,
          currency: "LKR",
        };
      }
    }
  },

  /**
   * Update dynamic system settings (Admin Only)
   */
  async updateSettings(payload: UpdateSystemSettingsPayload): Promise<SystemSettings> {
    const response = await apiClient.put<ApiResponse<SystemSettings>>("/admin/settings", payload);
    return response.data;
  },
};
