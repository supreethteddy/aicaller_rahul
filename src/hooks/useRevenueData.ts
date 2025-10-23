
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
      // Remove mock revenue calculations - show actual data or 0
      const revenuePerCall = 0; // No mock revenue per call
      const totalRevenue = 0; // No mock total revenue

      return {
        monthlyRevenueData: [
          { month: 'Jan', total: 0, recurring: 0, one_time: 0, forecast: 0 },
          { month: 'Feb', total: 0, recurring: 0, one_time: 0, forecast: 0 },
          { month: 'Mar', total: 0, recurring: 0, one_time: 0, forecast: 0 },
          { month: 'Apr', total: 0, recurring: 0, one_time: 0, forecast: 0 },
          { month: 'May', total: 0, recurring: 0, one_time: 0, forecast: 0 },
          { month: 'Jun', total: 0, recurring: 0, one_time: 0, forecast: 0 }
        ],
        revenueBySource: [
          { source: 'Real Estate', revenue: 0, percentage: 0, growth: 0 },
          { source: 'Insurance', revenue: 0, percentage: 0, growth: 0 },
          { source: 'SaaS', revenue: 0, percentage: 0, growth: 0 },
          { source: 'E-commerce', revenue: 0, percentage: 0, growth: 0 }
        ],
        customerSegmentRevenue: [
          { segment: 'Enterprise', customers: 0, revenue: 0, avg_value: 0 },
          { segment: 'Mid-Market', customers: 0, revenue: 0, avg_value: 0 },
          { segment: 'Small Business', customers: 0, revenue: 0, avg_value: 0 }
        ],
        revenueMetrics: {
          totalRevenue: 0,
          monthlyGrowth: 0,
          arrGrowth: 0,
          churnRate: 0,
          avgDealSize: 0,
          customerLTV: 0,
          paybackPeriod: 0
        }
      };
    },
    enabled: !!user?.id,
  });
};
