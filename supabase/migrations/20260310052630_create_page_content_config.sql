/*
  # 页面文案配置系统

  1. 新表 (New Tables)
    - `page_content_config`
      - `id` (uuid, primary key) - 配置 ID
      - `scene_token` (text, unique) - 场景标识，关联到 h5_share_config
      - `page_name` (text) - 页面名称（naming, home, emotion, journal 等）
      - `content_key` (text) - 内容键名（welcome_text, subtitle, button_text 等）
      - `content_value` (text) - 内容值
      - `description` (text) - 说明
      - `created_at` (timestamptz) - 创建时间
      - `updated_at` (timestamptz) - 更新时间

  2. 安全策略 (Security)
    - 启用 RLS
    - 允许匿名用户读取（用于引流页显示）
    - 仅管理员可以修改

  3. 索引
    - 为 scene_token + page_name + content_key 组合创建唯一索引
*/

-- 创建页面文案配置表
CREATE TABLE IF NOT EXISTS page_content_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_token text NOT NULL,
  page_name text NOT NULL,
  content_key text NOT NULL,
  content_value text NOT NULL DEFAULT '',
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- 确保每个场景的每个页面的每个内容键只有一条记录
  CONSTRAINT unique_scene_page_key UNIQUE (scene_token, page_name, content_key)
);

-- 启用 RLS
ALTER TABLE page_content_config ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户读取（引流页需要）
CREATE POLICY "Anyone can read page content"
  ON page_content_config
  FOR SELECT
  USING (true);

-- 允许所有人插入（用于后台管理，实际生产环境应该限制为管理员）
CREATE POLICY "Anyone can insert page content"
  ON page_content_config
  FOR INSERT
  WITH CHECK (true);

-- 允许所有人更新（用于后台管理，实际生产环境应该限制为管理员）
CREATE POLICY "Anyone can update page content"
  ON page_content_config
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_page_content_scene_page
  ON page_content_config(scene_token, page_name);

-- 创建触发器自动更新 updated_at
CREATE OR REPLACE FUNCTION update_page_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_page_content_updated_at ON page_content_config;
CREATE TRIGGER trigger_update_page_content_updated_at
  BEFORE UPDATE ON page_content_config
  FOR EACH ROW
  EXECUTE FUNCTION update_page_content_updated_at();

-- 插入默认文案配置（以 default 场景为例）
INSERT INTO page_content_config (scene_token, page_name, content_key, content_value, description)
VALUES
  -- 首页文案
  ('default', 'home', 'welcome_text', '亲爱的师兄们，大家好', '首页欢迎语'),
  ('default', 'home', 'subtitle', '欢迎来到觉察之旅', '首页副标题'),
  ('default', 'home', 'start_button', '开始今日觉察之旅', '开始按钮文字'),

  -- 起名页文案
  ('default', 'naming', 'title', '起名仪式', '起名页标题'),
  ('default', 'naming', 'name_label', '请输入您的姓名', '姓名输入框标签'),
  ('default', 'naming', 'birthdate_label', '请选择您的生日', '生日选择标签'),
  ('default', 'naming', 'next_button', '下一步', '下一步按钮文字'),

  -- 情绪扫描页文案
  ('default', 'emotion', 'title', '觉察此刻的情绪', '情绪扫描页标题'),
  ('default', 'emotion', 'subtitle', '选择你现在的感受', '情绪扫描页副标题'),
  ('default', 'emotion', 'next_button', '继续', '继续按钮文字'),

  -- 日记页文案
  ('default', 'journal', 'title', '内在的低语', '日记页标题'),
  ('default', 'journal', 'placeholder', '在此记录你内心深处的声音...', '文本框占位符'),
  ('default', 'journal', 'voice_hint', '点击喇叭开始语音输入', '语音输入提示'),
  ('default', 'journal', 'voice_listening', '🎤 正在聆听...', '聆听中提示'),
  ('default', 'journal', 'submit_button', '完成书写', '提交按钮文字'),

  -- 答案之书文案
  ('default', 'answer', 'title', '答案之书', '答案之书标题'),
  ('default', 'answer', 'subtitle', '你的高我为你准备了指引', '答案之书副标题'),
  ('default', 'answer', 'generate_button', '生成专属能量卡', '生成按钮文字'),

  -- 卡片文案
  ('default', 'card', 'title', '觉察时刻', '卡片标题'),
  ('default', 'card', 'journal_section_title', '我的觉察', '日记部分标题'),
  ('default', 'card', 'advice_section_title', '高我的指引', '建议部分标题'),
  ('default', 'card', 'footer_brand', '植本逻辑', '底部品牌名'),
  ('default', 'card', 'footer_tagline', '觉察 · 疗愈 · 成长', '底部标语'),
  ('default', 'card', 'share_hint', '✨ 你的专属能量卡已生成，请长按发送给微信好友', '分享提示'),
  ('default', 'card', 'close_button', '关闭', '关闭按钮'),
  ('default', 'card', 'restart_button', '开启新的觉察之旅', '重新开始按钮')

ON CONFLICT (scene_token, page_name, content_key)
DO UPDATE SET
  content_value = EXCLUDED.content_value,
  description = EXCLUDED.description,
  updated_at = now();

-- 添加注释
COMMENT ON TABLE page_content_config IS '页面文案配置表，支持多场景动态配置所有页面的文字内容';
COMMENT ON COLUMN page_content_config.scene_token IS '场景标识，关联到 h5_share_config 表';
COMMENT ON COLUMN page_content_config.page_name IS '页面名称（home, naming, emotion, journal, answer, card）';
COMMENT ON COLUMN page_content_config.content_key IS '内容键名（welcome_text, subtitle, button_text 等）';
COMMENT ON COLUMN page_content_config.content_value IS '实际显示的文字内容';
