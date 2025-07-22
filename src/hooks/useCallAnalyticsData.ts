
import { useQuery } from '@tanstack/react-query';
import { mockData } from '@/data/mockData';

export const useCallAnalyticsData = () => {
  return useQuery({
    queryKey: ['call-analytics', 'mock-user-123'],
    queryFn: async () => {
      return mockData.callAnalytics;
    },
    enabled: true,
  });
};
