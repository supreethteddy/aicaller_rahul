import React, { useState } from 'react';
import { useAdminFilter } from '@/contexts/AdminFilterContext';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUsersPage } from './AdminUsersPage';
import { ContactSubmissionsPage } from './ContactSubmissionsPage';
import { UserActivationTable } from './UserActivationTable';
import { QuickReanalysisPanel } from './QuickReanalysisPanel';
import { Users, MessageSquare, Settings } from 'lucide-react';

interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalLeads: number;
    totalCalls: number;
    successfulCalls: number;
    averageCallDuration: number;
    totalContactSubmissions: number;
}

export const AdminDashboard: React.FC = () => {
    const { selectedFilter, customRange, setFilter, getDateRange } = useAdminFilter();
    const dateRange = getDateRange();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = React.useState('overview');

    const { data: adminStats, isLoading } = useQuery({
        queryKey: ['admin_stats', dateRange.from.toISOString(), dateRange.to.toISOString()],
        queryFn: async () => {
            if (!user) throw new Error('User not authenticated');

            try {
                // Get all users using the get_admin_users_data function
                const { data: users, error: usersError } = await supabase
                    .rpc('get_admin_users_data');

                if (usersError) {
                    console.error('Error fetching users:', usersError);
                    throw usersError;
                }

                // Get leads stats
                const { data: leads } = await supabase
                    .from('leads')
                    .select('id, created_at')
                    .gte('created_at', dateRange.from.toISOString())
                    .lte('created_at', dateRange.to.toISOString());

                // Get calls stats
                const { data: calls } = await supabase
                    .from('bland_ai_calls')
                    .select('id, status, duration, created_at')
                    .gte('created_at', dateRange.from.toISOString())
                    .lte('created_at', dateRange.to.toISOString());

                // Get contact submissions stats
                const { data: contactSubmissions } = await supabase
                    .from('contact_submissions')
                    .select('id')
                    .gte('created_at', dateRange.from.toISOString())
                    .lte('created_at', dateRange.to.toISOString());

                // Calculate stats
                const stats: AdminStats = {
                    totalUsers: users?.length || 0,
                    activeUsers: users?.filter(u => u.status === 'active').length || 0,
                    totalLeads: leads?.length || 0,
                    totalCalls: calls?.length || 0,
                    successfulCalls: calls?.filter(c => c.status === 'completed').length || 0,
                    averageCallDuration: calls?.reduce((acc, call) => acc + (call.duration || 0), 0) / (calls?.length || 1),
                    totalContactSubmissions: contactSubmissions?.length || 0,
                };

                return stats;
            } catch (error) {
                console.error('Error fetching admin stats:', error);
                throw error;
            }
        },
        enabled: !!user,
        retry: 1,
    });

    const getFilterLabel = () => {
        switch (selectedFilter) {
            case 'today': return 'Today';
            case 'week': return 'This Week';
            case 'month': return 'This Month';
            case 'custom': return customRange ? `${customRange.from.toLocaleDateString()} - ${customRange.to.toLocaleDateString()}` : 'Custom Range';
            default: return 'This Week';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-600">Manage users, settings, and system configuration</p>
            </div>

            <Tabs defaultValue="users" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="users" className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Users</span>
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Contact</span>
                    </TabsTrigger>
                    <TabsTrigger value="activation" className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Activation</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <AdminUsersPage />
                </TabsContent>

                <TabsContent value="contact">
                    <ContactSubmissionsPage />
                </TabsContent>

                <TabsContent value="activation">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Activation Management</CardTitle>
                            <CardDescription>
                                Manage user activation status and permissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserActivationTable />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Settings</CardTitle>
                            <CardDescription>
                                Configure system-wide settings and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">System settings will be available here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
