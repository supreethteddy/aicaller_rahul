-- Add centralized API key to Supabase database
-- This script adds the centralized API key that will be used by all users

-- Insert the centralized API key into the settings table
INSERT INTO public.settings (key, value, created_at, updated_at)
VALUES (
    'centralized_ai_api_key',
    'org_1b25603d1e6199931316fc9e4be8adecd24a45bcbe19beea9e5cdd77e459be1b44814402c56533afae7b69',
    NOW(),
    NOW()
)
ON CONFLICT (key) 
DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Add a comment to document this setting
COMMENT ON TABLE public.settings IS 'Stores application settings including centralized API keys';

-- Create an index on the key column for faster lookups (if it doesn't exist)
CREATE UNIQUE INDEX IF NOT EXISTS settings_key_idx ON public.settings USING btree (key);

-- Verify the key was inserted
SELECT key, 
       CASE 
           WHEN LENGTH(value) > 20 THEN LEFT(value, 10) || '...' || RIGHT(value, 10)
           ELSE value 
       END as masked_value,
       created_at 
FROM public.settings 
WHERE key = 'centralized_ai_api_key';
