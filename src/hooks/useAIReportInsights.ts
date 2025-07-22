
import { useQuery } from '@tanstack/react-query';
import { mockData } from '@/data/mockData';

export interface AIReportData {
  summary: string;
  recommendations: string[];
  insights: {
    topPerformer: string;
    bestTimeToCall: string;
    keySuccessFactors: string[];
  };
}

export const useAIReportInsights = () => {
  return useQuery({
    queryKey: ['ai-report-insights', 'mock-user-123'],
    queryFn: async (): Promise<AIReportData> => {
      return mockData.insights;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
