-- Migration: Add Centralized API Key
-- Description: Adds the centralized API key for AI calling services
-- Date: 2025-01-23
-- Author: System Administrator

-- Insert the centralized API key
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

-- Add additional system settings
INSERT INTO public.settings (key, value, created_at, updated_at)
VALUES 
    ('system_ai_provider', 'centralized', NOW(), NOW()),
    ('ai_service_status', 'active', NOW(), NOW()),
    ('max_concurrent_calls', '100', NOW(), NOW())
ON CONFLICT (key) 
DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Create a function to check API key status
CREATE OR REPLACE FUNCTION public.check_api_key_status()
RETURNS TABLE(key_name text, is_configured boolean, last_updated timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.key,
        CASE WHEN s.value IS NOT NULL AND s.value != '' THEN true ELSE false END as is_configured,
        s.updated_at
    FROM public.settings s
    WHERE s.key IN ('centralized_ai_api_key', 'system_ai_provider', 'ai_service_status');
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_api_key_status() TO authenticated;

-- Verify the migration
SELECT 
    key,
    CASE 
        WHEN LENGTH(value) > 20 THEN LEFT(value, 10) || '...' || RIGHT(value, 10)
        ELSE value 
    END as masked_value,
    created_at,
    updated_at
FROM public.settings 
WHERE key LIKE '%ai%' OR key LIKE '%api%'
ORDER BY created_at DESC;
