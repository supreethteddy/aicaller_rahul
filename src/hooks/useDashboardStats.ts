import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard_stats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get leads count
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get qualified leads count (assuming score > 70 means qualified)
      const { count: qualifiedLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gt('score', 70);

      // Get Bland AI calls count
      const { count: totalCalls } = await supabase
        .from('bland_ai_calls')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get successful calls count
      const { count: successfulCalls } = await supabase
        .from('bland_ai_calls')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('outcome', 'success');

      // Get average call duration
      const { data: callsData } = await supabase
        .from('bland_ai_calls')
        .select('duration')
        .eq('user_id', user.id)
        .not('duration', 'is', null);

      const avgCallDuration = callsData && callsData.length > 0 
        ? callsData.reduce((sum, call) => sum + (call.duration || 0), 0) / callsData.length 
        : 0;

      const successRate = totalCalls && totalCalls > 0 
        ? Math.round((successfulCalls || 0) / totalCalls * 100) 
        : 0;

      return {
        totalCalls: totalCalls || 0,
        successfulCalls: successfulCalls || 0,
        totalLeads: totalLeads || 0,
        qualifiedLeads: qualifiedLeads || 0,
        successRate,
        avgCallDuration: Math.round(avgCallDuration),
        growth: {
          calls: 15, // This would need to be calculated based on previous period
          leads: 8,
          qualified: 22,
          revenue: 35
        }
      };
    },
    enabled: !!user?.id,
    staleTime: 5000,
    retry: 1,
    refetchOnWindowFocus: false,
    meta: {
      timeout: 3000
    }
  });
};

export const useRecentCalls = (dateRange?: DateRange) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['recent_calls', user?.id, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      let query = supabase
        .from('bland_ai_calls')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .not('lead_score', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

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
