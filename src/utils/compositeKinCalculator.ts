/**
 * 第一层：个体能量实例化 (Individual Instantiation)
 *
 * 严格隔离：每个日期都必须先转换为独立的「能量快照对象」
 * 禁止直接对比日期！
 */

import { calculateKin } from './mayaCalendar';
import { fetchEnergyCentersFromDatabase } from './energyPortraitEngine';

export interface EnergySnapshot {
  kin: number;
  pineal: number;
  throat: number;
  heart: number;
  style: string;
  totem: string;
  sealName?: string;
  toneName?: string;
  midnightType?: 'early' | 'late' | null;
  secondaryKin?: number;
}

/**
 * 计算复合 Kin 能量快照
 * 包含子时加权计算（40/60 或 60/40）
 */
export async function calculateCompositeKin(
  date: Date,
  hour?: number
): Promise<EnergySnapshot> {
  // 确定子时类型
  let midnightType: 'early' | 'late' | null = null;
  if (hour !== undefined && hour >= 0 && hour < 1) {
    midnightType = 'early'; // 0:00-1:00 为早子时（阳子时）
  } else if (hour !== undefined && hour >= 23) {
    midnightType = 'late'; // 23:00-24:00 为晚子时（阴子时）
  }

  // 基础 Kin 计算
  const kinData = calculateKin(date, midnightType);

  // 从数据库获取能量中心数据
  const energyCenters = await fetchEnergyCentersFromDatabase(kinData.kin);

  // 构建基础快照
  let snapshot: EnergySnapshot = {
    kin: kinData.kin,
    pineal: energyCenters.find(c => c.name === 'pineal')?.percentage || 50,
    throat: energyCenters.find(c => c.name === 'throat')?.percentage || 50,
    heart: energyCenters.find(c => c.name === 'heart')?.percentage || 50,
    style: kinData.toneName || '',
    totem: kinData.sealName || '',
    sealName: kinData.sealName,
    toneName: kinData.toneName,
    midnightType: kinData.midnightType || null,
    secondaryKin: kinData.secondaryKin
  };

  // 子时加权计算（重要！）
  if (kinData.midnightType && kinData.secondaryKin) {
    const secondaryCenters = await fetchEnergyCentersFromDatabase(kinData.secondaryKin);

    const secondaryPineal = secondaryCenters.find(c => c.name === 'pineal')?.percentage || 50;
    const secondaryThroat = secondaryCenters.find(c => c.name === 'throat')?.percentage || 50;
    const secondaryHeart = secondaryCenters.find(c => c.name === 'heart')?.percentage || 50;

    if (kinData.midnightType === 'yangzi') {
      // 阳子时：主 Kin 60%，次 Kin 40%
      snapshot.pineal = Math.round(snapshot.pineal * 0.6 + secondaryPineal * 0.4);
      snapshot.throat = Math.round(snapshot.throat * 0.6 + secondaryThroat * 0.4);
      snapshot.heart = Math.round(snapshot.heart * 0.6 + secondaryHeart * 0.4);
    } else {
      // 阴子时：主 Kin 40%，次 Kin 60%
      snapshot.pineal = Math.round(snapshot.pineal * 0.4 + secondaryPineal * 0.6);
      snapshot.throat = Math.round(snapshot.throat * 0.4 + secondaryThroat * 0.6);
      snapshot.heart = Math.round(snapshot.heart * 0.4 + secondaryHeart * 0.6);
    }
  }

  return snapshot;
}

/**
 * 批量计算多个日期的能量快照
 */
export async function calculateMultipleSnapshots(
  persons: Array<{ date: Date; hour?: number; name?: string }>
): Promise<Array<EnergySnapshot & { name?: string }>> {
  return Promise.all(
    persons.map(async (p) => {
      const snapshot = await calculateCompositeKin(p.date, p.hour);
      return { ...snapshot, name: p.name };
    })
  );
}
