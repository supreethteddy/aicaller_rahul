import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Settings } from 'lucide-react';

export const BlandAISettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Settings</h2>
        <p className="text-gray-600">Configure your AI calling preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span>AI Calling Service</span>
            </CardTitle>
            <CardDescription>
              Your AI calling service is managed centrally by the system administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Service Status</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Your AI calling service is configured and ready to use. You can create campaigns and make calls without any additional setup.</p>
            </div>
          </CardContent>
        </Card>

        {/* Voice Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Default Voice Settings</span>
            </CardTitle>
            <CardDescription>
              Set default voice and AI behavior for new campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Voice</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Maya (Female, Professional)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">English</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Speaking Speed</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Normal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>
              Current status of your AI calling integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Service</span>
                <Badge variant="default">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Call Capacity</span>
                <Badge variant="secondary">Unlimited</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Voice Options</span>
                <Badge variant="secondary">Multiple Available</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};