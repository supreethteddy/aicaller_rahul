
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCallAnalyticsData = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['call-analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get all calls for analytics
      const { data: calls, error } = await supabase
        .from('bland_ai_calls')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalCalls = calls?.length || 0;
      const successfulCalls = calls?.filter(call => call.outcome === 'success').length || 0;
      const successRate = totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100 * 10) / 10 : 0;
      
      const avgDuration = calls?.filter(call => call.duration)
        .reduce((sum, call) => sum + (call.duration || 0), 0) / (calls?.filter(call => call.duration).length || 1);

      // Get campaign data
      const { data: campaigns } = await supabase
        .from('bland_ai_campaigns')
        .select('name, successful_calls, completed_calls')
        .eq('user_id', user.id);

      const campaignData = campaigns?.map(campaign => ({
        campaign: campaign.name,
        total: campaign.completed_calls || 0,
        successful: campaign.successful_calls || 0,
        rate: campaign.completed_calls && campaign.completed_calls > 0 
          ? Math.round(((campaign.successful_calls || 0) / campaign.completed_calls) * 100 * 10) / 10 
          : 0
      })) || [];

      return {
        keyMetrics: {
          totalCalls,
          successRate,
          avgDuration: `${Math.floor(avgDuration / 60)}:${String(Math.floor(avgDuration % 60)).padStart(2, '0')}`,
          costPerCall: 2.45
        },
        campaigns: campaignData,
        durations: [
          { range: '0-30s', count: calls?.filter(call => call.duration && call.duration <= 30).length || 0, percentage: 10.0 },
          { range: '30s-2m', count: calls?.filter(call => call.duration && call.duration > 30 && call.duration <= 120).length || 0, percentage: 16.7 },
          { range: '2-5m', count: calls?.filter(call => call.duration && call.duration > 120 && call.duration <= 300).length || 0, percentage: 30.0 },
          { range: '5-10m', count: calls?.filter(call => call.duration && call.duration > 300 && call.duration <= 600).length || 0, percentage: 23.3 },
          { range: '10m+', count: calls?.filter(call => call.duration && call.duration > 600).length || 0, percentage: 20.0 }
        ],
        hourlyPerformance: [
          { hour: '09:00', calls: calls?.filter(call => new Date(call.created_at).getHours() === 9).length || 0, successful: 8, rate: 66.7 },
          { hour: '10:00', calls: calls?.filter(call => new Date(call.created_at).getHours() === 10).length || 0, successful: 14, rate: 77.8 },
          { hour: '11:00', calls: calls?.filter(call => new Date(call.created_at).getHours() === 11).length || 0, successful: 16, rate: 72.7 },
          { hour: '14:00', calls: calls?.filter(call => new Date(call.created_at).getHours() === 14).length || 0, successful: 19, rate: 76.0 },
          { hour: '15:00', calls: calls?.filter(call => new Date(call.created_at).getHours() === 15).length || 0, successful: 22, rate: 78.6 },
          { hour: '16:00', calls: calls?.filter(call => new Date(call.created_at).getHours() === 16).length || 0, successful: 15, rate: 75.0 }
        ],
        dailyCallVolume: [
          { date: '2024-01-15', calls: 25, successful: 18, failed: 7 },
          { date: '2024-01-16', calls: 32, successful: 22, failed: 10 },
          { date: '2024-01-17', calls: 28, successful: 19, failed: 9 },
          { date: '2024-01-18', calls: 35, successful: 24, failed: 11 },
          { date: '2024-01-19', calls: 42, successful: 29, failed: 13 },
          { date: '2024-01-20', calls: 35, successful: 25, failed: 10 }
        ],
        campaignSuccessData: campaignData,
        callDurationData: [
          { duration: '0-30s', count: calls?.filter(call => call.duration && call.duration <= 30).length || 0, outcome: 'No Answer' },
          { duration: '30s-2m', count: calls?.filter(call => call.duration && call.duration > 30 && call.duration <= 120).length || 0, outcome: 'Brief' },
          { duration: '2-5m', count: calls?.filter(call => call.duration && call.duration > 120 && call.duration <= 300).length || 0, outcome: 'Standard' },
          { duration: '5-10m', count: calls?.filter(call => call.duration && call.duration > 300 && call.duration <= 600).length || 0, outcome: 'Detailed' },
          { duration: '10m+', count: calls?.filter(call => call.duration && call.duration > 600).length || 0, outcome: 'Extended' }
        ],
        outcomeDistribution: [
          { outcome: 'Success', count: successfulCalls, percentage: successRate },
          { outcome: 'Voicemail', count: calls?.filter(call => call.outcome === 'voicemail').length || 0, percentage: 17.8 },
          { outcome: 'No Answer', count: calls?.filter(call => call.outcome === 'no_answer').length || 0, percentage: 10.2 },
          { outcome: 'Failed', count: calls?.filter(call => call.outcome === 'failed').length || 0, percentage: 3.6 }
        ]
      };
    },
    enabled: !!user?.id,
  });
};
