/*
  # 临时允许公开写入以便数据填充

  允许所有用户写入totems, tones, kin_definitions表以便数据填充
*/

DROP POLICY IF EXISTS "Admins can insert totems" ON totems;
DROP POLICY IF EXISTS "Admins can update totems" ON totems;
DROP POLICY IF EXISTS "Admins can insert tones" ON tones;
DROP POLICY IF EXISTS "Admins can update tones" ON tones;
DROP POLICY IF EXISTS "Admins can insert kin definitions" ON kin_definitions;
DROP POLICY IF EXISTS "Admins can update kin definitions" ON kin_definitions;

CREATE POLICY "Public can insert totems"
  ON totems FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update totems"
  ON totems FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can insert tones"
  ON tones FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update tones"
  ON tones FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can insert kin definitions"
  ON kin_definitions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update kin definitions"
  ON kin_definitions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
