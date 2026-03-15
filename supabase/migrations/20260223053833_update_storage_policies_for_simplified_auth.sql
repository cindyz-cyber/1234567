/*
  # Update Storage Policies for Simplified Authentication

  1. Changes
    - Drop old policies that require authenticated users
    - Create new policies that allow public uploads to guidance folder
    - Keep public read access
    - Allow public delete (since we don't have real auth)

  2. Security
    - This is a simplified auth model
    - In production, proper auth should be implemented
*/

DROP POLICY IF EXISTS "Authenticated users can upload audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own audio files" ON storage.objects;

CREATE POLICY "Allow uploads to guidance folder"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'audio-files' AND
  (storage.foldername(name))[1] = 'guidance'
);

CREATE POLICY "Allow deletes from audio-files bucket"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'audio-files');

CREATE POLICY "Allow updates in audio-files bucket"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'audio-files')
WITH CHECK (bucket_id = 'audio-files');