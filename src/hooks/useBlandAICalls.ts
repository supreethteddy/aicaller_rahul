import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockData } from '@/data/mockData';
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
  return useQuery({
    queryKey: ['bland_ai_calls', 'mock-user-123'],
    queryFn: async () => {
      return mockData.calls as BlandAICall[];
    },
    enabled: true,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
    staleTime: 30000,
  });
};

export const useCreateBlandAICall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (callData: Omit<BlandAICall, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'ai_analysis' | 'lead_score' | 'qualification_status'>) => {
      const newCall = {
        id: `call-${Date.now()}`,
        user_id: 'mock-user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ai_analysis: null,
        lead_score: null,
        qualification_status: null,
        ...callData
      };

      mockData.calls.unshift(newCall);
      return newCall;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });
    },
  });
};

export const useUpdateBlandAICall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlandAICall> }) => {
      const callIndex = mockData.calls.findIndex(call => call.id === id);
      if (callIndex !== -1) {
        mockData.calls[callIndex] = { ...mockData.calls[callIndex], ...updates };
        return mockData.calls[callIndex];
      }
      throw new Error('Call not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });
    },
  });
};

export const useDeleteBlandAICall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const callIndex = mockData.calls.findIndex(call => call.id === id);
      if (callIndex !== -1) {
        mockData.calls.splice(callIndex, 1);
      }
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
  return useMutation({
    mutationFn: async () => {
      // Mock sync - just return success
      return { synced: mockData.calls.length };
    },
  });
};

export const useTriggerAIAnalysis = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return {
    triggerAnalysis: async (callId: string, transcript: string) => {
      // Mock AI analysis
      const callIndex = mockData.calls.findIndex(call => call.id === callId);
      if (callIndex !== -1) {
        mockData.calls[callIndex].ai_analysis = {
          leadScore: Math.floor(Math.random() * 100),
          qualificationStatus: ['Hot', 'Warm', 'Cold', 'Unqualified'][Math.floor(Math.random() * 4)],
          sentiment: ['Positive', 'Neutral', 'Negative'][Math.floor(Math.random() * 3)],
          interestLevel: Math.floor(Math.random() * 10),
          keyInsights: ['Showed interest in pricing', 'Decision maker confirmed'],
          nextBestAction: 'Schedule demo',
          analyzerUsed: 'openai'
        };

        queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });

        toast({
          title: 'Analysis Complete',
          description: 'AI analysis completed successfully',
        });
      }
    }
  };
};
