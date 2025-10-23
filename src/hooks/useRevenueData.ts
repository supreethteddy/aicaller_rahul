
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useRevenueData = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['revenue-data', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get successful calls to calculate revenue
      const { count: successfulCalls } = await supabase
        .from('bland_ai_calls')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('outcome', 'success');

      // Mock revenue calculation - in real implementation, this would be more sophisticated
      const revenuePerCall = 1000; // Assuming $1000 per successful call
      const totalRevenue = (successfulCalls || 0) * revenuePerCall;

      return {
        monthlyRevenueData: [
          { month: 'Jan', total: totalRevenue * 0.1, recurring: totalRevenue * 0.065, one_time: totalRevenue * 0.035, forecast: 0 },
          { month: 'Feb', total: totalRevenue * 0.15, recurring: totalRevenue * 0.0975, one_time: totalRevenue * 0.0525, forecast: 0 },
          { month: 'Mar', total: totalRevenue * 0.2, recurring: totalRevenue * 0.13, one_time: totalRevenue * 0.07, forecast: 0 },
          { month: 'Apr', total: totalRevenue * 0.25, recurring: totalRevenue * 0.1625, one_time: totalRevenue * 0.0875, forecast: 0 },
          { month: 'May', total: totalRevenue * 0.3, recurring: totalRevenue * 0.195, one_time: totalRevenue * 0.105, forecast: 0 },
          { month: 'Jun', total: totalRevenue * 0.35, recurring: totalRevenue * 0.2275, one_time: totalRevenue * 0.1225, forecast: totalRevenue * 0.385 }
        ],
        revenueBySource: [
          { source: 'Real Estate', revenue: totalRevenue * 0.425, percentage: 42.5, growth: 15.2 },
          { source: 'Insurance', revenue: totalRevenue * 0.302, percentage: 30.2, growth: 8.7 },
          { source: 'SaaS', revenue: totalRevenue * 0.175, percentage: 17.5, growth: 22.1 },
          { source: 'E-commerce', revenue: totalRevenue * 0.099, percentage: 9.9, growth: -2.3 }
        ],
        customerSegmentRevenue: [
          { segment: 'Enterprise', customers: 12, revenue: totalRevenue * 0.5, avg_value: totalRevenue * 0.5 / 12 },
          { segment: 'Mid-Market', customers: 28, revenue: totalRevenue * 0.3, avg_value: totalRevenue * 0.3 / 28 },
          { segment: 'Small Business', customers: 45, revenue: totalRevenue * 0.2, avg_value: totalRevenue * 0.2 / 45 }
        ],
        revenueMetrics: {
          totalRevenue,
          monthlyGrowth: 24.4,
          arrGrowth: 292.8,
          churnRate: 3.2,
          avgDealSize: totalRevenue / (successfulCalls || 1),
          customerLTV: totalRevenue * 0.15,
          paybackPeriod: 4.2
        }
      };
    },
    enabled: !!user?.id,
  });
};
