/*
  # Create profile images storage bucket and policies

  1. New Storage Bucket
    - Creates a 'profile-images' bucket for storing user profile images
    - Sets the bucket to be publicly accessible for reading

  2. Security
    - Creates RLS policies for the storage.objects table
    - Allows users to manage their own avatar and cover images
    - Allows public read access to all images
*/

-- Create the profile-images bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('profile-images', 'profile-images', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create folder structure for avatars and covers
-- Note: We don't need to create folders explicitly in object storage

-- Create policy for users to upload their own avatar images
DO $$
BEGIN
  INSERT INTO storage.policies (name, definition, bucket_id)
  VALUES (
    'Users can upload their own avatar images',
    '(bucket_id = ''profile-images'' AND auth.uid()::text = (storage.foldername(name))[2] AND (storage.foldername(name))[1] = ''avatars'')',
    'profile-images'
  )
  ON CONFLICT (name, bucket_id) DO NOTHING;
END $$;

-- Create policy for users to upload their own cover images
DO $$
BEGIN
  INSERT INTO storage.policies (name, definition, bucket_id)
  VALUES (
    'Users can upload their own cover images',
    '(bucket_id = ''profile-images'' AND auth.uid()::text = (storage.foldername(name))[2] AND (storage.foldername(name))[1] = ''covers'')',
    'profile-images'
  )
  ON CONFLICT (name, bucket_id) DO NOTHING;
END $$;

-- Create policy for public read access to all images
DO $$
BEGIN
  INSERT INTO storage.policies (name, definition, bucket_id)
  VALUES (
    'Public read access for profile images',
    '(bucket_id = ''profile-images'')',
    'profile-images'
  )
  ON CONFLICT (name, bucket_id) DO NOTHING;
END $$;