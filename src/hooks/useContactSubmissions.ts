import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  form_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useContactSubmissions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['contact_submissions', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactSubmission[];
    },
    enabled: !!user?.id,
  });
};

export const useUpdateContactSubmissionStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('contact_submissions')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as ContactSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_submissions'] });
    },
  });
};

export const useCreateContactSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionData: Omit<ContactSubmission, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert(submissionData)
        .select()
        .single();
      
      if (error) throw error;
      return data as ContactSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_submissions'] });
    },
  });
};
