import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DateRange {
  from: Date;
  to: Date;
}

export const useLeadQualification = (dateRange?: DateRange) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['lead_qualification', user?.id, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      let query = supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id);

      // Filter by date range if provided
      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString());
      }

      const { data: leads, error } = await query;
      
      if (error) throw error;

      // Calculate qualification stats based on score ranges (matching UI labels)
      const hotLeads = leads?.filter(lead => lead.score && lead.score >= 71) || [];
      const warmLeads = leads?.filter(lead => lead.score && lead.score >= 51 && lead.score < 71) || [];
      const coldLeads = leads?.filter(lead => lead.score && lead.score >= 31 && lead.score < 51) || [];
      const unqualifiedLeads = leads?.filter(lead => !lead.score || lead.score < 31) || [];

      return {
        stats: {
          hot: hotLeads.length,
          warm: warmLeads.length,
          cold: coldLeads.length,
          unqualified: unqualifiedLeads.length,
          total: leads?.length || 0
        },
        leads: leads || []
      };
    },
    enabled: !!user?.id,
  });
};

export const useQualifiedLeadsByStatus = (status: string, dateRange?: DateRange) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['qualified_leads_by_status', user?.id, status, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      let query = supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id);

      // Filter by status if provided (matching UI score ranges)
      if (status && status !== 'all') {
        if (status === 'Hot') {
          query = query.gte('score', 71);
        } else if (status === 'Warm') {
          query = query.gte('score', 51).lt('score', 71);
        } else if (status === 'Cold') {
          query = query.gte('score', 31).lt('score', 51);
        } else if (status === 'Unqualified') {
          query = query.or('score.is.null,score.lt.31');
        }
      }

      // Filter by date range if provided
      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString());
      }

      const { data, error } = await query.limit(25);
      
      if (error) throw error;
      return data || [];
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
