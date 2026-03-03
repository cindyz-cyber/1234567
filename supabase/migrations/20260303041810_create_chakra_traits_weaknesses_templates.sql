/*
  # 创建脉轮特质和弱点动态模板系统

  1. 新表
    - `chakra_traits_templates` - 脉轮特质模板（基于分数范围）
      - `id` (uuid, primary key)
      - `chakra_name` (text) - 脉轮名称：喉轮/心轮/松果体
      - `score_range` (text) - 分数范围：high/medium/low
      - `min_score` (int) - 最小分数
      - `max_score` (int) - 最大分数
      - `trait_template` (text) - 特质模板
      - `created_at` (timestamptz)

    - `chakra_weaknesses_templates` - 脉轮弱点模板（基于分数范围）
      - `id` (uuid, primary key)
      - `chakra_name` (text) - 脉轮名称
      - `score_range` (text) - 分数范围
      - `min_score` (int) - 最小分数
      - `max_score` (int) - 最大分数
      - `weakness_template` (text) - 弱点模板
      - `created_at` (timestamptz)

  2. 安全
    - 启用 RLS
    - 允许公开读取（用于动态生成）
*/

-- 创建特质模板表
CREATE TABLE IF NOT EXISTS chakra_traits_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chakra_name text NOT NULL,
  score_range text NOT NULL CHECK (score_range IN ('high', 'medium', 'low')),
  min_score int NOT NULL,
  max_score int NOT NULL,
  trait_template text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 创建弱点模板表
CREATE TABLE IF NOT EXISTS chakra_weaknesses_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chakra_name text NOT NULL,
  score_range text NOT NULL CHECK (score_range IN ('high', 'medium', 'low')),
  min_score int NOT NULL,
  max_score int NOT NULL,
  weakness_template text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 启用 RLS
ALTER TABLE chakra_traits_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE chakra_weaknesses_templates ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "Allow public read access to traits templates"
  ON chakra_traits_templates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to weaknesses templates"
  ON chakra_weaknesses_templates
  FOR SELECT
  TO public
  USING (true);

-- 允许匿名写入（用于数据注入）
CREATE POLICY "Allow public insert for seeding traits"
  ON chakra_traits_templates
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public insert for seeding weaknesses"
  ON chakra_weaknesses_templates
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 插入喉轮特质模板
INSERT INTO chakra_traits_templates (chakra_name, score_range, min_score, max_score, trait_template) VALUES
('喉轮', 'high', 80, 100, '你的喉轮天生强大，言语具有穿透力和磁性，能够快速将内在洞见转化为精准的表达。你的声音是你的力量源泉，天生擅长通过语言影响和启发他人。'),
('喉轮', 'medium', 60, 79, '你的喉轮处于平衡状态，既能表达又懂倾听。你的沟通风格温和而有力，能够在保持真实的同时照顾他人感受。你正在学习如何在表达与静默之间找到平衡。'),
('喉轮', 'low', 0, 59, '你的喉轮正在觉醒中，你的真实声音还未完全释放。你可能习惯压抑自己的表达，或在需要发声时感到喉咙紧锁。2026白风年将是你学习释放声音的关键时期。');

INSERT INTO chakra_traits_templates (chakra_name, score_range, min_score, max_score, trait_template) VALUES
('心轮', 'high', 80, 100, '你的心轮天生开放，拥有强烈的同理心和博爱精神。你能够深刻感受他人情绪，天然的慈悲心驱使你帮助和疗愈他人。你的心是一个能量场，能够吸引和安抚周围的人。'),
('心轮', 'medium', 60, 79, '你的心轮处于健康平衡，既能感受他人也能保护自己。你懂得在给予与接收之间流动，能够建立有边界的亲密关系。你的爱是成熟而有智慧的。'),
('心轮', 'low', 0, 59, '你的心轮正在学习开放，你可能曾经历过情感创伤导致心墙的建立。你倾向于保护自己的情感空间，但内心深处渴望真实的连接。疗愈之路将带你重新信任爱的力量。');

INSERT INTO chakra_traits_templates (chakra_name, score_range, min_score, max_score, trait_template) VALUES
('松果体', 'high', 80, 100, '你的松果体高度活跃，直觉敏锐如激光，能够洞察事物的本质和隐藏的真相。你的逻辑思维和灵性直觉完美结合，天生的质疑精神让你不断追求更深层的智慧。'),
('松果体', 'medium', 60, 79, '你的松果体处于觉醒状态，理性与直觉在你内在和谐共舞。你既能运用逻辑分析，也能信任内在的感知。你正在学习如何平衡头脑的知与心灵的觉。'),
('松果体', 'low', 0, 59, '你的松果体正在被唤醒，你可能过度依赖外在证据和逻辑推理，而忽略了内在的直觉声音。你正在学习信任那些无法被证明但能被感知的真理。');

-- 插入喉轮弱点模板
INSERT INTO chakra_weaknesses_templates (chakra_name, score_range, min_score, max_score, weakness_template) VALUES
('喉轮', 'high', 80, 100, '高能喉轮的风险：你可能过度使用指令型沟通，让他人感到压迫。你需要学会在沉默中蓄能，而非在每个瞬间释放。过度表达会消耗你的喉轮能量，学会倾听与温柔表达是你的功课。'),
('喉轮', 'medium', 60, 79, '平衡喉轮的挑战：你可能在某些情境下过度表达，在另一些情境下又压抑自己。你需要觉察什么时候该说、什么时候该闭嘴，学会区分真实表达与情绪宣泄的界限。'),
('喉轮', 'low', 0, 59, '低能喉轮的困境：你倾向于吞咽自己的真实声音，害怕表达会带来冲突或拒绝。长期压抑可能导致喉咙不适或沟通障碍。你需要勇敢地练习发声，即使一开始声音颤抖也没关系。');

INSERT INTO chakra_weaknesses_templates (chakra_name, score_range, min_score, max_score, weakness_template) VALUES
('心轮', 'high', 80, 100, '高能心轮的陷阱：你容易陷入"救世主情结"，过度承担他人的情绪负担。你需要学会边界感，明白你无法拯救所有人。过度给予会掏空你的心轮，学会说"不"是你的疗愈之路。'),
('心轮', 'medium', 60, 79, '平衡心轮的挑战：你可能在某些关系中过度付出，在另一些关系中又封闭心门。你需要觉察自己的情感模式，学会在每段关系中找到给予与接收的平衡点。'),
('心轮', 'low', 0, 59, '低能心轮的防御：你可能因为过去的伤害而建立了厚厚的心墙，难以信任他人。你倾向于理性分析感情，而非真实感受。你需要温柔地拆除心墙，允许脆弱的存在。');

INSERT INTO chakra_weaknesses_templates (chakra_name, score_range, min_score, max_score, weakness_template) VALUES
('松果体', 'high', 80, 100, '高能松果体的困境：你可能过度质疑和分析，导致"分析瘫痪"。你的头脑运转太快，难以关闭思维的噪音。你需要学会信任直觉并放下控制，允许答案自然显现而非强行推导。'),
('松果体', 'medium', 60, 79, '平衡松果体的挑战：你可能在某些时候过度思考，在另一些时候又冲动行事。你需要觉察何时该用理性分析，何时该信任直觉，学会在两者之间灵活切换。'),
('松果体', 'low', 0, 59, '低能松果体的盲区：你可能忽视内在的直觉信号，过度依赖外在的证据和他人的意见。你的第三只眼还未睁开，你需要练习静心冥想，学会倾听内在的智慧声音。');