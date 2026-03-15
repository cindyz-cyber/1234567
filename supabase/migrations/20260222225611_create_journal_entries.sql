/*
  # Create journal entries table

  1. New Tables
    - `journal_entries`
      - `id` (uuid, primary key) - unique identifier
      - `emotions` (text array) - selected emotions
      - `body_states` (text array) - selected body states
      - `journal_content` (text) - user's journal entry
      - `higher_self_response` (text) - higher self's response
      - `created_at` (timestamptz) - when the entry was created
  
  2. Security
    - Enable RLS on `journal_entries` table
    - Add policies for public access (single-user app)
    
  3. Notes
    - Stores the complete flow of each healing session
    - Includes emotion scan, journal, and higher self dialogue
*/

CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emotions text[] DEFAULT '{}',
  body_states text[] DEFAULT '{}',
  journal_content text NOT NULL,
  higher_self_response text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON journal_entries
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON journal_entries
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON journal_entries
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);