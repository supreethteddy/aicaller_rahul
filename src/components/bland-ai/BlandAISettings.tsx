import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, CheckCircle, AlertCircle, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BlandAIClient } from '@/integrations/bland-ai/client';
import { ElevenLabsProvider } from '@/integrations/elevenlabs/client';
import { Voice } from '@/integrations/voice/Provider';
export const BlandAISettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [loadingVoices, setLoadingVoices] = useState(false);
  const {
    toast
  } = useToast();
  const blandAI = new BlandAIClient();
  const elevenLabs = new ElevenLabsProvider();
  useEffect(() => {
    checkConnection();
  }, []);
  const checkConnection = async () => {
    try {
      const existingApiKey = await elevenLabs.getApiKey();
      if (existingApiKey) {
        setApiKey(existingApiKey);
        elevenLabs.setApiKey(existingApiKey);
        const isActive = await elevenLabs.testConnection();
        setIsConnected(isActive);
        if (isActive) {
          await loadVoices();
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    }
  };

  const loadVoices = async () => {
    try {
      setLoadingVoices(true);
      const voiceList = await elevenLabs.fetchVoices();
      setVoices(voiceList);
      if (voiceList.length > 0 && !selectedVoice) {
        setSelectedVoice(voiceList[0].voice_id);
      }
    } catch (error) {
      console.error('Error loading voices:', error);
      toast({
        title: "Error",
        description: "Failed to load voices. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setLoadingVoices(false);
    }
  };
  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an ElevenLabs API key",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      // Test the API key first by temporarily setting it
      const testProvider = new ElevenLabsProvider();
      testProvider.setApiKey(apiKey);

      // Test connection with the provided API key
      const isActive = await testProvider.testConnection();
      if (!isActive) {
        throw new Error('ElevenLabs account is not active or API key is invalid');
      }

      // Only save the API key if the test was successful
      const saved = await elevenLabs.saveApiKey(apiKey);
      if (!saved) {
        throw new Error('Failed to save API key');
      }
      setIsConnected(true);
      await loadVoices();
      toast({
        title: "Success",
        description: "Successfully connected to ElevenLabs"
      });
    } catch (error: any) {
      console.error('Error connecting to ElevenLabs:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to connect to ElevenLabs. Please check your API key.",
        variant: "destructive"
      });
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Voice Settings</h2>
        <p className="text-gray-600">Configure your ElevenLabs integration and voice preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>ElevenLabs API Configuration</span>
            </CardTitle>
            <CardDescription>Configure your ElevenLabs API key and connection settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Connected to ElevenLabs</span>
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
                {isConnected ? "Connected" : "Not Connected"}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your ElevenLabs API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-600">Get your API key from <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">ElevenLabs</a>.</p>
            </div>

            <Button
              className="w-full"
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : isConnected ? "Update ElevenLabs" : "Connect to ElevenLabs"}
            </Button>
          </CardContent>
        </Card>

        {/* Voice Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <span>ElevenLabs Voice Settings</span>
            </CardTitle>
            <CardDescription>
              Select from your available ElevenLabs voices for campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice">Default Voice</Label>
              <Select 
                disabled={!isConnected || loadingVoices} 
                value={selectedVoice} 
                onValueChange={setSelectedVoice}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingVoices ? "Loading voices..." : "Select a voice"} />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.voice_id} value={voice.voice_id}>
                      {voice.name} {voice.category ? `(${voice.category})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {voices.length === 0 && isConnected && !loadingVoices && (
                <p className="text-xs text-gray-600">No voices found. Please check your ElevenLabs account.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en" disabled={!isConnected}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="speed">Speaking Speed</Label>
              <Select defaultValue="normal" disabled={!isConnected}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full" disabled={!isConnected}>
              Save Voice Settings
            </Button>
          </CardContent>
        </Card>

        {/* Phone Number Management */}
        <Card>
          <CardHeader>
            <CardTitle>Phone Numbers</CardTitle>
            <CardDescription>
              Manage your phone numbers for outbound calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">No phone numbers configured</p>
              <Button variant="outline" disabled={!isConnected}>
                Add Phone Number
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>
              Current status of your Bland.ai integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Connection</span>
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Phone Numbers</span>
                <Badge variant="secondary">0 Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Credits Remaining</span>
                <Badge variant="secondary">Unknown</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={checkConnection} disabled={!isConnected || isLoading}>
              Test Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};
