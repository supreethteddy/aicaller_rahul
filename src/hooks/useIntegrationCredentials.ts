
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface IntegrationCredential {
  id: string;
  source_type: string;
  api_key?: string;
  access_token?: string;
  refresh_token?: string;
  client_id?: string;
  client_secret?: string;
  webhook_secret?: string;
  config?: any;
  is_active: boolean;
  last_validated_at?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface SyncLog {
  id: string;
  user_id: string;
  source_type: string;
  sync_status: string;
  leads_imported: number | null;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  metadata: any;
}

export const useIntegrationCredentials = () => {
  return useQuery({
    queryKey: ['integration_credentials', 'mock-user-123'],
    queryFn: async () => {
      // Return empty array since we removed integrations
      return [] as IntegrationCredential[];
    },
    enabled: true,
  });
};

export const useSyncLogs = (sourceType?: string) => {
  // This hook is no longer used as integrations are removed.
  // Keeping it here for now, but it will always return empty.
  return useQuery({
    queryKey: ['integration_sync_logs', sourceType, 'mock-user-123'],
    queryFn: async () => {
      return [] as SyncLog[];
    },
    enabled: true,
  });
};

export const useCreateCredentials = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: Omit<IntegrationCredential, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_validated_at'>) => {
      // Mock creation - just return success
      return {
        id: `cred-${Date.now()}`,
        user_id: 'mock-user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_validated_at: null,
        ...credentials
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration_credentials'] });
    },
  });
};

export const useTestConnection = () => {
  // This hook is no longer used as integrations are removed.
  // Keeping it here for now, but it will always return success.
  return useMutation({
    mutationFn: async ({ sourceType, credentials }: { sourceType: string; credentials: any }) => {
      return { status: 'success' };
    },
  });
};

export const useTriggerSync = () => {
  return useMutation({
    mutationFn: async (sourceId: string) => {
      // Mock sync - just return success
      return { status: 'success', synced: 0 };
    },
  });
};
