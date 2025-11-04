import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  source: string;
  source_id: string | null;
  campaign_id: string | null;
  lead_data: any;
  score: number | null;
  status: string | null;
  priority: string | null;
  created_at: string;
  updated_at: string;
  last_contact_at: string | null;
}

export interface LeadSource {
  id: string;
  source_type: string;
  source_name: string;
  is_active: boolean | null;
  api_config: any;
  webhook_url: string | null;
  total_leads: number | null;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

interface DateRange {
  from: Date;
  to: Date;
}

const isValidDateRange = (from: Date, to: Date): boolean => {
  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setHours(0, 0, 0, 0);
  return fromDate <= toDate;
};

export const useLeads = (dateRange?: DateRange) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['leads', user?.id, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      let query = supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Filter by date range if provided
      if (dateRange && dateRange.from && dateRange.to &&
        !isNaN(dateRange.from.getTime()) && !isNaN(dateRange.to.getTime()) &&
        isValidDateRange(dateRange.from, dateRange.to)) {

        const fromDate = dateRange.from.toISOString();
        const toDate = dateRange.to.toISOString();
        
        query = query
          .gte('created_at', fromDate)
          .lte('created_at', toDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Lead[];
    },
    enabled: !!user?.id,
    retry: 1,
  });
};

export const useLeadSources = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['lead_sources', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('lead_sources')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LeadSource[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateLeadSource = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (leadSource: Omit<LeadSource, 'id' | 'created_at' | 'updated_at' | 'total_leads' | 'last_sync_at' | 'webhook_url'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('lead_sources')
        .insert({
          ...leadSource,
          user_id: user.id,
          webhook_url: `https://oeghvmszrfomcmyhsnkh.supabase.co/functions/v1/webhook/${leadSource.source_type}`,
          total_leads: 0,
          last_sync_at: null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as LeadSource;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_sources'] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('leads')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
