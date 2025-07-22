
import { useQuery } from '@tanstack/react-query';
import { mockData } from '@/data/mockData';

export const useReportsData = () => {
  return useQuery({
    queryKey: ['reports-overview', 'mock-user-123'],
    queryFn: async () => {
      return mockData.reports;
    },
    enabled: true,
  });
};
