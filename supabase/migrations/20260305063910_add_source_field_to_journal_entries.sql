/*
  # Add source field to journal_entries table

  1. Changes
    - Add `source` column to `journal_entries` table
      - Type: text
      - Default: 'app' (正式版用户)
      - Purpose: 区分引流版粉丝 ('web_share') 和正式版用户 ('app')
    
    - Make `higher_self_response` nullable for web_share entries
      - Web share entries may not have higher self responses
  
  2. Notes
    - Uses IF NOT EXISTS to prevent errors if column already exists
    - Existing entries will default to 'app' source
*/

-- Add source column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'source'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN source text DEFAULT 'app' NOT NULL;
  END IF;
END $$;

-- Make higher_self_response nullable
ALTER TABLE journal_entries ALTER COLUMN higher_self_response DROP NOT NULL;
