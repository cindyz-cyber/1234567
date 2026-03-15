/*
  # 添加场景化配置支持（单页面、多场景）

  1. 说明
    - 将 h5_share_config 从单行配置升级为多场景配置
    - 添加 scene_token 字段作为场景唯一标识
    - 支持通过 URL 参数 ?scene=A 动态加载对应配置
    - 保持向后兼容：默认场景使用 scene_token='default'
  
  2. 新增字段
    - scene_token (text, unique): 场景唯一标识符（如 'A', 'B', 'zen', 'healing'）
    - scene_name (text): 场景显示名称（如 '禅意疗愈', '能量唤醒'）
    - description (text): 场景描述
  
  3. 数据迁移
    - 将现有单行配置标记为 'default' 场景
    - 保持所有现有配置不变
  
  4. 索引优化
    - 为 scene_token 创建唯一索引，优化查询性能
*/

-- 添加新字段
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'h5_share_config' AND column_name = 'scene_token'
  ) THEN
    ALTER TABLE h5_share_config ADD COLUMN scene_token text NOT NULL DEFAULT 'default';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'h5_share_config' AND column_name = 'scene_name'
  ) THEN
    ALTER TABLE h5_share_config ADD COLUMN scene_name text NOT NULL DEFAULT '默认场景';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'h5_share_config' AND column_name = 'description'
  ) THEN
    ALTER TABLE h5_share_config ADD COLUMN description text DEFAULT '';
  END IF;
END $$;

-- 更新现有配置为默认场景
UPDATE h5_share_config
SET 
  scene_token = 'default',
  scene_name = '默认场景',
  description = '通用引流页配置'
WHERE scene_token = 'default' OR scene_token IS NULL;

-- 创建唯一索引
DROP INDEX IF EXISTS idx_h5_share_config_scene_token;
CREATE UNIQUE INDEX idx_h5_share_config_scene_token ON h5_share_config(scene_token);

-- 更新 RLS 策略，允许公开插入新场景（用于后台管理）
DROP POLICY IF EXISTS "Authenticated users can insert h5 share config" ON h5_share_config;
CREATE POLICY "Authenticated users can insert h5 share config"
  ON h5_share_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 允许删除场景配置
DROP POLICY IF EXISTS "Authenticated users can delete h5 share config" ON h5_share_config;
CREATE POLICY "Authenticated users can delete h5 share config"
  ON h5_share_config
  FOR DELETE
  TO authenticated
  USING (true);

-- 验证
DO $$
BEGIN
  RAISE NOTICE '✅ h5_share_config 表已升级为多场景配置模式';
  RAISE NOTICE '📋 新增字段: scene_token (唯一标识), scene_name (显示名称), description (描述)';
  RAISE NOTICE '🔍 已创建唯一索引: idx_h5_share_config_scene_token';
  RAISE NOTICE '🔐 已更新 RLS 策略: 支持增删改查多场景配置';
END $$;
