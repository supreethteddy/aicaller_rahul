// Voice provider interface for abstracting different AI calling services
export interface VoiceProvider {
  // API Key management
  getApiKey(): Promise<string | null>;
  setApiKey(apiKey: string): void;
  saveApiKey(apiKey: string): Promise<boolean>;
  
  // Connection testing
  testConnection(): Promise<boolean>;
  
  // Voice management
  fetchVoices(): Promise<Voice[]>;
  
  // Call operations
  makeCall(phoneNumber: string, task: string, options?: CallOptions): Promise<CallResult>;
  getCallStatus(callId: string): Promise<CallStatus>;
  listCalls(options?: ListCallsOptions): Promise<CallResult[]>;
  
  // Analysis (optional - some providers may not support this)
  analyzeCall?(callId: string, goal: string, questions: string[][]): Promise<any>;
}

export interface Voice {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  preview_url?: string;
  labels?: Record<string, string>;
}

export interface CallOptions {
  voice?: string;
  voice_id?: string;
  model?: string;
  language?: string;
  max_duration?: number;
  record?: boolean;
  wait_for_greeting?: boolean;
  reduce_latency?: boolean;
  answered_by_enabled?: boolean;
  campaign_id?: string;
  lead_id?: string;
  metadata?: Record<string, any>;
}

export interface CallResult {
  call_id: string;
  status: string;
  phone_number?: string;
  duration?: number;
  recording_url?: string;
  transcript?: string;
  created_at?: string;
  started_at?: string;
  ended_at?: string;
  metadata?: Record<string, any>;
}

export interface CallStatus {
  call_id: string;
  status: string;
  duration?: number;
  recording_url?: string;
  transcript?: string;
  started_at?: string;
  ended_at?: string;
  metadata?: Record<string, any>;
}

export interface ListCallsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  from_date?: string;
  to_date?: string;
}

// Status mapping for different providers
export const CALL_STATUS = {
  PENDING: 'pending',
  QUEUED: 'queued',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  NO_ANSWER: 'no-answer',
  BUSY: 'busy',
  CANCELLED: 'cancelled'
} as const;

export type CallStatusType = typeof CALL_STATUS[keyof typeof CALL_STATUS];
