
import React from 'react';
import { Users, TrendingUp, Phone, MessageSquare } from 'lucide-react';
import { Lead } from '@/hooks/useLeads';

interface LeadStatsProps {
  leads: Lead[];
}

export const LeadStats: React.FC<LeadStatsProps> = ({ leads }) => {
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Leads</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">New Leads</p>
            <p className="text-xl font-bold">{stats.new}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Phone className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Contacted</p>
            <p className="text-xl font-bold">{stats.contacted}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <MessageSquare className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Converted</p>
            <p className="text-xl font-bold">{stats.converted}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
