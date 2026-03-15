/*
  # Create Wavespell (波符) Table

  1. New Tables
    - `wavespells`
      - `id` (integer, primary key) - Wavespell number (1-20)
      - `name_cn` (text) - Chinese name
      - `name_en` (text) - English name
      - `kin_start` (integer) - Starting Kin number
      - `kin_end` (integer) - Ending Kin number
      - `wave_type` (text) - Wave type description
      - `life_essence` (text) - Life essence/底色
      - `long_term_purpose` (text) - Long-term purpose description
      - `seal_id` (integer) - Reference to the seal that starts this wavespell
      - `color` (text) - Color of the wavespell
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `wavespells` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS wavespells (
  id integer PRIMARY KEY,
  name_cn text NOT NULL,
  name_en text NOT NULL,
  kin_start integer NOT NULL CHECK (kin_start >= 1 AND kin_start <= 260),
  kin_end integer NOT NULL CHECK (kin_end >= 1 AND kin_end <= 260),
  wave_type text NOT NULL,
  life_essence text NOT NULL,
  long_term_purpose text NOT NULL,
  seal_id integer,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wavespells ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read wavespells"
  ON wavespells
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can read wavespells"
  ON wavespells
  FOR SELECT
  TO anon
  USING (true);