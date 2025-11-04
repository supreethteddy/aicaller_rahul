
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useReportsData = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['reports-overview', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get leads count
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get AI calls count
      const { count: aiCallsMade } = await supabase
        .from('bland_ai_calls')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get successful calls count
      const { count: successfulCalls } = await supabase
        .from('bland_ai_calls')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('outcome', 'success');

      const successRate = aiCallsMade && aiCallsMade > 0 
        ? Math.round((successfulCalls || 0) / aiCallsMade * 100 * 10) / 10 
        : 0;

      // Remove mock revenue - show actual data or 0 if no real revenue tracking
      const revenueGenerated = 0; // No mock revenue

      return {
        totalLeads: totalLeads || 0,
        aiCallsMade: aiCallsMade || 0,
        successRate,
        revenueGenerated
      };
    },
    enabled: !!user?.id,
  });
};
