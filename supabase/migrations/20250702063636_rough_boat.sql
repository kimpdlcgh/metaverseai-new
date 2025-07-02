/*
  # Fix Notification System Functions
  
  1. Changes
    - Drops existing notification functions by full signature to avoid ambiguity
    - Creates notification functions with distinctive names to prevent conflicts
    - Updates grants to provide necessary permissions to authenticated users
    - Ensures policies exist for proper access control
*/

-- Drop the functions by specifying their full parameter lists to avoid ambiguity
DROP FUNCTION IF EXISTS public.create_notification(uuid, text, text, text, text, timestamptz);
DROP FUNCTION IF EXISTS public.create_notification(text, timestamptz, text, text, text, uuid);
DROP FUNCTION IF EXISTS public.mark_notification_read(uuid, uuid);
DROP FUNCTION IF EXISTS public.mark_all_notifications_read(uuid);

-- Create a new renamed notification creation function
CREATE OR REPLACE FUNCTION public.create_user_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type text,
  p_action_url text DEFAULT NULL,
  p_expires_at timestamptz DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  -- Validate required parameters
  IF p_message IS NULL OR p_title IS NULL OR p_type IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'Required parameters cannot be null: message, title, type, user_id';
  END IF;
  
  -- Validate notification type
  IF p_type NOT IN ('success', 'error', 'info', 'warning') THEN
    RAISE EXCEPTION 'Invalid notification type: %. Must be one of: success, error, info, warning', p_type;
  END IF;

  -- Insert notification
  INSERT INTO public.user_notifications (
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
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Error creating notification: %', SQLERRM;
END;
$$;

-- Create function to mark notifications as read with unique name
CREATE OR REPLACE FUNCTION public.mark_user_notification_read(
  p_notification_id uuid,
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_affected_rows int;
BEGIN
  -- Validate parameters
  IF p_notification_id IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'Notification ID and User ID cannot be null';
  END IF;

  -- Update the notification
  UPDATE public.user_notifications
  SET read = true
  WHERE id = p_notification_id AND user_id = p_user_id AND read = false
  RETURNING 1 INTO v_affected_rows;
  
  -- Return true if the notification was found and updated, false otherwise
  RETURN v_affected_rows IS NOT NULL;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Error marking notification as read: %', SQLERRM;
END;
$$;

-- Create function to mark all notifications as read with unique name
CREATE OR REPLACE FUNCTION public.mark_all_user_notifications_read(
  p_user_id uuid
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_affected_rows int;
BEGIN
  -- Validate parameters
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;

  -- Update all unread notifications for the user
  UPDATE public.user_notifications
  SET read = true
  WHERE user_id = p_user_id AND read = false;
  
  -- Get the number of rows affected
  GET DIAGNOSTICS v_affected_rows = ROW_COUNT;
  
  RETURN v_affected_rows;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Error marking all notifications as read: %', SQLERRM;
END;
$$;

-- Grant execute permissions to authenticated users on the new functions
GRANT EXECUTE ON FUNCTION public.create_user_notification TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_user_notification_read TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_all_user_notifications_read TO authenticated;

-- Make sure we have all necessary policies
DO $$
BEGIN
  -- Check if we need to add additional policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notifications' 
    AND policyname = 'Users can read their own notifications 2'
  ) THEN
    CREATE POLICY "Users can read their own notifications 2"
    ON public.user_notifications
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notifications' 
    AND policyname = 'Users can update their own notifications 2'
  ) THEN
    CREATE POLICY "Users can update their own notifications 2"
    ON public.user_notifications
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notifications' 
    AND policyname = 'Users can insert their notifications'
  ) THEN
    CREATE POLICY "Users can insert their notifications"
    ON public.user_notifications
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;