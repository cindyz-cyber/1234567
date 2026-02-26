/*
  # 动态样本上传与持续学习系统

  1. 新增表
    - `sample_uploads` - 存储新上传的真实校准样本
      - `id` (uuid, primary key) - 样本唯一标识
      - `sample_name` (text) - 样本名称
      - `audio_url` (text) - 音频文件URL
      - `chakra_signature` (jsonb) - 脉轮能量签名
      - `core_frequency` (integer) - 核心频率
      - `phase_pattern` (text) - 相位模式
      - `quality_type` (text) - 纹理质地
      - `tag_name` (text) - 生成的标签名
      - `description` (text) - 描述
      - `color` (text) - 色彩编码
      - `advice` (text) - 个性化建议
      - `organs` (text) - 脏腑对应
      - `do_list` (jsonb) - 建议做列表
      - `dont_list` (jsonb) - 避免做列表
      - `recharge_hz` (integer) - 充电频率
      - `is_promoted_to_anchor` (boolean) - 是否已提升为锚点
      - `upload_source` (text) - 上传来源
      - `created_at` (timestamptz) - 创建时间
      - `created_by` (uuid) - 创建者ID

  2. 安全策略
    - 仅管理员可以上传样本
    - 所有认证用户可以查看样本
    - 管理员可以将样本提升为锚点原型

  3. 功能说明
    - 支持真实样本动态上传
    - 自动计算能量特征
    - 可选提升为系统锚点
*/

CREATE TABLE IF NOT EXISTS sample_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_name text NOT NULL,
  audio_url text,
  chakra_signature jsonb NOT NULL,
  core_frequency integer NOT NULL,
  phase_pattern text NOT NULL CHECK (phase_pattern IN ('grounded', 'floating', 'dispersed')),
  quality_type text NOT NULL CHECK (quality_type IN ('smooth', 'rough', 'flat')),
  tag_name text NOT NULL,
  description text,
  color text DEFAULT '#FFFFFF',
  advice text,
  organs text,
  do_list jsonb DEFAULT '[]'::jsonb,
  dont_list jsonb DEFAULT '[]'::jsonb,
  recharge_hz integer,
  is_promoted_to_anchor boolean DEFAULT false,
  upload_source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE sample_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can insert samples"
  ON sample_uploads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profile
      WHERE user_profile.id = auth.uid()
      AND user_profile.is_admin = true
    )
  );

CREATE POLICY "Admins can update samples"
  ON sample_uploads
  FOR UPDATE
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

CREATE POLICY "All authenticated users can view samples"
  ON sample_uploads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete samples"
  ON sample_uploads
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profile
      WHERE user_profile.id = auth.uid()
      AND user_profile.is_admin = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_sample_uploads_core_frequency ON sample_uploads(core_frequency);
CREATE INDEX IF NOT EXISTS idx_sample_uploads_is_promoted ON sample_uploads(is_promoted_to_anchor);
CREATE INDEX IF NOT EXISTS idx_sample_uploads_created_at ON sample_uploads(created_at DESC);
