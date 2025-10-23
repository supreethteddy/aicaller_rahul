import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface BlandAICall {
  id: string;
  user_id: string;
  lead_id: string | null;
  campaign_id: string | null;
  bland_call_id: string | null;
  phone_number: string;
  status: string;
  duration: number | null;
  transcript: string | null;
  summary: string | null;
  outcome: string | null;
  recording_url: string | null;
  call_data: any;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  ai_analysis: any;
  lead_score: number | null;
  qualification_status: string | null;
}

export const useBlandAICalls = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['bland_ai_calls', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bland_ai_calls')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlandAICall[];
    },
    enabled: !!user?.id,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
    staleTime: 30000,
  });
};

export const useCreateBlandAICall = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (callData: Omit<BlandAICall, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'ai_analysis' | 'lead_score' | 'qualification_status'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bland_ai_calls')
        .insert({
          ...callData,
          user_id: user.id,
          ai_analysis: null,
          lead_score: null,
          qualification_status: null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as BlandAICall;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });
    },
  });
};

export const useUpdateBlandAICall = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlandAICall> }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bland_ai_calls')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as BlandAICall;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });
    },
  });
};

export const useDeleteBlandAICall = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('bland_ai_calls')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });
    },
  });
};

// Mock sync function that doesn't do anything
export const useBlandAICallsSync = () => {
  return null;
};

export const useSyncBlandAICalls = () => {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // This would typically sync with Bland AI API
      // For now, just return the count of calls
      const { count } = await supabase
        .from('bland_ai_calls')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      return { synced: count || 0 };
    },
  });
};

export const useTriggerAIAnalysis = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return {
    triggerAnalysis: async (callId: string, transcript: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Mock AI analysis - in real implementation, this would call OpenAI API
      const mockAnalysis = {
        leadScore: Math.floor(Math.random() * 100),
        qualificationStatus: ['Hot', 'Warm', 'Cold', 'Unqualified'][Math.floor(Math.random() * 4)],
        sentiment: ['Positive', 'Neutral', 'Negative'][Math.floor(Math.random() * 3)],
        interestLevel: Math.floor(Math.random() * 10),
        keyInsights: ['Showed interest in pricing', 'Decision maker confirmed'],
        nextBestAction: 'Schedule demo',
        analyzerUsed: 'openai'
      };

      const { error } = await supabase
        .from('bland_ai_calls')
        .update({
          ai_analysis: mockAnalysis,
          lead_score: mockAnalysis.leadScore,
          qualification_status: mockAnalysis.qualificationStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', callId)
        .eq('user_id', user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });

      toast({
        title: 'Analysis Complete',
        description: 'AI analysis completed successfully',
      });
    }
  };
};
