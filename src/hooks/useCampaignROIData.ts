
import { useQuery } from '@tanstack/react-query';
import { mockData } from '@/data/mockData';

export const useCampaignROIData = () => {
  return useQuery({
    queryKey: ['campaign-roi', 'mock-user-123'],
    queryFn: async () => {
      return mockData.campaignROI;
    },
    enabled: true,
  });
};
