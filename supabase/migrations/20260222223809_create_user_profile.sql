/*
  # Create user profile table for healing app

  1. New Tables
    - `user_profile`
      - `id` (uuid, primary key) - unique identifier
      - `user_name` (text) - the name the higher self uses for the user
      - `higher_self_name` (text) - the name user gives to their inner wisdom
      - `created_at` (timestamptz) - when the profile was created
      - `updated_at` (timestamptz) - when the profile was last updated
  
  2. Security
    - Enable RLS on `user_profile` table
    - Add policy for public access (single-user app, no auth required)
    
  3. Notes
    - This is a single-user healing app
    - Only one profile record will exist
*/

CREATE TABLE IF NOT EXISTS user_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  higher_self_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON user_profile
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON user_profile
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON user_profile
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);