
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Play, Download, Eye } from 'lucide-react';
import { useVapiAICalls } from '@/hooks/useVapiAICalls';

export const VapiAICalls: React.FC = () => {
  const { data: calls = [], isLoading } = useVapiAICalls();

  if (isLoading) {
    return <div className="p-8 text-center">Loading calls...</div>;
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Voice Calls</h2>
          <p className="text-gray-600">Monitor and analyze your voice AI conversations</p>
        </div>
      </div>

      {calls.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No calls yet</h3>
            <p className="text-gray-600">
              Voice calls will appear here once your assistants start making or receiving calls.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {calls.map((call) => (
            <Card key={call.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">
                        {call.caller_phone_number || call.destination_phone_number}
                      </CardTitle>
                      <CardDescription>
                        {call.type} call • {new Date(call.created_at).toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(call.status)}>
                    {call.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Duration:</span>
                    <p className="font-medium">
                      {call.duration ? formatDuration(call.duration) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Cost:</span>
                    <p className="font-medium">
                      {call.cost ? `$${call.cost.toFixed(4)}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Started:</span>
                    <p className="font-medium">
                      {call.started_at ? new Date(call.started_at).toLocaleTimeString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {call.summary && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Summary:</span>
                    <p className="text-sm mt-1 bg-gray-50 p-3 rounded">{call.summary}</p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  {call.transcript && (
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Transcript
                    </Button>
                  )}
                  {call.recording_url && (
                    <>
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Play Recording
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
