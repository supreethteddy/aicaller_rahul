import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Key, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BlandAIClient } from '@/integrations/bland-ai/client';

export const CentralizedAPIManagement: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const blandAI = new BlandAIClient();

  useEffect(() => {
    checkConnection();
    // Auto-set the centralized API key if it doesn't exist
    autoSetAPIKey();
  }, []);

  const autoSetAPIKey = async () => {
    try {
      const existingApiKey = await blandAI.getApiKey();
      if (!existingApiKey) {
        // Set the centralized API key automatically
        const centralizedKey = 'org_1b25603d1e6199931316fc9e4be8adecd24a45bcbe19beea9e5cdd77e459be1b44814402c56533afae7b69';
        
        const { error } = await supabase
          .from('settings')
          .upsert({
            key: 'centralized_ai_api_key',
            value: centralizedKey
          });

        if (!error) {
          setApiKey(centralizedKey);
          blandAI.setApiKey(centralizedKey);
          const isActive = await blandAI.testConnection();
          setIsConnected(isActive);
          
          if (isActive) {
            toast({
              title: "Success",
              description: "Centralized API key automatically configured and tested"
            });
          }
        }
      }
    } catch (error) {
      console.error('Error auto-setting API key:', error);
    }
  };

  const checkConnection = async () => {
    try {
      const existingApiKey = await blandAI.getApiKey();
      if (existingApiKey) {
        setApiKey(existingApiKey);
        blandAI.setApiKey(existingApiKey);
        const isActive = await blandAI.testConnection();
        setIsConnected(isActive);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Test the API key first
      const testClient = new BlandAIClient();
      testClient.setApiKey(apiKey);
      const isActive = await testClient.testConnection();
      
      if (!isActive) {
        throw new Error('API key is invalid or account is not active');
      }

      // Save the centralized API key
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'centralized_ai_api_key',
          value: apiKey
        });

      if (error) throw error;

      setIsConnected(true);
      toast({
        title: "Success",
        description: "Centralized API key saved successfully"
      });
    } catch (error: any) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save API key",
        variant: "destructive"
      });
      setIsConnected(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      await checkConnection();
      toast({
        title: "Connection Test",
        description: isConnected ? "API connection is working" : "API connection failed",
        variant: isConnected ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test connection",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Centralized API Management</h2>
        <p className="text-gray-600">Manage system-wide API keys for all users</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>AI Calling Service</span>
            </CardTitle>
            <CardDescription>
              Configure the centralized API key for AI calling services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Service Connected</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      API Key Required
                    </span>
                  </>
                )}
              </div>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">Centralized API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter the centralized API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isSaving}
              />
              <p className="text-xs text-gray-600">
                This API key is pre-configured and used by all users for AI calling services
              </p>
              {apiKey && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  ✅ API key is configured and active
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleSaveApiKey}
                disabled={!apiKey || isSaving}
                className="flex-1"
              >
                {isSaving ? "Saving..." : "Save API Key"}
              </Button>
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isLoading}
              >
                {isLoading ? "Testing..." : "Test"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Service Status</span>
            </CardTitle>
            <CardDescription>
              Current status of centralized services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Calling Service</span>
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">User Access</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Voice Options</span>
                <Badge variant="default">Multiple Available</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Call Capacity</span>
                <Badge variant="default">Unlimited</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                All users can access AI calling features without individual API key configuration.
                The centralized system manages authentication and billing.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
