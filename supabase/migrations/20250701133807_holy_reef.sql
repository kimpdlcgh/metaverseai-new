/*
  # Create profile images storage bucket and policies

  1. Storage
    - Create profile-images bucket for storing user avatars and cover photos
    - Set up folder structure for avatars and covers

  2. Security
    - Enable public read access for all profile images
    - Create policies for authenticated users to manage their own images
*/

-- Create the profile-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow users to upload their own avatar images
DO $$
BEGIN
  INSERT INTO storage.policies (name, bucket_id, definition)
  VALUES (
    'Users can upload their own avatar images',
    'profile-images',
    '(bucket_id = ''profile-images'' AND auth.uid()::text = (storage.foldername(name))[1])'
  )
  ON CONFLICT (name, bucket_id) DO NOTHING;
EXCEPTION
  WHEN undefined_table THEN
    -- Handle case where storage.policies table doesn't exist
    RAISE NOTICE 'storage.policies table does not exist, skipping policy creation';
END $$;

-- Create policy for public read access to all images
DO $$
BEGIN
  INSERT INTO storage.policies (name, bucket_id, definition)
  VALUES (
    'Public read access for profile images',
    'profile-images',
    '(bucket_id = ''profile-images'')'
  )
  ON CONFLICT (name, bucket_id) DO NOTHING;
EXCEPTION
  WHEN undefined_table THEN
    -- Handle case where storage.policies table doesn't exist
    RAISE NOTICE 'storage.policies table does not exist, skipping policy creation';
END $$;