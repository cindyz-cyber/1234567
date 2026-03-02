/*
  # 修复波符表写入权限

  1. Changes
    - 添加管理员插入权限到 wavespells 表
    - 添加临时公开插入权限用于初始化数据注入
  
  2. Security
    - 保持公开读取权限
    - 添加管理员和临时公开插入权限
*/

-- 添加管理员插入权限
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'wavespells' 
    AND policyname = 'Admins can insert wavespells'
  ) THEN
    CREATE POLICY "Admins can insert wavespells"
      ON wavespells FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_profile
          WHERE user_profile.id = auth.uid()
          AND user_profile.is_admin = true
        )
      );
  END IF;
END $$;

-- 添加临时公开插入权限（用于数据注入）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'wavespells' 
    AND policyname = 'Temporary allow public insert for seeding'
  ) THEN
    CREATE POLICY "Temporary allow public insert for seeding"
      ON wavespells FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- 添加更新权限
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'wavespells' 
    AND policyname = 'Admins can update wavespells'
  ) THEN
    CREATE POLICY "Admins can update wavespells"
      ON wavespells FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profile
          WHERE user_profile.id = auth.uid()
          AND user_profile.is_admin = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_profile
          WHERE user_profile.id = auth.uid()
          AND user_profile.is_admin = true
        )
      );
  END IF;
END $$;
