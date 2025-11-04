import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Bland AI webhook event types
interface BlandAIWebhookEvent {
  call_id: string;
  status: string;
  queue_status?: string;
  completed?: boolean;
  started_at?: string;
  end_at?: string;
  call_length?: number;
  corrected_duration?: string;
  recording_url?: string;
  concatenated_transcript?: string;
  summary?: string;
  answered_by?: string;
  call_ended_by?: string;
  error_message?: string;
  transcripts?: Array<{
    id: number;
    user: string;
    text: string;
    created_at: string;
  }>;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Bland AI webhook received:', req.method, req.url);

    // Parse the webhook payload
    const event: BlandAIWebhookEvent = await req.json();
    console.log('Bland AI event received:', event);

    // Validate required fields
    if (!event.call_id) {
      console.error('Missing call_id in webhook event');
      return new Response(
        JSON.stringify({ error: 'Missing call_id' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // Find the call record by Bland AI call_id
    const { data: callRecord, error: fetchError } = await supabase
      .from('bland_ai_calls')
      .select('*')
      .eq('bland_call_id', event.call_id)
      .single();

    if (fetchError) {
      console.error('Error finding call record:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Call record not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Found call record:', callRecord.id);

    // Map Bland AI status to our standard status
    const mapStatus = (blandStatus: string, queueStatus?: string): string => {
      if (queueStatus === 'complete' || event.completed === true) {
        return 'completed';
      }
      
      const statusMap: Record<string, string> = {
        'queued': 'queued',
        'in_progress': 'in-progress',
        'ringing': 'in-progress',
        'connected': 'in-progress',
        'completed': 'completed',
        'ended': 'completed',
        'failed': 'failed',
        'error': 'failed',
        'no_answer': 'no-answer',
        'busy': 'busy',
        'cancelled': 'cancelled',
        'timeout': 'failed'
      };
      return statusMap[blandStatus.toLowerCase()] || 'pending';
    };

    // Determine outcome based on call data
    const determineOutcome = (event: BlandAIWebhookEvent): string => {
      if (event.error_message) {
        return 'failed';
      }
      
      if (event.answered_by === 'voicemail') {
        return 'voicemail';
      }
      
      if (event.answered_by === 'human') {
        if (event.summary?.toLowerCase().includes('not interested') || 
            event.summary?.toLowerCase().includes('declined')) {
          return 'no-interest';
        }
        if (event.summary?.toLowerCase().includes('interested') || 
            event.summary?.toLowerCase().includes('follow up')) {
          return 'interested';
        }
        return 'contacted';
      }
      
      return 'no-answer';
    };

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
      provider: 'bland_ai',
      call_data: {
        ...callRecord.call_data,
        latest_webhook: event,
        webhook_received_at: new Date().toISOString()
      }
    };

    // Update status
    updateData.status = mapStatus(event.status, event.queue_status);

    // Update timing fields
    if (event.started_at) {
      updateData.started_at = event.started_at;
    }
    
    if (event.end_at || event.completed) {
      updateData.completed_at = event.end_at || new Date().toISOString();
    }

    // Update duration
    if (event.corrected_duration) {
      updateData.duration = parseInt(event.corrected_duration);
    } else if (event.call_length) {
      updateData.duration = Math.round(event.call_length);
    }

    // Update transcript
    if (event.concatenated_transcript) {
      updateData.transcript = event.concatenated_transcript;
    }

    // Update recording URL
    if (event.recording_url) {
      updateData.recording_url = event.recording_url;
    }

    // Update outcome
    updateData.outcome = determineOutcome(event);

    // Update the call record
    const { error: updateError } = await supabase
      .from('bland_ai_calls')
      .update(updateData)
      .eq('id', callRecord.id);

    if (updateError) {
      console.error('Error updating call record:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update call record' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Successfully updated call record:', callRecord.id);

    // If we have a transcript and the call is completed, trigger AI analysis
    if (updateData.transcript && updateData.status === 'completed') {
      try {
        console.log('Triggering AI analysis for call:', callRecord.id);
        
        // Call the analyze-call-transcript function
        const analyzeResponse = await fetch(`${supabaseUrl}/functions/v1/analyze-call-transcript`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            callId: callRecord.id,
            transcript: updateData.transcript
          })
        });

        if (!analyzeResponse.ok) {
          console.error('Failed to trigger AI analysis:', await analyzeResponse.text());
        } else {
          console.log('AI analysis triggered successfully');
        }
      } catch (error) {
        console.error('Error triggering AI analysis:', error);
        // Don't fail the webhook if analysis fails
      }
    }

    // Log the activity
    try {
      await supabase.from('lead_activities').insert({
        lead_id: callRecord.lead_id,
        activity_type: 'call_updated',
        description: `Call status updated to ${updateData.status || 'unknown'}`,
        metadata: {
          call_id: callRecord.id,
          status: event.status,
          queue_status: event.queue_status,
          provider: 'bland_ai'
        }
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't fail the webhook if activity logging fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        call_id: callRecord.id,
        status: event.status,
        queue_status: event.queue_status
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing Bland AI webhook:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
