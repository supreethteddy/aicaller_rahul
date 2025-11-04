
import React from 'react';
import { Button } from '@/components/ui/button';

export const IntegrationSetupGuide: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <span className="text-xl">💡</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Need help setting up integrations?</h3>
          <p className="text-gray-600 mb-4">
            Each integration provides multiple ways to import leads: webhooks for real-time data and API polling for historical data. Configure your credentials to enable automatic lead importing.
          </p>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            View Setup Guides
          </Button>
        </div>
      </div>
    </div>
  );
};
