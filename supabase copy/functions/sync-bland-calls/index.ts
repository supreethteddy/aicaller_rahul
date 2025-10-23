import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Bland AI sync function called');

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const blandApiKey = Deno.env.get('BLAND_AI_API_KEY') || 'org_1b25603d1e6199931316fc9e4be8adecd24a45bcbe19beea9e5cdd77e459be1b44814402c56533afae7b69';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // Get all queued calls that have a bland_call_id
    const { data: queuedCalls, error: fetchError } = await supabase
      .from('bland_ai_calls')
      .select('*')
      .in('status', ['queued', 'in-progress'])
      .not('bland_call_id', 'is', null)
      .limit(50); // Limit to prevent timeout

    if (fetchError) {
      console.error('Error fetching queued calls:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch calls' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Found ${queuedCalls.length} calls to sync`);

    let syncedCount = 0;
    let errorCount = 0;

    // Process each call
    for (const call of queuedCalls) {
      try {
        console.log(`Syncing call ${call.bland_call_id}...`);

        // Fetch current status from Bland AI
        const response = await fetch(`https://api.bland.ai/v1/calls/${call.bland_call_id}`, {
          headers: {
            'Authorization': `Bearer ${blandApiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.error(`Failed to fetch call ${call.bland_call_id}: ${response.status}`);
          errorCount++;
          continue;
        }

        const blandData = await response.json();
        console.log(`Call ${call.bland_call_id} status: ${blandData.status}, queue: ${blandData.queue_status}`);

        // Determine our status
        let ourStatus = 'queued';
        if (blandData.queue_status === 'complete' || blandData.completed === true) {
          ourStatus = 'completed';
        } else if (blandData.status === 'in_progress') {
          ourStatus = 'in-progress';
        } else if (blandData.status === 'failed' || blandData.error_message) {
          ourStatus = 'failed';
        }

        // Determine outcome
        let outcome = null;
        if (ourStatus === 'completed') {
          if (blandData.answered_by === 'voicemail') {
            outcome = 'voicemail';
          } else if (blandData.answered_by === 'human') {
            if (blandData.summary?.toLowerCase().includes('not interested') || 
                blandData.summary?.toLowerCase().includes('declined')) {
              outcome = 'no-interest';
            } else if (blandData.summary?.toLowerCase().includes('interested') || 
                       blandData.summary?.toLowerCase().includes('follow up')) {
              outcome = 'interested';
            } else {
              outcome = 'contacted';
            }
          } else {
            outcome = 'no-answer';
          }
        }

        // Update the call record
        const updateData: any = {
          status: ourStatus,
          updated_at: new Date().toISOString(),
          call_data: {
            ...call.call_data,
            last_sync: blandData,
            synced_at: new Date().toISOString()
          }
        };

        if (blandData.started_at) {
          updateData.started_at = blandData.started_at;
        }

        if (blandData.end_at || blandData.completed) {
          updateData.completed_at = blandData.end_at || new Date().toISOString();
        }

        if (blandData.corrected_duration) {
          updateData.duration = parseInt(blandData.corrected_duration);
        } else if (blandData.call_length) {
          updateData.duration = Math.round(blandData.call_length);
        }

        if (blandData.concatenated_transcript) {
          updateData.transcript = blandData.concatenated_transcript;
        }

        if (blandData.recording_url) {
          updateData.recording_url = blandData.recording_url;
        }

        if (outcome) {
          updateData.outcome = outcome;
        }

        const { error: updateError } = await supabase
          .from('bland_ai_calls')
          .update(updateData)
          .eq('id', call.id);

        if (updateError) {
          console.error(`Error updating call ${call.id}:`, updateError);
          errorCount++;
        } else {
          console.log(`Successfully synced call ${call.bland_call_id} to status: ${ourStatus}`);
          syncedCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing call ${call.bland_call_id}:`, error);
        errorCount++;
      }
    }

    console.log(`Sync completed: ${syncedCount} synced, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sync completed',
        synced: syncedCount,
        errors: errorCount,
        total: queuedCalls.length
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in sync function:', error);
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
