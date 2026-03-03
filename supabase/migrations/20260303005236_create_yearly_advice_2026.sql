/*
  # 2026 白风年频率对齐建议系统

  1. 新表
    - `yearly_advice_2026_totems`
      - `totem_id` (1-20): 图腾ID
      - `totem_name_cn`: 图腾中文名
      - `core_challenge`: 核心避坑
      - `manifestation_path`: 显化路径
      - `action_verb`: 动作指令
      - `frequency_type`: 频率类型（收敛型/放射型）

    - `yearly_advice_2026_throat_templates`
      - `throat_range`: 喉轮分值区间（high/medium/low）
      - `min_percentage`: 最小百分比
      - `max_percentage`: 最大百分比
      - `archetype`: 原型名称（威权转化型/定频输出型/沉默觉醒型）
      - `advice_template`: 建议模板
      - `action_template`: 动作模板

    - `yearly_advice_2026_tone_modifiers`
      - `tone_id` (1-13): 调性ID
      - `tone_type`: 调性类型（收敛型/放射型）
      - `yearly_lesson`: 年度课题

  2. 安全策略
    - 启用 RLS
    - 允许公共读取（年度建议是公开知识）
*/

-- 1. 创建图腾特定建议表
CREATE TABLE IF NOT EXISTS yearly_advice_2026_totems (
  totem_id INTEGER PRIMARY KEY CHECK (totem_id >= 1 AND totem_id <= 20),
  totem_name_cn TEXT NOT NULL,
  core_challenge TEXT NOT NULL,
  manifestation_path TEXT NOT NULL,
  action_verb TEXT NOT NULL,
  frequency_type TEXT NOT NULL CHECK (frequency_type IN ('收敛型', '放射型', '平衡型'))
);

ALTER TABLE yearly_advice_2026_totems ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'yearly_advice_2026_totems' AND policyname = 'Allow public read access to 2026 totem advice'
  ) THEN
    CREATE POLICY "Allow public read access to 2026 totem advice"
      ON yearly_advice_2026_totems
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'yearly_advice_2026_totems' AND policyname = 'Allow insert for seeding 2026 totem advice'
  ) THEN
    CREATE POLICY "Allow insert for seeding 2026 totem advice"
      ON yearly_advice_2026_totems
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- 2. 创建喉轮分值模板表
CREATE TABLE IF NOT EXISTS yearly_advice_2026_throat_templates (
  id SERIAL PRIMARY KEY,
  throat_range TEXT NOT NULL CHECK (throat_range IN ('high', 'medium', 'low')),
  min_percentage INTEGER NOT NULL,
  max_percentage INTEGER NOT NULL,
  archetype TEXT NOT NULL,
  advice_template TEXT NOT NULL,
  action_template TEXT NOT NULL,
  prefix_modifier TEXT
);

ALTER TABLE yearly_advice_2026_throat_templates ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'yearly_advice_2026_throat_templates' AND policyname = 'Allow public read access to throat templates'
  ) THEN
    CREATE POLICY "Allow public read access to throat templates"
      ON yearly_advice_2026_throat_templates
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'yearly_advice_2026_throat_templates' AND policyname = 'Allow insert for seeding throat templates'
  ) THEN
    CREATE POLICY "Allow insert for seeding throat templates"
      ON yearly_advice_2026_throat_templates
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- 3. 创建调性修正逻辑表
CREATE TABLE IF NOT EXISTS yearly_advice_2026_tone_modifiers (
  tone_id INTEGER PRIMARY KEY CHECK (tone_id >= 1 AND tone_id <= 13),
  tone_name_cn TEXT NOT NULL,
  tone_type TEXT NOT NULL CHECK (tone_type IN ('收敛型', '放射型', '平衡型')),
  yearly_lesson TEXT NOT NULL
);

ALTER TABLE yearly_advice_2026_tone_modifiers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'yearly_advice_2026_tone_modifiers' AND policyname = 'Allow public read access to tone modifiers'
  ) THEN
    CREATE POLICY "Allow public read access to tone modifiers"
      ON yearly_advice_2026_tone_modifiers
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'yearly_advice_2026_tone_modifiers' AND policyname = 'Allow insert for seeding tone modifiers'
  ) THEN
    CREATE POLICY "Allow insert for seeding tone modifiers"
      ON yearly_advice_2026_tone_modifiers
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;