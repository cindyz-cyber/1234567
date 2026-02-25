/*
  # Fix journal entries table to allow optional fields

  1. Changes
    - Make higher_self_response optional (allow NULL)
    - This allows saving journal entries before the higher self dialogue step

  2. Notes
    - Journal entries can now be saved during the inner whisper step
    - higher_self_response will be added later during the dialogue step
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries'
    AND column_name = 'higher_self_response'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE journal_entries
    ALTER COLUMN higher_self_response DROP NOT NULL;
  END IF;
END $$;
