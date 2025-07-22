
import { useQuery } from '@tanstack/react-query';
import { mockData } from '@/data/mockData';

export const useLeadPerformanceData = () => {
  return useQuery({
    queryKey: ['lead-performance', 'mock-user-123'],
    queryFn: async () => {
      return mockData.leadPerformance;
    },
    enabled: true,
  });
};
