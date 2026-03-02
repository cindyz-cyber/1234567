import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function calculateKinNumber(birthDate: Date): number {
  const MAYA_EPOCH = new Date('1997-07-26');
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const daysDiff = Math.floor((birthDate.getTime() - MAYA_EPOCH.getTime()) / MS_PER_DAY);
  let kin = (daysDiff % 260 + 260) % 260;
  return kin === 0 ? 260 : kin;
}

async function generateFullReport() {
  const birthDate = new Date('1996-07-17T00:30:00+08:00');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('            玛雅历能量人格完整报告');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`出生日期: 1996年7月16日后子时（7月17日00:30）`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  const kinNumber = calculateKinNumber(birthDate);
  console.log(`🔮 你的银河签名: Kin ${kinNumber}\n`);

  const { data: kinDef, error } = await supabase
    .from('kin_definitions')
    .select(`
      *,
      totem:totems(*),
      tone:tones(*)
    `)
    .eq('kin_number', kinNumber)
    .maybeSingle();

  if (error || !kinDef) {
    console.error('❌ 数据获取失败:', error);
    return;
  }

  const wavespellId = Math.floor((kinNumber - 1) / 13) + 1;
  const { data: wavespell } = await supabase
    .from('wavespells')
    .select('*')
    .eq('id', wavespellId)
    .maybeSingle();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【一】核心身份');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✨ 核心本质: ${kinDef.core_essence}`);
  console.log(`🎭 调性: ${kinDef.tone.name_cn} (${kinDef.tone.name_en})`);
  console.log(`   - ${kinDef.tone.description}`);
  console.log(`🌟 图腾: ${kinDef.totem.name_cn} (${kinDef.totem.name_en})`);
  console.log(`   - ${kinDef.totem.description}`);
  console.log(`🌊 所属波符: ${wavespell?.name_cn} (Kin ${wavespell?.kin_start}-${wavespell?.kin_end})`);
  console.log(`   - ${wavespell?.life_essence}\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【二】能量中心分布（脉轮频率）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🔮 松果体（直觉灵性）: ${kinDef.totem.pineal_gland}%`);
  console.log(`   ${'█'.repeat(Math.floor(kinDef.totem.pineal_gland / 5))}░`.padEnd(25, '░'));
  console.log(`💬 喉轮（表达沟通）: ${kinDef.totem.throat_chakra}%`);
  console.log(`   ${'█'.repeat(Math.floor(kinDef.totem.throat_chakra / 5))}░`.padEnd(25, '░'));
  console.log(`❤️  心轮（情感连接）: ${kinDef.totem.heart_chakra}%`);
  console.log(`   ${'█'.repeat(Math.floor(kinDef.totem.heart_chakra / 5))}░`.padEnd(25, '░'));
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【三】调性能量模式');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`⚡ 能量模式: ${kinDef.tone.energy_pattern}`);
  console.log(`🎯 生命策略: ${kinDef.tone.life_strategy}`);
  console.log(`🎁 天赋礼物: ${kinDef.tone.gift}`);
  console.log(`⚠️  挑战课题: ${kinDef.tone.challenge}\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【四】图腾操作系统');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🔧 操作模式: ${kinDef.totem.operation_mode}`);
  console.log(`🔑 核心关键词: ${kinDef.totem.core_keyword}`);
  console.log(`✨ 能量签名: ${kinDef.totem.energy_signature}\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【五】波符生命底色');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌈 波符类型: ${wavespell?.wave_type}`);
  console.log(`💫 生命本质: ${wavespell?.life_essence}`);
  console.log(`🎯 长期目标: ${wavespell?.long_term_purpose}\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【六】生命蓝图解读');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌟 生命目的:\n   ${kinDef.life_purpose}\n`);
  console.log(`🌑 阴影功课:\n   ${kinDef.shadow_work}\n`);
  console.log(`🌈 整合路径:\n   ${kinDef.integration_path}\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【七】神谕体系（支持力量）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const oracleKins = [
    { label: '指引力量', kin: kinDef.oracle_guide },
    { label: '挑战拓展', kin: kinDef.oracle_challenge },
    { label: '支持力量', kin: kinDef.oracle_support },
    { label: '隐藏力量', kin: kinDef.oracle_hidden }
  ];

  for (const oracle of oracleKins) {
    const { data: oracleDef } = await supabase
      .from('kin_definitions')
      .select('core_essence, totem:totems(name_cn)')
      .eq('kin_number', oracle.kin)
      .maybeSingle();

    if (oracleDef) {
      console.log(`🔮 ${oracle.label}: Kin ${oracle.kin} - ${oracleDef.core_essence}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('【合成公式验证】');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`报告内容 = [调性描述] + [图腾模式] + [波符底色视角]`);
  console.log(`         = [${kinDef.tone.energy_pattern}]`);
  console.log(`         + [${kinDef.totem.operation_mode}]`);
  console.log(`         + [${wavespell?.life_essence}]`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔒 数据来源: 数据库锁定数值，图腾脉轮分值禁止AI修改');
  console.log('✅ 报告生成: 基于完整玛雅历知识库自动合成');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

generateFullReport().catch(console.error);
