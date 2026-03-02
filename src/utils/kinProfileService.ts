/**
 * Kin Profile Service - Integrates Featured Profiles & G-N-P Algorithm
 * 整合精选Kin定制档案与全量Kin自动合成算法
 */

import { supabase } from '../lib/supabase';

export interface FeaturedKinProfile {
  kin_number: number;
  mode_name: string;
  custom_summary: string;
  pineal_gland: number;
  heart_chakra: number;
  throat_chakra: number;
  special_traits: Record<string, any>;
}

export interface SynthesizedKinProfile {
  kin_number: number;
  synthesis_type: 'auto_generated';
  wavespell: {
    name_cn: string;
    name_en: string;
    wave_type: string;
    life_essence: string;
    long_term_purpose: string;
  };
  seal: {
    name_cn: string;
    name_en: string;
    keywords: string;
    pineal_gland: number;
    heart_chakra: number;
    throat_chakra: number;
  };
  tone: {
    name_cn: string;
    name_en: string;
    power: string;
    action: string;
    essence: string;
  };
  year_2026_guidance: string;
  auto_summary: string;
}

export type KinProfileResult = FeaturedKinProfile | SynthesizedKinProfile;

/**
 * 获取Kin档案 - 优先返回精选定制，否则使用G-N-P算法自动合成
 */
export async function getKinProfile(kinNumber: number): Promise<KinProfileResult | null> {
  try {
    const { data: featured, error: featuredError } = await supabase
      .from('featured_kin_profiles')
      .select('*')
      .eq('kin_number', kinNumber)
      .maybeSingle();

    if (featured) {
      return featured as FeaturedKinProfile;
    }

    const { data: synthesized, error: synthesisError } = await supabase
      .rpc('synthesize_kin_profile', { kin_num: kinNumber });

    if (synthesisError) {
      console.error('Failed to synthesize Kin profile:', synthesisError);
      return null;
    }

    return synthesized as SynthesizedKinProfile;
  } catch (error) {
    console.error('Error fetching Kin profile:', error);
    return null;
  }
}

/**
 * 判断是否为精选定制档案
 */
export function isFeaturedProfile(profile: KinProfileResult): profile is FeaturedKinProfile {
  return 'mode_name' in profile && 'custom_summary' in profile;
}

/**
 * 判断是否为自动合成档案
 */
export function isSynthesizedProfile(profile: KinProfileResult): profile is SynthesizedKinProfile {
  return 'synthesis_type' in profile && profile.synthesis_type === 'auto_generated';
}

/**
 * 获取能量中心分数（统一接口）
 */
export function getEnergyCenters(profile: KinProfileResult) {
  if (isFeaturedProfile(profile)) {
    return {
      pineal_gland: profile.pineal_gland,
      heart_chakra: profile.heart_chakra,
      throat_chakra: profile.throat_chakra
    };
  } else {
    return {
      pineal_gland: profile.seal.pineal_gland,
      heart_chakra: profile.seal.heart_chakra,
      throat_chakra: profile.seal.throat_chakra
    };
  }
}

/**
 * 获取Kin摘要（统一接口）
 */
export function getKinSummary(profile: KinProfileResult): string {
  if (isFeaturedProfile(profile)) {
    return profile.custom_summary;
  } else {
    return profile.auto_summary;
  }
}

/**
 * 获取模式名称（统一接口）
 */
export function getModeName(profile: KinProfileResult): string {
  if (isFeaturedProfile(profile)) {
    return profile.mode_name;
  } else {
    return `${profile.tone.name_cn} ${profile.seal.name_cn}`;
  }
}

/**
 * 批量获取Kin档案
 */
export async function getBatchKinProfiles(kinNumbers: number[]): Promise<Map<number, KinProfileResult>> {
  const profileMap = new Map<number, KinProfileResult>();

  await Promise.all(
    kinNumbers.map(async (kinNumber) => {
      const profile = await getKinProfile(kinNumber);
      if (profile) {
        profileMap.set(kinNumber, profile);
      }
    })
  );

  return profileMap;
}
