/*
  # Fix Audio Files RLS for Simplified Authentication

  1. Changes
    - Drop all existing policies that require auth.uid()
    - Create new policies that allow public access for INSERT, UPDATE, DELETE
    - Keep the existing SELECT policies

  2. Security
    - This is a simplified auth model
    - Access control is handled at the application level
    - In production, proper auth should be implemented
*/

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload audio files" ON audio_files;
DROP POLICY IF EXISTS "Users can update their own audio files" ON audio_files;
DROP POLICY IF EXISTS "Users can delete their own audio files" ON audio_files;

-- Create new public policies for admin operations
CREATE POLICY "Allow public insert for audio files"
ON audio_files
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update for audio files"
ON audio_files
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete for audio files"
ON audio_files
FOR DELETE
TO public
USING (true);