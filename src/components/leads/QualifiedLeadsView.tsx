
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Mail, Building, Calendar, TrendingUp } from 'lucide-react';
import { useQualifiedLeadsByStatus } from '@/hooks/useLeadQualification';

interface QualifiedLeadsViewProps {
  status: string;
  onBack: () => void;
}

export const QualifiedLeadsView: React.FC<QualifiedLeadsViewProps> = ({ status, onBack }) => {
  const { data: leads = [], isLoading } = useQualifiedLeadsByStatus(status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return 'bg-red-500 text-white';
      case 'Warm': return 'bg-yellow-500 text-white';
      case 'Cold': return 'bg-blue-500 text-white';
      case 'Unqualified': return 'bg-gray-500 text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 71) return 'bg-green-100 text-green-800';
    if (score >= 51) return 'bg-yellow-100 text-yellow-800';
    if (score >= 31) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <span>{status} Leads</span>
              <Badge className={getStatusColor(status)}>
                {leads.length}
              </Badge>
            </h1>
            <p className="text-gray-600">
              {status === 'Hot' && 'Very interested, qualified leads (score 71-85+)'}
              {status === 'Warm' && 'Interested with minor concerns (score 51-70)'}
              {status === 'Cold' && 'Some interest but major barriers (score 31-50)'}
              {status === 'Unqualified' && 'No interest, no budget, not a fit (score 0-30)'}
            </p>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="grid gap-4">
        {leads.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <TrendingUp className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No {status} Leads Found</h3>
              <p className="text-gray-600">
                No leads have been qualified as {status.toLowerCase()} yet. 
                Complete more AI calls to see qualified leads here.
              </p>
            </CardContent>
          </Card>
        ) : (
          leads.map((lead: any) => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {lead.name || 'Unknown Name'}
                      </h3>
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                      {lead.call_data?.lead_score && (
                        <Badge className={getScoreColor(lead.call_data.lead_score)} variant="secondary">
                          Score: {lead.call_data.lead_score}/100
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      {lead.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{lead.email}</span>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                      {lead.company && (
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4" />
                          <span>{lead.company}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Added: {new Date(lead.created_at).toLocaleDateString()}</span>
                      </div>
                      {lead.call_data?.completed_at && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>Last call: {new Date(lead.call_data.completed_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Analysis Summary */}
                {lead.call_data?.ai_analysis && (
                  <div className="border-t pt-4 mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">AI Analysis Summary</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lead.call_data.ai_analysis.keyInsights?.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Key Insights</p>
                          <ul className="text-xs space-y-1">
                            {lead.call_data.ai_analysis.keyInsights.slice(0, 2).map((insight: string, index: number) => (
                              <li key={index} className="text-gray-700">• {insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {lead.call_data.ai_analysis.nextBestAction && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Recommended Action</p>
                          <p className="text-xs text-gray-700">{lead.call_data.ai_analysis.nextBestAction}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
