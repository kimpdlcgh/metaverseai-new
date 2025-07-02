/*
  # Create notification RPC function

  1. New Functions
    - `create_notification` - Creates a new notification for a user
      - Parameters: p_action_url, p_expires_at, p_message, p_title, p_type, p_user_id
      - Returns: notification ID (uuid)
  
  2. Security
    - Function executes with invoker's rights (security definer not needed)
    - RLS policies on user_notifications table will handle access control
*/

CREATE OR REPLACE FUNCTION create_notification(
  p_action_url text,
  p_expires_at timestamptz,
  p_message text,
  p_title text,
  p_type text,
  p_user_id uuid
) RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  notification_id uuid;
BEGIN
  -- Validate notification type
  IF p_type NOT IN ('success', 'error', 'info', 'warning') THEN
    RAISE EXCEPTION 'Invalid notification type. Must be one of: success, error, info, warning';
  END IF;

  -- Insert the notification
  INSERT INTO user_notifications (
    user_id,
    title,
    message,
    type,
    action_url,
    expires_at
  ) VALUES (
    p_user_id,
    p_title,
    p_message,
    p_type,
    p_action_url,
    p_expires_at
  ) RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$;

-- Create function for marking notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(
  p_notification_id uuid,
  p_user_id uuid
) RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE user_notifications 
  SET read = true 
  WHERE id = p_notification_id 
    AND user_id = p_user_id 
    AND read = false;
  
  RETURN FOUND;
END;
$$;

-- Create function for marking all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read(
  p_user_id uuid
) RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  update_count integer;
BEGIN
  UPDATE user_notifications 
  SET read = true 
  WHERE user_id = p_user_id 
    AND read = false;
  
  GET DIAGNOSTICS update_count = ROW_COUNT;
  RETURN update_count;
END;
$$;