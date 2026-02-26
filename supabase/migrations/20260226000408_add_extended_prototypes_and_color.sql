/*
  # 扩展声音能量种子库 - 补充原型与色彩系统

  1. 表结构修改
    - 为 `voice_energy_prototypes` 添加 `color` 字段用于UI渲染
    - 添加 `advice`, `organs`, `do_list`, `dont_list`, `recharge_hz` 等指导信息

  2. 新增原型数据
    - ID 194 (贾先生原型) - 下三轮发力的实干家
    - ID 065 (典型案例A) - 带刺的表达者
    - 其他补充分型原型

  3. 数据安全
    - 使用 ON CONFLICT DO NOTHING 避免重复插入
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voice_energy_prototypes' AND column_name = 'color'
  ) THEN
    ALTER TABLE voice_energy_prototypes ADD COLUMN color text DEFAULT '#FFFFFF';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voice_energy_prototypes' AND column_name = 'advice'
  ) THEN
    ALTER TABLE voice_energy_prototypes ADD COLUMN advice text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voice_energy_prototypes' AND column_name = 'organs'
  ) THEN
    ALTER TABLE voice_energy_prototypes ADD COLUMN organs text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voice_energy_prototypes' AND column_name = 'do_list'
  ) THEN
    ALTER TABLE voice_energy_prototypes ADD COLUMN do_list jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voice_energy_prototypes' AND column_name = 'dont_list'
  ) THEN
    ALTER TABLE voice_energy_prototypes ADD COLUMN dont_list jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voice_energy_prototypes' AND column_name = 'recharge_hz'
  ) THEN
    ALTER TABLE voice_energy_prototypes ADD COLUMN recharge_hz integer;
  END IF;
END $$;

UPDATE voice_energy_prototypes SET color = '#FFFFFF', advice = '维持当前的觉知频率，你是他人的校准基准。', organs = '心肾相交，中焦运化圆满。', do_list = '["静坐保持", "引导他人"]'::jsonb, dont_list = '["过度介入他人因果"]'::jsonb, recharge_hz = 528 WHERE id = '000';

UPDATE voice_energy_prototypes SET color = '#00FF7F', advice = '关注能量的向上宣发，保持眼睛的亮感。', organs = '心与小肠通达，肺气宣发极强。', do_list = '["公众表达", "创意显化"]'::jsonb, dont_list = '["长时间处于低频环境"]'::jsonb, recharge_hz = 384 WHERE id = '343';

UPDATE voice_energy_prototypes SET color = '#4169E1', advice = '建议将意念下沉，关注足底扎根感。', organs = '膀胱经紧绷，需注意脑部减压。', do_list = '["深度思考", "冥想下沉"]'::jsonb, dont_list = '["连续熬夜", "高强度逻辑推演"]'::jsonb, recharge_hz = 194 WHERE id = '432';

INSERT INTO voice_energy_prototypes (id, name, tag_name, description, core_frequency, chakra_signature, harmonic_richness, phase_pattern, quality_type, somatic_sensation, color, advice, organs, do_list, dont_list, recharge_hz)
VALUES
  (
    '194',
    '贾先生原型',
    '棕色·下三轮发力的实干家',
    '物理定义：核心194Hz(海底轮)极强，能量相位呈下沉态。体感意义：发力点在胃以下，具备强大的物质世界显化力。',
    194,
    '{"root": 1.00, "sacral": 0.88, "solar": 0.85, "heart": 0.65, "throat": 0.55, "thirdEye": 0.45, "crown": 0.40}'::jsonb,
    80.00,
    'grounded',
    'smooth',
    '能量扎根稳固，物质显化力强，需提升上三轮能量',
    '#8B4513',
    '关注能量的向上提频，避免陷入过度务实。',
    '脾胃运化有力，肾气封藏稳固。',
    '["商业落地", "体力运动"]'::jsonb,
    '["忽视直觉灵感"]'::jsonb,
    432
  ),
  (
    '065',
    '典型案例A',
    '金色·带刺的表达者',
    '物理定义：核心384Hz(喉轮)强但质地粗糙，能量在喉部呈现卡顿态。体感意义：表达欲强但带有防御色彩。',
    384,
    '{"root": 0.55, "sacral": 0.60, "solar": 0.65, "heart": 0.70, "throat": 1.00, "thirdEye": 0.62, "crown": 0.58}'::jsonb,
    70.00,
    'grounded',
    'rough',
    '喉部张力明显，表达带防御性，需释放大肠经压力',
    '#FFD700',
    '通过腹式呼吸化解喉部张力，释放大肠经压力。',
    '大肠经郁结，肺气肃降受阻。',
    '["书写表达", "温润饮食"]'::jsonb,
    '["大声辩论", "辛辣刺激"]'::jsonb,
    342
  ),
  (
    '528',
    '典型案例B',
    '黄绿色·太阳神的化身',
    '物理定义：核心528Hz(太阳轮)极强，能量呈现爆发态。体感意义：意志力极强，执行力超群。',
    528,
    '{"root": 0.75, "sacral": 0.78, "solar": 1.00, "heart": 0.82, "throat": 0.68, "thirdEye": 0.60, "crown": 0.55}'::jsonb,
    85.00,
    'grounded',
    'smooth',
    '意志力极强，脾胃能量充沛，需平衡上下能量流',
    '#9ACD32',
    '注意劳逸结合，避免脾胃过度消耗。',
    '脾胃运化强劲，肝气疏泄有力。',
    '["目标执行", "团队领导"]'::jsonb,
    '["过度消耗", "忽视休息"]'::jsonb,
    432
  ),
  (
    '417',
    '典型案例C',
    '橙色·情绪流动者',
    '物理定义：核心417Hz(脐轮)强，能量呈现流动态。体感意义：情绪感知敏锐，创造力丰富。',
    417,
    '{"root": 0.68, "sacral": 1.00, "solar": 0.75, "heart": 0.78, "throat": 0.65, "thirdEye": 0.58, "crown": 0.52}'::jsonb,
    82.00,
    'floating',
    'smooth',
    '情绪流动性强，创造力丰富，需稳定情绪波动',
    '#FF8C00',
    '建立情绪觉察机制，保持创造力与稳定性的平衡。',
    '膀胱与肾功能活跃，需注意情绪稳定。',
    '["艺术创作", "情绪表达"]'::jsonb,
    '["压抑情绪", "过度理性"]'::jsonb,
    194
  ),
  (
    '963',
    '典型案例D',
    '紫白色·灵性接收者',
    '物理定义：核心963Hz(顶轮)极强，能量呈现上升态。体感意义：灵性感知强，易接收高维信息。',
    963,
    '{"root": 0.40, "sacral": 0.45, "solar": 0.52, "heart": 0.65, "throat": 0.70, "thirdEye": 0.88, "crown": 1.00}'::jsonb,
    76.00,
    'floating',
    'flat',
    '灵性通道开启，需加强扎根，避免能量悬浮',
    '#E6E6FA',
    '务必加强海底轮扎根，避免灵性接收过载。',
    '小肠吸收功能需加强，肾气需补充。',
    '["冥想连接", "灵性实践"]'::jsonb,
    '["过度灵修", "忽视身体"]'::jsonb,
    194
  )
ON CONFLICT (id) DO NOTHING;
