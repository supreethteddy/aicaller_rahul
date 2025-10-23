import { supabase } from '@/integrations/supabase/client';
import { formatPhoneNumber, validatePhoneNumber, getCountryFromNumber } from '@/utils/phoneUtils';

class BlandAIClient {
    private apiKey: string | null = null;
    private baseUrl = 'https://api.bland.ai/v1';

    async getApiKey(): Promise<string | null> {
        try {
            // Use centralized API key for all users
            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'centralized_ai_api_key')
                .single();

            if (error || !data) return null;

            return data.value;
        } catch (error) {
            console.error('Error fetching API key:', error);
            return null;
        }
    }

    // Method to temporarily set API key for testing without saving to database
    setApiKey(apiKey: string): void {
        this.apiKey = apiKey;
    }

    async saveApiKey(apiKey: string): Promise<boolean> {
        try {
            // Save centralized API key (only super admins should be able to do this)
            const { error } = await supabase
                .from('settings')
                .upsert({
                    key: 'centralized_ai_api_key',
                    value: apiKey
                });

            if (error) {
                console.error('Error saving API key:', error);
                return false;
            }

            this.apiKey = apiKey;
            return true;
        } catch (error) {
            console.error('Error saving API key:', error);
            return false;
        }
    }

    async testConnection(): Promise<boolean> {
        // Use existing API key if set, otherwise try to get from database
        if (!this.apiKey) {
            const apiKey = await this.getApiKey();
            if (!apiKey) {
                throw new Error('API key not configured');
            }
            this.apiKey = apiKey;
        }

        try {
            // Test the connection by getting account details
            const response = await fetch(`${this.baseUrl}/me`, {
                method: 'GET',
                headers: {
                    'authorization': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || 'Invalid API key or unable to connect to Bland AI';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Check if account is active
            return data.status === 'active';
        } catch (error: any) {
            console.error('Error testing Bland AI connection:', error);
            throw error;
        }
    }

    async makeCall(phoneNumber: string, task: string, options: any = {}) {
        if (!this.apiKey) {
            const apiKey = await this.getApiKey();
            if (!apiKey) {
                throw new Error('API key not configured');
            }
            this.apiKey = apiKey;
        }

        try {
            // Validate and format the phone number
            if (!validatePhoneNumber(phoneNumber)) {
                throw new Error('Invalid phone number. Please include country code (e.g., +1, +91, +63)');
            }

            const formattedNumber = formatPhoneNumber(phoneNumber);
            if (!formattedNumber) {
                throw new Error('Failed to format phone number. Make sure to include the country code.');
            }

            // Get the country for logging/tracking
            const country = getCountryFromNumber(formattedNumber);

            // Use the correct Bland AI API endpoint for making calls
            const response = await fetch(`${this.baseUrl}/calls`, {
                method: 'POST',
                headers: {
                    'authorization': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone_number: formattedNumber,
                    task: task,
                    voice: options.voice || 'maya',
                    model: options.model || 'base',
                    language: options.language || 'en-US',
                    max_duration: options.max_duration || 30,
                    record: options.record || true,
                    wait_for_greeting: options.wait_for_greeting || true,
                    reduce_latency: true,
                    answered_by_enabled: true,
                    metadata: {
                        campaign_id: options.campaign_id,
                        lead_id: options.lead_id,
                        source: 'aicaller_app',
                        country: country // Add country to metadata
                    },
                    ...options
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || errorData?.errors?.join(', ') || 'Failed to initiate call';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error making Bland AI call:', error);
            throw error;
        }
    }

    async getCallStatus(callId: string) {
        if (!this.apiKey) {
            const apiKey = await this.getApiKey();
            if (!apiKey) {
                throw new Error('API key not configured');
            }
            this.apiKey = apiKey;
        }

        try {
            // Use the correct endpoint for getting call details
            const response = await fetch(`${this.baseUrl}/calls/${callId}`, {
                method: 'GET',
                headers: {
                    'authorization': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || 'Failed to get call status';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting Bland AI call status:', error);
            throw error;
        }
    }

    async listCalls(options: any = {}) {
        if (!this.apiKey) {
            const apiKey = await this.getApiKey();
            if (!apiKey) {
                throw new Error('API key not configured');
            }
            this.apiKey = apiKey;
        }

        try {
            // Build query parameters
            const params = new URLSearchParams();
            if (options.limit) params.append('limit', options.limit.toString());
            if (options.completed !== undefined) params.append('completed', options.completed.toString());
            if (options.start_date) params.append('start_date', options.start_date);
            if (options.end_date) params.append('end_date', options.end_date);
            if (options.campaign_id) params.append('campaign_id', options.campaign_id);

            const url = `${this.baseUrl}/calls${params.toString() ? '?' + params.toString() : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'authorization': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || 'Failed to list calls';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error listing Bland AI calls:', error);
            throw error;
        }
    }

    async analyzeCall(callId: string, goal: string, questions: string[][]) {
        if (!this.apiKey) {
            const apiKey = await this.getApiKey();
            if (!apiKey) {
                throw new Error('API key not configured');
            }
            this.apiKey = apiKey;
        }

        try {
            const response = await fetch(`${this.baseUrl}/calls/${callId}/analyze`, {
                method: 'POST',
                headers: {
                    'authorization': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    goal,
                    questions
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || 'Failed to analyze call';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error analyzing Bland AI call:', error);
            throw error;
        }
    }
}

export { BlandAIClient }; 