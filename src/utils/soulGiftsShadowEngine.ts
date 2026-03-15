/**
 * 灵性礼物与阴影合成引擎
 * Soul Gifts & Shadow Synthesis Engine
 *
 * 核心原则：
 * 1. 从"描述"转向"赋能" - 灵性礼物不是特质列表，而是能量场的动态显化
 * 2. 从"批评"转向"觉察" - 阴影不是弱点指责，而是成长的觉察提醒
 * 3. 动态意象合成 = [图腾意象] + [调性张力] + [喉轮分值] + [白风年避坑]
 */

import { supabase } from '../lib/supabase';

interface TotemImagery {
  totem_id: number;
  totem_name_cn: string;
  archetype_imagery: string;
  energy_base_color: string;
  gift_template: string;
  shadow_imagery: string;
}

interface ToneDynamicTension {
  tone_id: number;
  tone_name_cn: string;
  action_tension: string;
  gift_modifier: string;
  shadow_trigger: string;
}

export interface SoulGiftsAndShadow {
  soulGift: string;
  soulShadow: string;
  archetypeImagery: string;
  energyBaseColor: string;
}

/**
 * 获取图腾意象
 */
async function getTotemImagery(totemId: number): Promise<TotemImagery | null> {
  try {
    const { data, error } = await supabase
      .from('totem_imagery')
      .select('*')
      .eq('totem_id', totemId)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch totem imagery:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getTotemImagery:', error);
    return null;
  }
}

/**
 * 获取调性动态张力
 */
async function getToneDynamicTension(toneId: number): Promise<ToneDynamicTension | null> {
  try {
    const { data, error } = await supabase
      .from('tone_dynamic_tension')
      .select('*')
      .eq('tone_id', toneId)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch tone dynamic tension:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getToneDynamicTension:', error);
    return null;
  }
}

/**
 * 获取白风年避坑逻辑
 */
async function getWhiteWindAvoidance(totemId: number): Promise<string> {
  try {
    const { data } = await supabase
      .from('yearly_advice_2026_totems')
      .select('action_verb')
      .eq('totem_id', totemId)
      .maybeSingle();

    return data?.action_verb || '呼吸';
  } catch (error) {
    console.error('Error in getWhiteWindAvoidance:', error);
    return '呼吸';
  }
}

/**
 * 生成灵性礼物 (Soul Gift)
 * 公式：[图腾意象] 的底色 + [调性] 的行动张力 = 灵性礼物
 */
function synthesizeSoulGift(
  totemImagery: TotemImagery,
  toneTension: ToneDynamicTension,
  throatPercentage: number
): string {
  let gift = '';

  // 1. 能量底色
  gift += `${totemImagery.energy_base_color}。`;

  // 2. 调性修饰
  gift += `${toneTension.gift_modifier}，`;

  // 3. 核心礼物模板
  gift += totemImagery.gift_template;

  // 4. 喉轮分值强化
  if (throatPercentage > 80) {
    gift += `。你的高喉轮赋予这份礼物"威权定频"的穿透力。`;
  } else if (throatPercentage >= 60) {
    gift += `。你的喉轮处于"稳健共振"的黄金平衡点，让这份礼物得以精准传递。`;
  } else {
    gift += `。你的喉轮正在"静默蓄能"，这份礼物将在沉默中积累爆发的力量。`;
  }

  return gift;
}

/**
 * 生成灵性阴影 (Soul Shadow)
 * 公式：[阴影意象] + [调性触发条件] + [白风年避坑] = 觉察提醒
 */
function synthesizeSoulShadow(
  totemImagery: TotemImagery,
  toneTension: ToneDynamicTension,
  throatPercentage: number,
  whiteWindActionVerb: string
): string {
  let shadow = '';

  // 1. 阴影意象开场
  shadow += `警惕"${totemImagery.shadow_imagery}"。`;

  // 2. 调性触发条件
  shadow += `${toneTension.shadow_trigger}，`;

  // 3. 喉轮分值特定风险
  if (throatPercentage > 80) {
    shadow += '声音可能化为锋利的切割，忽略了白风年所需的呼吸留白。';
  } else if (throatPercentage >= 60) {
    shadow += '声音可能化为机械的定频，失去了灵性共振的温度。';
  } else {
    shadow += '声音可能化为压抑的淤积，阻塞了能量流动的管道。';
  }

  // 4. 白风年避坑提醒
  shadow += `请记得，最强大的穿透力往往来自于话语间的清晨微风，而非指令的重压。`;
  shadow += `2026白风年的关键词是"${whiteWindActionVerb}"。`;

  return shadow;
}

/**
 * 生成灵性礼物与阴影
 *
 * @param kin - Kin 号码
 * @param throatPercentage - 喉轮分值百分比
 * @returns 灵性礼物与阴影对象
 */
export async function generateSoulGiftsAndShadow(
  kin: number,
  throatPercentage: number
): Promise<SoulGiftsAndShadow> {
  // 提取图腾和调性
  const totemId = ((kin - 1) % 20) + 1;
  const toneId = ((kin - 1) % 13) + 1;

  // 并行获取所有数据
  const [totemImagery, toneTension, whiteWindActionVerb] = await Promise.all([
    getTotemImagery(totemId),
    getToneDynamicTension(toneId),
    getWhiteWindAvoidance(totemId)
  ]);

  // 降级处理
  if (!totemImagery || !toneTension) {
    console.warn('Missing data for soul gifts and shadow generation, using fallback');
    return {
      soulGift: '你携带了独特的能量场频率，在这一年通过精准的表达来显化你的灵性礼物。',
      soulShadow: '警惕在沟通中失去呼吸的节奏，请记得在每一次发声前先对齐心轮的频率。',
      archetypeImagery: '能量场携带者',
      energyBaseColor: '你携带了独特的能量底色'
    };
  }

  // 合成灵性礼物与阴影
  const soulGift = synthesizeSoulGift(totemImagery, toneTension, throatPercentage);
  const soulShadow = synthesizeSoulShadow(
    totemImagery,
    toneTension,
    throatPercentage,
    whiteWindActionVerb
  );

  return {
    soulGift,
    soulShadow,
    archetypeImagery: totemImagery.archetype_imagery,
    energyBaseColor: totemImagery.energy_base_color
  };
}

/**
 * 为子时双 Kin 用户生成复合灵性礼物
 * 体现"双核驱动"的复杂美感
 */
export async function generateDualKinSoulGifts(
  dayKin: number,
  nightKin: number,
  dayThroatPercentage: number,
  nightThroatPercentage: number
): Promise<SoulGiftsAndShadow> {
  // 获取两个 Kin 的数据
  const [dayGifts, nightGifts] = await Promise.all([
    generateSoulGiftsAndShadow(dayKin, dayThroatPercentage),
    generateSoulGiftsAndShadow(nightKin, nightThroatPercentage)
  ]);

  const dayTotemId = ((dayKin - 1) % 20) + 1;
  const nightTotemId = ((nightKin - 1) % 20) + 1;

  const [dayTotem, nightTotem] = await Promise.all([
    getTotemImagery(dayTotemId),
    getTotemImagery(nightTotemId)
  ]);

  // 双核驱动的复合描述
  const dualGift = `你是双核驱动的灵性存有，白昼携带${dayTotem?.archetype_imagery}的频率，午夜携带${nightTotem?.archetype_imagery}的频率。这种双重能量场赋予你独特的"频率切换"能力——在日光下你以${dayTotem?.totem_name_cn}的方式显化，在月光下你以${nightTotem?.totem_name_cn}的方式觉察。2026白风年，你的挑战是将这两种频率编织成统一的共振场，而非让它们撕裂你的表达。`;

  const dualShadow = `警惕"双核失衡"的撕裂。当你过度认同其中一个身份时，另一个能量场可能化为暗流的阴影。${dayTotem?.totem_name_cn}与${nightTotem?.totem_name_cn}需要在你的喉轮中找到共存的节奏，而非相互吞噬。请记得，最强大的双核驱动来自于两种频率的呼吸留白，而非单一的过载输出。`;

  return {
    soulGift: dualGift,
    soulShadow: dualShadow,
    archetypeImagery: `${dayTotem?.archetype_imagery} × ${nightTotem?.archetype_imagery}`,
    energyBaseColor: `双核频率：${dayTotem?.energy_base_color} + ${nightTotem?.energy_base_color}`
  };
}
