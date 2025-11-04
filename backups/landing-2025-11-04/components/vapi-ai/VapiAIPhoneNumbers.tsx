
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Phone, Settings, Trash2 } from 'lucide-react';
import { useVapiAIPhoneNumbers } from '@/hooks/useVapiAIPhoneNumbers';

export const VapiAIPhoneNumbers: React.FC = () => {
  const { data: phoneNumbers = [], isLoading } = useVapiAIPhoneNumbers();

  if (isLoading) {
    return <div className="p-8 text-center">Loading phone numbers...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Phone Numbers</h2>
          <p className="text-gray-600">Manage your Vapi.ai phone numbers and routing</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Buy Phone Number
        </Button>
      </div>

      {phoneNumbers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No phone numbers</h3>
            <p className="text-gray-600 mb-4">
              Purchase phone numbers to enable inbound calls to your voice assistants.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Buy Your First Number
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phoneNumbers.map((phoneNumber) => (
            <Card key={phoneNumber.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{phoneNumber.phone_number}</CardTitle>
                      <CardDescription>{phoneNumber.name || 'Unnamed'}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(phoneNumber.status)}>
                    {phoneNumber.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Country:</span>
                    <span className="font-medium">{phoneNumber.country_code}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monthly Cost:</span>
                    <span className="font-medium">
                      {phoneNumber.monthly_cost ? `$${phoneNumber.monthly_cost}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Assistant:</span>
                    <span className="font-medium">
                      {phoneNumber.assistant_id ? 'Assigned' : 'Unassigned'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
