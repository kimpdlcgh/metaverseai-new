/*
  # Storage Policies for Profile Images

  1. Storage Setup
    - Create profile-images bucket if it doesn't exist
    - Enable RLS on storage objects
    - Add policies for authenticated users to manage their own images

  2. Security
    - Users can upload their own profile images
    - Users can update their own profile images
    - Users can delete their own profile images
    - Public read access for all images
*/

-- Create the profile-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to upload their own images
CREATE POLICY "Users can upload own images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy: Allow authenticated users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy: Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy: Allow public read access to all images
CREATE POLICY "Public read access for images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');

-- Policy: Allow cover image uploads
CREATE POLICY "Users can upload cover images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = 'covers' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy: Allow cover image updates
CREATE POLICY "Users can update cover images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = 'covers' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy: Allow cover image deletion
CREATE POLICY "Users can delete cover images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = 'covers' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);