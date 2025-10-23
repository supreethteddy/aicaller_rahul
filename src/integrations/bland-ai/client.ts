import { ElevenLabsProvider } from '@/integrations/elevenlabs/client';
import { VoiceProvider } from '@/integrations/voice/Provider';

class BlandAIClient {
    private provider: VoiceProvider;

    constructor() {
        this.provider = new ElevenLabsProvider();
    }

    async getApiKey(): Promise<string | null> {
        return this.provider.getApiKey();
    }

    // Method to temporarily set API key for testing without saving to database
    setApiKey(apiKey: string): void {
        this.provider.setApiKey(apiKey);
    }

    async saveApiKey(apiKey: string): Promise<boolean> {
        return this.provider.saveApiKey(apiKey);
    }

    async testConnection(): Promise<boolean> {
        return this.provider.testConnection();
    }

    async makeCall(phoneNumber: string, task: string, options: any = {}) {
        const result = await this.provider.makeCall(phoneNumber, task, options);
        // Return in the format expected by existing code
        return {
            call_id: result.call_id,
            status: result.status === 'queued' ? 'success' : result.status,
            phone_number: result.phone_number,
            created_at: result.created_at,
            metadata: result.metadata
        };
    }

    async getCallStatus(callId: string) {
        const result = await this.provider.getCallStatus(callId);
        // Return in the format expected by existing code
        return {
            call_id: result.call_id,
            status: result.status,
            duration: result.duration,
            recording_url: result.recording_url,
            transcript: result.transcript,
            started_at: result.started_at,
            ended_at: result.ended_at,
            metadata: result.metadata
        };
    }

    async listCalls(options: any = {}) {
        const results = await this.provider.listCalls(options);
        // Return in the format expected by existing code
        return {
            calls: results.map(result => ({
                call_id: result.call_id,
                status: result.status,
                phone_number: result.phone_number,
                duration: result.duration,
                recording_url: result.recording_url,
                transcript: result.transcript,
                created_at: result.created_at,
                started_at: result.started_at,
                ended_at: result.ended_at,
                metadata: result.metadata
            }))
        };
    }

    async analyzeCall(callId: string, goal: string, questions: string[][]) {
        // ElevenLabs doesn't have built-in analysis, so we'll return a placeholder
        // The actual analysis will be done by our analyze-call-transcript edge function
        return {
            message: 'Analysis will be performed by the analyze-call-transcript edge function',
            call_id: callId,
            goal,
            questions
        };
    }
}

export { BlandAIClient }; 