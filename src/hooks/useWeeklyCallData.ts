import { useQuery } from '@tanstack/react-query';
import { mockData } from '@/data/mockData';

interface DateRange {
    from: Date;
    to: Date;
}

export const useWeeklyCallData = (dateRange?: DateRange) => {
    return useQuery({
        queryKey: ['weekly_call_data', 'mock-user-123', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
        queryFn: async () => {
            // Return mock weekly call data - you could filter by date range if needed
            return mockData.weeklyCallData;
        },
        enabled: true,
        staleTime: 5000,
        retry: 1,
        refetchOnWindowFocus: false,
    });
}; 