/*
  # 创建多维语感叙事引擎资料库

  1. 新表
    - `chakra_narrative_templates` - 脉轮叙事模板（三段梯度）
      - `center_name` (text) - 能量中心名称
      - `tier` (text) - 分值梯度 (high/medium/low)
      - `keywords` (text[]) - 关键词库
      - `templates` (text[]) - 描述模板库
      
    - `tone_dynamics` - 调性动态动词库
      - `tone_number` (int) - 调性编号 (1-13)
      - `color_temperature` (text) - 色温 (cold/warm)
      - `verbs` (text[]) - 动词库
      - `adjectives` (text[]) - 形容词库
      
    - `quantum_synergy_bursts` - 量子共振爆发短句
      - `synergy_code` (int) - 共振代码 (如 261, 130)
      - `relationship_type` (text) - 关系类型
      - `burst_templates` (text[]) - 爆发式短句模板
      
    - `wind_year_ambient` - 2026白风年环境音意象
      - `context` (text) - 上下文（喉轮专属）
      - `imagery` (text[]) - 意象库

  2. 安全性
    - 启用 RLS
    - 允许所有人读取
    - 允许公开写入（用于数据注入）
*/

-- 脉轮叙事模板表
CREATE TABLE IF NOT EXISTS chakra_narrative_templates (
  id serial PRIMARY KEY,
  center_name text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('high', 'medium', 'low')),
  keywords text[] NOT NULL,
  templates text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(center_name, tier)
);

ALTER TABLE chakra_narrative_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许所有人读取脉轮叙事"
  ON chakra_narrative_templates FOR SELECT TO public USING (true);

CREATE POLICY "允许公开写入脉轮叙事"
  ON chakra_narrative_templates FOR INSERT TO public WITH CHECK (true);

-- 调性动态动词表
CREATE TABLE IF NOT EXISTS tone_dynamics (
  tone_number int PRIMARY KEY CHECK (tone_number >= 1 AND tone_number <= 13),
  color_temperature text NOT NULL CHECK (color_temperature IN ('cold', 'warm')),
  verbs text[] NOT NULL,
  adjectives text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tone_dynamics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许所有人读取调性动词"
  ON tone_dynamics FOR SELECT TO public USING (true);

CREATE POLICY "允许公开写入调性动词"
  ON tone_dynamics FOR INSERT TO public WITH CHECK (true);

-- 量子共振爆发短句表
CREATE TABLE IF NOT EXISTS quantum_synergy_bursts (
  synergy_code int PRIMARY KEY,
  relationship_type text NOT NULL,
  burst_templates text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quantum_synergy_bursts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许所有人读取共振短句"
  ON quantum_synergy_bursts FOR SELECT TO public USING (true);

CREATE POLICY "允许公开写入共振短句"
  ON quantum_synergy_bursts FOR INSERT TO public WITH CHECK (true);

-- 白风年环境音表
CREATE TABLE IF NOT EXISTS wind_year_ambient (
  id serial PRIMARY KEY,
  context text NOT NULL,
  imagery text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wind_year_ambient ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许所有人读取环境音"
  ON wind_year_ambient FOR SELECT TO public USING (true);

CREATE POLICY "允许公开写入环境音"
  ON wind_year_ambient FOR INSERT TO public WITH CHECK (true);

-- ========================================
-- 注入脉轮叙事模板数据
-- ========================================

-- 松果体（高分段）
INSERT INTO chakra_narrative_templates (center_name, tier, keywords, templates) VALUES
('松果体', 'high', 
  ARRAY['天生雷达', '通透本能', '高维天线', '不假思索的破译', '全频开启', '深空探测器', '瞬间破译'],
  ARRAY[
    '你的松果体呈现出一种"近乎透明的本能"，像是一台高维天线，能瞬间捕捉到环境中的微弱共振。',
    '由于{percentage}%的极高开启度，你的直觉像是一台永不关机的深空探测器，能瞬间破译复杂的逻辑迷雾。',
    '天生的雷达系统，全频开启。你的松果体能够不假思索地接收到来自更高维度的信息流。'
  ]
)
ON CONFLICT (center_name, tier) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  templates = EXCLUDED.templates;

-- 松果体（中分段）
INSERT INTO chakra_narrative_templates (center_name, tier, keywords, templates) VALUES
('松果体', 'medium', 
  ARRAY['逻辑支撑', '定频输出', '审慎表达', '有边界的共鸣', '精密定频模式', '筛选后的洞察'],
  ARRAY[
    '你的松果体属于"精密定频模式"，所有的直觉都经过逻辑的筛选，呈现出一种稳健而有力量的洞察。',
    '定频稳健的感知力，你的灵感不会盲目迸发，而是在理智的审核后精准释放。',
    '{percentage}%的开启度让你保持着审慎而清醒的直觉边界，既能接收信息，又不会被淹没。'
  ]
)
ON CONFLICT (center_name, tier) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  templates = EXCLUDED.templates;

-- 松果体（低分段）
INSERT INTO chakra_narrative_templates (center_name, tier, keywords, templates) VALUES
('松果体', 'low', 
  ARRAY['铁甲温柔', '隔离观测', '逻辑性关怀', '深埋的火山', '沉重原则', '冰霜外壳'],
  ARRAY[
    '你的松果体处于"隔离保护状态"，外表覆盖着理智的冰霜，实则包裹着极度纯粹且讲究原则的内核。',
    '深埋的直觉火山，表面是清冷的逻辑观测者，内部却沸腾着不可妥协的真理追求。',
    '{percentage}%的低开启度意味着你的灵感被严密保护，只在绝对安全时才会显露。'
  ]
)
ON CONFLICT (center_name, tier) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  templates = EXCLUDED.templates;

-- 心轮（高分段）
INSERT INTO chakra_narrative_templates (center_name, tier, keywords, templates) VALUES
('心轮', 'high', 
  ARRAY['天生雷达', '通透本能', '无条件共振', '情感洪流', '全频开启'],
  ARRAY[
    '你的心轮呈现出一种"近乎透明的本能"，像是一台高维天线，能瞬间捕捉到他人情绪中的微弱共振。',
    '{percentage}%的极高开启度让你成为情感的放大器，能够无条件地接纳并转化周围的能量场。',
    '全频开启的爱之雷达，你的心轮像是一个不设防的共振腔，天生就知道如何与他人的灵魂对频。'
  ]
)
ON CONFLICT (center_name, tier) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  templates = EXCLUDED.templates;

-- 心轮（中分段）
INSERT INTO chakra_narrative_templates (center_name, tier, keywords, templates) VALUES
('心轮', 'medium', 
  ARRAY['逻辑支撑', '定频输出', '有边界的共鸣', '审慎的慈悲', '稳健释放'],
  ARRAY[
    '你的心轮属于"精密定频模式"，所有的爱都经过逻辑的筛选，呈现出一种稳健而有力量的输出。',
    '{percentage}%的开启度让你在付出与保护之间找到平衡，既能给予温暖，又不会耗竭自己。',
    '有边界的共鸣者，你的爱不盲目，不泛滥，而是精准地流向值得的对象。'
  ]
)
ON CONFLICT (center_name, tier) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  templates = EXCLUDED.templates;

-- 心轮（低分段）
INSERT INTO chakra_narrative_templates (center_name, tier, keywords, templates) VALUES
('心轮', 'low', 
  ARRAY['铁甲温柔', '隔离观测', '逻辑性关怀', '深埋的火山', '沉重原则'],
  ARRAY[
    '铁甲温柔模式。由于{percentage}%的清冷属性，你的爱呈现出一种"逻辑性关怀"，以理智的隔离来保护最纯粹的慈悲内核。',
    '你的心轮处于"隔离保护状态"，外表覆盖着理智的冰霜，实则包裹着极度纯粹且讲究原则的情感。',
    '深埋的情感火山，只对通过严格筛选的对象开启，一旦打开便是灼热而忠诚的。'
  ]
)
ON CONFLICT (center_name, tier) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  templates = EXCLUDED.templates;

-- 喉轮（高分段）
INSERT INTO chakra_narrative_templates (center_name, tier, keywords, templates) VALUES
('喉轮', 'high', 
  ARRAY['天生雷达', '通透本能', '频率传播者', '言语自带共振', '不假思索的表达'],
  ARRAY[
    '你的喉轮呈现出一种"近乎透明的本能"，言语自带频率，能像微风般穿透人心。',
    '{percentage}%的极高开启度让你成为天生的频率传播者，每一句话都能精准共振听众的灵魂。',
    '全频开启的表达者，你的声音像是灵性的载波，不假思索却总能击中要害。'
  ]
)
ON CONFLICT (center_name, tier) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  templates = EXCLUDED.templates;

-- 喉轮（中分段）
INSERT INTO chakra_narrative_templates (center_name, tier, keywords, templates) VALUES
('喉轮', 'medium', 
  ARRAY['逻辑支撑', '定频输出', '审慎表达', '有边界的传播', '筛选后的语言'],
  ARRAY[
    '你的喉轮属于"精密定频模式"，所有的表达都经过逻辑的筛选，呈现出一种稳健而有力量的输出。',
    '{percentage}%的开启度让你在倾听与表达之间保持平衡，不轻易发声，但每次开口都有分量。',
    '有边界的传播者，你的语言不泛滥，不迎合，而是精准地传递你想要表达的核心。'
  ]
)
ON CONFLICT (center_name, tier) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  templates = EXCLUDED.templates;

-- 喉轮（低分段）
INSERT INTO chakra_narrative_templates (center_name, tier, keywords, templates) VALUES
('喉轮', 'low', 
  ARRAY['铁甲温柔', '隔离观测', '静默的思考者', '深埋的火山', '内部呼吸'],
  ARRAY[
    '你的喉轮处于"隔离保护状态"，外表是静默的思考者，所有的灵感都在内部呼吸中自我消化。',
    '{percentage}%的低开启度意味着你的表达被严密保护，语言只是冰山一角，真正的洞察埋藏在沉默深处。',
    '深埋的表达火山，表面的冷静只是保护机制，内部的思考比任何人都更加激烈和深刻。'
  ]
)
ON CONFLICT (center_name, tier) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  templates = EXCLUDED.templates;
