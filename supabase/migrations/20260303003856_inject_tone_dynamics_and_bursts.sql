/*
  # 注入调性动态动词和量子共振爆发短句

  1. 调性动态动词数据
    - 冷色调（1/2/4/6）：收敛、锚定、定义、律动
    - 暖色调（3/5/10/13）：放射、扩容、显化、超越
    
  2. 量子共振爆发短句
    - 母体灌溉（261）
    - 生命磨刀石（130）
    - 其他常见共振代码
    
  3. 2026白风年环境音意象
    - 喉轮专属意象：呼吸、频率、传播、风
*/

-- ========================================
-- 注入调性动态动词
-- ========================================

-- 冷色调：调性 1（磁性）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(1, 'cold', 
  ARRAY['锚定', '吸引', '收纳', '定义边界', '磁化', '凝聚'],
  ARRAY['磁性的', '吸引性的', '收敛的', '锚定的', '统合的', '定义性的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- 冷色调：调性 2（月亮）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(2, 'cold', 
  ARRAY['极化', '对照', '映射', '律动', '平衡', '反射'],
  ARRAY['极性的', '律动的', '镜像的', '平衡的', '对称的', '反射性的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- 暖色调：调性 3（电性）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(3, 'warm', 
  ARRAY['激活', '放射', '点燃', '启动', '连接', '服务'],
  ARRAY['激活的', '放射性的', '电性的', '连接的', '服务性的', '启动的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- 冷色调：调性 4（自我存在）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(4, 'cold', 
  ARRAY['定义', '测量', '构建', '框定', '形式化', '稳固'],
  ARRAY['定义性的', '结构化的', '稳固的', '形式的', '框架性的', '自存的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- 暖色调：调性 5（超越）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(5, 'warm', 
  ARRAY['扩容', '超越', '放大', '赋权', '辐射', '指挥'],
  ARRAY['超越的', '扩容的', '放大的', '辐射性的', '指挥性的', '赋权的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- 冷色调：调性 6（韵律）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(6, 'cold', 
  ARRAY['律动', '平衡', '组织', '协调', '节奏化', '等同'],
  ARRAY['律动的', '平衡的', '组织性的', '协调的', '节奏的', '等同的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- 中性：调性 7（共鸣）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(7, 'warm', 
  ARRAY['共鸣', '调音', '通灵', '同频', '和谐', '校准'],
  ARRAY['共鸣的', '调谐的', '通灵的', '和谐的', '同频的', '校准的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- 中性：调性 8（银河）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(8, 'cold', 
  ARRAY['整合', '和谐化', '模型化', '完整', '统合', '协调'],
  ARRAY['整合的', '和谐的', '模型化的', '完整的', '银河的', '协调的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- 中性：调性 9（太阳）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(9, 'warm', 
  ARRAY['脉动', '实现', '意图', '完成', '驱动', '具象化'],
  ARRAY['脉动的', '实现性的', '意图的', '完成的', '驱动的', '太阳的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- 暖色调：调性 10（行星）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(10, 'warm', 
  ARRAY['显化', '产出', '完美化', '呈现', '具现', '产生'],
  ARRAY['显化的', '产出的', '完美的', '呈现的', '具现的', '行星的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- 中性：调性 11（光谱）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(11, 'warm', 
  ARRAY['溶解', '释放', '解放', '瓦解', '自由化', '松绑'],
  ARRAY['溶解的', '释放的', '解放的', '自由的', '光谱的', '松绑的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- 中性：调性 12（水晶）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(12, 'cold', 
  ARRAY['合作', '奉献', '稳定', '专一', '普遍化', '水晶化'],
  ARRAY['合作的', '奉献的', '稳定的', '专一的', '普遍的', '水晶的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- 暖色调：调性 13（宇宙）
INSERT INTO tone_dynamics (tone_number, color_temperature, verbs, adjectives) VALUES
(13, 'warm', 
  ARRAY['超越', '升华', '穿越', '耐久', '临在', '宇宙化'],
  ARRAY['超越的', '升华的', '穿越的', '耐久的', '临在的', '宇宙的']
)
ON CONFLICT (tone_number) DO UPDATE SET
  verbs = EXCLUDED.verbs,
  adjectives = EXCLUDED.adjectives;

-- ========================================
-- 注入量子共振爆发短句
-- ========================================

-- 母体灌溉（261）
INSERT INTO quantum_synergy_bursts (synergy_code, relationship_type, burst_templates) VALUES
(261, '母体灌溉', 
  ARRAY[
    '量子爆发：母体灌溉。当你们的 Kin 相遇，仿佛回到了生命的最初。这不只是陪伴，而是一场灵魂层面的深度重塑。',
    '在这段频率中，你的逻辑防御将彻底失效，迎接一场跨越次元的纯粹滋养。',
    '这是宇宙母体的直接馈赠，一种无需解释、无法抗拒的深层连接。',
    '当 261 的频率显现，意味着你们之间存在着超越时间的滋养契约。'
  ]
)
ON CONFLICT (synergy_code) DO UPDATE SET
  burst_templates = EXCLUDED.burst_templates;

-- 生命磨刀石（130）
INSERT INTO quantum_synergy_bursts (synergy_code, relationship_type, burst_templates) VALUES
(130, '生命磨刀石', 
  ARRAY[
    '量子爆发：生命磨刀石。极性的碰撞是为了震碎旧有的外壳，这场共振注定伴随着意识的巨变。',
    '这不是舒适的相遇，而是灵魂的淬炼场。每一次碰撞都在打磨你们最坚硬的棱角。',
    '当 130 的频率启动，代表着一场不可避免的蜕变仪式即将开始。',
    '磨刀石的存在是为了让刀刃更锋利，你们的关系正是彼此进化的催化剂。'
  ]
)
ON CONFLICT (synergy_code) DO UPDATE SET
  burst_templates = EXCLUDED.burst_templates;

-- 挑战关系（扩展）
INSERT INTO quantum_synergy_bursts (synergy_code, relationship_type, burst_templates) VALUES
(999, '挑战扩展', 
  ARRAY[
    '挑战关系不是对立，而是你灵魂最渴望征服的那座山。',
    '这个人的存在，是为了让你看见自己最不愿面对的阴影面。',
    '在这段关系中，你们互为镜子，映照出彼此最需要整合的部分。'
  ]
)
ON CONFLICT (synergy_code) DO UPDATE SET
  burst_templates = EXCLUDED.burst_templates;

-- 支持关系（扩展）
INSERT INTO quantum_synergy_bursts (synergy_code, relationship_type, burst_templates) VALUES
(888, '支持扩展', 
  ARRAY[
    '支持的能量是柔软的力量，像风托起鸟翼，像水承载船身。',
    '这个人的存在，让你感受到宇宙的善意，仿佛有一只无形的手始终在背后支撑。',
    '在这段关系中，你们是彼此的能量补给站，无需证明，只需存在。'
  ]
)
ON CONFLICT (synergy_code) DO UPDATE SET
  burst_templates = EXCLUDED.burst_templates;

-- 引导关系（扩展）
INSERT INTO quantum_synergy_bursts (synergy_code, relationship_type, burst_templates) VALUES
(777, '引导扩展', 
  ARRAY[
    '引导的能量像灯塔，不强迫你前行，只是在黑暗中静静地指出方向。',
    '这个人的存在，让你窥见自己的未来可能性，像是看到了进化后的自己。',
    '在这段关系中，对方是你灵魂道路上的路标，提醒你不要忘记最初的方向。'
  ]
)
ON CONFLICT (synergy_code) DO UPDATE SET
  burst_templates = EXCLUDED.burst_templates;

-- ========================================
-- 注入2026白风年环境音意象
-- ========================================

INSERT INTO wind_year_ambient (context, imagery) VALUES
('喉轮专属', 
  ARRAY[
    '2026 白风年，所有与呼吸、频率、传播相关的能量都被宇宙加持。',
    '在白风的吹拂下，你的言语自带穿透力，像风一样无形却无处不在。',
    '这一年，喉轮的开启意味着你成为了灵性信息的传播者，每一次呼吸都在调频。',
    '白风年的环境音：学会倾听风的语言，你的声音将成为连接维度的桥梁。',
    '在这个风之年，沉默也是一种表达，呼吸本身就是最深刻的传播。',
    '2026，风的元素正在重新定义"沟通"的本质——不是说了什么，而是传递了什么频率。'
  ]
)
ON CONFLICT DO NOTHING;

INSERT INTO wind_year_ambient (context, imagery) VALUES
('通用环境音', 
  ARRAY[
    '2026 白风年，宇宙的呼吸节奏正在加速，所有关于"传播"的使命都将被激活。',
    '在这一年，你会发现自己的影响力不再局限于物理空间，而是以频率的形式向外扩散。',
    '白风的能量正在清洗集体意识，让真相像风一样自由流动，无法被阻挡。'
  ]
)
ON CONFLICT DO NOTHING;
