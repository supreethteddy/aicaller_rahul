
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Settings, Play, Pause } from 'lucide-react';
import { useVapiAIAssistants } from '@/hooks/useVapiAIAssistants';
import { CreateAssistantDialog } from './CreateAssistantDialog';

export const VapiAIAssistants: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: assistants = [], isLoading } = useVapiAIAssistants();

  if (isLoading) {
    return <div className="p-8 text-center">Loading assistants...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Voice AI Assistants</h2>
          <p className="text-gray-600">Create and manage your real-time voice assistants</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assistant
        </Button>
      </div>

      {assistants.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assistants yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first voice AI assistant to start having real-time conversations with your leads.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Assistant
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assistants.map((assistant) => (
            <Card key={assistant.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{assistant.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant={assistant.status === 'active' ? 'default' : 'outline'} 
                      size="sm"
                    >
                      {assistant.status === 'active' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <CardDescription>{assistant.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Model:</span>
                    <span className="font-medium">{assistant.model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      assistant.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {assistant.status}
                    </span>
                  </div>
                  {assistant.first_message && (
                    <div className="text-sm">
                      <span className="text-gray-500">First Message:</span>
                      <p className="mt-1 text-gray-900 italic">"{assistant.first_message}"</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateAssistantDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  );
};
