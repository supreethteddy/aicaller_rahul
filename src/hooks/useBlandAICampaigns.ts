import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface BlandAICampaign {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  ai_prompt: string;
  voice_id: string | null;
  status: string;
  total_leads: number | null;
  completed_calls: number | null;
  successful_calls: number | null;
  campaign_data: any;
  created_at: string;
  updated_at: string;
}

export const useBlandAICampaigns = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['bland_ai_campaigns', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bland_ai_campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlandAICampaign[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateBlandAICampaign = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (campaignData: Omit<BlandAICampaign, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bland_ai_campaigns')
        .insert({
          ...campaignData,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as BlandAICampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_campaigns'] });
    },
  });
};

export const useUpdateBlandAICampaign = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlandAICampaign> }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bland_ai_campaigns')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as BlandAICampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_campaigns'] });
    },
  });
};

export const useDeleteBlandAICampaign = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // First delete all associated calls
      const { error: callsError } = await supabase
        .from('bland_ai_calls')
        .delete()
        .eq('campaign_id', id)
        .eq('user_id', user.id);
      
      if (callsError) throw callsError;

      // Then delete the campaign
      const { error } = await supabase
        .from('bland_ai_campaigns')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });
    },
  });
};

export const useRecalculateCampaignMetrics = () => {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get all campaigns for the user
      const { data: campaigns, error: campaignsError } = await supabase
        .from('bland_ai_campaigns')
        .select('id')
        .eq('user_id', user.id);

      if (campaignsError) throw campaignsError;

      let updatedCount = 0;

      // Recalculate metrics for each campaign
      for (const campaign of campaigns || []) {
        // Get call counts for this campaign
        const { count: totalCalls } = await supabase
          .from('bland_ai_calls')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id);

        const { count: successfulCalls } = await supabase
          .from('bland_ai_calls')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id)
          .eq('outcome', 'success');

        // Get lead count for this campaign
        const { count: totalLeads } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id);

        // Update campaign metrics
        const { error: updateError } = await supabase
          .from('bland_ai_campaigns')
          .update({
            completed_calls: totalCalls || 0,
            successful_calls: successfulCalls || 0,
            total_leads: totalLeads || 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', campaign.id);

        if (!updateError) updatedCount++;
      }

      return { updated: updatedCount };
    },
  });
};
