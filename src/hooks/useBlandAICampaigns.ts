import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockData } from '@/data/mockData';

export interface BlandAICampaign {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  ai_prompt: string;
  voice_id: string | null;
  status: string;
  total_leads: number | null;
  completed_calls: number | null;
  successful_calls: number | null;
  campaign_data: any;
  created_at: string;
  updated_at: string;
}

export const useBlandAICampaigns = () => {
  return useQuery({
    queryKey: ['bland_ai_campaigns', 'mock-user-123'],
    queryFn: async () => {
      return mockData.campaigns as BlandAICampaign[];
    },
    enabled: true,
  });
};

export const useCreateBlandAICampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignData: Omit<BlandAICampaign, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const newCampaign = {
        id: `campaign-${Date.now()}`,
        user_id: 'mock-user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...campaignData
      };

      mockData.campaigns.unshift(newCampaign);
      return newCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_campaigns'] });
    },
  });
};

export const useUpdateBlandAICampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlandAICampaign> }) => {
      const campaignIndex = mockData.campaigns.findIndex(campaign => campaign.id === id);
      if (campaignIndex !== -1) {
        mockData.campaigns[campaignIndex] = { ...mockData.campaigns[campaignIndex], ...updates };
        return mockData.campaigns[campaignIndex];
      }
      throw new Error('Campaign not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_campaigns'] });
    },
  });
};

export const useDeleteBlandAICampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const campaignIndex = mockData.campaigns.findIndex(campaign => campaign.id === id);
      if (campaignIndex !== -1) {
        mockData.campaigns.splice(campaignIndex, 1);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_campaigns'] });
    },
  });
};

export const useRecalculateCampaignMetrics = () => {
  return useMutation({
    mutationFn: async () => {
      // Mock recalculation - just return success
      return { updated: mockData.campaigns.length };
    },
  });
};
