/*
  # Create H5 Share Configuration Table

  1. New Tables
    - `h5_share_config`
      - `id` (uuid, primary key) - Single row identifier
      - `is_active` (boolean) - Master switch for H5 share page
      - `daily_token` (text) - Today's valid access token
      - `bg_video_url` (text) - Global background video URL from cloud storage
      - `bg_music_url` (text) - Global healing background music URL
      - `card_bg_image_url` (text) - H5 share card background image URL
      - `created_at` (timestamp) - Record creation time
      - `updated_at` (timestamp) - Last update time

  2. Security
    - Enable RLS on `h5_share_config` table
    - Add policy for public read access (for H5 page validation)
    - Add policy for authenticated admin write access

  3. Initial Data
    - Insert single configuration row with default values
*/

-- Create the h5_share_config table
CREATE TABLE IF NOT EXISTS h5_share_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active boolean DEFAULT true NOT NULL,
  daily_token text DEFAULT '' NOT NULL,
  bg_video_url text DEFAULT '' NOT NULL,
  bg_music_url text DEFAULT '' NOT NULL,
  card_bg_image_url text DEFAULT '/0_0_640_N.webp' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE h5_share_config ENABLE ROW LEVEL SECURITY;

-- Public can read the config (for token validation)
CREATE POLICY "Anyone can read h5 share config"
  ON h5_share_config
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can update the config
CREATE POLICY "Authenticated users can update h5 share config"
  ON h5_share_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert the single global configuration row
INSERT INTO h5_share_config (
  id,
  is_active,
  daily_token,
  bg_video_url,
  bg_music_url,
  card_bg_image_url
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  true,
  'zen2026',
  '',
  '',
  '/0_0_640_N.webp'
) ON CONFLICT (id) DO NOTHING;

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_h5_share_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_h5_share_config_updated_at_trigger ON h5_share_config;
CREATE TRIGGER update_h5_share_config_updated_at_trigger
  BEFORE UPDATE ON h5_share_config
  FOR EACH ROW
  EXECUTE FUNCTION update_h5_share_config_updated_at();
