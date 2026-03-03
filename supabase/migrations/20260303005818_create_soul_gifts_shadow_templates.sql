/*
  # 灵性礼物与阴影模板系统

  1. 新表
    - `totem_imagery`
      - 图腾意象库：20个图腾的原型意象和能量底色
      - `totem_id`: 图腾ID (1-20)
      - `totem_name_cn`: 图腾中文名
      - `archetype_imagery`: 原型意象（如"深海先知"、"风暴催化师"）
      - `energy_base_color`: 能量底色描述
      - `gift_template`: 灵性礼物模板
      - `shadow_imagery`: 阴影意象

    - `tone_dynamic_tension`
      - 调性行动张力：13个调性的动态特质
      - `tone_id`: 调性ID (1-13)
      - `tone_name_cn`: 调性中文名
      - `action_tension`: 行动张力描述
      - `gift_modifier`: 对灵性礼物的修饰
      - `shadow_trigger`: 阴影触发条件

  2. 安全策略
    - 启用 RLS
    - 允许公共读取
*/

-- 1. 创建图腾意象表
CREATE TABLE IF NOT EXISTS totem_imagery (
  totem_id INTEGER PRIMARY KEY CHECK (totem_id >= 1 AND totem_id <= 20),
  totem_name_cn TEXT NOT NULL,
  archetype_imagery TEXT NOT NULL,
  energy_base_color TEXT NOT NULL,
  gift_template TEXT NOT NULL,
  shadow_imagery TEXT NOT NULL
);

ALTER TABLE totem_imagery ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'totem_imagery' AND policyname = 'Allow public read access to totem imagery'
  ) THEN
    CREATE POLICY "Allow public read access to totem imagery"
      ON totem_imagery
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'totem_imagery' AND policyname = 'Allow insert for seeding totem imagery'
  ) THEN
    CREATE POLICY "Allow insert for seeding totem imagery"
      ON totem_imagery
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- 2. 创建调性动态张力表
CREATE TABLE IF NOT EXISTS tone_dynamic_tension (
  tone_id INTEGER PRIMARY KEY CHECK (tone_id >= 1 AND tone_id <= 13),
  tone_name_cn TEXT NOT NULL,
  action_tension TEXT NOT NULL,
  gift_modifier TEXT NOT NULL,
  shadow_trigger TEXT NOT NULL
);

ALTER TABLE tone_dynamic_tension ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tone_dynamic_tension' AND policyname = 'Allow public read access to tone tension'
  ) THEN
    CREATE POLICY "Allow public read access to tone tension"
      ON tone_dynamic_tension
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tone_dynamic_tension' AND policyname = 'Allow insert for seeding tone tension'
  ) THEN
    CREATE POLICY "Allow insert for seeding tone tension"
      ON tone_dynamic_tension
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;