import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

interface Voice {
    id: string;
    name: string;
    language: string;
    gender: string;
    accent?: string;
    description?: string;
}

interface TestVoiceResponse {
    audioUrl: string;
    duration: number;
}

class BlandAIService {
    private apiKey: string | null = null;
    private readonly baseURL: string = 'https://api.bland.ai/v1';

    private async getApiKey(): Promise<string> {
        if (this.apiKey) return this.apiKey;

        try {
            // Fetch the current user's Bland AI API key from the settings table
            const { data: settings, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'bland_ai_api_key')
                .single();

            if (error) throw error;
            if (!settings?.value) throw new Error('Bland AI API key not found');

            this.apiKey = settings.value;
            return this.apiKey;
        } catch (error) {
            console.error('Error fetching Bland AI API key:', error);
            throw new Error('Failed to get Bland AI API key. Please check your settings.');
        }
    }

    private async getHeaders() {
        const apiKey = await this.getApiKey();
        return {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        };
    }

    async getVoices(): Promise<Voice[]> {
        try {
            const headers = await this.getHeaders();
            const response = await axios.get(`${this.baseURL}/voices`, { headers });

            console.log('Bland AI Response:', response.data);

            // Transform the response to match our Voice interface
            return response.data.voices.map((voice: any) => {
                console.log('Individual voice:', voice);
                return {
                    id: voice.id,
                    name: voice.name,
                    language: voice.language || '',
                    gender: voice.gender || '',
                    accent: voice.accent || '',
                    description: voice.description || '',
                };
            });
        } catch (error: any) {
            console.error('Error fetching voices from Bland AI:', error);
            if (error.response?.status === 404) {
                throw new Error('Could not connect to Bland AI. Please check your API key and try again.');
            }
            throw error;
        }
    }

    async testVoice(voiceId: string, text: string = "Hi, thank you for choosing me! Give me a prompt and I will help you in your call."): Promise<TestVoiceResponse> {
        if (!voiceId) {
            throw new Error('No voice selected. Please select a voice to test.');
        }

        try {
            const headers = await this.getHeaders();
            console.log('Testing voice with ID:', voiceId);
            console.log('Request URL:', `${this.baseURL}/speak`);

            const response = await axios.post(
                `${this.baseURL}/speak`,
                {
                    voice_id: voiceId,
                    text: text,
                },
                { headers }
            );

            console.log('Voice test response:', response.data);

            // Check multiple possible response formats
            let audioUrl = null;
            if (response.data?.url) {
                audioUrl = response.data.url;
            } else if (response.data?.audio_url) {
                audioUrl = response.data.audio_url;
            } else if (response.data?.sample_url) {
                audioUrl = response.data.sample_url;
            } else if (response.data?.file_url) {
                audioUrl = response.data.file_url;
            } else if (typeof response.data === 'string') {
                // Sometimes APIs return just the URL as a string
                audioUrl = response.data;
            }

            if (!audioUrl) {
                console.error('No audio URL found in response:', response.data);
                throw new Error('No audio URL found in the response. Voice sample may not be available.');
            }

            return {
                audioUrl: audioUrl,
                duration: response.data.duration || 0,
            };
        } catch (error: any) {
            console.error('Error testing voice:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);

            if (error.response?.status === 404) {
                throw new Error('Voice testing is not available. Please select this voice and use it in your campaign.');
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                throw new Error('Invalid or expired API key. Please check your settings.');
            } else if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Voice preview is not available for this voice. You can still use it in your campaigns.');
        }
    }
}

export const blandAIService = new BlandAIService(); 