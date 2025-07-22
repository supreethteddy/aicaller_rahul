
import { useQuery } from '@tanstack/react-query';
import { mockData } from '@/data/mockData';

export const useRevenueData = () => {
  return useQuery({
    queryKey: ['revenue-data', 'mock-user-123'],
    queryFn: async () => {
      return mockData.revenueData;
    },
    enabled: true,
  });
};
