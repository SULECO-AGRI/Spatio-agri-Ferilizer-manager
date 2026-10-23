import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService, type SystemSettings, type UpdateSystemSettingsPayload } from "@/services/settingsService";

export const SETTINGS_QUERY_KEY = ["systemSettings"] as const;

export function useSettings() {
  const queryClient = useQueryClient();

  const query = useQuery<SystemSettings>({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: () => settingsService.getSettings(),
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: (payload: UpdateSystemSettingsPayload) => settingsService.updateSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, updated);
      queryClient.invalidateQueries({ queryKey: ["paymentsData"] });
      queryClient.invalidateQueries({ queryKey: ["serviceRequests"] });
    },
  });

  return {
    settings: query.data ?? {
      pilotCommissionPercentage: 70,
      costPerHectare: 6200,
      minimumDispatchFee: 3500,
      currency: "LKR",
      operationRates: {
        FERTILIZING: 6200,
        PRECISION_SPRAYING: 6940,
        PEST_CONTROL_SPRAY: 7440,
        SEED_BROADCASTING: 5460,
        DRONE_MAPPING: 9420,
      },
    },
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    updateSettings: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
}
