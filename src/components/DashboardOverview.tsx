import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QualificationCards } from './dashboard/QualificationCards';
import { FilterBar } from './dashboard/FilterBar';
import { useFilter } from '@/contexts/FilterContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useLeads } from '@/hooks/useLeads';
import { useBlandAICalls } from '@/hooks/useBlandAICalls';
import { MobileStatsGrid } from './mobile/MobileStatsGrid';
import { SetupRequiredNotice } from './dashboard/SetupRequiredNotice';
import { useSetupRequired } from '@/hooks/useSetupRequired';
import { useContactDialog } from '@/hooks/useContactDialog';
import { useChatWindow } from '@/hooks/useChatWindow';
import {
  Users,
  Phone,
  TrendingUp,
  Target,
  Calendar,
  Activity,
  PhoneCall,
  Clock
} from 'lucide-react';

interface DashboardOverviewProps {
  onQualificationClick: (status: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-800';
    case 'contacted': return 'bg-yellow-100 text-yellow-800';
    case 'qualified': return 'bg-green-100 text-green-800';
    case 'converted': return 'bg-purple-100 text-purple-800';
    case 'lost': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getCallStatusColor = (status: string) => {
  switch (status) {
    case 'queued': return 'bg-blue-100 text-blue-800';
    case 'ringing': return 'bg-yellow-100 text-yellow-800';
    case 'in-progress': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-purple-100 text-purple-800';
    case 'failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onQualificationClick }) => {
  const isMobile = useIsMobile();
  const { selectedFilter, customRange, setFilter, getDateRange } = useFilter();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: leads } = useLeads();
  const { data: calls } = useBlandAICalls();
  const { setupRequired, isLoading: setupCheckLoading } = useSetupRequired();
  const { openContactDialog } = useContactDialog();
  const { openChat } = useChatWindow();

  // If still checking setup status or loading stats, show loading state
  if (setupCheckLoading || statsLoading) {
    return (
      <div className="space-y-4 md:space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If setup is required, show the setup notice
  if (setupRequired) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <SetupRequiredNotice
          onContactClick={openContactDialog}
          onChatClick={openChat}
        />
      </div>
    );
  }

  // Filter data based on selected date range
  const dateRange = getDateRange();

  const filteredLeads = leads?.filter(lead => {
    const leadDate = new Date(lead.created_at);
    return leadDate >= dateRange.from && leadDate <= dateRange.to;
  }) || [];

  const filteredCalls = calls?.filter(call => {
    const callDate = new Date(call.created_at);
    return callDate >= dateRange.from && callDate <= dateRange.to;
  }) || [];

  const recentLeads = filteredLeads.slice(0, 5);
  const recentCalls = filteredCalls.slice(0, 5);

  // Calculate derived stats from filtered data
  const totalLeads = filteredLeads.length;
  const totalCalls = filteredCalls.length;
  const successfulCalls = filteredCalls.filter(call =>
    ['completed', 'success'].includes(call.status)
  ).length;
  const conversionRate = totalCalls ? Math.round((successfulCalls / totalCalls) * 100) : 0;
  // Remove mock revenue - show actual data or hide if no real revenue data
  const estimatedRevenue = 0; // No mock revenue

  const mobileStats = [
    {
      title: 'Total Leads',
      value: totalLeads,
      change: 0, // No mock data
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'AI Calls Made',
      value: totalCalls,
      change: 0, // No mock data
      icon: Phone,
      color: 'bg-green-500'
    },
    {
      title: 'Success Rate',
      value: `${conversionRate}%`,
      change: 0, // No mock data
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      title: 'Revenue',
      value: estimatedRevenue > 0 ? `$${estimatedRevenue.toLocaleString()}` : 'No Data',
      change: 0, // No mock data
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Welcome back! Here's what's happening with your leads.
          </p>
        </div>
        {!isMobile && (
          <div className="flex space-x-3">

            
            {/* Commented out buttons
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 days
            </Button>
            <Button>
              <Activity className="w-4 h-4 mr-2" />
              View Reports
            </Button>
            */}
          </div>
        )}
      </div>

      {/* Time Period Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Time Period</CardTitle>
          <CardDescription>Filter data by time period</CardDescription>
        </CardHeader>
        <CardContent>
          <FilterBar
            selectedFilter={selectedFilter}
            customRange={customRange}
            onFilterChange={setFilter}
          />
        </CardContent>
      </Card>

      {/* Mobile Stats Grid or Desktop Stats */}
      {isMobile ? (
        <MobileStatsGrid stats={mobileStats} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Total Leads
              </CardTitle>
              <CardDescription>All leads in your system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalLeads}</div>
              <p className="text-sm text-gray-500 mt-2">
                <TrendingUp className="w-4 h-4 inline-block mr-1" />
                12% increase from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Phone className="w-5 h-5 mr-2 text-green-500" />
                AI Calls Made
              </CardTitle>
              <CardDescription>Total AI calls made</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalCalls}</div>
              <p className="text-sm text-gray-500 mt-2">
                <TrendingUp className="w-4 h-4 inline-block mr-1" />
                8% increase from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-500" />
                Conversion Rate
              </CardTitle>
              <CardDescription>AI call conversion success</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{conversionRate}%</div>
              <p className="text-sm text-gray-500 mt-2">
                <TrendingUp className="w-4 h-4 inline-block mr-1" />
                5% increase from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                Estimated Revenue
              </CardTitle>
              <CardDescription>Based on successful AI calls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">${estimatedRevenue.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-2">
                <TrendingUp className="w-4 h-4 inline-block mr-1" />
                15% increase from last month
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Qualification Cards - Pass the onCardClick prop correctly */}
      <QualificationCards onCardClick={onQualificationClick} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl flex items-center">
              <PhoneCall className="w-5 h-5 mr-2" />
              Recent Calls
            </CardTitle>
            <CardDescription>Latest AI call activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCalls.slice(0, 5).map((call, index) => (
                <div
                  key={call.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {call.phone_number || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(call.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getCallStatusColor(call.status)}`}
                    >
                      {call.status}
                    </Badge>
                    {call.duration && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {call.duration}s
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {recentCalls.length === 0 && (
                <p className="text-center text-gray-500 py-4 text-sm">
                  No recent calls for this period
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl flex items-center">
              <Users className="w-5 h-5 mr-2" />
              New Leads
            </CardTitle>
            <CardDescription>Recently added leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLeads.slice(0, 5).map((lead, index) => (
                <div
                  key={lead.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {lead.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {lead.email}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getStatusColor(lead.status || 'new')}`}
                    >
                      {lead.status || 'new'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {lead.score || 0}%
                    </span>
                  </div>
                </div>
              ))}
              {recentLeads.length === 0 && (
                <p className="text-center text-gray-500 py-4 text-sm">
                  No recent leads for this period
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Action Buttons */}
      {isMobile && (
        <div className="grid grid-cols-2 gap-3">
          <Button className="w-full touch-manipulation min-h-[48px]">
            <Phone className="w-4 h-4 mr-2" />
            Make Call
          </Button>
          <Button variant="outline" className="w-full touch-manipulation min-h-[48px]">
            <Users className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      )}
    </div>
  );
};
