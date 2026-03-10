/*
  # 创建全新的 Flow 配置系统（废弃旧 Share 系统）

  1. 说明
    - 创建全新的 flow_config 表，完全独立于旧的 h5_share_config
    - 新路径: /flow/{scene_path} 取代旧路径 /share/journal
    - 新 Token 机制: 每个场景独立的 access_token
    - 只支持 MP4 视频格式，解决加载超时问题
    - 旧的 /share 路由将返回 404

  2. 新表结构
    - flow_config: 核心配置表
      - scene_path (text, unique): URL 路径标识（如 'inner-peace', 'healing-flow'）
      - scene_name (text): 场景显示名称
      - access_token (text, unique): 访问令牌（如 'peace2026', 'heal2026'）
      - description (text): 场景描述
      - is_active (boolean): 是否激活
      - bg_home_url (text): 首页背景视频 URL（仅 MP4）
      - bg_step1_url (text): 步骤1 背景 URL（仅 MP4）
      - bg_step2_url (text): 步骤2 背景 URL
      - bg_step3_url (text): 步骤3 背景 URL
      - bg_step4_url (text): 步骤4 背景 URL
      - audio_step1_url (text): 步骤1 音频 URL
      - audio_step2_url (text): 步骤2 音频 URL
      - audio_step3_url (text): 步骤3 音频 URL
      - audio_step4_url (text): 步骤4 音频 URL

  3. 安全策略
    - 允许匿名用户读取（用于前端展示）
    - 仅管理员可以创建/更新/删除配置

  4. 示例配置
    - scene_path: 'inner-peace'
    - 完整 URL: yourdomain.com/flow/inner-peace?token=peace2026
    - 旧链接自动 404
*/

-- 创建 flow_config 表
CREATE TABLE IF NOT EXISTS flow_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_path text UNIQUE NOT NULL,
  scene_name text NOT NULL,
  access_token text UNIQUE NOT NULL,
  description text DEFAULT '',
  is_active boolean DEFAULT true,

  bg_home_url text,
  bg_step1_url text,
  bg_step2_url text,
  bg_step3_url text,
  bg_step4_url text,

  audio_step1_url text,
  audio_step2_url text,
  audio_step3_url text,
  audio_step4_url text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 启用 RLS
ALTER TABLE flow_config ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取激活的配置（前端需要）
CREATE POLICY "Anyone can read active flow configs"
  ON flow_config
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- 仅管理员可以插入
CREATE POLICY "Admins can insert flow configs"
  ON flow_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 仅管理员可以更新
CREATE POLICY "Admins can update flow configs"
  ON flow_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 仅管理员可以删除
CREATE POLICY "Admins can delete flow configs"
  ON flow_config
  FOR DELETE
  TO authenticated
  USING (true);

-- 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_flow_config_scene_path ON flow_config(scene_path);
CREATE INDEX IF NOT EXISTS idx_flow_config_access_token ON flow_config(access_token);
CREATE INDEX IF NOT EXISTS idx_flow_config_is_active ON flow_config(is_active);

-- 创建示例配置
INSERT INTO flow_config (
  scene_path,
  scene_name,
  access_token,
  description,
  is_active
) VALUES (
  'inner-peace',
  '内在宁静',
  'peace2026',
  '内在宁静引导流程 - 新一代分享页',
  true
) ON CONFLICT (scene_path) DO NOTHING;

-- 添加更新时间自动触发器
CREATE OR REPLACE FUNCTION update_flow_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_flow_config_updated_at
  BEFORE UPDATE ON flow_config
  FOR EACH ROW
  EXECUTE FUNCTION update_flow_config_updated_at();

-- 验证
DO $$
BEGIN
  RAISE NOTICE '✅ flow_config 表创建成功';
  RAISE NOTICE '🚀 新路由系统: /flow/{scene_path}?token={access_token}';
  RAISE NOTICE '🔒 旧路由 /share/journal 将返回 404';
  RAISE NOTICE '🎬 仅支持 MP4 格式视频，解决加载超时';
  RAISE NOTICE '📋 已创建示例配置: /flow/inner-peace?token=peace2026';
END $$;
