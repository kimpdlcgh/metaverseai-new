/*
  # Add Cover Image Support and Storage Policies

  1. Changes
    - Create 'covers' storage bucket if it doesn't exist
    - Add cover_image_url column to user_profiles table if it doesn't exist
    - Create storage policies for avatars and covers buckets with existence checks
  
  2. Security
    - Ensure public read access to images
    - Restrict write operations to authenticated users for their own files only
*/

-- Create storage bucket for cover images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Add cover_image_url to user_profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN cover_image_url text;
  END IF;
END $$;

-- Create storage policies for avatars bucket with existence checks
DO $$
BEGIN
  -- Check if the policy already exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Avatar images are publicly accessible'
  ) THEN
    CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can upload their own avatar'
  ) THEN
    CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'avatars' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can update their own avatar'
  ) THEN
    CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'avatars' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can delete their own avatar'
  ) THEN
    CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'avatars' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
END $$;

-- Create storage policies for covers bucket with existence checks
DO $$
BEGIN
  -- Check if the policy already exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Cover images are publicly accessible'
  ) THEN
    CREATE POLICY "Cover images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'covers');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can upload their own cover image'
  ) THEN
    CREATE POLICY "Users can upload their own cover image"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'covers' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can update their own cover image'
  ) THEN
    CREATE POLICY "Users can update their own cover image"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'covers' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can delete their own cover image'
  ) THEN
    CREATE POLICY "Users can delete their own cover image"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'covers' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
END $$;