/*
  # Fix storage policies for profile images

  1. New Storage Configuration
    - Creates a 'profile-images' bucket for storing user profile images
    - Sets up proper security policies for the bucket
  
  2. Security
    - Allows users to upload their own avatar and cover images
    - Provides public read access to all profile images
*/

-- Create the profile-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
UPDATE storage.buckets SET public = false WHERE id = 'profile-images';

-- Create policy to allow authenticated users to upload their own avatar images
CREATE POLICY "Users can upload their own avatar images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[2] AND
  (storage.foldername(name))[1] = 'avatars'
);

-- Create policy to allow users to update their own avatar images
CREATE POLICY "Users can update their own avatar images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[2] AND
  (storage.foldername(name))[1] = 'avatars'
);

-- Create policy to allow users to delete their own avatar images
CREATE POLICY "Users can delete their own avatar images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[2] AND
  (storage.foldername(name))[1] = 'avatars'
);

-- Create policy to allow authenticated users to upload their own cover images
CREATE POLICY "Users can upload their own cover images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[2] AND
  (storage.foldername(name))[1] = 'covers'
);

-- Create policy to allow users to update their own cover images
CREATE POLICY "Users can update their own cover images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[2] AND
  (storage.foldername(name))[1] = 'covers'
);

-- Create policy to allow users to delete their own cover images
CREATE POLICY "Users can delete their own cover images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[2] AND
  (storage.foldername(name))[1] = 'covers'
);

-- Create policy for public read access to all profile images
CREATE POLICY "Public read access for profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');