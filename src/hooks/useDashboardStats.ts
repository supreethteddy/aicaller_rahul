import { useQuery } from '@tanstack/react-query';
import { mockData } from '@/data/mockData';

interface DateRange {
  from: Date;
  to: Date;
}

interface DashboardStats {
  totalCalls: number;
  successfulCalls: number;
  totalLeads: number;
  qualifiedLeads: number;
  successRate: number;
  avgCallDuration: number;
  growth: {
    calls: number;
    leads: number;
    qualified: number;
    revenue: number;
  };
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard_stats', 'mock-user-123'],
    queryFn: async (): Promise<DashboardStats> => {
      return mockData.stats;
    },
    enabled: true,
    staleTime: 5000,
    retry: 1,
    refetchOnWindowFocus: false,
    meta: {
      timeout: 3000
    }
  });
};

export const useRecentCalls = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['recent_calls', 'mock-user-123', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      let calls = [...mockData.calls].filter(call => call.status === 'completed' && call.lead_score);

      if (dateRange) {
        calls = calls.filter(call => {
          const callDate = new Date(call.created_at);
          return callDate >= dateRange.from && callDate <= dateRange.to;
        });
      }

      return calls.slice(0, 5);
    },
    enabled: true,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export const useWeeklyCallData = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['weekly_call_data', 'mock-user-123', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      return mockData.weeklyCallData;
    },
    enabled: true,
    staleTime: 5000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
