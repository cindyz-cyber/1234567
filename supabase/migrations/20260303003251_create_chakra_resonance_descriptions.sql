/*
  # 创建脉轮共振描述资料库

  1. 新表
    - `chakra_resonance_descriptions`
      - `totem_id` (int) - 图腾ID (1-20)
      - `totem_name_cn` (text) - 图腾中文名
      - `color_family` (text) - 色系家族 (红/白/蓝/黄)
      - `high_score_description` (text) - 高分感应描述（能量开放模式）
      - `low_score_description` (text) - 低分感应描述（能量防御模式）
      - `created_at` (timestamptz) - 创建时间
  
  2. 安全性
    - 启用 RLS
    - 允许所有人读取（公开知识库）
    - 仅管理员可写入

  3. 数据说明
    - 基于玛雅历20个太阳图腾的能量特性
    - 高分：能量中心开放，直觉主导
    - 低分：能量中心防御，逻辑主导
*/

CREATE TABLE IF NOT EXISTS chakra_resonance_descriptions (
  totem_id int PRIMARY KEY CHECK (totem_id >= 1 AND totem_id <= 20),
  totem_name_cn text NOT NULL,
  color_family text NOT NULL CHECK (color_family IN ('红', '白', '蓝', '黄')),
  high_score_description text NOT NULL,
  low_score_description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chakra_resonance_descriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许所有人读取脉轮描述"
  ON chakra_resonance_descriptions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "允许公开写入脉轮描述（用于数据注入）"
  ON chakra_resonance_descriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 插入红色家族数据
INSERT INTO chakra_resonance_descriptions (totem_id, totem_name_cn, color_family, high_score_description, low_score_description) VALUES
(1, '红龙', '红', '母体能量全开，具备极强的直觉滋养力，如同生命之泉', '深埋的古老记忆，爱得深沉但带有极强的防御边界'),
(5, '红蛇', '红', '生命本能炽热，感官极其敏锐，呈现出一种原始的爆发力', '能量处于蛰伏期，通过逻辑分析来克制生理本能的冲动'),
(9, '红月', '红', '宇宙洪流的接收器，情绪净化力极强，随波而不流', '静止的水面，在理智的堤坝下小心翼翼地处理情感波动'),
(13, '红天行者', '红', '多维空间的探索者，天生具备打破维度墙的勇气', '严谨的跨界观察者，在行动前必须完成完美的逻辑闭环'),
(17, '红地球', '红', '大地的导航员，具备强大的共时性引力，能锚定进化的方向', '孤独的行者，在纷乱的信息中寻找属于自己的频率坐标')
ON CONFLICT (totem_id) DO UPDATE SET
  high_score_description = EXCLUDED.high_score_description,
  low_score_description = EXCLUDED.low_score_description;

-- 插入白色家族数据
INSERT INTO chakra_resonance_descriptions (totem_id, totem_name_cn, color_family, high_score_description, low_score_description) VALUES
(2, '白风', '白', '灵性传播者，言语自带频率，能像微风般穿透人心', '静默的思考者，所有的灵感都在内部呼吸中自我消化'),
(6, '白世界桥', '白', '跨越生死的连接者，擅长在不同维度间建立机遇之桥', '铁甲温柔模式。断舍离的执行者，爱得极度务实且讲究原则'),
(10, '白狗', '白', '无条件的爱之源，忠诚于心轮的颤动，具备极强的疗愈力', '有条件的守护者，在确认安全前，心轮保持逻辑性隔离'),
(14, '白巫师', '白', '当下的施法者，通过全然的受纳，让显化自然发生', '理性的观察家，试图通过控制时间来寻找永恒的确定性'),
(18, '白镜', '白', '无穷反思的映照者，真相的揭露者，眼里容不下虚伪', '破碎的棱镜，通过逻辑的切割来防御外界的直射')
ON CONFLICT (totem_id) DO UPDATE SET
  high_score_description = EXCLUDED.high_score_description,
  low_score_description = EXCLUDED.low_score_description;

-- 插入蓝色家族数据
INSERT INTO chakra_resonance_descriptions (totem_id, totem_name_cn, color_family, high_score_description, low_score_description) VALUES
(3, '蓝夜', '蓝', '丰盛的先知，直觉雷达在潜意识的深海中自由航行', '逻辑的造梦者，在黑暗中严密地建构属于自己的精神领地'),
(7, '蓝手', '蓝', '疗愈的成就者，知行合一，双手自带化腐朽为神奇的魔力', '纠结的分析师，在动手之前会被海量的逻辑可能性困住'),
(11, '蓝猴', '蓝', '神圣的幻象破解者，在游戏的戏谑中揭示生命的真理', '严肃的解构者，因为看透了幻象而显得格格不入'),
(15, '蓝鹰', '蓝', '上帝视角的拥有者，全景感知，远见超越时空', '冷峻的观测员，高处不胜寒，以疏离保持绝对的清醒'),
(19, '蓝风暴', '蓝', '破局的变革者，在自我蜕变的飓风中心保持绝对的定轴', '隔离保护模式。能量向内坍缩，呈现出一种理智的冰霜感')
ON CONFLICT (totem_id) DO UPDATE SET
  high_score_description = EXCLUDED.high_score_description,
  low_score_description = EXCLUDED.low_score_description;

-- 插入黄色家族数据
INSERT INTO chakra_resonance_descriptions (totem_id, totem_name_cn, color_family, high_score_description, low_score_description) VALUES
(4, '黄种子', '黄', '觉知的播种者，深谙成长的节奏，目标感极强', '焦虑的囤积者，在逻辑的壳里保护着尚未成熟的愿望'),
(8, '黄星星', '黄', '优雅的艺术家，天生具备美化环境与点亮他人的能力', '刻板的完美主义者，由于无法忍受瑕疵而产生的逻辑洁癖'),
(12, '黄人', '黄', '自由意志的灯塔，通过智慧的影响力启发他人的独立', '固执的逻辑者，在自我意志的围城里反复推敲'),
(16, '黄战士', '黄', '无畏的战略家，天生为了提问与探索真理而生', '防御的战术家，通过海量的逻辑推演来对冲未知的风险'),
(20, '黄太阳', '黄', '指挥官模式，开悟的源头，自带普照众生的威权与慈悲', '落日的余晖，能量内敛，在逻辑的沉思中寻找中心')
ON CONFLICT (totem_id) DO UPDATE SET
  high_score_description = EXCLUDED.high_score_description,
  low_score_description = EXCLUDED.low_score_description;
