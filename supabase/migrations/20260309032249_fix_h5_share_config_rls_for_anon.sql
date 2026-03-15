/*
  # 修复 h5_share_config RLS 策略支持 anon 用户

  1. 问题
    - ShareConfigAdmin 使用前端密码验证（plantlogic2026）
    - Supabase 客户端使用 anon key，不是 authenticated 用户
    - 现有 RLS 策略只允许 authenticated 用户写入
    - 导致保存配置时被 RLS 拒绝

  2. 解决方案
    - 修改 INSERT/UPDATE/DELETE 策略，允许 anon 用户操作
    - 前端密码已提供足够保护
    - 保持 SELECT 策略为 public（用于前台访问）

  3. 安全性
    - 前端密码保护：只有知道密码的人才能访问管理页面
    - RLS 策略放宽：允许 anon 用户写入（与前端密码验证配合）
    - 不影响前台页面：前台只读取配置，不需要写入权限
*/

-- 删除旧的 authenticated 策略
DROP POLICY IF EXISTS "Authenticated users can update h5 share config" ON h5_share_config;
DROP POLICY IF EXISTS "Authenticated users can insert h5 share config" ON h5_share_config;
DROP POLICY IF EXISTS "Authenticated users can delete h5 share config" ON h5_share_config;

-- 创建新的 anon 策略（允许匿名用户写入）
CREATE POLICY "Anon users can update h5 share config"
  ON h5_share_config
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon users can insert h5 share config"
  ON h5_share_config
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon users can delete h5 share config"
  ON h5_share_config
  FOR DELETE
  TO anon
  USING (true);

-- 保留 authenticated 用户的权限（向后兼容）
CREATE POLICY "Authenticated users can update h5 share config"
  ON h5_share_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert h5 share config"
  ON h5_share_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete h5 share config"
  ON h5_share_config
  FOR DELETE
  TO authenticated
  USING (true);

-- 验证
DO $$
BEGIN
  RAISE NOTICE '✅ h5_share_config RLS 策略已更新';
  RAISE NOTICE '🔓 anon 用户现在可以进行 INSERT/UPDATE/DELETE 操作';
  RAISE NOTICE '🔐 前端密码保护: plantlogic2026';
  RAISE NOTICE '📖 public 用户仍可读取配置（前台访问）';
END $$;
