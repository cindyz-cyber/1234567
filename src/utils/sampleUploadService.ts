import { supabase } from '../lib/supabase';
import { ChakraEnergy } from './voiceAnalysis';

export interface SampleUpload {
  id: string;
  sampleName: string;
  audioUrl?: string;
  chakraSignature: ChakraEnergy;
  coreFrequency: number;
  phasePattern: 'grounded' | 'floating' | 'dispersed';
  qualityType: 'smooth' | 'rough' | 'flat';
  tagName: string;
  description?: string;
  color: string;
  advice?: string;
  organs?: string;
  doList: string[];
  dontList: string[];
  rechargeHz?: number;
  isPromotedToAnchor: boolean;
  uploadSource: string;
  createdAt: string;
  createdBy: string;
}

export interface UploadSampleParams {
  sampleName: string;
  audioUrl?: string;
  chakraSignature: ChakraEnergy;
  coreFrequency: number;
  phasePattern: 'grounded' | 'floating' | 'dispersed';
  qualityType: 'smooth' | 'rough' | 'flat';
  tagName: string;
  description?: string;
  color: string;
  advice?: string;
  organs?: string;
  doList: string[];
  dontList: string[];
  rechargeHz?: number;
  uploadSource?: string;
}

export async function uploadSample(params: UploadSampleParams): Promise<{ success: boolean; sampleId?: string; error?: string }> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return { success: false, error: '用户未登录' };
    }

    const { data: profileData, error: profileError } = await supabase
      .from('user_profile')
      .select('is_admin')
      .eq('id', userData.user.id)
      .maybeSingle();

    if (profileError || !profileData?.is_admin) {
      return { success: false, error: '权限不足：仅管理员可上传样本' };
    }

    const { data, error } = await supabase
      .from('sample_uploads')
      .insert({
        sample_name: params.sampleName,
        audio_url: params.audioUrl,
        chakra_signature: params.chakraSignature,
        core_frequency: params.coreFrequency,
        phase_pattern: params.phasePattern,
        quality_type: params.qualityType,
        tag_name: params.tagName,
        description: params.description,
        color: params.color,
        advice: params.advice,
        organs: params.organs,
        do_list: params.doList,
        dont_list: params.dontList,
        recharge_hz: params.rechargeHz,
        upload_source: params.uploadSource || 'manual',
        created_by: userData.user.id
      })
      .select('id')
      .single();

    if (error) {
      console.error('Sample upload error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, sampleId: data.id };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: '上传失败' };
  }
}

export async function promoteToAnchor(sampleId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return { success: false, error: '用户未登录' };
    }

    const { data: profileData, error: profileError } = await supabase
      .from('user_profile')
      .select('is_admin')
      .eq('id', userData.user.id)
      .maybeSingle();

    if (profileError || !profileData?.is_admin) {
      return { success: false, error: '权限不足：仅管理员可提升锚点' };
    }

    const { data: sample, error: fetchError } = await supabase
      .from('sample_uploads')
      .select('*')
      .eq('id', sampleId)
      .single();

    if (fetchError || !sample) {
      return { success: false, error: '样本不存在' };
    }

    const prototypeId = `A${Math.floor(sample.core_frequency)}`;

    const { error: insertError } = await supabase
      .from('voice_energy_prototypes')
      .insert({
        id: prototypeId,
        name: sample.sample_name,
        tag_name: sample.tag_name,
        description: sample.description || '',
        core_frequency: sample.core_frequency,
        chakra_signature: sample.chakra_signature,
        harmonic_richness: 80.0,
        phase_pattern: sample.phase_pattern,
        quality_type: sample.quality_type,
        somatic_sensation: sample.description || '',
        color: sample.color,
        advice: sample.advice,
        organs: sample.organs,
        do_list: sample.do_list,
        dont_list: sample.dont_list,
        recharge_hz: sample.recharge_hz
      });

    if (insertError) {
      console.error('Promote to anchor error:', insertError);
      return { success: false, error: insertError.message };
    }

    const { error: updateError } = await supabase
      .from('sample_uploads')
      .update({ is_promoted_to_anchor: true })
      .eq('id', sampleId);

    if (updateError) {
      console.error('Update sample status error:', updateError);
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: '提升锚点失败' };
  }
}

export async function listSamples(): Promise<SampleUpload[]> {
  const { data, error } = await supabase
    .from('sample_uploads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('List samples error:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    sampleName: row.sample_name,
    audioUrl: row.audio_url,
    chakraSignature: row.chakra_signature,
    coreFrequency: row.core_frequency,
    phasePattern: row.phase_pattern,
    qualityType: row.quality_type,
    tagName: row.tag_name,
    description: row.description,
    color: row.color,
    advice: row.advice,
    organs: row.organs,
    doList: row.do_list || [],
    dontList: row.dont_list || [],
    rechargeHz: row.recharge_hz,
    isPromotedToAnchor: row.is_promoted_to_anchor,
    uploadSource: row.upload_source,
    createdAt: row.created_at,
    createdBy: row.created_by
  }));
}
