/*
  # 创建量子共振模式表

  1. 新表
    - `quantum_resonance_patterns` - 量子共振关系模式（基于Kin差值）
      - `id` (uuid, primary key)
      - `kin_delta` (int) - Kin差值（0-130）
      - `type` (text) - 关系类型标识符
      - `label` (text) - 关系中文标签
      - `description` (text) - 关系描述
      - `energy_boost` (jsonb) - 能量加成
      - `created_at` (timestamptz)

  2. 安全
    - 启用 RLS
    - 允许公开读取
*/

-- 创建量子共振模式表
CREATE TABLE IF NOT EXISTS quantum_resonance_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kin_delta int NOT NULL UNIQUE,
  type text NOT NULL,
  label text NOT NULL,
  description text NOT NULL,
  energy_boost jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- 启用 RLS
ALTER TABLE quantum_resonance_patterns ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "Allow public read access to quantum resonance patterns"
  ON quantum_resonance_patterns
  FOR SELECT
  TO public
  USING (true);

-- 允许匿名写入（用于数据注入）
CREATE POLICY "Allow public insert for seeding"
  ON quantum_resonance_patterns
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 注入核心量子共振模式数据
-- 差值1: 已在代码中硬编码为母体灌溉
-- 差值130: 已在代码中硬编码为生命磨刀石
-- 以下为其他常见差值的关系定义

-- 差值2: 相邻共振
INSERT INTO quantum_resonance_patterns (kin_delta, type, label, description, energy_boost) VALUES
(2, 'adjacent', '相邻共振', '你们在能量光谱上紧密相邻，能够快速理解彼此的频率。这种关系适合日常陪伴与支持，能量流动自然而平稳。', '{"throat": 5, "heart": 8}');

-- 差值10: 同色族共振
INSERT INTO quantum_resonance_patterns (kin_delta, type, label, description, energy_boost) VALUES
(10, 'color_kin', '同色族共振', '你们属于同一个图腾色族，拥有相似的能量振动模式。这种连接让你们在表达方式和价值观上产生天然的共鸣。', '{"throat": 10, "heart": 5}');

-- 差值13: 波符跳跃
INSERT INTO quantum_resonance_patterns (kin_delta, type, label, description, energy_boost) VALUES
(13, 'wavespell_jump', '波符跳跃', '你们处于不同但相邻的13天波符中，能量模式既有差异又有连接。这种关系能带来新鲜感与互补性。', '{"throat": 3, "pineal": 7}');

-- 差值20: 调性共振
INSERT INTO quantum_resonance_patterns (kin_delta, type, label, description, energy_boost) VALUES
(20, 'tone_resonance', '调性共振', '你们拥有相同的图腾但不同的调性，形成"同根异枝"的关系。彼此能深刻理解对方的本质，但表达方式各异。', '{"heart": 10, "pineal": 5}');

-- 差值26: 和声共振
INSERT INTO quantum_resonance_patterns (kin_delta, type, label, description, energy_boost) VALUES
(26, 'harmonic', '和声共振', '你们的Kin形成和谐的能量比例，如同音乐中的和弦。这种关系能创造美好的协作体验，适合共同创造。', '{"throat": 7, "heart": 7, "pineal": 3}');

-- 差值52: 倍频共振
INSERT INTO quantum_resonance_patterns (kin_delta, type, label, description, energy_boost) VALUES
(52, 'double_harmonic', '倍频共振', '你们的能量频率形成2倍关系，能够在更高层次上产生共鸣。这种连接适合深度精神交流与灵性探索。', '{"pineal": 12, "throat": 5}');

-- 差值65: 中点共振
INSERT INTO quantum_resonance_patterns (kin_delta, type, label, description, energy_boost) VALUES
(65, 'midpoint', '中点共振', '你们处于半圆的对称位置，形成平衡而稳定的能量场。这种关系能带来互补性与整体感。', '{"heart": 8, "pineal": 8}');

-- 其他常见差值（使用通用模板）
INSERT INTO quantum_resonance_patterns (kin_delta, type, label, description, energy_boost) VALUES
(3, 'support', '支持共振', '你们之间形成稳定的支持关系，能够在需要时互相依靠。这种连接温和而持久。', '{"heart": 6, "throat": 4}'),
(5, 'guide', '引导共振', '你们之间存在微妙的引导关系，一方的经验能启发另一方的成长。', '{"pineal": 8, "throat": 5}'),
(7, 'mirror', '镜像共振', '你们彼此映照出对方未曾察觉的特质，如同一面灵魂之镜。', '{"pineal": 7, "heart": 6}'),
(11, 'catalyst', '催化共振', '你们的相遇能激发彼此的潜能，产生1+1>2的化学反应。', '{"throat": 8, "pineal": 7}'),
(17, 'evolution', '进化共振', '你们的关系推动彼此向更高意识进化，这是一种成长型的连接。', '{"pineal": 10, "heart": 5}'),
(22, 'wisdom', '智慧共振', '你们之间能够交流深层的智慧与洞见，彼此是对方的灵性导师。', '{"pineal": 12, "throat": 6}'),
(33, 'mystic', '神秘共振', '你们的连接带有神秘的特质，能共同探索未知的领域。', '{"pineal": 15, "heart": 5}'),
(43, 'creative', '创造共振', '你们的能量结合能激发强大的创造力，适合共同完成创意项目。', '{"throat": 10, "pineal": 8, "heart": 5}'),
(50, 'foundation', '基础共振', '你们的关系为彼此提供稳固的根基，能够长期互相支持。', '{"heart": 10, "throat": 5}'),
(78, 'transcendent', '超越共振', '你们的连接超越常规模式，能共同体验非凡的意识状态。', '{"pineal": 18, "heart": 7}'),
(108, 'cosmic', '宇宙共振', '你们形成接近对冲但又不完全对立的关系，带来深刻的张力与突破。', '{"pineal": 15, "heart": -5, "throat": 10}');