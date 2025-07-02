/*
  # Storage Bucket and Policies for Profile Images

  1. New Storage
    - Creates a 'profile-images' bucket for storing user profile and cover images
  
  2. Security
    - Sets up RLS policies for the bucket
    - Allows users to manage their own images
    - Provides public read access to all images
*/

-- Create the profile-images bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('profile-images', 'profile-images', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create policies using storage.create_policy function
-- This avoids the need for direct table ownership

-- Policy: Allow authenticated users to upload their own avatar images
SELECT storage.create_policy(
  'profile-images',
  'authenticated_user_insert_avatars',
  'INSERT',
  'authenticated',
  storage.foldername(name)[1] = 'avatars' AND auth.uid()::text = storage.foldername(name)[2]
);

-- Policy: Allow authenticated users to update their own avatar images
SELECT storage.create_policy(
  'profile-images',
  'authenticated_user_update_avatars',
  'UPDATE',
  'authenticated',
  storage.foldername(name)[1] = 'avatars' AND auth.uid()::text = storage.foldername(name)[2]
);

-- Policy: Allow authenticated users to delete their own avatar images
SELECT storage.create_policy(
  'profile-images',
  'authenticated_user_delete_avatars',
  'DELETE',
  'authenticated',
  storage.foldername(name)[1] = 'avatars' AND auth.uid()::text = storage.foldername(name)[2]
);

-- Policy: Allow authenticated users to upload their own cover images
SELECT storage.create_policy(
  'profile-images',
  'authenticated_user_insert_covers',
  'INSERT',
  'authenticated',
  storage.foldername(name)[1] = 'covers' AND auth.uid()::text = storage.foldername(name)[2]
);

-- Policy: Allow authenticated users to update their own cover images
SELECT storage.create_policy(
  'profile-images',
  'authenticated_user_update_covers',
  'UPDATE',
  'authenticated',
  storage.foldername(name)[1] = 'covers' AND auth.uid()::text = storage.foldername(name)[2]
);

-- Policy: Allow authenticated users to delete their own cover images
SELECT storage.create_policy(
  'profile-images',
  'authenticated_user_delete_covers',
  'DELETE',
  'authenticated',
  storage.foldername(name)[1] = 'covers' AND auth.uid()::text = storage.foldername(name)[2]
);

-- Policy: Allow public read access to all images in the bucket
SELECT storage.create_policy(
  'profile-images',
  'public_read_access',
  'SELECT',
  'public',
  true
);