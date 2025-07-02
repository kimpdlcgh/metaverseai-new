/*
  # Fix Storage Policies

  1. Storage Configuration
    - Creates 'profile-images' bucket if it doesn't exist
    - Sets bucket to private (not public)
  
  2. Storage Policies
    - Creates policies for avatar uploads, updates, and deletions
    - Creates policies for cover image uploads, updates, and deletions
    - Creates policy for public read access to all profile images
    - Uses existence checks to prevent duplicate policy errors
*/

-- Create the profile-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
UPDATE storage.buckets SET public = false WHERE id = 'profile-images';

-- Create policy to allow authenticated users to upload their own avatar images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Users can upload their own avatar images'
  ) THEN
    CREATE POLICY "Users can upload their own avatar images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'profile-images' AND
      auth.uid()::text = (storage.foldername(name))[2] AND
      (storage.foldername(name))[1] = 'avatars'
    );
  END IF;
END $$;

-- Create policy to allow users to update their own avatar images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Users can update their own avatar images'
  ) THEN
    CREATE POLICY "Users can update their own avatar images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'profile-images' AND
      auth.uid()::text = (storage.foldername(name))[2] AND
      (storage.foldername(name))[1] = 'avatars'
    );
  END IF;
END $$;

-- Create policy to allow users to delete their own avatar images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Users can delete their own avatar images'
  ) THEN
    CREATE POLICY "Users can delete their own avatar images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'profile-images' AND
      auth.uid()::text = (storage.foldername(name))[2] AND
      (storage.foldername(name))[1] = 'avatars'
    );
  END IF;
END $$;

-- Create policy to allow authenticated users to upload their own cover images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Users can upload their own cover images'
  ) THEN
    CREATE POLICY "Users can upload their own cover images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'profile-images' AND
      auth.uid()::text = (storage.foldername(name))[2] AND
      (storage.foldername(name))[1] = 'covers'
    );
  END IF;
END $$;

-- Create policy to allow users to update their own cover images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Users can update their own cover images'
  ) THEN
    CREATE POLICY "Users can update their own cover images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'profile-images' AND
      auth.uid()::text = (storage.foldername(name))[2] AND
      (storage.foldername(name))[1] = 'covers'
    );
  END IF;
END $$;

-- Create policy to allow users to delete their own cover images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Users can delete their own cover images'
  ) THEN
    CREATE POLICY "Users can delete their own cover images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'profile-images' AND
      auth.uid()::text = (storage.foldername(name))[2] AND
      (storage.foldername(name))[1] = 'covers'
    );
  END IF;
END $$;

-- Create policy for public read access to all profile images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Public read access for profile images'
  ) THEN
    CREATE POLICY "Public read access for profile images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'profile-images');
  END IF;
END $$;