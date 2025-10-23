import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ElevenLabs webhook event types
interface ElevenLabsWebhookEvent {
  event_type: string;
  conversation_id: string;
  phone_number?: string;
  status?: string;
  duration_seconds?: number;
  recording_url?: string;
  transcript?: string;
  started_at?: string;
  ended_at?: string;
  metadata?: Record<string, any>;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('ElevenLabs webhook received:', req.method, req.url);

    // Verify webhook signature if available (optional security measure)
    const signature = req.headers.get('x-elevenlabs-signature');
    const webhookSecret = Deno.env.get('ELEVENLABS_WEBHOOK_SECRET');
    
    if (webhookSecret && signature) {
      // TODO: Implement signature verification if ElevenLabs provides it
      console.log('Webhook signature verification not implemented yet');
    }

    // Parse the webhook payload
    const event: ElevenLabsWebhookEvent = await req.json();
    console.log('ElevenLabs event received:', event);

    // Validate required fields
    if (!event.conversation_id) {
      console.error('Missing conversation_id in webhook event');
      return new Response(
        JSON.stringify({ error: 'Missing conversation_id' }),
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

    // Find the call record by ElevenLabs conversation_id
    const { data: callRecord, error: fetchError } = await supabase
      .from('bland_ai_calls')
      .select('*')
      .eq('bland_call_id', event.conversation_id)
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

    // Map ElevenLabs status to our standard status
    const mapStatus = (elevenLabsStatus: string): string => {
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
      return statusMap[elevenLabsStatus.toLowerCase()] || 'pending';
    };

    // Prepare update data based on event type
    const updateData: any = {
      updated_at: new Date().toISOString(),
      provider: 'elevenlabs'
    };

    // Handle different event types
    switch (event.event_type) {
      case 'conversation_started':
        updateData.status = 'in-progress';
        updateData.started_at = event.started_at || new Date().toISOString();
        break;

      case 'conversation_ended':
      case 'conversation_completed':
        updateData.status = mapStatus(event.status || 'completed');
        updateData.completed_at = event.ended_at || new Date().toISOString();
        if (event.duration_seconds) {
          updateData.duration = event.duration_seconds;
        }
        if (event.recording_url) {
          updateData.recording_url = event.recording_url;
        }
        if (event.transcript) {
          updateData.transcript = event.transcript;
        }
        break;

      case 'conversation_failed':
        updateData.status = 'failed';
        updateData.completed_at = event.ended_at || new Date().toISOString();
        if (event.error) {
          updateData.outcome = `Failed: ${event.error}`;
        }
        break;

      case 'recording_available':
        if (event.recording_url) {
          updateData.recording_url = event.recording_url;
        }
        break;

      case 'transcript_available':
        if (event.transcript) {
          updateData.transcript = event.transcript;
        }
        break;

      default:
        console.log('Unknown event type:', event.event_type);
        // Still update the call_data with the raw event
        updateData.call_data = {
          ...callRecord.call_data,
          latest_event: event
        };
    }

    // Always update call_data with the latest event
    updateData.call_data = {
      ...callRecord.call_data,
      latest_event: event,
      events: [
        ...(callRecord.call_data?.events || []),
        {
          ...event,
          received_at: new Date().toISOString()
        }
      ]
    };

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
    if (updateData.transcript && (updateData.status === 'completed' || updateData.status === 'failed')) {
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
          event_type: event.event_type,
          provider: 'elevenlabs'
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
        event_type: event.event_type
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing ElevenLabs webhook:', error);
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
