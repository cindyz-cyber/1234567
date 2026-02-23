/*
  # Add admin role to user profile

  1. Changes
    - Add `is_admin` (boolean) column to `user_profile` table
    - Default is false for regular users
    - Admin can access backend management features

  2. Notes
    - First user profile created will be set as admin automatically
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profile' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE user_profile ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

UPDATE user_profile 
SET is_admin = true 
WHERE id = (SELECT id FROM user_profile ORDER BY created_at ASC LIMIT 1);
