/*
  # 声音能量种子库 (Voice Energy Prototype Library)

  1. 新表
    - `voice_energy_prototypes`
      - `id` (text, 主键) - 原型编号 (如 "000", "343", "432")
      - `name` (text) - 原型名称
      - `tag_name` (text) - 能量标签
      - `description` (text) - 物理定义与逻辑意义
      - `core_frequency` (integer) - 核心频率 (Hz)
      - `chakra_signature` (jsonb) - 7脉轮能量签名 (归一化0-1)
      - `harmonic_richness` (numeric) - 谐波丰盈度 (0-100%)
      - `phase_pattern` (text) - 能量相位模式 (grounded/floating/dispersed)
      - `quality_type` (text) - 声音质地 (smooth/rough/flat)
      - `somatic_sensation` (text) - 体感描述
      - `created_at` (timestamptz)

  2. 安全策略
    - 启用 RLS
    - 所有用户可读取原型数据
    - 仅管理员可修改原型数据
*/

CREATE TABLE IF NOT EXISTS voice_energy_prototypes (
  id text PRIMARY KEY,
  name text NOT NULL,
  tag_name text NOT NULL,
  description text NOT NULL,
  core_frequency integer NOT NULL,
  chakra_signature jsonb NOT NULL,
  harmonic_richness numeric(5,2) DEFAULT 0,
  phase_pattern text CHECK (phase_pattern IN ('grounded', 'floating', 'dispersed')) DEFAULT 'grounded',
  quality_type text CHECK (quality_type IN ('smooth', 'rough', 'flat')) DEFAULT 'smooth',
  somatic_sensation text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voice_energy_prototypes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view prototypes"
  ON voice_energy_prototypes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert prototypes"
  ON voice_energy_prototypes
  FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profile
      WHERE user_profile.is_admin = true
    )
  );

CREATE POLICY "Only admins can update prototypes"
  ON voice_energy_prototypes
  FOR UPDATE
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM user_profile
      WHERE user_profile.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profile
      WHERE user_profile.is_admin = true
    )
  );

CREATE POLICY "Only admins can delete prototypes"
  ON voice_energy_prototypes
  FOR DELETE
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM user_profile
      WHERE user_profile.is_admin = true
    )
  );

-- 插入三个核心原型
INSERT INTO voice_energy_prototypes (id, name, tag_name, description, core_frequency, chakra_signature, harmonic_richness, phase_pattern, quality_type, somatic_sensation)
VALUES
  (
    '000',
    'Cindy原型',
    '粉色·平衡的共振师',
    '物理定义：342Hz、384Hz、432Hz呈现1:1:1协和共振，具备极高瞬态稳定性。逻辑意义：系统基准原点，代表"心口意合一"的球形场能。',
    342,
    '{"root": 0.70, "sacral": 0.72, "solar": 0.75, "heart": 1.00, "throat": 0.95, "thirdEye": 0.98, "crown": 0.85}'::jsonb,
    95.00,
    'grounded',
    'smooth',
    '心口意合一，能量呈球形均衡分布，无阻滞感'
  ),
  (
    '343',
    '赵越原型',
    '粉色·全频道发光者',
    '物理定义：核心342Hz(心轮)极强，全频谱谐波丰盈度>90%。体感意义：线性穿透态，能量如透明管道，眼睛有亮感。',
    342,
    '{"root": 0.80, "sacral": 0.85, "solar": 0.88, "heart": 1.00, "throat": 0.92, "thirdEye": 0.90, "crown": 0.87}'::jsonb,
    92.00,
    'grounded',
    'smooth',
    '线性穿透态，能量如透明管道，眼睛有亮感，七轮全通'
  ),
  (
    '432',
    '卢先生原型',
    '紫色·逻辑过载的觉知者',
    '物理定义：核心432Hz(眉心轮)极强，能量相位呈升腾态。体感意义：思维活跃，能量集中于头部，需引导下行。',
    432,
    '{"root": 0.45, "sacral": 0.50, "solar": 0.60, "heart": 0.70, "throat": 0.75, "thirdEye": 1.00, "crown": 0.95}'::jsonb,
    78.00,
    'floating',
    'smooth',
    '思维极度活跃，能量集中头部，需引导能量下行扎根'
  )
ON CONFLICT (id) DO NOTHING;
