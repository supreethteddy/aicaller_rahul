import React, { useState, lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Phone, Settings, BarChart3, Loader2 } from 'lucide-react';
import { BlandAIDashboard } from './bland-ai/BlandAIDashboard';
import { BlandAICampaigns } from './bland-ai/BlandAICampaigns';
// Lazy load the heavy components
const BlandAICalls = lazy(() => import('./bland-ai/BlandAICalls').then(module => ({ default: module.BlandAICalls })));
import { BlandAISettings } from './bland-ai/BlandAISettings';

export const BlandAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Calling</h1>
            <p className="text-gray-600">AI-powered phone calls for lead qualification</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center space-x-2">
            <Bot className="w-4 h-4" />
            <span>Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Calls</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <BlandAIDashboard />
        </TabsContent>

        <TabsContent value="campaigns">
          <BlandAICampaigns />
        </TabsContent>

        <TabsContent value="calls">
          <Suspense fallback={
            <div className="flex items-center justify-center h-[600px]">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-gray-500">Loading call history...</p>
              </div>
            </div>
          }>
            <BlandAICalls />
          </Suspense>
        </TabsContent>

        <TabsContent value="settings">
          <BlandAISettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
