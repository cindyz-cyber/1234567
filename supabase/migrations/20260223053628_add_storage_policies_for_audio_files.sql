/*
  # Add Storage Policies for Audio Files Bucket

  1. Changes
    - Add policy for authenticated users to upload audio files
    - Add policy for authenticated users to read audio files
    - Add policy for authenticated users to delete their own audio files
    - Set public access for reading (since we're using getPublicUrl)

  2. Security
    - Authenticated users can upload to 'guidance' folder
    - All users can read files (bucket is public)
    - Only file owners can delete their uploads
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload audio files'
  ) THEN
    CREATE POLICY "Authenticated users can upload audio files"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'audio-files' AND
      (storage.foldername(name))[1] = 'guidance'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can read audio files'
  ) THEN
    CREATE POLICY "Anyone can read audio files"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'audio-files');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete their own audio files'
  ) THEN
    CREATE POLICY "Users can delete their own audio files"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'audio-files' AND
      owner = auth.uid()
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update their own audio files'
  ) THEN
    CREATE POLICY "Authenticated users can update their own audio files"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'audio-files' AND
      owner = auth.uid()
    )
    WITH CHECK (
      bucket_id = 'audio-files' AND
      owner = auth.uid()
    );
  END IF;
END $$;