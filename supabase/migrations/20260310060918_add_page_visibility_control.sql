/*
  # 页面可见性控制系统

  1. 新表 (New Tables)
    - `page_visibility_config`
      - `id` (uuid, primary key) - 配置 ID
      - `scene_token` (text) - 场景标识，关联到 h5_share_config
      - `page_name` (text) - 页面名称（naming, home, emotion, journal, dialogue, answer, card 等）
      - `is_visible` (boolean) - 是否显示该页面，默认 true
      - `created_at` (timestamptz) - 创建时间
      - `updated_at` (timestamptz) - 更新时间

  2. 安全策略 (Security)
    - 启用 RLS
    - 允许匿名用户读取（用于引流页判断）
    - 允许所有人修改（实际生产环境应限制为管理员）

  3. 索引
    - 为 scene_token + page_name 创建唯一索引
*/

-- 创建页面可见性配置表
CREATE TABLE IF NOT EXISTS page_visibility_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_token text NOT NULL,
  page_name text NOT NULL,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- 确保每个场景的每个页面只有一条记录
  CONSTRAINT unique_scene_page_visibility UNIQUE (scene_token, page_name)
);

-- 启用 RLS
ALTER TABLE page_visibility_config ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户读取（引流页需要判断页面是否可见）
CREATE POLICY "Anyone can read page visibility"
  ON page_visibility_config
  FOR SELECT
  USING (true);

-- 允许所有人插入（用于后台管理）
CREATE POLICY "Anyone can insert page visibility"
  ON page_visibility_config
  FOR INSERT
  WITH CHECK (true);

-- 允许所有人更新（用于后台管理）
CREATE POLICY "Anyone can update page visibility"
  ON page_visibility_config
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_page_visibility_scene_page
  ON page_visibility_config(scene_token, page_name);

-- 创建触发器自动更新 updated_at
CREATE OR REPLACE FUNCTION update_page_visibility_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_page_visibility_updated_at ON page_visibility_config;
CREATE TRIGGER trigger_update_page_visibility_updated_at
  BEFORE UPDATE ON page_visibility_config
  FOR EACH ROW
  EXECUTE FUNCTION update_page_visibility_updated_at();

-- 插入默认可见性配置（default 场景，所有页面默认可见）
INSERT INTO page_visibility_config (scene_token, page_name, is_visible)
VALUES
  ('default', 'naming', true),
  ('default', 'home', true),
  ('default', 'emotion', true),
  ('default', 'journal', true),
  ('default', 'dialogue', true),
  ('default', 'transition', true),
  ('default', 'answer', true),
  ('default', 'card', true)
ON CONFLICT (scene_token, page_name)
DO NOTHING;

-- 添加注释
COMMENT ON TABLE page_visibility_config IS '页面可见性配置表，控制引流页中各个步骤页面的显示/隐藏';
COMMENT ON COLUMN page_visibility_config.scene_token IS '场景标识，关联到 h5_share_config 表';
COMMENT ON COLUMN page_visibility_config.page_name IS '页面名称（naming, home, emotion, journal, dialogue, transition, answer, card）';
COMMENT ON COLUMN page_visibility_config.is_visible IS '是否显示该页面，false 则跳过该页面';
