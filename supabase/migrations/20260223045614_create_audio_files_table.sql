/*
  # Create audio files management system

  1. New Tables
    - `audio_files`
      - `id` (uuid, primary key)
      - `file_name` (text) - Original file name
      - `file_path` (text) - Storage path in Supabase
      - `file_type` (text) - Audio type (e.g., 'guidance', 'background')
      - `duration` (integer) - Duration in seconds
      - `is_active` (boolean) - Whether this audio is currently active
      - `uploaded_at` (timestamptz) - Upload timestamp
      - `uploaded_by` (uuid) - User who uploaded (references auth.users)
      - `description` (text) - Optional description

  2. Storage
    - Create 'audio-files' bucket for storing audio files

  3. Security
    - Enable RLS on `audio_files` table
    - Admins can upload and manage audio files
    - All users can read active audio files
*/

CREATE TABLE IF NOT EXISTS audio_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL UNIQUE,
  file_type text NOT NULL DEFAULT 'guidance',
  duration integer DEFAULT 35,
  is_active boolean DEFAULT false,
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES auth.users(id),
  description text
);

ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active audio files"
  ON audio_files
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all audio files"
  ON audio_files
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can upload audio files"
  ON audio_files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own audio files"
  ON audio_files
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own audio files"
  ON audio_files
  FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio-files', 'audio-files', true)
ON CONFLICT (id) DO NOTHING;
