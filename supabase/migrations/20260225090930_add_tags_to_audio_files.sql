/*
  # Add tags and metadata to audio files

  1. Changes
    - Add `tags` column to `audio_files` table (array of text)
    - Add `frequency_hz` column for storing the primary healing frequency
    - Add `cover_image_url` column for album/track artwork
    - Add `title` column for display name
    - Create index on tags for faster filtering

  2. Notes
    - Tags will be used to filter audio by frequency (e.g., "Hz:396", "Hz:417")
    - This enables dynamic audio library filtering based on diagnosis
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'audio_files' AND column_name = 'tags'
  ) THEN
    ALTER TABLE audio_files ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'audio_files' AND column_name = 'frequency_hz'
  ) THEN
    ALTER TABLE audio_files ADD COLUMN frequency_hz integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'audio_files' AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE audio_files ADD COLUMN cover_image_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'audio_files' AND column_name = 'title'
  ) THEN
    ALTER TABLE audio_files ADD COLUMN title text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_audio_files_tags
  ON audio_files USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_audio_files_frequency
  ON audio_files(frequency_hz);

COMMENT ON COLUMN audio_files.tags IS
  'Array of tags for filtering (e.g., ["Hz:396", "Root Chakra", "Healing"])';

COMMENT ON COLUMN audio_files.frequency_hz IS
  'Primary healing frequency in Hz (194, 417, 528, 639, 741, 852, 963)';

COMMENT ON COLUMN audio_files.cover_image_url IS
  'URL to cover artwork image';

COMMENT ON COLUMN audio_files.title IS
  'Display title for the audio track';
