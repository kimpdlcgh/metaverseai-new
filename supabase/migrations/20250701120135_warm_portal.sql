/*
  # Storage Policies for Profile Images

  1. New Bucket
     - Creates a 'profile-images' bucket for storing user avatars and cover images
     - Makes the bucket publicly accessible for reading images

  2. Security
     - Enables Row Level Security (RLS) on storage.objects
     - Creates policies for avatars and cover images
     - Ensures users can only manage their own files
     - Allows public read access to all images

  3. Folder Structure
     - Avatars stored in: avatars/{user_id}/{filename}
     - Cover images stored in: covers/{user_id}/{filename}
*/

-- Create the profile-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to upload their own avatar images
CREATE POLICY "authenticated_user_insert_avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy: Allow authenticated users to update their own avatar images
CREATE POLICY "authenticated_user_update_avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy: Allow authenticated users to delete their own avatar images
CREATE POLICY "authenticated_user_delete_avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy: Allow authenticated users to upload their own cover images
CREATE POLICY "authenticated_user_insert_covers"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = 'covers' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy: Allow authenticated users to update their own cover images
CREATE POLICY "authenticated_user_update_covers"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = 'covers' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy: Allow authenticated users to delete their own cover images
CREATE POLICY "authenticated_user_delete_covers"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = 'covers' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy: Allow public read access to all images in the bucket
CREATE POLICY "public_read_access_for_profile_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');