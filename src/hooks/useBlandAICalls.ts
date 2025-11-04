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

// Sync function that automatically triggers analysis for completed calls
export const useBlandAICallsSync = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const triggerAnalysis = useTriggerAIAnalysis();

  return useQuery({
    queryKey: ['bland_ai_calls_sync', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // 1) Poll backend to sync queued/in-progress calls with Bland AI API
      let synced = 0;
      try {
        const { data: syncResult, error: syncError } = await supabase.functions.invoke('sync-bland-calls');
        if (syncError) {
          // Non-fatal: continue with analysis even if sync failed
          console.error('Error syncing Bland AI calls:', syncError);
        } else if (syncResult && typeof syncResult.synced === 'number') {
          synced = syncResult.synced;
        }
      } catch (err) {
        console.error('Failed to invoke sync-bland-calls:', err);
      }

      // 2) Find completed calls with transcripts but no analysis and trigger analysis
      const { data: callsNeedingAnalysis, error } = await supabase
        .from('bland_ai_calls')
        .select('id, transcript')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .not('transcript', 'is', null)
        .not('transcript', 'eq', '')
        .is('ai_analysis', null);

      if (error) {
        console.error('Error fetching calls needing analysis:', error);
        return { analyzed: 0, synced };
      }

      let analyzed = 0;
      if (callsNeedingAnalysis && callsNeedingAnalysis.length > 0) {
        for (const call of callsNeedingAnalysis) {
          try {
            await triggerAnalysis.triggerAnalysis(call.id, call.transcript);
            analyzed++;
          } catch (err) {
            console.error(`Failed to trigger analysis for call ${call.id}:`, err);
          }
        }
      }

      // Refresh the calls list after sync/analysis
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });

      return { analyzed, synced };
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Check every 30 seconds
    refetchIntervalInBackground: false,
    staleTime: 10000,
  });
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
      
      // Skip analysis if transcript is empty or null
      if (!transcript || transcript.trim() === '') {
        console.log(`Skipping analysis for call ${callId} - no transcript available`);
        return null;
      }

      try {
        // Call the real analyze-call-transcript edge function
        const { data, error } = await supabase.functions.invoke('analyze-call-transcript', {
          body: {
            callId,
            transcript
          }
        });

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });

        toast({
          title: 'Analysis Complete',
          description: 'AI analysis completed successfully',
        });

        return data;
      } catch (error) {
        console.error('Error triggering AI analysis:', error);
        toast({
          title: 'Analysis Failed',
          description: 'Failed to analyze transcript. Please try again.',
          variant: 'destructive',
        });
        throw error;
      }
    }
  };
};
