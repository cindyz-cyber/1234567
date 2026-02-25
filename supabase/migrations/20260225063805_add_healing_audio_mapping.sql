/*
  # Add Healing Audio Mapping

  1. Changes
    - Add `healing_audio_id` column to `voice_analysis_results` table
    - Create index for faster audio lookup
    - Add column to map each analysis result to its corresponding healing audio file

  2. Notes
    - This enables the 384 energy profile system to link each analysis to specific healing frequencies
    - The audio files will be stored in the existing `audio-files` storage bucket
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voice_analysis_results' AND column_name = 'healing_audio_id'
  ) THEN
    ALTER TABLE voice_analysis_results ADD COLUMN healing_audio_id text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_voice_analysis_healing_audio
  ON voice_analysis_results(healing_audio_id);

COMMENT ON COLUMN voice_analysis_results.healing_audio_id IS
  'References the healing audio file ID from the 384 energy profile system';
