
// Integration configurations - these are now dynamic and can be fetched from Supabase
export const integrations = [
  {
    id: 'facebook',
    name: 'Facebook Lead Ads',
    description: 'Import leads directly from Facebook and Instagram advertising campaigns',
    icon: '📘',
    setupInstructions: 'Go to your Facebook Business Manager, navigate to Lead Ads, and add this webhook URL to receive leads automatically.',
    isActive: true
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Cloud API',
    description: 'Receive leads from WhatsApp Business and send follow-up messages',
    icon: '💬',
    setupInstructions: 'Configure your WhatsApp Business API webhook to send messages to this endpoint.',
    isActive: true
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Lead Gen',
    description: 'Sync leads from LinkedIn advertising and Sales Navigator',
    icon: '💼',
    setupInstructions: 'In LinkedIn Campaign Manager, set up Lead Gen Forms and configure the webhook integration.',
    isActive: true
  },
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    description: 'Import leads from Google Sheets spreadsheets automatically',
    icon: '📊',
    setupInstructions: 'Use Google Apps Script or Zapier to send new rows from your sheet to this webhook.',
    isActive: true
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect with 5000+ apps through Zapier workflows',
    icon: '⚡',
    setupInstructions: 'In Zapier, create a new Zap and use "Webhooks by Zapier" as the action app with this URL.',
    isActive: true
  },
  {
    id: 'google_forms',
    name: 'Google Forms',
    description: 'Automatically import responses from Google Forms',
    icon: '📝',
    setupInstructions: 'Use Google Apps Script to send form responses to this webhook URL.',
    isActive: true
  },
  {
    id: 'typeform',
    name: 'Typeform',
    description: 'Import leads from Typeform responses',
    icon: '📋',
    setupInstructions: 'In your Typeform settings, add a webhook integration pointing to this URL.',
    isActive: true
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    description: 'Advanced automation platform for complex workflows',
    icon: '🔄',
    setupInstructions: 'Create a new scenario in Make and use the HTTP module to send data to this webhook.',
    isActive: true
  }
];

// Helper function to get webhook URL for an integration
export const getWebhookUrl = (integrationId: string): string => {
  return `https://oeghvmszrfomcmyhsnkh.supabase.co/functions/v1/webhook/${integrationId}`;
};

// Helper function to get integration by ID
export const getIntegrationById = (id: string) => {
  return integrations.find(integration => integration.id === id);
};
