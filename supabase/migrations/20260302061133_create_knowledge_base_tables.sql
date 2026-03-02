/*
  # 植本逻辑全量知识库 - Single Source of Truth

  1. New Tables
    - `totems` (图腾表)
      - `id` (int, primary key) - 图腾编号 (1-20)
      - `name_cn` (text) - 中文名称
      - `name_en` (text) - 英文名称
      - `pineal_gland` (int) - 松果体频率
      - `throat_chakra` (int) - 喉轮频率
      - `operation_mode` (text) - 操作模式/风格
      - `core_keyword` (text) - 核心关键词
      - `description` (text) - 详细描述
      - `energy_signature` (text) - 能量签名
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `tones` (调性表)
      - `id` (int, primary key) - 调性编号 (1-13)
      - `name_cn` (text) - 中文名称
      - `name_en` (text) - 英文名称
      - `description` (text) - 核心描述
      - `energy_pattern` (text) - 能量模式
      - `life_strategy` (text) - 生命策略
      - `challenge` (text) - 挑战
      - `gift` (text) - 天赋
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `kin_definitions` (Kin定义表)
      - `kin_number` (int, primary key) - Kin编号 (1-260)
      - `totem_id` (int, foreign key) - 对应图腾
      - `tone_id` (int, foreign key) - 对应调性
      - `oracle_guide` (int) - 神谕指引Kin
      - `oracle_challenge` (int) - 神谕挑战Kin
      - `oracle_support` (int) - 神谕支持Kin
      - `oracle_hidden` (int) - 神谕隐藏Kin
      - `antipode` (int) - 反对极Kin
      - `analog` (int) - 类比Kin
      - `core_essence` (text) - 核心本质
      - `life_purpose` (text) - 生命目的
      - `shadow_work` (text) - 阴影功课
      - `integration_path` (text) - 整合路径
      - `quantum_signature` (jsonb) - 量子签名(包含共振频率等)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Indexes
    - Index on totem_id for fast lookup
    - Index on tone_id for fast lookup
    - Composite index on (totem_id, tone_id) for Kin calculation

  3. Security
    - Enable RLS on all tables
    - Public read access (knowledge base is read-only for all users)
    - Only admins can write/update
*/

-- Create totems table
CREATE TABLE IF NOT EXISTS totems (
  id int PRIMARY KEY CHECK (id >= 1 AND id <= 20),
  name_cn text NOT NULL,
  name_en text NOT NULL,
  pineal_gland int NOT NULL CHECK (pineal_gland >= 0 AND pineal_gland <= 100),
  throat_chakra int NOT NULL CHECK (throat_chakra >= 0 AND throat_chakra <= 100),
  operation_mode text NOT NULL,
  core_keyword text NOT NULL,
  description text NOT NULL DEFAULT '',
  energy_signature text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tones table
CREATE TABLE IF NOT EXISTS tones (
  id int PRIMARY KEY CHECK (id >= 1 AND id <= 13),
  name_cn text NOT NULL,
  name_en text NOT NULL,
  description text NOT NULL,
  energy_pattern text NOT NULL DEFAULT '',
  life_strategy text NOT NULL DEFAULT '',
  challenge text NOT NULL DEFAULT '',
  gift text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create kin_definitions table
CREATE TABLE IF NOT EXISTS kin_definitions (
  kin_number int PRIMARY KEY CHECK (kin_number >= 1 AND kin_number <= 260),
  totem_id int NOT NULL REFERENCES totems(id),
  tone_id int NOT NULL REFERENCES tones(id),
  oracle_guide int CHECK (oracle_guide >= 1 AND oracle_guide <= 260),
  oracle_challenge int CHECK (oracle_challenge >= 1 AND oracle_challenge <= 260),
  oracle_support int CHECK (oracle_support >= 1 AND oracle_support <= 260),
  oracle_hidden int CHECK (oracle_hidden >= 1 AND oracle_hidden <= 260),
  antipode int CHECK (antipode >= 1 AND antipode <= 260),
  analog int CHECK (analog >= 1 AND analog <= 260),
  core_essence text NOT NULL DEFAULT '',
  life_purpose text NOT NULL DEFAULT '',
  shadow_work text NOT NULL DEFAULT '',
  integration_path text NOT NULL DEFAULT '',
  quantum_signature jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_kin_totem ON kin_definitions(totem_id);
CREATE INDEX IF NOT EXISTS idx_kin_tone ON kin_definitions(tone_id);
CREATE INDEX IF NOT EXISTS idx_kin_composite ON kin_definitions(totem_id, tone_id);

-- Enable RLS
ALTER TABLE totems ENABLE ROW LEVEL SECURITY;
ALTER TABLE tones ENABLE ROW LEVEL SECURITY;
ALTER TABLE kin_definitions ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public can read totems"
  ON totems FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read tones"
  ON tones FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read kin definitions"
  ON kin_definitions FOR SELECT
  TO public
  USING (true);

-- Admin insert policies
CREATE POLICY "Admins can insert totems"
  ON totems FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profile
      WHERE user_profile.id = auth.uid()
      AND user_profile.is_admin = true
    )
  );

CREATE POLICY "Admins can update totems"
  ON totems FOR UPDATE
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

CREATE POLICY "Admins can insert tones"
  ON tones FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profile
      WHERE user_profile.id = auth.uid()
      AND user_profile.is_admin = true
    )
  );

CREATE POLICY "Admins can update tones"
  ON tones FOR UPDATE
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

CREATE POLICY "Admins can insert kin definitions"
  ON kin_definitions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profile
      WHERE user_profile.id = auth.uid()
      AND user_profile.is_admin = true
    )
  );

CREATE POLICY "Admins can update kin definitions"
  ON kin_definitions FOR UPDATE
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
