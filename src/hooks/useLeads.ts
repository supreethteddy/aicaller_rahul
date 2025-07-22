import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockData } from '@/data/mockData';

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
  return useQuery({
    queryKey: ['leads', 'mock-user-123', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      // Filter mock leads by date range if provided
      let leads = [...mockData.leads];

      if (dateRange && dateRange.from && dateRange.to &&
        !isNaN(dateRange.from.getTime()) && !isNaN(dateRange.to.getTime()) &&
        isValidDateRange(dateRange.from, dateRange.to)) {

        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);

        leads = leads.filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate >= fromDate && leadDate <= toDate;
        });
      }

      return leads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    enabled: true,
    retry: 1,
  });
};

export const useLeadSources = () => {
  return useQuery({
    queryKey: ['lead_sources', 'mock-user-123'],
    queryFn: async () => {
      // Return empty array for lead sources since we removed integrations
      return [];
    },
    enabled: true,
  });
};

export const useCreateLeadSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadSource: Omit<LeadSource, 'id' | 'created_at' | 'updated_at' | 'total_leads' | 'last_sync_at' | 'webhook_url'>) => {
      // Return mock success since we don't actually create anything
      return {
        id: `source-${Date.now()}`,
        ...leadSource,
        user_id: 'mock-user-123',
        webhook_url: `https://example.com/webhook/${leadSource.source_type}`,
        total_leads: 0,
        last_sync_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_sources'] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
      // Find and update the lead in mock data
      const leadIndex = mockData.leads.findIndex(lead => lead.id === id);
      if (leadIndex !== -1) {
        mockData.leads[leadIndex] = { ...mockData.leads[leadIndex], ...updates };
        return mockData.leads[leadIndex];
      }
      throw new Error('Lead not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Remove lead from mock data
      const leadIndex = mockData.leads.findIndex(lead => lead.id === id);
      if (leadIndex !== -1) {
        mockData.leads.splice(leadIndex, 1);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
