import { useQuery } from '@tanstack/react-query';
import { mockData } from '@/data/mockData';

export const useLeadQualification = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['lead_qualification', 'mock-user-123', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      // Calculate qualification stats from mock data
      let leads = [...mockData.leads];
      
      // Filter by date range if provided
      if (dateRange) {
        leads = leads.filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate >= dateRange.from && leadDate <= dateRange.to;
        });
      }
      
      const hotLeads = leads.filter(lead => lead.qualification_status === 'Hot');
      const warmLeads = leads.filter(lead => lead.qualification_status === 'Warm');
      const coldLeads = leads.filter(lead => lead.qualification_status === 'Cold');
      const unqualifiedLeads = leads.filter(lead => lead.qualification_status === 'Unqualified');

      return {
        stats: {
          hot: hotLeads.length,
          warm: warmLeads.length,
          cold: coldLeads.length,
          unqualified: unqualifiedLeads.length,
          total: leads.length
        },
        leads: leads
      };
    },
    enabled: true,
  });
};

interface DateRange {
  from: Date;
  to: Date;
}

export const useQualifiedLeadsByStatus = (status: string, dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['qualified_leads_by_status', 'mock-user-123', status, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      let leads = [...mockData.leads];

      // Filter by status if provided
      if (status && status !== 'all') {
        leads = leads.filter(lead => lead.qualification_status === status);
      }

      // Filter by date range if provided
      if (dateRange) {
        leads = leads.filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate >= dateRange.from && leadDate <= dateRange.to;
        });
      }

      return leads.slice(0, 25); // Limit to 25 like the original
    },
    enabled: true,
    staleTime: 5000,
    retry: 1,
    refetchOnWindowFocus: false,
    meta: {
      timeout: 3000
    }
  });
};
