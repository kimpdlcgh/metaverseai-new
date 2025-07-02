/*
  # Fix onboarding policies and tables

  1. Tables
    - Ensure user_profiles table exists with correct structure
    - Ensure onboarding_progress table exists
    - Ensure rate_limits table exists
    - Ensure profile_audit_logs table exists

  2. Security
    - Drop and recreate policies to avoid conflicts
    - Enable RLS on all tables
    - Add comprehensive security policies

  3. Functions
    - Rate limiting function
    - Audit logging function
    - Updated timestamp function
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop user_profiles policies
  DROP POLICY IF EXISTS "Users can create own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Public read access for basic info" ON user_profiles;

  -- Drop onboarding_progress policies
  DROP POLICY IF EXISTS "Users can manage own onboarding progress" ON onboarding_progress;

  -- Drop rate_limits policies
  DROP POLICY IF EXISTS "Users can read own rate limits" ON rate_limits;

  -- Drop profile_audit_logs policies
  DROP POLICY IF EXISTS "Users can read own audit logs" ON profile_audit_logs;
END $$;

-- Create tables if they don't exist
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
  CONSTRAINT valid_full_name CHECK (length(trim(full_name)) >= 2),
  CONSTRAINT valid_phone CHECK (phone_number IS NULL OR phone_number ~* '^\+[1-9]\d{1,14}$'),
  CONSTRAINT valid_age CHECK (date_of_birth IS NULL OR date_of_birth <= (CURRENT_DATE - INTERVAL '18 years'))
);

CREATE TABLE IF NOT EXISTS onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step integer DEFAULT 1,
  completed_steps integer[] DEFAULT ARRAY[]::integer[],
  step_data jsonb DEFAULT '{}'::jsonb,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_activity timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_step CHECK (current_step >= 1 AND current_step <= 3),
  CONSTRAINT unique_user_progress UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  attempts integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  blocked_until timestamptz,
  
  CONSTRAINT unique_user_action UNIQUE (user_id, action_type)
);

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
  
  -- Constraints
  CONSTRAINT valid_operation CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding_completed ON user_profiles(onboarding_completed);

CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_current_step ON onboarding_progress(current_step);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits(user_id, action_type);

CREATE INDEX IF NOT EXISTS idx_profile_audit_logs_user_id ON profile_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_audit_logs_created_at ON profile_audit_logs(created_at);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create or replace functions
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS TRIGGER AS $$
DECLARE
  changed_fields text[] := '{}';
  field_name text;
BEGIN
  -- Determine changed fields for UPDATE operations
  IF TG_OP = 'UPDATE' THEN
    FOR field_name IN 
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = TG_TABLE_NAME 
      AND table_schema = TG_TABLE_SCHEMA
    LOOP
      IF (OLD IS DISTINCT FROM NEW) THEN
        IF to_jsonb(OLD)->>field_name IS DISTINCT FROM to_jsonb(NEW)->>field_name THEN
          changed_fields := array_append(changed_fields, field_name);
        END IF;
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
    changed_fields
  ) VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    CASE WHEN TG_OP = 'UPDATE' THEN changed_fields ELSE NULL END
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
BEGIN
  -- Get current rate limit record
  SELECT attempts, window_start
  INTO current_attempts, window_start
  FROM rate_limits
  WHERE user_id = p_user_id AND action_type = p_action_type;

  -- If no record exists, create one and allow
  IF NOT FOUND THEN
    INSERT INTO rate_limits (user_id, action_type, attempts, window_start)
    VALUES (p_user_id, p_action_type, 1, now());
    RETURN true;
  END IF;

  -- Check if window has expired
  IF window_start < (now() - (p_window_minutes || ' minutes')::interval) THEN
    -- Reset the window
    UPDATE rate_limits
    SET attempts = 1, window_start = now(), blocked_until = NULL
    WHERE user_id = p_user_id AND action_type = p_action_type;
    RETURN true;
  END IF;

  -- Check if currently blocked
  IF EXISTS (
    SELECT 1 FROM rate_limits
    WHERE user_id = p_user_id 
    AND action_type = p_action_type 
    AND blocked_until > now()
  ) THEN
    RETURN false;
  END IF;

  -- Check if limit exceeded
  IF current_attempts >= p_max_attempts THEN
    -- Block for the remaining window time
    UPDATE rate_limits
    SET blocked_until = window_start + (p_window_minutes || ' minutes')::interval
    WHERE user_id = p_user_id AND action_type = p_action_type;
    RETURN false;
  END IF;

  -- Increment attempts
  UPDATE rate_limits
  SET attempts = attempts + 1
  WHERE user_id = p_user_id AND action_type = p_action_type;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS user_profiles_updated_at ON user_profiles;
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS user_profiles_audit ON user_profiles;
CREATE TRIGGER user_profiles_audit
  AFTER INSERT OR UPDATE OR DELETE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_profile_changes();

DROP TRIGGER IF EXISTS onboarding_progress_updated_at ON onboarding_progress;
CREATE TRIGGER onboarding_progress_updated_at
  BEFORE UPDATE ON onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS onboarding_progress_audit ON onboarding_progress;
CREATE TRIGGER onboarding_progress_audit
  AFTER INSERT OR UPDATE OR DELETE ON onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION log_profile_changes();

-- Create RLS policies
CREATE POLICY "Users can create own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public read access for basic info"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() != user_id AND 
    onboarding_completed = true
  );

CREATE POLICY "Users can manage own onboarding progress"
  ON onboarding_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own rate limits"
  ON rate_limits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own audit logs"
  ON profile_audit_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);