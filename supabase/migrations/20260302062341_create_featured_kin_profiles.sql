/*
  # Create Featured Kin Profiles Table

  1. New Tables
    - `featured_kin_profiles`
      - `kin_number` (integer, primary key) - Kin number (1-260)
      - `mode_name` (text) - Mode name (e.g., "超频黄太阳", "先知模式")
      - `custom_summary` (text) - Deep customized summary
      - `pineal_gland` (integer) - Pineal gland/松果体 locked percentage (0-100)
      - `heart_chakra` (integer) - Heart chakra/心轮 locked percentage (0-100)
      - `throat_chakra` (integer) - Throat chakra/喉轮 locked percentage (0-100)
      - `special_traits` (jsonb) - Additional special characteristics
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Update timestamp

  2. Security
    - Enable RLS on `featured_kin_profiles` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS featured_kin_profiles (
  kin_number integer PRIMARY KEY CHECK (kin_number >= 1 AND kin_number <= 260),
  mode_name text NOT NULL,
  custom_summary text NOT NULL,
  pineal_gland integer NOT NULL CHECK (pineal_gland >= 0 AND pineal_gland <= 100),
  heart_chakra integer NOT NULL CHECK (heart_chakra >= 0 AND heart_chakra <= 100),
  throat_chakra integer NOT NULL CHECK (throat_chakra >= 0 AND throat_chakra <= 100),
  special_traits jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE featured_kin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read featured kin profiles"
  ON featured_kin_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can read featured kin profiles"
  ON featured_kin_profiles
  FOR SELECT
  TO anon
  USING (true);