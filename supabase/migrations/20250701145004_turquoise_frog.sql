/*
  # Fix Notifications System

  1. New Tables
    - `user_notifications` - Stores user notifications with fields for title, message, type, read status, etc.
  
  2. Security
    - Enable RLS on `user_notifications` table
    - Add policies for users to manage their own notifications
  
  3. Functions
    - `create_notification` - Creates a new notification for a user
    - `mark_notification_read` - Marks a specific notification as read
    - `mark_all_notifications_read` - Marks all notifications for a user as read
    - `delete_expired_notifications` - Removes expired notifications
    - `schedule_expired_notifications_cleanup` - Schedules cleanup of expired notifications
*/

-- Create user_notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  
  -- Constraints
  CONSTRAINT valid_notification_type CHECK (type IN ('success', 'error', 'info', 'warning'))
);

-- Create indexes for faster queries if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read ON public.user_notifications(read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON public.user_notifications(created_at);

-- Enable Row Level Security if not already enabled
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
  -- Check if the select policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notifications' 
    AND policyname = 'Users can read their own notifications'
  ) THEN
    CREATE POLICY "Users can read their own notifications"
    ON public.user_notifications
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  -- Check if the update policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notifications' 
    AND policyname = 'Users can update their own notifications'
  ) THEN
    CREATE POLICY "Users can update their own notifications"
    ON public.user_notifications
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check if the delete policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notifications' 
    AND policyname = 'Users can delete their own notifications'
  ) THEN
    CREATE POLICY "Users can delete their own notifications"
    ON public.user_notifications
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Drop existing functions if they exist to avoid return type errors
DO $$
BEGIN
  DROP FUNCTION IF EXISTS public.create_notification(uuid, text, text, text, text, timestamptz);
  DROP FUNCTION IF EXISTS public.mark_notification_read(uuid, uuid);
  DROP FUNCTION IF EXISTS public.mark_all_notifications_read(uuid);
  DROP FUNCTION IF EXISTS public.delete_expired_notifications();
  DROP FUNCTION IF EXISTS public.schedule_expired_notifications_cleanup();
END
$$;

-- Create function to add a notification
CREATE OR REPLACE FUNCTION public.create_notification(
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
  -- Validate notification type
  IF p_type NOT IN ('success', 'error', 'info', 'warning') THEN
    RAISE EXCEPTION 'Invalid notification type: %', p_type;
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
END;
$$;

-- Create function to mark notifications as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(
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
  UPDATE public.user_notifications
  SET read = true
  WHERE id = p_notification_id AND user_id = p_user_id
  RETURNING 1 INTO v_affected_rows;
  
  RETURN v_affected_rows IS NOT NULL;
END;
$$;

-- Create function to mark all notifications as read
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(
  p_user_id uuid
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_affected_rows int;
BEGIN
  UPDATE public.user_notifications
  SET read = true
  WHERE user_id = p_user_id AND read = false;
  
  GET DIAGNOSTICS v_affected_rows = ROW_COUNT;
  RETURN v_affected_rows;
END;
$$;

-- Create trigger to automatically delete expired notifications
CREATE OR REPLACE FUNCTION public.delete_expired_notifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.user_notifications
  WHERE expires_at IS NOT NULL AND expires_at < now();
  
  RETURN NULL;
END;
$$;

-- Create function for scheduled cleanup
CREATE OR REPLACE FUNCTION public.schedule_expired_notifications_cleanup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM pg_notify('expired_notifications_cleanup', '');
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notification_read TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_all_notifications_read TO authenticated;