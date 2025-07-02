/*
  # Comprehensive Onboarding System

  1. New Tables
    - `user_profiles` - Complete user profile information
    - `onboarding_progress` - Track user progress through onboarding steps
    - `profile_audit_logs` - Audit trail for profile changes
    - `rate_limits` - Rate limiting for profile updates

  2. Security
    - Enable RLS on all tables
    - Comprehensive policies for CRUD operations
    - Rate limiting implementation
    - Audit logging triggers

  3. Validation
    - Email format and uniqueness constraints
    - Phone number E.164 format validation
    - Age verification (18+ years)
    - Input sanitization functions
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone_number text,
  date_of_birth date,
  avatar_url text,
  bio text,
  location jsonb,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (phone_number IS NULL OR phone_number ~* '^\+[1-9]\d{1,14}$'),
  CONSTRAINT valid_age CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE - INTERVAL '18 years'),
  CONSTRAINT valid_full_name CHECK (length(trim(full_name)) >= 2)
);

-- Create onboarding_progress table
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step integer DEFAULT 1,
  completed_steps integer[] DEFAULT ARRAY[]::integer[],
  step_data jsonb DEFAULT '{}'::jsonb,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_activity timestamptz DEFAULT now(),
  
  CONSTRAINT valid_step CHECK (current_step >= 1 AND current_step <= 3),
  CONSTRAINT unique_user_progress UNIQUE(user_id)
);

-- Create profile_audit_logs table
CREATE TABLE IF NOT EXISTS profile_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  table_name text NOT NULL,
  operation text NOT NULL,
  old_values jsonb,
  new_values jsonb,
  changed_fields text[],
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_operation CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE'))
);

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  attempts integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  blocked_until timestamptz,
  
  CONSTRAINT unique_user_action UNIQUE(user_id, action_type)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can create own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public read access for basic info"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for onboarding_progress
CREATE POLICY "Users can manage own onboarding progress"
  ON onboarding_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for profile_audit_logs
CREATE POLICY "Users can read own audit logs"
  ON profile_audit_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for rate_limits
CREATE POLICY "Users can read own rate limits"
  ON rate_limits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions for input sanitization
CREATE OR REPLACE FUNCTION sanitize_text(input_text text)
RETURNS text AS $$
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Remove potentially dangerous characters and trim whitespace
  RETURN trim(regexp_replace(input_text, '[<>"\'';&]', '', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate E.164 phone format
CREATE OR REPLACE FUNCTION validate_phone_e164(phone text)
RETURNS boolean AS $$
BEGIN
  IF phone IS NULL THEN
    RETURN true;
  END IF;
  
  -- E.164 format: +[country code][number] (max 15 digits total)
  RETURN phone ~* '^\+[1-9]\d{1,14}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id uuid,
  p_action_type text,
  p_max_attempts integer DEFAULT 5,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean AS $$
DECLARE
  current_attempts integer;
  window_start timestamptz;
  is_blocked boolean;
BEGIN
  -- Check if user is currently blocked
  SELECT blocked_until > now() INTO is_blocked
  FROM rate_limits
  WHERE user_id = p_user_id AND action_type = p_action_type;
  
  IF is_blocked THEN
    RETURN false;
  END IF;
  
  -- Get current attempts in window
  SELECT attempts, window_start INTO current_attempts, window_start
  FROM rate_limits
  WHERE user_id = p_user_id AND action_type = p_action_type;
  
  -- If no record exists or window expired, create/reset
  IF current_attempts IS NULL OR window_start < now() - (p_window_minutes || ' minutes')::interval THEN
    INSERT INTO rate_limits (user_id, action_type, attempts, window_start)
    VALUES (p_user_id, p_action_type, 1, now())
    ON CONFLICT (user_id, action_type)
    DO UPDATE SET attempts = 1, window_start = now(), blocked_until = NULL;
    RETURN true;
  END IF;
  
  -- Check if limit exceeded
  IF current_attempts >= p_max_attempts THEN
    UPDATE rate_limits
    SET blocked_until = now() + (p_window_minutes || ' minutes')::interval
    WHERE user_id = p_user_id AND action_type = p_action_type;
    RETURN false;
  END IF;
  
  -- Increment attempts
  UPDATE rate_limits
  SET attempts = attempts + 1
  WHERE user_id = p_user_id AND action_type = p_action_type;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Audit logging function
CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS trigger AS $$
DECLARE
  changed_fields text[] := ARRAY[]::text[];
  field_name text;
BEGIN
  -- Determine changed fields for UPDATE operations
  IF TG_OP = 'UPDATE' THEN
    FOR field_name IN SELECT column_name FROM information_schema.columns 
                      WHERE table_name = TG_TABLE_NAME AND table_schema = 'public'
    LOOP
      IF to_jsonb(OLD) ->> field_name IS DISTINCT FROM to_jsonb(NEW) ->> field_name THEN
        changed_fields := array_append(changed_fields, field_name);
      END IF;
    END LOOP;
  END IF;
  
  -- Insert audit log
  INSERT INTO profile_audit_logs (
    user_id,
    table_name,
    operation,
    old_values,
    new_values,
    changed_fields,
    ip_address,
    user_agent
  ) VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    changed_fields,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER user_profiles_audit
  AFTER INSERT OR UPDATE OR DELETE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION log_profile_changes();

CREATE TRIGGER onboarding_progress_audit
  AFTER INSERT OR UPDATE OR DELETE ON onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION log_profile_changes();

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER onboarding_progress_updated_at
  BEFORE UPDATE ON onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding_completed ON user_profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_current_step ON onboarding_progress(current_step);
CREATE INDEX IF NOT EXISTS idx_profile_audit_logs_user_id ON profile_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_audit_logs_created_at ON profile_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits(user_id, action_type);