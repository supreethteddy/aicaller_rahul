--
-- PostgreSQL database dump
--

\restrict ue0rJyjKOjAyPUsRuaVREqeSgArkfUCgPwovOgUISkNwpcO850sojhyktm5o7Qc

-- Dumped from database version 17.4
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--



--
-- Name: activation_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.activation_status AS ENUM (
    'pending',
    'active',
    'suspended'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'premium',
    'basic'
);


--
-- Name: add_super_admin(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_super_admin(email text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get the user ID from the email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE auth.users.email = add_super_admin.email;

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', email;
    END IF;

    -- Update user metadata to set super_admin flag
    UPDATE auth.users
    SET raw_user_meta_data = 
        CASE 
            WHEN raw_user_meta_data IS NULL THEN 
                jsonb_build_object('super_admin', true)
            ELSE 
                raw_user_meta_data || jsonb_build_object('super_admin', true)
        END
    WHERE id = target_user_id;
END;
$$;


--
-- Name: FUNCTION add_super_admin(email text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.add_super_admin(email text) IS 'Function to add super admin flag to user metadata';


--
-- Name: check_my_activation_status(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_my_activation_status() RETURNS TABLE(status public.activation_status)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT uas.status
    FROM public.user_activation_status uas
    WHERE uas.profile_id = auth.uid();
END;
$$;


--
-- Name: convert_contact_submission_to_lead(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.convert_contact_submission_to_lead() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the first super admin user ID
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE raw_user_meta_data->>'super_admin' = 'true'
    LIMIT 1;

    -- Insert into leads table
    INSERT INTO public.leads (
        name,
        email,
        phone,
        company,
        source,
        source_id,
        lead_data,
        user_id
    ) VALUES (
        NEW.name,
        NEW.email,
        NEW.phone,
        NEW.company,
        'contact_form',
        NEW.id::text,
        jsonb_build_object(
            'form_type', NEW.form_type,
            'message', NEW.message,
            'submission_id', NEW.id
        ),
        admin_user_id
    );

    RETURN NEW;
END;
$$;


--
-- Name: FUNCTION convert_contact_submission_to_lead(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.convert_contact_submission_to_lead() IS 'Automatically converts contact form submissions to leads';


--
-- Name: get_admin_users_data(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_admin_users_data() RETURNS TABLE(id uuid, email character varying, full_name text, subscription_plan text, leads_count bigint, status text, created_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if the current user is a super admin
    IF NOT public.is_super_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Access denied. User is not a super admin.';
    END IF;

    RETURN QUERY
    SELECT 
        au.id,
        au.email::varchar(255),  -- Explicitly cast to varchar(255)
        COALESCE(p.full_name, 'N/A') as full_name,
        'free'::text as subscription_plan,
        COUNT(l.id)::bigint as leads_count,
        CASE 
            WHEN au.banned_until IS NOT NULL AND au.banned_until > now() THEN 'banned'
            WHEN au.last_sign_in_at > now() - interval '30 days' THEN 'active'
            ELSE 'inactive'
        END as status,
        au.created_at
    FROM auth.users au
    LEFT JOIN public.profiles p ON p.id = au.id
    LEFT JOIN public.leads l ON l.user_id = au.id
    GROUP BY au.id, au.email, au.created_at, au.last_sign_in_at, au.banned_until, p.full_name
    ORDER BY au.created_at DESC;
END;
$$;


--
-- Name: get_user_activation_statuses(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_activation_statuses() RETURNS TABLE(id uuid, profile_id uuid, status public.activation_status, activated_by uuid, activated_at timestamp with time zone, notes text, created_at timestamp with time zone, updated_at timestamp with time zone, email text, full_name text, activated_by_email text, activated_by_full_name text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if the current user is a super admin
    IF NOT public.is_super_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Only super admins can view activation statuses';
    END IF;

    RETURN QUERY
    SELECT 
        uas.id,
        uas.profile_id,
        uas.status,
        uas.activated_by,
        uas.activated_at,
        uas.notes,
        uas.created_at,
        uas.updated_at,
        p.email,
        p.full_name,
        ap.email as activated_by_email,
        ap.full_name as activated_by_full_name
    FROM public.user_activation_status uas
    JOIN public.profiles p ON p.id = uas.profile_id
    LEFT JOIN public.profiles ap ON ap.id = uas.activated_by
    ORDER BY uas.created_at DESC;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'basic');
  
  RETURN NEW;
END;
$$;


--
-- Name: handle_new_user_activation(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user_activation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Always create a pending status for new users
    INSERT INTO public.user_activation_status (profile_id, status)
    VALUES (NEW.id, 'pending');
    RETURN NEW;
END;
$$;


--
-- Name: handle_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;


--
-- Name: is_super_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_super_admin(user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM auth.users 
        WHERE id = user_id 
        AND raw_user_meta_data->>'super_admin' = 'true'
    );
END;
$$;


--
-- Name: FUNCTION is_super_admin(user_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.is_super_admin(user_id uuid) IS 'Function to check if a user is a super admin based on metadata';


--
-- Name: remove_super_admin(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.remove_super_admin(email text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get the user ID from the email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE auth.users.email = remove_super_admin.email;

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', email;
    END IF;

    -- Update user metadata to remove super_admin flag
    UPDATE auth.users
    SET raw_user_meta_data = raw_user_meta_data - 'super_admin'
    WHERE id = target_user_id;
END;
$$;


--
-- Name: FUNCTION remove_super_admin(email text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.remove_super_admin(email text) IS 'Function to remove super admin flag from user metadata';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


--
-- Name: update_user_activation_status(uuid, public.activation_status, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_user_activation_status(target_profile_id uuid, new_status public.activation_status, status_notes text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if the current user is a super admin
    IF NOT public.is_super_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Only super admins can update activation status';
    END IF;

    -- Update the status
    UPDATE public.user_activation_status
    SET 
        status = new_status,
        notes = COALESCE(status_notes, notes),
        activated_by = CASE 
            WHEN new_status = 'active' AND status != 'active' THEN auth.uid()
            ELSE activated_by
        END,
        activated_at = CASE 
            WHEN new_status = 'active' AND status != 'active' THEN NOW()
            ELSE activated_at
        END,
        updated_at = NOW()
    WHERE profile_id = target_profile_id;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bland_ai_calls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bland_ai_calls (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lead_id uuid,
    campaign_id uuid,
    bland_call_id text,
    phone_number text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    duration integer,
    transcript text,
    summary text,
    outcome text,
    recording_url text,
    call_data jsonb,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    ai_analysis jsonb,
    lead_score integer,
    qualification_status text,
    analyzer_used text
);


--
-- Name: bland_ai_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bland_ai_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    ai_prompt text NOT NULL,
    voice_id text,
    status text DEFAULT 'draft'::text NOT NULL,
    total_leads integer DEFAULT 0,
    completed_calls integer DEFAULT 0,
    successful_calls integer DEFAULT 0,
    campaign_data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    message text,
    form_type text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: integration_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.integration_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    source_type text NOT NULL,
    credentials jsonb NOT NULL,
    is_active boolean DEFAULT true,
    last_validated_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: integration_sync_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.integration_sync_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    source_type text NOT NULL,
    sync_status text NOT NULL,
    leads_imported integer DEFAULT 0,
    error_message text,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    metadata jsonb,
    CONSTRAINT integration_sync_logs_sync_status_check CHECK ((sync_status = ANY (ARRAY['success'::text, 'error'::text, 'in_progress'::text])))
);


--
-- Name: lead_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lead_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lead_id uuid NOT NULL,
    user_id uuid NOT NULL,
    activity_type text NOT NULL,
    description text,
    notes text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lead_imports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lead_imports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    import_type text NOT NULL,
    source_name text NOT NULL,
    total_leads integer DEFAULT 0 NOT NULL,
    successful_imports integer DEFAULT 0 NOT NULL,
    failed_imports integer DEFAULT 0 NOT NULL,
    import_status text DEFAULT 'processing'::text NOT NULL,
    error_log jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone
);


--
-- Name: lead_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lead_sources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    source_type text NOT NULL,
    source_name text NOT NULL,
    is_active boolean DEFAULT true,
    api_config jsonb,
    webhook_url text,
    total_leads integer DEFAULT 0,
    last_sync_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text,
    email text,
    phone text,
    company text,
    job_title text,
    source text NOT NULL,
    source_id text,
    campaign_id text,
    lead_data jsonb,
    score integer DEFAULT 0,
    status text DEFAULT 'new'::text,
    priority text DEFAULT 'medium'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_contact_at timestamp with time zone,
    import_batch_id uuid,
    ai_lead_score integer,
    ai_insights jsonb,
    last_analysis_at timestamp with time zone,
    CONSTRAINT leads_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
    CONSTRAINT leads_status_check CHECK ((status = ANY (ARRAY['new'::text, 'contacted'::text, 'qualified'::text, 'converted'::text, 'lost'::text])))
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key text NOT NULL,
    value text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: TABLE settings; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.settings IS 'Stores application settings like API keys';


--
-- Name: user_activation_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_activation_status (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid,
    status public.activation_status DEFAULT 'pending'::public.activation_status,
    activated_by uuid,
    activated_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.user_role DEFAULT 'basic'::public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vapi_ai_assistants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vapi_ai_assistants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    voice_settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    prompt text NOT NULL,
    functions jsonb DEFAULT '[]'::jsonb,
    model text DEFAULT 'gpt-3.5-turbo'::text NOT NULL,
    first_message text,
    background_sound text,
    status text DEFAULT 'active'::text NOT NULL,
    vapi_assistant_id text,
    assistant_data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vapi_ai_calls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vapi_ai_calls (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lead_id uuid,
    assistant_id uuid,
    phone_number_id uuid,
    vapi_call_id text,
    caller_phone_number text,
    destination_phone_number text,
    status text DEFAULT 'pending'::text NOT NULL,
    type text DEFAULT 'inbound'::text NOT NULL,
    duration integer,
    cost numeric(10,4),
    transcript text,
    summary text,
    sentiment_analysis jsonb,
    recording_url text,
    call_data jsonb,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vapi_ai_phone_numbers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vapi_ai_phone_numbers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    phone_number text NOT NULL,
    vapi_phone_number_id text,
    name text,
    assistant_id uuid,
    status text DEFAULT 'active'::text NOT NULL,
    monthly_cost numeric(10,2),
    country_code text DEFAULT 'US'::text NOT NULL,
    phone_number_data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bland_ai_calls bland_ai_calls_bland_call_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bland_ai_calls
    ADD CONSTRAINT bland_ai_calls_bland_call_id_key UNIQUE (bland_call_id);


--
-- Name: bland_ai_calls bland_ai_calls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bland_ai_calls
    ADD CONSTRAINT bland_ai_calls_pkey PRIMARY KEY (id);


--
-- Name: bland_ai_campaigns bland_ai_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bland_ai_campaigns
    ADD CONSTRAINT bland_ai_campaigns_pkey PRIMARY KEY (id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: integration_credentials integration_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integration_credentials
    ADD CONSTRAINT integration_credentials_pkey PRIMARY KEY (id);


--
-- Name: integration_credentials integration_credentials_user_id_source_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integration_credentials
    ADD CONSTRAINT integration_credentials_user_id_source_type_key UNIQUE (user_id, source_type);


--
-- Name: integration_sync_logs integration_sync_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integration_sync_logs
    ADD CONSTRAINT integration_sync_logs_pkey PRIMARY KEY (id);


--
-- Name: lead_activities lead_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_activities
    ADD CONSTRAINT lead_activities_pkey PRIMARY KEY (id);


--
-- Name: lead_imports lead_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_imports
    ADD CONSTRAINT lead_imports_pkey PRIMARY KEY (id);


--
-- Name: lead_sources lead_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_sources
    ADD CONSTRAINT lead_sources_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: leads leads_source_source_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_source_source_id_key UNIQUE (source, source_id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: user_activation_status user_activation_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activation_status
    ADD CONSTRAINT user_activation_status_pkey PRIMARY KEY (id);


--
-- Name: user_activation_status user_activation_status_profile_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activation_status
    ADD CONSTRAINT user_activation_status_profile_id_key UNIQUE (profile_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: vapi_ai_assistants vapi_ai_assistants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_assistants
    ADD CONSTRAINT vapi_ai_assistants_pkey PRIMARY KEY (id);


--
-- Name: vapi_ai_assistants vapi_ai_assistants_vapi_assistant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_assistants
    ADD CONSTRAINT vapi_ai_assistants_vapi_assistant_id_key UNIQUE (vapi_assistant_id);


--
-- Name: vapi_ai_calls vapi_ai_calls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_calls
    ADD CONSTRAINT vapi_ai_calls_pkey PRIMARY KEY (id);


--
-- Name: vapi_ai_calls vapi_ai_calls_vapi_call_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_calls
    ADD CONSTRAINT vapi_ai_calls_vapi_call_id_key UNIQUE (vapi_call_id);


--
-- Name: vapi_ai_phone_numbers vapi_ai_phone_numbers_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_phone_numbers
    ADD CONSTRAINT vapi_ai_phone_numbers_phone_number_key UNIQUE (phone_number);


--
-- Name: vapi_ai_phone_numbers vapi_ai_phone_numbers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_phone_numbers
    ADD CONSTRAINT vapi_ai_phone_numbers_pkey PRIMARY KEY (id);


--
-- Name: vapi_ai_phone_numbers vapi_ai_phone_numbers_vapi_phone_number_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_phone_numbers
    ADD CONSTRAINT vapi_ai_phone_numbers_vapi_phone_number_id_key UNIQUE (vapi_phone_number_id);


--
-- Name: idx_bland_ai_calls_lead_score; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bland_ai_calls_lead_score ON public.bland_ai_calls USING btree (lead_score) WHERE (lead_score IS NOT NULL);


--
-- Name: idx_integration_credentials_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_integration_credentials_user_id ON public.integration_credentials USING btree (user_id);


--
-- Name: idx_integration_sync_logs_source_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_integration_sync_logs_source_type ON public.integration_sync_logs USING btree (source_type);


--
-- Name: idx_integration_sync_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_integration_sync_logs_user_id ON public.integration_sync_logs USING btree (user_id);


--
-- Name: idx_lead_activities_lead_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities USING btree (lead_id);


--
-- Name: idx_lead_imports_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lead_imports_user_id ON public.lead_imports USING btree (user_id);


--
-- Name: idx_lead_sources_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lead_sources_user_id ON public.lead_sources USING btree (user_id);


--
-- Name: idx_leads_ai_lead_score; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_ai_lead_score ON public.leads USING btree (ai_lead_score) WHERE (ai_lead_score IS NOT NULL);


--
-- Name: idx_leads_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_created_at ON public.leads USING btree (created_at);


--
-- Name: idx_leads_import_batch_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_import_batch_id ON public.leads USING btree (import_batch_id);


--
-- Name: idx_leads_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_source ON public.leads USING btree (source);


--
-- Name: idx_leads_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_status ON public.leads USING btree (status);


--
-- Name: idx_leads_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_user_id ON public.leads USING btree (user_id);


--
-- Name: settings_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX settings_key_idx ON public.settings USING btree (key);


--
-- Name: contact_submissions convert_contact_submission_to_lead_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER convert_contact_submission_to_lead_trigger AFTER INSERT ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION public.convert_contact_submission_to_lead();


--
-- Name: settings handle_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER handle_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: profiles on_profile_created_activation; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_profile_created_activation AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_activation();


--
-- Name: bland_ai_calls update_bland_ai_calls_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bland_ai_calls_updated_at BEFORE UPDATE ON public.bland_ai_calls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bland_ai_campaigns update_bland_ai_campaigns_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bland_ai_campaigns_updated_at BEFORE UPDATE ON public.bland_ai_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: contact_submissions update_contact_submissions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: integration_credentials update_integration_credentials_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_integration_credentials_updated_at BEFORE UPDATE ON public.integration_credentials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: lead_sources update_lead_sources_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_lead_sources_updated_at BEFORE UPDATE ON public.lead_sources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: leads update_leads_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: vapi_ai_assistants update_vapi_ai_assistants_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_vapi_ai_assistants_updated_at BEFORE UPDATE ON public.vapi_ai_assistants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: vapi_ai_calls update_vapi_ai_calls_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_vapi_ai_calls_updated_at BEFORE UPDATE ON public.vapi_ai_calls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: vapi_ai_phone_numbers update_vapi_ai_phone_numbers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_vapi_ai_phone_numbers_updated_at BEFORE UPDATE ON public.vapi_ai_phone_numbers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bland_ai_calls bland_ai_calls_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bland_ai_calls
    ADD CONSTRAINT bland_ai_calls_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.bland_ai_campaigns(id);


--
-- Name: bland_ai_calls bland_ai_calls_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bland_ai_calls
    ADD CONSTRAINT bland_ai_calls_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id);


--
-- Name: bland_ai_calls bland_ai_calls_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bland_ai_calls
    ADD CONSTRAINT bland_ai_calls_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: bland_ai_campaigns bland_ai_campaigns_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bland_ai_campaigns
    ADD CONSTRAINT bland_ai_campaigns_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: integration_credentials integration_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integration_credentials
    ADD CONSTRAINT integration_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: integration_sync_logs integration_sync_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integration_sync_logs
    ADD CONSTRAINT integration_sync_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: lead_activities lead_activities_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_activities
    ADD CONSTRAINT lead_activities_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: lead_activities lead_activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_activities
    ADD CONSTRAINT lead_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: lead_imports lead_imports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_imports
    ADD CONSTRAINT lead_imports_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: lead_sources lead_sources_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_sources
    ADD CONSTRAINT lead_sources_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: leads leads_import_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_import_batch_id_fkey FOREIGN KEY (import_batch_id) REFERENCES public.lead_imports(id);


--
-- Name: leads leads_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_activation_status user_activation_status_activated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activation_status
    ADD CONSTRAINT user_activation_status_activated_by_fkey FOREIGN KEY (activated_by) REFERENCES public.profiles(id);


--
-- Name: user_activation_status user_activation_status_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activation_status
    ADD CONSTRAINT user_activation_status_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: vapi_ai_assistants vapi_ai_assistants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_assistants
    ADD CONSTRAINT vapi_ai_assistants_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: vapi_ai_calls vapi_ai_calls_assistant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_calls
    ADD CONSTRAINT vapi_ai_calls_assistant_id_fkey FOREIGN KEY (assistant_id) REFERENCES public.vapi_ai_assistants(id);


--
-- Name: vapi_ai_calls vapi_ai_calls_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_calls
    ADD CONSTRAINT vapi_ai_calls_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id);


--
-- Name: vapi_ai_calls vapi_ai_calls_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_calls
    ADD CONSTRAINT vapi_ai_calls_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: vapi_ai_phone_numbers vapi_ai_phone_numbers_assistant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_phone_numbers
    ADD CONSTRAINT vapi_ai_phone_numbers_assistant_id_fkey FOREIGN KEY (assistant_id) REFERENCES public.vapi_ai_assistants(id);


--
-- Name: vapi_ai_phone_numbers vapi_ai_phone_numbers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vapi_ai_phone_numbers
    ADD CONSTRAINT vapi_ai_phone_numbers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: contact_submissions Admins can view all contact submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all contact submissions" ON public.contact_submissions FOR SELECT USING (public.is_super_admin(auth.uid()));


--
-- Name: user_activation_status Allow system to insert activation status; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow system to insert activation status" ON public.user_activation_status FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: contact_submissions Anyone can create contact submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create contact submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);


--
-- Name: settings Enable insert access for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert access for authenticated users" ON public.settings FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: settings Enable read access for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for authenticated users" ON public.settings FOR SELECT TO authenticated USING (true);


--
-- Name: settings Enable update access for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable update access for authenticated users" ON public.settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


--
-- Name: user_activation_status Super admins can do everything; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Super admins can do everything" ON public.user_activation_status TO authenticated USING ((EXISTS ( SELECT 1
   FROM auth.users
  WHERE ((users.id = auth.uid()) AND ((users.raw_user_meta_data ->> 'super_admin'::text) = 'true'::text)))));


--
-- Name: vapi_ai_assistants Super admins can view all assistants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Super admins can view all assistants" ON public.vapi_ai_assistants FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));


--
-- Name: vapi_ai_calls Super admins can view all calls; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Super admins can view all calls" ON public.vapi_ai_calls FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));


--
-- Name: leads Super admins can view all leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Super admins can view all leads" ON public.leads FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));


--
-- Name: vapi_ai_phone_numbers Super admins can view all phone numbers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Super admins can view all phone numbers" ON public.vapi_ai_phone_numbers FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));


--
-- Name: profiles Super admins can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Super admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM auth.users
  WHERE ((users.id = auth.uid()) AND ((users.raw_user_meta_data ->> 'super_admin'::text) = 'true'::text)))));


--
-- Name: vapi_ai_assistants Users can create their own assistants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own assistants" ON public.vapi_ai_assistants FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: bland_ai_calls Users can create their own calls; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own calls" ON public.bland_ai_calls FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: vapi_ai_calls Users can create their own calls; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own calls" ON public.vapi_ai_calls FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: bland_ai_campaigns Users can create their own campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own campaigns" ON public.bland_ai_campaigns FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: lead_imports Users can create their own imports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own imports" ON public.lead_imports FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: integration_credentials Users can create their own integration credentials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own integration credentials" ON public.integration_credentials FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: lead_activities Users can create their own lead activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own lead activities" ON public.lead_activities FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: lead_sources Users can create their own lead sources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own lead sources" ON public.lead_sources FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: leads Users can create their own leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own leads" ON public.leads FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: vapi_ai_phone_numbers Users can create their own phone numbers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own phone numbers" ON public.vapi_ai_phone_numbers FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: integration_sync_logs Users can create their own sync logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own sync logs" ON public.integration_sync_logs FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: vapi_ai_assistants Users can delete their own assistants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own assistants" ON public.vapi_ai_assistants FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: bland_ai_calls Users can delete their own calls; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own calls" ON public.bland_ai_calls FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: vapi_ai_calls Users can delete their own calls; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own calls" ON public.vapi_ai_calls FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: bland_ai_campaigns Users can delete their own campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own campaigns" ON public.bland_ai_campaigns FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: integration_credentials Users can delete their own integration credentials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own integration credentials" ON public.integration_credentials FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: lead_sources Users can delete their own lead sources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own lead sources" ON public.lead_sources FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: leads Users can delete their own leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own leads" ON public.leads FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: vapi_ai_phone_numbers Users can delete their own phone numbers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own phone numbers" ON public.vapi_ai_phone_numbers FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: vapi_ai_assistants Users can update their own assistants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own assistants" ON public.vapi_ai_assistants FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: bland_ai_calls Users can update their own calls; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own calls" ON public.bland_ai_calls FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: vapi_ai_calls Users can update their own calls; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own calls" ON public.vapi_ai_calls FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: bland_ai_campaigns Users can update their own campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own campaigns" ON public.bland_ai_campaigns FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: lead_imports Users can update their own imports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own imports" ON public.lead_imports FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: integration_credentials Users can update their own integration credentials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own integration credentials" ON public.integration_credentials FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: lead_sources Users can update their own lead sources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own lead sources" ON public.lead_sources FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: leads Users can update their own leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own leads" ON public.leads FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: vapi_ai_phone_numbers Users can update their own phone numbers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own phone numbers" ON public.vapi_ai_phone_numbers FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id));


--
-- Name: user_activation_status Users can view their own activation status; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own activation status" ON public.user_activation_status FOR SELECT TO authenticated USING ((profile_id = auth.uid()));


--
-- Name: vapi_ai_assistants Users can view their own assistants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own assistants" ON public.vapi_ai_assistants FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: bland_ai_calls Users can view their own calls; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own calls" ON public.bland_ai_calls FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: vapi_ai_calls Users can view their own calls; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own calls" ON public.vapi_ai_calls FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: bland_ai_campaigns Users can view their own campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own campaigns" ON public.bland_ai_campaigns FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: lead_imports Users can view their own imports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own imports" ON public.lead_imports FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: integration_credentials Users can view their own integration credentials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own integration credentials" ON public.integration_credentials FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: lead_activities Users can view their own lead activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own lead activities" ON public.lead_activities FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: lead_sources Users can view their own lead sources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own lead sources" ON public.lead_sources FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: leads Users can view their own leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own leads" ON public.leads FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: vapi_ai_phone_numbers Users can view their own phone numbers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own phone numbers" ON public.vapi_ai_phone_numbers FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: integration_sync_logs Users can view their own sync logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own sync logs" ON public.integration_sync_logs FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: bland_ai_calls; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bland_ai_calls ENABLE ROW LEVEL SECURITY;

--
-- Name: bland_ai_campaigns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bland_ai_campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: integration_credentials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.integration_credentials ENABLE ROW LEVEL SECURITY;

--
-- Name: integration_sync_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.integration_sync_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: lead_activities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

--
-- Name: lead_imports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lead_imports ENABLE ROW LEVEL SECURITY;

--
-- Name: lead_sources; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;

--
-- Name: leads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

--
-- Name: user_activation_status; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_activation_status ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: vapi_ai_assistants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.vapi_ai_assistants ENABLE ROW LEVEL SECURITY;

--
-- Name: vapi_ai_calls; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.vapi_ai_calls ENABLE ROW LEVEL SECURITY;

--
-- Name: vapi_ai_phone_numbers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.vapi_ai_phone_numbers ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict ue0rJyjKOjAyPUsRuaVREqeSgArkfUCgPwovOgUISkNwpcO850sojhyktm5o7Qc

