import { supabase } from '@/integrations/supabase/client';
import { formatPhoneNumber, validatePhoneNumber, getCountryFromNumber } from '@/utils/phoneUtils';
import { VoiceProvider, Voice, CallOptions, CallResult, CallStatus, ListCallsOptions, CALL_STATUS } from '@/integrations/voice/Provider';

class ElevenLabsProvider implements VoiceProvider {
    private apiKey: string | null = null;
    private baseUrl = 'https://api.elevenlabs.io/v1';

    async getApiKey(): Promise<string | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            // Use user-specific key by appending user ID
            const userSpecificKey = `elevenlabs_api_key_${user.id}`;

            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', userSpecificKey)
                .single();

            if (error || !data) return null;

            return data.value;
        } catch (error) {
            console.error('Error fetching ElevenLabs API key:', error);
            return null;
        }
    }

    setApiKey(apiKey: string): void {
        this.apiKey = apiKey;
    }

    async saveApiKey(apiKey: string): Promise<boolean> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            const userSpecificKey = `elevenlabs_api_key_${user.id}`;

            // Check if the key exists
            const { data: existingKey } = await supabase
                .from('settings')
                .select('id')
                .eq('key', userSpecificKey)
                .single();

            let error;
            if (existingKey) {
                // Update existing key
                ({ error } = await supabase
                    .from('settings')
                    .update({ value: apiKey })
                    .eq('key', userSpecificKey));
            } else {
                // Insert new key
                ({ error } = await supabase
                    .from('settings')
                    .insert([{
                        key: userSpecificKey,
                        value: apiKey
                    }]));
            }

            if (error) {
                console.error('Error saving ElevenLabs API key:', error);
                return false;
            }

            this.apiKey = apiKey;
            return true;
        } catch (error) {
            console.error('Error saving ElevenLabs API key:', error);
            return false;
        }
    }

    async testConnection(): Promise<boolean> {
        if (!this.apiKey) {
            const apiKey = await this.getApiKey();
            if (!apiKey) {
                throw new Error('ElevenLabs API key not configured');
            }
            this.apiKey = apiKey;
        }

        try {
            // Test connection by fetching user info
            const response = await fetch(`${this.baseUrl}/user`, {
                method: 'GET',
                headers: {
                    'xi-api-key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.detail?.message || 'Invalid API key or unable to connect to ElevenLabs';
                throw new Error(errorMessage);
            }

            return true;
        } catch (error: any) {
            console.error('Error testing ElevenLabs connection:', error);
            throw error;
        }
    }

    async fetchVoices(): Promise<Voice[]> {
        if (!this.apiKey) {
            const apiKey = await this.getApiKey();
            if (!apiKey) {
                throw new Error('ElevenLabs API key not configured');
            }
            this.apiKey = apiKey;
        }

        try {
            // Fetch Conversational AI agents instead of just voices
            const response = await fetch(`${this.baseUrl}/convai/agents`, {
                method: 'GET',
                headers: {
                    'xi-api-key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail?.message || 'Failed to fetch agents. Make sure you have Conversational AI enabled in your ElevenLabs account.');
            }

            const data = await response.json();
            
            // Map ElevenLabs agents to our Voice interface
            // The agent_id is what we'll use for making calls
            return data.agents?.map((agent: any) => ({
                voice_id: agent.agent_id,
                name: agent.name,
                category: agent.conversation_config?.agent?.prompt?.type || 'Agent',
                description: `Agent with ${agent.conversation_config?.tts?.voice_id || 'default'} voice`,
                preview_url: null,
                labels: {}
            })) || [];
        } catch (error) {
            console.error('Error fetching ElevenLabs agents:', error);
            throw error;
        }
    }

    async makeCall(phoneNumber: string, task: string, options: CallOptions = {}): Promise<CallResult> {
        if (!this.apiKey) {
            const apiKey = await this.getApiKey();
            if (!apiKey) {
                throw new Error('ElevenLabs API key not configured');
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

            const country = getCountryFromNumber(formattedNumber);

            // ElevenLabs requires using pre-configured agent IDs from your dashboard
            // For now, we'll use the voice_id as the agent_id
            // USER MUST: Create agents in ElevenLabs dashboard and pass agent_id as voice_id
            
            const agentId = options.voice_id || options.voice;
            
            if (!agentId) {
                throw new Error('No agent ID provided. Please create an agent in your ElevenLabs dashboard and select it as the voice.');
            }

            // Initiate the call with the agent
            const response = await fetch(`${this.baseUrl}/convai/conversations`, {
                method: 'POST',
                headers: {
                    'xi-api-key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    agent_id: agentId,
                    phone_number: formattedNumber,
                    metadata: {
                        campaign_id: options.campaign_id,
                        lead_id: options.lead_id,
                        source: 'aicaller_app',
                        country: country,
                        task: task, // Include task in metadata for reference
                        ...options.metadata
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.detail?.message || errorData?.message || 'Failed to initiate call';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            // Map ElevenLabs response to our CallResult format
            return {
                call_id: data.conversation_id || data.id,
                status: this.mapElevenLabsStatus(data.status || 'queued'),
                phone_number: formattedNumber,
                created_at: data.created_at || new Date().toISOString(),
                metadata: data.metadata
            };
        } catch (error) {
            console.error('Error making ElevenLabs call:', error);
            throw error;
        }
    }

    async getCallStatus(callId: string): Promise<CallStatus> {
        if (!this.apiKey) {
            const apiKey = await this.getApiKey();
            if (!apiKey) {
                throw new Error('ElevenLabs API key not configured');
            }
            this.apiKey = apiKey;
        }

        try {
            const response = await fetch(`${this.baseUrl}/convai/conversations/${callId}`, {
                method: 'GET',
                headers: {
                    'xi-api-key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail?.message || 'Failed to get call status');
            }

            const data = await response.json();
            
            return {
                call_id: callId,
                status: this.mapElevenLabsStatus(data.status),
                duration: data.duration_seconds,
                recording_url: data.recording_url,
                transcript: data.transcript,
                started_at: data.started_at,
                ended_at: data.ended_at,
                metadata: data.metadata
            };
        } catch (error) {
            console.error('Error getting ElevenLabs call status:', error);
            throw error;
        }
    }

    async listCalls(options: ListCallsOptions = {}): Promise<CallResult[]> {
        if (!this.apiKey) {
            const apiKey = await this.getApiKey();
            if (!apiKey) {
                throw new Error('ElevenLabs API key not configured');
            }
            this.apiKey = apiKey;
        }

        try {
            const params = new URLSearchParams();
            if (options.limit) params.append('page_size', options.limit.toString());
            if (options.offset) params.append('cursor', options.offset.toString());
            if (options.status) params.append('status', options.status);
            if (options.from_date) params.append('start_time', options.from_date);
            if (options.to_date) params.append('end_time', options.to_date);

            const response = await fetch(`${this.baseUrl}/convai/conversations?${params}`, {
                method: 'GET',
                headers: {
                    'xi-api-key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail?.message || 'Failed to list calls');
            }

            const data = await response.json();
            
            return data.conversations?.map((call: any) => ({
                call_id: call.conversation_id || call.id,
                status: this.mapElevenLabsStatus(call.status),
                phone_number: call.phone_number,
                duration: call.duration_seconds,
                recording_url: call.recording_url,
                transcript: call.transcript,
                created_at: call.created_at,
                started_at: call.started_at,
                ended_at: call.ended_at,
                metadata: call.metadata
            })) || [];
        } catch (error) {
            console.error('Error listing ElevenLabs calls:', error);
            throw error;
        }
    }

    // Map ElevenLabs status to our standard status
    private mapElevenLabsStatus(elevenLabsStatus: string): string {
        const statusMap: Record<string, string> = {
            'queued': CALL_STATUS.QUEUED,
            'in_progress': CALL_STATUS.IN_PROGRESS,
            'ringing': CALL_STATUS.IN_PROGRESS,
            'connected': CALL_STATUS.IN_PROGRESS,
            'completed': CALL_STATUS.COMPLETED,
            'ended': CALL_STATUS.COMPLETED,
            'failed': CALL_STATUS.FAILED,
            'error': CALL_STATUS.FAILED,
            'no_answer': CALL_STATUS.NO_ANSWER,
            'busy': CALL_STATUS.BUSY,
            'cancelled': CALL_STATUS.CANCELLED,
            'timeout': CALL_STATUS.FAILED
        };

        return statusMap[elevenLabsStatus.toLowerCase()] || CALL_STATUS.PENDING;
    }
}

export { ElevenLabsProvider };
