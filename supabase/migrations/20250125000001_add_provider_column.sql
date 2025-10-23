-- Add provider column to bland_ai_calls table to track which voice provider was used
-- This is optional and non-breaking - defaults to 'elevenlabs' for new calls

-- Add the provider column with a default value
ALTER TABLE public.bland_ai_calls 
ADD COLUMN IF NOT EXISTS provider text DEFAULT 'elevenlabs';

-- Add a comment to explain the column
COMMENT ON COLUMN public.bland_ai_calls.provider IS 'Voice provider used for this call (elevenlabs, bland_ai, etc.)';

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_bland_ai_calls_provider ON public.bland_ai_calls(provider);

-- Update existing calls to have 'elevenlabs' as provider (since we're migrating from Bland AI to ElevenLabs)
UPDATE public.bland_ai_calls 
SET provider = 'elevenlabs' 
WHERE provider IS NULL;
