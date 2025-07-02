/*
  # Add unique constraint to user_profiles.user_id

  1. Changes
    - Add unique constraint on `user_id` column in `user_profiles` table
    - This enables upsert operations using `onConflict: 'user_id'`

  2. Security
    - No changes to RLS policies needed
    - Maintains existing data integrity
*/

-- Add unique constraint to user_id column in user_profiles table
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id);