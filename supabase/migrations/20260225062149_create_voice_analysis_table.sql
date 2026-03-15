/*
  # Create Voice Analysis Results Table

  1. New Tables
    - `voice_analysis_results`
      - `id` (uuid, primary key) - Unique identifier for each analysis
      - `user_id` (uuid, nullable) - Reference to auth.users, nullable for guest users
      - `session_id` (text) - Session identifier for tracking analyses
      - `source` (text) - Voice source type: 'brain', 'throat', or 'heart'
      - `quality` (text) - Voice quality type: 'smooth', 'rough', or 'flat'
      - `phase` (text) - Energy phase: 'grounded', 'floating', or 'scattering'
      - `profile_id` (text) - Emotion profile ID (e.g., '001', '065', '343', '372')
      - `profile_name` (text) - Human-readable profile name
      - `message` (text) - Personalized message for the user
      - `energy_data` (jsonb) - Detailed frequency and energy analysis data
      - `audio_duration` (integer) - Duration of analyzed audio in seconds
      - `created_at` (timestamptz) - Timestamp of analysis

  2. Security
    - Enable RLS on `voice_analysis_results` table
    - Add policy for users to read their own analysis results
    - Add policy for users to insert their own analysis results
    - Add policy for admin users to read all analysis results
    - Add policies for anonymous users to allow guest access

  3. Indexes
    - Index on user_id for fast user-specific queries
    - Index on session_id for tracking multiple analyses in one session
    - Index on created_at for time-based queries
*/

CREATE TABLE IF NOT EXISTS voice_analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  source text NOT NULL CHECK (source IN ('brain', 'throat', 'heart')),
  quality text NOT NULL CHECK (quality IN ('smooth', 'rough', 'flat')),
  phase text NOT NULL CHECK (phase IN ('grounded', 'floating', 'scattering')),
  profile_id text NOT NULL,
  profile_name text NOT NULL,
  message text NOT NULL,
  energy_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  audio_duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voice_analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own analysis results"
  ON voice_analysis_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis results"
  ON voice_analysis_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can read all analysis results"
  ON voice_analysis_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profile
      WHERE user_profile.is_admin = true
      LIMIT 1
    )
  );

CREATE POLICY "Guest users can read their session analysis"
  ON voice_analysis_results
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Guest users can insert analysis results"
  ON voice_analysis_results
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_voice_analysis_user_id ON voice_analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_analysis_session_id ON voice_analysis_results(session_id);
CREATE INDEX IF NOT EXISTS idx_voice_analysis_created_at ON voice_analysis_results(created_at DESC);
