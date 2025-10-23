# ElevenLabs Integration Setup Guide

This guide covers the setup required after switching from Bland AI to ElevenLabs for voice calling functionality.

## Overview

The application has been updated to use ElevenLabs Conversational AI Calling API instead of Bland AI, while maintaining the same UI and database structure for seamless transition.

## Required Steps

### 1. Deploy New Edge Functions

Deploy the new ElevenLabs webhook handler:

```bash
# Deploy the ElevenLabs callback function
supabase functions deploy elevenlabs-callback

# Update the test-integration function with ElevenLabs support
supabase functions deploy test-integration
```

### 2. Run Database Migration

Apply the optional provider column migration:

```bash
supabase db push
```

This adds a `provider` column to track which voice service was used for each call.

### 3. Environment Variables

Set the following environment variables in your Supabase project:

```bash
# Optional: ElevenLabs webhook secret for signature verification
supabase secrets set ELEVENLABS_WEBHOOK_SECRET=your_webhook_secret_here
```

### 4. ElevenLabs Webhook Configuration

Configure your ElevenLabs account to send webhooks to your callback function:

1. Go to your ElevenLabs dashboard
2. Navigate to Conversational AI settings
3. Set the webhook URL to: `https://your-project-id.supabase.co/functions/v1/elevenlabs-callback`
4. Enable the following events:
   - `conversation_started`
   - `conversation_ended`
   - `conversation_completed`
   - `conversation_failed`
   - `recording_available`
   - `transcript_available`

### 5. User Migration

Existing users will need to:

1. Go to Settings → AI Voice Settings
2. Enter their ElevenLabs API key
3. Select their preferred voice from the available ElevenLabs voices

## API Key Storage

- ElevenLabs API keys are stored per-user in the `settings` table
- Key format: `elevenlabs_api_key_{user_id}`
- Keys are encrypted at rest by Supabase

## Voice Management

- Voices are fetched dynamically from ElevenLabs API
- Users can select from their available voices in the settings
- Voice IDs are stored in campaign configurations

## Webhook Security

The webhook endpoint includes basic security measures:

- CORS headers for cross-origin requests
- Optional signature verification (if ElevenLabs provides it)
- Input validation and error handling
- Proper HTTP status codes

## Database Changes

### New Columns

- `bland_ai_calls.provider` (text, default: 'elevenlabs')

### Indexes

- `idx_bland_ai_calls_provider` for efficient provider-based queries

## Monitoring

Monitor the following for successful integration:

1. **Edge Function Logs**: Check `elevenlabs-callback` function logs for webhook processing
2. **Call Status Updates**: Verify calls are updating from 'pending' to 'completed'
3. **Transcript Processing**: Ensure transcripts trigger AI analysis
4. **Voice Loading**: Confirm voices load in the settings UI

## Troubleshooting

### Common Issues

1. **API Key Invalid**: 
   - Verify the ElevenLabs API key has proper permissions
   - Check the key is saved correctly in settings

2. **Webhooks Not Received**:
   - Verify webhook URL is correctly configured in ElevenLabs
   - Check edge function deployment status
   - Review function logs for errors

3. **Voices Not Loading**:
   - Ensure API key has access to voices endpoint
   - Check network connectivity to ElevenLabs API

4. **Calls Not Updating**:
   - Verify webhook events are being sent by ElevenLabs
   - Check database permissions for the service role key
   - Review call record matching logic

### Debug Commands

```bash
# Check function deployment
supabase functions list

# View function logs
supabase functions logs elevenlabs-callback

# Test webhook manually
curl -X POST https://your-project-id.supabase.co/functions/v1/elevenlabs-callback \
  -H "Content-Type: application/json" \
  -d '{"event_type":"conversation_started","conversation_id":"test-123"}'
```

## Migration Notes

- All existing UI components continue to work unchanged
- Database table names remain the same (`bland_ai_calls`, `bland_ai_campaigns`)
- The `BlandAIClient` class now delegates to `ElevenLabsProvider` internally
- Campaign and call management workflows are preserved

## Support

For issues with the ElevenLabs integration:

1. Check the edge function logs first
2. Verify API key permissions and quotas
3. Test the webhook endpoint manually
4. Review ElevenLabs API documentation for any changes

The integration maintains backward compatibility while providing the enhanced features of ElevenLabs' Conversational AI platform.
