/*
  # Add File Notification System

  1. New Tables
    - `file_operations` - Tracks file operations for audit and notification purposes
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `file_path` (text)
      - `operation_type` (text)
      - `status` (text)
      - `error_message` (text, nullable)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `file_operations` table
    - Add policy for authenticated users to insert their own operations
    - Add policy for authenticated users to read their own operations
*/

-- Create file_operations table to track file operations
CREATE TABLE IF NOT EXISTS public.file_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  operation_type text NOT NULL,
  status text NOT NULL,
  error_message text,
  created_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_operation_type CHECK (operation_type IN ('upload', 'delete', 'update')),
  CONSTRAINT valid_status CHECK (status IN ('success', 'error', 'pending'))
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_file_operations_user_id ON public.file_operations(user_id);
CREATE INDEX IF NOT EXISTS idx_file_operations_created_at ON public.file_operations(created_at);

-- Enable Row Level Security
ALTER TABLE public.file_operations ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own operations
CREATE POLICY "Users can insert their own file operations"
ON public.file_operations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to read their own operations
CREATE POLICY "Users can read their own file operations"
ON public.file_operations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create function to log file operations
CREATE OR REPLACE FUNCTION public.log_file_operation(
  p_user_id uuid,
  p_file_path text,
  p_operation_type text,
  p_status text,
  p_error_message text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_operation_id uuid;
BEGIN
  INSERT INTO public.file_operations (
    user_id,
    file_path,
    operation_type,
    status,
    error_message
  ) VALUES (
    p_user_id,
    p_file_path,
    p_operation_type,
    p_status,
    p_error_message
  )
  RETURNING id INTO v_operation_id;
  
  RETURN v_operation_id;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.log_file_operation TO authenticated;