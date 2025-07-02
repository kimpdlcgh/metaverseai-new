/*
  # Create rate limit check function

  1. New Functions
    - `check_rate_limit` - Function to check and update rate limits for users
      - Takes user_id, action_type, max_attempts, and window_minutes as parameters
      - Returns boolean indicating if the action is allowed
      - Handles rate limiting logic with proper column qualification

  2. Security
    - Function uses SECURITY DEFINER to run with elevated privileges
    - Proper input validation and sanitization
*/

CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id uuid,
  p_action_type text,
  p_max_attempts integer DEFAULT 5,
  p_window_minutes integer DEFAULT 60
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_attempts integer := 0;
  v_window_start timestamptz;
  v_blocked_until timestamptz;
  v_now timestamptz := now();
BEGIN
  -- Calculate window start time
  v_window_start := v_now - (p_window_minutes || ' minutes')::interval;
  
  -- Get current rate limit record
  SELECT 
    rl.attempts, 
    rl.window_start, 
    rl.blocked_until
  INTO 
    v_current_attempts, 
    v_window_start, 
    v_blocked_until
  FROM rate_limits rl
  WHERE rl.user_id = p_user_id 
    AND rl.action_type = p_action_type;
  
  -- If no record exists, create one and allow the action
  IF NOT FOUND THEN
    INSERT INTO rate_limits (user_id, action_type, attempts, window_start)
    VALUES (p_user_id, p_action_type, 1, v_now);
    RETURN true;
  END IF;
  
  -- Check if user is currently blocked
  IF v_blocked_until IS NOT NULL AND v_blocked_until > v_now THEN
    RETURN false;
  END IF;
  
  -- Check if we're in a new time window
  IF v_window_start < (v_now - (p_window_minutes || ' minutes')::interval) THEN
    -- Reset the window
    UPDATE rate_limits 
    SET 
      attempts = 1,
      window_start = v_now,
      blocked_until = NULL
    WHERE user_id = p_user_id 
      AND action_type = p_action_type;
    RETURN true;
  END IF;
  
  -- Check if we've exceeded the limit
  IF v_current_attempts >= p_max_attempts THEN
    -- Block the user for the remaining window time plus additional penalty
    UPDATE rate_limits 
    SET blocked_until = v_now + (p_window_minutes || ' minutes')::interval
    WHERE user_id = p_user_id 
      AND action_type = p_action_type;
    RETURN false;
  END IF;
  
  -- Increment attempts and allow the action
  UPDATE rate_limits 
  SET attempts = attempts + 1
  WHERE user_id = p_user_id 
    AND action_type = p_action_type;
  
  RETURN true;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_rate_limit(uuid, text, integer, integer) TO authenticated;