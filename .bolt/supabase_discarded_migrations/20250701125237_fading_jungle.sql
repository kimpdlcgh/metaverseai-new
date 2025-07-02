/*
  # Create Storage Policies for Profile Images

  1. New Buckets
    - `profile-images` bucket for storing user profile images
  
  2. Storage Functions
    - Uses Supabase storage API functions to create policies
    - Avoids direct table ownership requirements
  
  3. Security
    - Implements proper access control for user uploads
    - Ensures users can only manage their own files
    - Allows public read access to all profile images
*/

-- Create the profile-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies using Supabase's storage API functions
-- These functions don't require table ownership

-- Create avatar upload policy
SELECT storage.extension.create_policy(
  'profile-images',
  'avatar-upload-policy',
  'INSERT',
  'authenticated',
  'starts_with(name, ''avatars/'') AND starts_with(name, ''avatars/'' || auth.uid() || ''/'')' 
);

-- Create avatar update policy
SELECT storage.extension.create_policy(
  'profile-images',
  'avatar-update-policy',
  'UPDATE',
  'authenticated',
  'starts_with(name, ''avatars/'') AND starts_with(name, ''avatars/'' || auth.uid() || ''/'')' 
);

-- Create avatar delete policy
SELECT storage.extension.create_policy(
  'profile-images',
  'avatar-delete-policy',
  'DELETE',
  'authenticated',
  'starts_with(name, ''avatars/'') AND starts_with(name, ''avatars/'' || auth.uid() || ''/'')' 
);

-- Create cover upload policy
SELECT storage.extension.create_policy(
  'profile-images',
  'cover-upload-policy',
  'INSERT',
  'authenticated',
  'starts_with(name, ''covers/'') AND starts_with(name, ''covers/'' || auth.uid() || ''/'')' 
);

-- Create cover update policy
SELECT storage.extension.create_policy(
  'profile-images',
  'cover-update-policy',
  'UPDATE',
  'authenticated',
  'starts_with(name, ''covers/'') AND starts_with(name, ''covers/'' || auth.uid() || ''/'')' 
);

-- Create cover delete policy
SELECT storage.extension.create_policy(
  'profile-images',
  'cover-delete-policy',
  'DELETE',
  'authenticated',
  'starts_with(name, ''covers/'') AND starts_with(name, ''covers/'' || auth.uid() || ''/'')' 
);

-- Create public read policy for all images in the bucket
SELECT storage.extension.create_policy(
  'profile-images',
  'public-read-policy',
  'SELECT',
  'public',
  'true'
);