import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DateRange {
    from: Date;
    to: Date;
}

export const useWeeklyCallData = (dateRange?: DateRange) => {
    const { user } = useAuth();
    
    return useQuery({
        queryKey: ['weekly_call_data', user?.id, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
        queryFn: async () => {
            if (!user?.id) throw new Error('User not authenticated');

            // Get calls grouped by day of week
            const { data, error } = await supabase
                .from('bland_ai_calls')
                .select('created_at, lead_score')
                .eq('user_id', user.id)
                .eq('status', 'completed');

            if (error) throw error;

            // Group by day of week and calculate qualified calls
            const weeklyData = [
                { name: 'Mon', calls: 0, qualified: 0 },
                { name: 'Tue', calls: 0, qualified: 0 },
                { name: 'Wed', calls: 0, qualified: 0 },
                { name: 'Thu', calls: 0, qualified: 0 },
                { name: 'Fri', calls: 0, qualified: 0 },
                { name: 'Sat', calls: 0, qualified: 0 },
                { name: 'Sun', calls: 0, qualified: 0 }
            ];

            data?.forEach(call => {
                const dayOfWeek = new Date(call.created_at).getDay();
                const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday=0 to Sunday=6
                
                weeklyData[dayIndex].calls++;
                if (call.lead_score && call.lead_score > 70) {
                    weeklyData[dayIndex].qualified++;
                }
            });

            return weeklyData;
        },
        enabled: !!user?.id,
        staleTime: 5000,
        retry: 1,
        refetchOnWindowFocus: false,
    });
}; 