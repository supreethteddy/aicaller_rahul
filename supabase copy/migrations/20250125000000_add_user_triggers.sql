-- Add missing triggers for user creation
-- This trigger should fire when a new user is created in auth.users

-- Check if trigger exists first, then create it
DO $$
BEGIN
    -- Create trigger for new user creation (inserts into profiles and user_roles)
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;

    -- Create trigger for profile creation (activation status)
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_profile_created_activation'
    ) THEN
        CREATE TRIGGER on_profile_created_activation
          AFTER INSERT ON public.profiles
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_activation();
    END IF;
END $$;
