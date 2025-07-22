
import React, { useState } from 'react';
import { Plus, Play, Settings, Trash2, Copy, ArrowDown } from 'lucide-react';

export const CallFlowBuilder: React.FC = () => {
  const [selectedFlow, setSelectedFlow] = useState('default');

  const flows = [
    { id: 'default', name: 'Default Sales Flow', status: 'active', calls: 1247 },
    { id: 'premium', name: 'Premium Product Flow', status: 'active', calls: 342 },
    { id: 'demo', name: 'Demo Request Flow', status: 'draft', calls: 0 },
  ];

  const flowSteps = [
    {
      id: 1,
      type: 'greeting',
      title: 'Greeting & Introduction',
      description: 'AI introduces itself and asks for basic lead information',
      settings: {
        script: 'Hi! This is Sarah from LeadFlow AI. I\'m calling about your recent inquiry...',
        voice: 'Professional Female',
        duration: '30-45 seconds'
      }
    },
    {
      id: 2,
      type: 'qualification',
      title: 'Lead Qualification',
      description: 'Ask qualifying questions to assess lead quality',
      settings: {
        questions: ['What\'s your budget range?', 'When are you looking to start?', 'Who makes the decisions?'],
        minScore: 60,
        maxDuration: '3 minutes'
      }
    },
    {
      id: 3,
      type: 'decision',
      title: 'Qualification Decision',
      description: 'AI decides next steps based on responses',
      settings: {
        qualified: 'Schedule demo',
        notQualified: 'Send information',
        needsCallback: 'Schedule callback'
      }
    },
    {
      id: 4,
      type: 'action',
      title: 'Next Steps',
      description: 'Execute the appropriate action based on qualification',
      settings: {
        calendar: 'Google Calendar',
        crm: 'Pipedrive',
        followUp: 'WhatsApp + Email'
      }
    }
  ];

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'greeting': return '👋';
      case 'qualification': return '❓';
      case 'decision': return '🎯';
      case 'action': return '✅';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Call Flow Builder</h1>
          <p className="text-gray-600">Design intelligent conversation flows for your AI calls</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            <Copy className="w-4 h-4" />
            <span>Duplicate Flow</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>New Flow</span>
          </button>
        </div>
      </div>

      {/* Flow Selector */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Current Flow:</label>
          <select
            value={selectedFlow}
            onChange={(e) => setSelectedFlow(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {flows.map((flow) => (
              <option key={flow.id} value={flow.id}>
                {flow.name} ({flow.status})
              </option>
            ))}
          </select>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm">
              <Play className="w-4 h-4" />
              <span>Test Flow</span>
            </button>
            <button className="flex items-center space-x-2 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Flow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">1,247</p>
            <p className="text-sm text-gray-600">Total Calls</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">68%</p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">4:32</p>
            <p className="text-sm text-gray-600">Avg Duration</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">34%</p>
            <p className="text-sm text-gray-600">Qualified Rate</p>
          </div>
        </div>
      </div>

      {/* Flow Builder */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Flow Steps</h3>
          <p className="text-sm text-gray-600">Drag and drop to reorder steps</p>
        </div>
        
        <div className="p-6 space-y-4">
          {flowSteps.map((step, index) => (
            <div key={step.id}>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                      <span className="text-xl">{getStepIcon(step.type)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                      
                      {/* Step Settings Preview */}
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {Object.entries(step.settings).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                              <span className="text-gray-600">
                                {Array.isArray(value) ? value.join(', ') : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-2">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800 p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {index < flowSteps.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          ))}
          
          {/* Add Step Button */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <button className="flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600">
              <Plus className="w-5 h-5" />
              <span>Add New Step</span>
            </button>
          </div>
        </div>
      </div>

      {/* Voice Settings */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Voice & AI Settings</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voice Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Professional Female (Sarah)</option>
                <option>Professional Male (David)</option>
                <option>Friendly Female (Emma)</option>
                <option>Authoritative Male (James)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Speaking Speed</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Normal</option>
                <option>Slow</option>
                <option>Fast</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personality</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Professional</option>
                <option>Friendly</option>
                <option>Enthusiastic</option>
                <option>Calm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
