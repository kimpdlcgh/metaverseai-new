/*
  # Create profile images storage bucket
  
  1. New Storage
    - Creates a public 'profile-images' bucket for storing user profile images
*/

-- Create the profile-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;