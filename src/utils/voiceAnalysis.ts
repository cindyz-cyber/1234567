export interface ChakraEnergy {
  root: number;
  sacral: number;
  solar: number;
  heart: number;
  throat: number;
  thirdEye: number;
  crown: number;
}

export interface VoiceAnalysisResult {
  source: 'brain' | 'throat' | 'heart' | 'lower';
  quality: 'smooth' | 'rough' | 'flat';
  phase: 'grounded' | 'floating' | 'scattering';
  profileId: string;
  profileName: string;
  message: string;
  dominantChakra: keyof ChakraEnergy;
  gapChakras: Array<keyof ChakraEnergy>;
  chakraEnergy: ChakraEnergy;
  chakraDistribution: ChakraEnergy;
  organMapping: {
    [K in keyof ChakraEnergy]: string[];
  };
  recommendedFrequency: {
    hz: number;
    chakra: keyof ChakraEnergy;
    reason: string;
  };
  detectionDetails: {
    chakra: keyof ChakraEnergy;
    detectedFrequency: number;
    coreFrequency: number;
    organSystem: string;
  }[];
  prototypeMatch?: {
    id: string;
    name: string;
    tagName: string;
    similarity: number;
    description: string;
    color: string;
    advice?: string;
    organs?: string;
    doList?: string[];
    dontList?: string[];
    rechargeHz?: number;
  };
  // 新增：声学特征和健康预警
  acousticFeatures?: {
    roughness: number;
    harmonicClarity: number;
    stressIndicator: number;
    defenseLevel: number;
    brightness: number;
    warmth: number;
  };
  healthWarning?: {
    hasWarning: boolean;
    level: 'none' | 'mild' | 'moderate' | 'severe';
    message: string;
    recommendation: string;
  };
}

interface EmotionProfile {
  id: string;
  name: string;
  source: string;
  quality: string;
  phase: string;
  message: string;
}

const EMOTION_PROFILES: EmotionProfile[] = [
  {
    id: '001',
    name: '全频道发光者',
    source: 'heart',
    quality: 'smooth',
    phase: 'grounded',
    message: '您正处于心气通达的状态，保持这种能量流动'
  },
  {
    id: '065',
    name: '能量守护者',
    source: 'throat',
    quality: 'rough',
    phase: 'scattering',
    message: '您正处于表达通道活跃的状态，注意能量的聚焦'
  },
  {
    id: '343',
    name: '智慧觉察者',
    source: 'brain',
    quality: 'flat',
    phase: 'grounded',
    message: '您正处于头脑清明的状态，平衡心与脑的能量'
  },
  {
    id: '372',
    name: '灵感创造者',
    source: 'brain',
    quality: 'smooth',
    phase: 'floating',
    message: '您正处于高维连接的状态，平衡上下能量流'
  }
];

// 【物理硬映射】7 脉轮频率 - 严格对位，禁止伪频率生成
const CHAKRA_FREQUENCIES = {
  root: { base: 194, range: [100, 250], core: 194 },      // 海底轮：100-250Hz（包含 200-260Hz 稳定态）
  sacral: { base: 288, range: [251, 320], core: 288 },    // 脐轮：251-320Hz
  solar: { base: 320, range: [321, 340], core: 320 },     // 太阳轮：321-340Hz
  heart: { base: 343, range: [341, 360], core: 343 },     // 心轮：341-360Hz（342-343Hz 唯一判定）
  throat: { base: 384, range: [361, 410], core: 384 },    // 喉轮：361-410Hz
  thirdEye: { base: 432, range: [411, 500], core: 432 },  // 眉心轮：411-500Hz
  crown: { base: 963, range: [501, 1200], core: 963 }     // 顶轮：501-1200Hz
};

const ORGAN_MAPPING = {
  root: ['肾', '小肠'],
  sacral: ['膀胱', '肾'],
  solar: ['脾', '胃', '肝'],
  heart: ['心', '小肠'],
  throat: ['肺', '大肠'],
  thirdEye: ['膀胱'],
  crown: ['小肠']
};

export class VoiceAnalyzer {
  private audioContext: AudioContext;
  private analyzer: AnalyserNode;
  private fftSize: number = 4096; // 【修复】匹配第三方软件,提升频率分辨率
  private featureExtractor: any; // AcousticFeatureExtractor instance

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = this.fftSize;
    this.analyzer.smoothingTimeConstant = 0.3;

    // 动态导入特征提取器
    this.initFeatureExtractor();
  }

  private async initFeatureExtractor() {
    try {
      const module = await import('./acousticFeatureExtractor');
      this.featureExtractor = new module.AcousticFeatureExtractor(this.audioContext.sampleRate);
      console.log('[VoiceAnalyzer] Acoustic feature extractor initialized');
    } catch (error) {
      console.error('[VoiceAnalyzer] Failed to init feature extractor:', error);
    }
  }

  async analyzeAudioBuffer(audioBlob: Blob): Promise<VoiceAnalysisResult> {
    console.log('[VoiceAnalyzer] Starting multi-dimensional acoustic analysis');

    try {
      // 1. Decode audio
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      console.log('[VoiceAnalyzer] Audio decoded, duration:', audioBuffer.duration);

      // 2. 【重大修复】使用Web Audio API原生FFT
      const { RealFFTAnalyzer } = await import('./realFFT');
      const fftAnalyzer = new RealFFTAnalyzer(audioBuffer.sampleRate);
      const fftResult = await fftAnalyzer.analyzeAudioBuffer(audioBuffer);
      const frequencyData = fftResult.frequencyData;
      const sampleRate = fftResult.sampleRate;
      console.log('[VoiceAnalyzer] Native FFT analysis complete, bins:', frequencyData.length);

      // 【诊断模式】输出原始频谱分布
      const spectrumDiagnostics = this.analyzeSpectrumDistribution(frequencyData, sampleRate);

      // 【新增】提取Top 5 Peak Hz (真正的峰值检测)
      const topPeaks = fftAnalyzer.findTopPeaks(frequencyData, sampleRate, fftResult.fftSize, 5);

      // 【强制心轮检测】直接扫描 341-360Hz 范围
      const heartRangeStart = Math.floor((341 * fftResult.fftSize) / sampleRate);
      const heartRangeEnd = Math.floor((360 * fftResult.fftSize) / sampleRate);
      let heartMaxFreq = 0;
      let heartMaxMagnitude = 0;
      for (let i = heartRangeStart; i <= heartRangeEnd && i < frequencyData.length; i++) {
        if (frequencyData[i] > heartMaxMagnitude) {
          heartMaxMagnitude = frequencyData[i];
          heartMaxFreq = Math.round((i * sampleRate) / fftResult.fftSize);
        }
      }

      console.log('');
      console.log('❤️ 【强制心轮扫描】341-360Hz 范围:');
      console.log(`   最大能量频率: ${heartMaxFreq}Hz`);
      console.log(`   幅度: ${heartMaxMagnitude.toFixed(6)}`);
      console.log('');

      // 计算能量分布
      const energyDist = fftAnalyzer.calculateEnergyDistribution(frequencyData, sampleRate, fftResult.fftSize);

      // 频谱质心
      const spectralCentroid = fftAnalyzer.calculateSpectralCentroid(frequencyData, sampleRate, fftResult.fftSize);

      // 【修复】基频估算 - 使用频谱峰值法
      const fundamentalFreq = fftAnalyzer.estimateFundamentalFrequency(frequencyData, sampleRate, fftResult.fftSize);

      // 倍频验证
      const harmonicCheck = fftAnalyzer.verifyHarmonicStructure(frequencyData, sampleRate, fftResult.fftSize, fundamentalFreq);

      fftAnalyzer.destroy();

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('【Web Audio API 原生FFT分析报告】');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('🎯 TOP 5 峰值频率 (局部最大值检测):');
      topPeaks.forEach((peak, idx) => {
        console.log(`   Peak #${idx + 1}: ${peak.frequency}Hz (幅度: ${peak.magnitude.toFixed(4)}, bin: ${peak.binIndex})`);
      });
      console.log('');
      console.log('🎵 基频估算 (频谱峰值法):');
      console.log(`   F0 = ${fundamentalFreq}Hz`);
      console.log(`   倍频验证: ${harmonicCheck.isValid ? '✓ 通过' : '✗ 未通过'} (置信度: ${(harmonicCheck.confidence * 100).toFixed(0)}%)`);
      console.log('');
      console.log('📊 绝对能量分布 (能量单位):');
      const totalE = energyDist.totalEnergy;
      console.log(`   Sub-Bass (20-60Hz):    ${(energyDist.bands['sub-bass'] / totalE * 100).toFixed(2)}%`);
      console.log(`   Bass (60-250Hz):       ${(energyDist.bands['bass'] / totalE * 100).toFixed(2)}% ← 男声基频区`);
      console.log(`   Low-Mid (250-500Hz):   ${(energyDist.bands['low-mid'] / totalE * 100).toFixed(2)}% ← 女声基频区`);
      console.log(`   Mid (500-2kHz):        ${(energyDist.bands['mid'] / totalE * 100).toFixed(2)}% ← 谐波区`);
      console.log(`   High-Mid (2k-4kHz):    ${(energyDist.bands['high-mid'] / totalE * 100).toFixed(2)}%`);
      console.log(`   Presence (4k-6kHz):    ${(energyDist.bands['presence'] / totalE * 100).toFixed(2)}%`);
      console.log(`   Brilliance (6k-20kHz): ${(energyDist.bands['brilliance'] / totalE * 100).toFixed(2)}%`);
      console.log('');
      console.log(`   ✓ 主导频段: ${energyDist.dominantBand}`);
      console.log('');
      console.log('🌈 频谱质心 (声音亮度):');
      console.log(`   Centroid = ${spectralCentroid.toFixed(1)}Hz`);
      console.log('   (质心越高,声音越"亮";质心越低,声音越"暗")');
      console.log('');
      console.log('🎯 智能主导频率判定:');

      // 【新增】综合判定逻辑
      let trueDominantFreq = fundamentalFreq;
      let judgmentReason = '基频峰值法';

      // 【心轮保护】优先检查 341-360Hz 心轮频率范围
      console.log(`   → 检查心轮频率范围 (341-360Hz)...`);
      console.log(`   → topPeaks 数量: ${topPeaks.length}`);
      topPeaks.slice(0, 10).forEach((p, i) => {
        const inHeartRange = p.frequency >= 341 && p.frequency <= 360;
        console.log(`      Peak ${i+1}: ${p.frequency}Hz (幅度: ${p.magnitude.toFixed(6)}) ${inHeartRange ? '❤️ 心轮范围' : ''}`);
      });

      // 【修复】使用强制扫描结果，阈值降到 0.0001
      if (heartMaxMagnitude > 0.0001) {
        trueDominantFreq = heartMaxFreq;
        judgmentReason = `❤️ 心轮频率强制检测 (${heartMaxFreq}Hz, 幅度 ${heartMaxMagnitude.toFixed(6)})`;
        console.log(`   ✓✓✓ 强制使用心轮频率 ${heartMaxFreq}Hz (幅度: ${heartMaxMagnitude.toFixed(6)})`);
      } else {
        console.log(`   ⚠️ 心轮频率范围能量过低 (${heartMaxMagnitude.toFixed(6)})`);

        // 如果峰值检测的第一峰远高于基频估算,优先使用峰值
        if (topPeaks.length > 0 && topPeaks[0].magnitude > 0.005) {
        const peak1 = topPeaks[0].frequency;

        // 如果峰值1在100-500Hz,且明显强于基频估算频率
        if (peak1 >= 100 && peak1 <= 500) {
          const f0BinMagnitude = frequencyData[Math.floor((fundamentalFreq * fftResult.fftSize) / sampleRate)] || 0;
          const peak1Magnitude = topPeaks[0].magnitude;

          if (peak1Magnitude > f0BinMagnitude * 1.2) {
            trueDominantFreq = peak1;
            judgmentReason = `Top峰值 (${peak1}Hz 幅度 ${peak1Magnitude.toFixed(4)} 强于基频估算 ${fundamentalFreq}Hz)`;
          }
        }
        }
      }

      // 如果频谱质心远离基频,说明能量中心偏移
      if (Math.abs(spectralCentroid - fundamentalFreq) > 100) {
        console.log(`   ⚠️ 频谱质心 (${spectralCentroid.toFixed(0)}Hz) 远离基频 (${fundamentalFreq}Hz)`);
        console.log(`   → 可能存在强谐波或多峰分布`);

        // 如果质心更接近某个峰值,使用该峰值
        for (const peak of topPeaks) {
          if (Math.abs(peak.frequency - spectralCentroid) < 50 && peak.frequency >= 100) {
            trueDominantFreq = peak.frequency;
            judgmentReason = `质心对齐 (质心${spectralCentroid.toFixed(0)}Hz 接近峰值${peak.frequency}Hz)`;
            break;
          }
        }
      }

      console.log(`   最终判定主导频率: ${trueDominantFreq}Hz`);
      console.log(`   判定依据: ${judgmentReason}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // 3. Extract chakra energy from frequency data (with weight adjustment)
      const channelData = audioBuffer.getChannelData(0);
      const chakraEnergy = this.extractChakraEnergyWithDiagnostics(
        frequencyData,
        sampleRate,
        spectrumDiagnostics,
        trueDominantFreq // 【修复】传入真实主导频率
      );

      // 4. 【核心创新】使用声学特征提取器进行多维分析
      let acousticFeatures = null;
      let healthWarning = null;
      let correctedProfile = null;

      if (this.featureExtractor) {
        console.log('[VoiceAnalyzer] Running acoustic feature extraction');
        acousticFeatures = this.featureExtractor.extractFeatures(channelData, frequencyData);

        // 生成健康预警
        healthWarning = this.featureExtractor.generateHealthWarning(acousticFeatures);
        console.log('[VoiceAnalyzer] Roughness:', acousticFeatures.roughness, 'Warning:', healthWarning.hasWarning);
      }

      // 5. 基础分析
      const { dominantChakra, gapChakras } = this.findDominantAndGaps(chakraEnergy);
      const chakraDistribution = this.calculateChakraDistribution(chakraEnergy);

      const sourceType = this.determineSourceFromChakras(chakraEnergy);
      let quality = this.determineQuality(frequencyData, chakraEnergy);
      const phase = this.determinePhase(chakraEnergy);

      // 6. 【关键修正】应用粗糙度修正
      if (acousticFeatures && acousticFeatures.roughness > 60) {
        console.log('[VoiceAnalyzer] Applying roughness correction - original quality:', quality);
        quality = 'rough'; // 强制修正为 rough
      }

      const recommendedFrequency = this.getRecommendedFrequency(dominantChakra, gapChakras);
      const dominantFrequency = CHAKRA_FREQUENCIES[dominantChakra].core;

      // 7. 【强制种子匹配】物理硬对位，禁止伪标签生成
      let prototypeMatch = await this.tryMatchPrototype(
        chakraEnergy,
        phase,
        quality,
        dominantFrequency
      );

      // 【核心规则】342-343Hz 必须匹配心轮原型（ID 000 平衡原点）
      if (dominantFrequency >= 341 && dominantFrequency <= 360 && dominantChakra === 'heart') {
        console.log('🔒 强制种子匹配: 检测到 342-343Hz，锁定心轮原型');
        // 如果没有匹配到合适的心轮原型，强制使用平衡态
        if (!prototypeMatch || prototypeMatch.id.includes('purple') || prototypeMatch.id.includes('silent')) {
          prototypeMatch = {
            id: '000',
            name: '心轮平衡者',
            tagName: '平衡原点',
            similarity: 92,
            description: '你的声音核心频率稳定在 343Hz，这是心轮的黄金共振点。代表着情感稳定、人际和谐、内心平衡的能量状态。',
            color: '#10B981',
            advice: '保持当前的心轮能量，可通过冥想、呼吸练习进一步巩固这种平衡状态。',
            organs: '心、小肠',
            rechargeHz: 343
          };
        }
      }

      // 【核心规则】200-260Hz 必须匹配下三轮原型（ID 023 稳健师）
      if (dominantFrequency >= 100 && dominantFrequency <= 250 &&
          (dominantChakra === 'root' || dominantChakra === 'sacral')) {
        console.log('🔒 强制种子匹配: 检测到 200-260Hz，锁定稳健原型');
        if (!prototypeMatch || prototypeMatch.id.includes('purple') || prototypeMatch.id.includes('silent')) {
          prototypeMatch = {
            id: '023',
            name: '稳健共振师',
            tagName: '落地的稳健师',
            similarity: 88,
            description: '你的声音展现出扎实的根基能量，低频共振稳定有力。这代表着强大的生存力、安全感和接地气的实践能力。',
            color: '#8B4513',
            advice: '你的根基能量充足，建议适度开发心轮与喉轮，提升情感表达和沟通能力。',
            organs: '肾、小肠、膀胱',
            rechargeHz: 194
          };
        }
      }

      // 【诊断输出】标签触发权重分析
      console.log('');
      console.log('🏷️ 标签触发权重诊断:');
      console.log(`   匹配到的标签: ${prototypeMatch ? prototypeMatch.tagName : '无匹配'}`);
      console.log(`   原型ID: ${prototypeMatch ? prototypeMatch.id : 'N/A'}`);
      console.log(`   匹配度: ${prototypeMatch ? prototypeMatch.similarity.toFixed(1) : 'N/A'}%`);
      console.log('');
      console.log('   关键参数:');
      console.log(`   - 主导脉轮: ${dominantChakra}`);
      console.log(`   - 主导频率: ${dominantFrequency}Hz`);
      console.log(`   - 能量相位: ${phase}`);
      console.log(`   - 声音质地: ${quality}`);
      console.log('');
      console.log('   与【稳健共振师】对比:');
      console.log('   【稳健共振师】触发阈值:');
      console.log('     - Root脉轮能量 > 30');
      console.log('     - 主导频率 200-300Hz');
      console.log('     - 相位: grounded');
      console.log('     - 质地: smooth/balanced');
      console.log('');
      console.log(`   实际值对比:`);
      console.log(`     - Root能量: ${chakraEnergy.root.toFixed(2)} ${chakraEnergy.root > 30 ? '✓' : '✗'}`);
      console.log(`     - 频率匹配: ${dominantFrequency}Hz ${(dominantFrequency >= 200 && dominantFrequency <= 300) ? '✓' : '✗'}`);
      console.log(`     - 相位匹配: ${phase} ${phase === 'grounded' ? '✓' : '✗'}`);
      console.log(`     - 质地匹配: ${quality} ${(quality === 'smooth' || quality === 'flat') ? '✓' : '✗'}`);

      if (spectrumDiagnostics.isLowFreqDominant && !prototypeMatch) {
        console.log('');
        console.log('⚠️ 检测异常: 频谱显示低频主导，但未匹配到稳健型标签');
        console.log('   可能原因: Root脉轮权重仍不足，或其他脉轮干扰');
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // 8. 【能量心理学修正】应用诊断修正
      let profileId = prototypeMatch ? prototypeMatch.id : 'balanced';
      let profileName = prototypeMatch ? prototypeMatch.name : '平衡型';
      let message = prototypeMatch ? prototypeMatch.description : '你的能量处于平衡状态';

      // 【扎根与稳健逻辑】强制修正
      if (spectrumDiagnostics.isLowFreqDominant &&
          chakraEnergy.root > 25 &&
          (dominantChakra === 'root' || dominantChakra === 'sacral')) {

        console.log('');
        console.log('🔄 应用【扎根与稳健】强制修正:');
        console.log(`   原标签: ${profileName}`);

        profileId = 'grounded-resonator';
        profileName = '稳健共振师';
        message = '你的声音展现出稳定的根基能量，像大地一样扎实。这种低频共振代表着内在的安全感和生存力量。建议保持这种接地状态，同时适度开发心轮与喉轮的表达能量。';

        console.log(`   修正后: ${profileName}`);
        console.log('   修正原因: 低频主导 + Root能量充足');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      }

      if (this.featureExtractor && acousticFeatures) {
        const correction = this.featureExtractor.correctChakraDiagnosis(
          profileName,
          dominantChakra,
          acousticFeatures
        );

        if (correction.correctedMessage) {
          profileName = correction.correctedDiagnosis;
          message = correction.correctedMessage;
          console.log('[VoiceAnalyzer] Applied diagnosis correction:', correction.correctedDiagnosis);
        }
      }

      const detectionDetails = this.generateDetectionDetails(
        frequencyData,
        sampleRate,
        chakraEnergy
      );

      const result: VoiceAnalysisResult = {
        source: sourceType,
        quality,
        phase,
        profileId,
        profileName,
        message,
        dominantChakra,
        gapChakras,
        chakraEnergy,
        chakraDistribution,
        organMapping: ORGAN_MAPPING,
        recommendedFrequency,
        detectionDetails,
        prototypeMatch: prototypeMatch || undefined,
        // 新增声学特征
        acousticFeatures: acousticFeatures ? {
          roughness: acousticFeatures.roughness,
          harmonicClarity: acousticFeatures.harmonicClarity,
          stressIndicator: acousticFeatures.stressIndicator,
          defenseLevel: acousticFeatures.defenseLevel,
          brightness: acousticFeatures.brightness,
          warmth: acousticFeatures.warmth
        } : undefined,
        healthWarning: healthWarning || undefined
      };

      console.log('[VoiceAnalyzer] Multi-dimensional analysis complete');
      return result;

    } catch (error) {
      console.error('[VoiceAnalyzer] Error:', error);
      throw error;
    }
  }

  /**
   * 【新增】查找Top 3峰值频率 - 原始物理测量
   */
  private findTop3Peaks(frequencyData: Float32Array, sampleRate: number): Array<{frequency: number, energy: number}> {
    const fftSize = frequencyData.length * 2;
    const peaks: Array<{frequency: number, energy: number, bin: number}> = [];

    // 只分析100-1000Hz区间（人声核心频段）
    const minBin = Math.floor((100 * fftSize) / sampleRate);
    const maxBin = Math.floor((1000 * fftSize) / sampleRate);

    // 收集所有峰值
    for (let i = minBin; i < maxBin && i < frequencyData.length; i++) {
      const frequency = Math.round((i * sampleRate) / fftSize);
      const energy = frequencyData[i];
      peaks.push({ frequency, energy, bin: i });
    }

    // 按能量排序
    peaks.sort((a, b) => b.energy - a.energy);

    // 返回Top 3
    return peaks.slice(0, 3).map(p => ({
      frequency: p.frequency,
      energy: p.energy
    }));
  }

  /**
   * 简化的FFT实现 - 提取频谱数据
   */
  /**
   * 分析频谱分布 - 诊断模式
   */
  private analyzeSpectrumDistribution(frequencyData: Float32Array, sampleRate: number) {
    const totalEnergy = frequencyData.reduce((sum, val) => sum + val, 0);

    // 计算各频段占比
    const getBandEnergy = (startHz: number, endHz: number) => {
      // 【修复】正确的频率到bin映射
      const fftSize = frequencyData.length * 2;
      const startIdx = Math.floor((startHz * fftSize) / sampleRate);
      const endIdx = Math.floor((endHz * fftSize) / sampleRate);
      let energy = 0;
      for (let i = startIdx; i < endIdx && i < frequencyData.length; i++) {
        energy += frequencyData[i];
      }
      return (energy / totalEnergy) * 100;
    };

    const bands = {
      '100-200Hz': getBandEnergy(100, 200),
      '200-300Hz': getBandEnergy(200, 300),
      '300-400Hz': getBandEnergy(300, 400),
      '400-500Hz': getBandEnergy(400, 500),
      '500-600Hz': getBandEnergy(500, 600),
      '600Hz+': getBandEnergy(600, 4000)
    };

    // 找主导频率
    let maxEnergy = 0;
    let dominantFrequency = 0;
    const fftSize = frequencyData.length * 2;
    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxEnergy) {
        maxEnergy = frequencyData[i];
        // 【修复】bin到Hz正确公式
        dominantFrequency = Math.floor((i * sampleRate) / fftSize);
      }
    }

    // 检查特定频率能量
    const energy260Hz = getBandEnergy(250, 270);
    const energy432Hz = getBandEnergy(420, 445);

    // 判断是否为低频主导
    const lowFreqEnergy = bands['100-200Hz'] + bands['200-300Hz'];
    const isLowFreqDominant = lowFreqEnergy > 40;

    return {
      bands,
      dominantFrequency,
      energy260Hz,
      energy432Hz,
      isLowFreqDominant,
      lowFreqTotal: lowFreqEnergy
    };
  }

  /**
   * 带诊断的脉轮能量提取 - 应用权重调整
   */
  private extractChakraEnergyWithDiagnostics(
    fftData: Float32Array,
    sampleRate: number,
    diagnostics: any,
    trueDominantFreq?: number
  ): ChakraEnergy {
    const chakraEnergy: ChakraEnergy = {
      root: 0,
      sacral: 0,
      solar: 0,
      heart: 0,
      throat: 0,
      thirdEye: 0,
      crown: 0
    };

    const detectionOrder: Array<keyof ChakraEnergy> = ['heart', 'throat', 'thirdEye', 'sacral', 'solar', 'root', 'crown'];

    console.log('');
    console.log('⚖️ 【修复】基于真实主导频率的能量分配策略:');
    console.log(`   trueDominantFreq = ${trueDominantFreq} (类型: ${typeof trueDominantFreq})`);
    if (trueDominantFreq) {
      console.log(`   - 主导频率: ${trueDominantFreq}Hz → 对应脉轮 +400% (绝对优势)`);
      console.log(`   - 非主导脉轮: 衰减至 15%`);
      console.log(`   - 支撑基底 (200-260Hz): 最多占 30% (不盖过主导)`);
    } else {
      console.log(`   ❌ trueDominantFreq 为空,使用原始能量计算`);
    }
    console.log('');

    for (const chakraKey of detectionOrder) {
      const { core, range } = CHAKRA_FREQUENCIES[chakraKey];

      const coreEnergy = this.getEnergyAtFrequency(fftData, core, sampleRate);
      const rangeEnergy = this.getEnergyInRange(fftData, range[0], range[1], sampleRate);

      // 【修复】改变权重公式 - 核心频率更重要
      let baseEnergy = (coreEnergy * 0.85 + rangeEnergy * 0.15);

      console.log(`   ${chakraKey}: 范围[${range[0]}-${range[1]}Hz] coreEnergy=${coreEnergy.toFixed(6)} rangeEnergy=${rangeEnergy.toFixed(6)} baseEnergy=${baseEnergy.toFixed(6)}`);

      // 【关键修复】如果真实主导频率命中该脉轮,大幅提升
      if (trueDominantFreq) {
        const { range } = CHAKRA_FREQUENCIES[chakraKey];
        const isMatch = trueDominantFreq >= range[0] && trueDominantFreq <= range[1];
        console.log(`      → 检查 ${trueDominantFreq}Hz 是否在 [${range[0]}-${range[1]}]: ${isMatch}`);

        if (isMatch) {
          const beforeBoost = baseEnergy;
          // 主导脉轮 * 5.0 (绝对优势)
          baseEnergy *= 5.0;
          console.log(`      ✓✓✓ 命中主导脉轮! ${beforeBoost.toFixed(6)} → ${baseEnergy.toFixed(6)} (+400%)`);
        } else {
          const beforeDecay = baseEnergy;
          // 非主导脉轮衰减 85%
          baseEnergy *= 0.15;
          console.log(`      → 非主导脉轮衰减: ${beforeDecay.toFixed(6)} → ${baseEnergy.toFixed(6)} (-85%)`);
        }
      }

      // 【新增】支撑频率逻辑 - 200-260Hz 作为基底,给予适度能量
      // 但不应盖过主导频率
      if ((chakraKey === 'root' || chakraKey === 'sacral') && trueDominantFreq) {
        // 如果主导频率在心轮以上,下三轮只保留基底能量
        if (trueDominantFreq >= 341) {
          const supportEnergy = this.getEnergyInRange(fftData, 200, 260, sampleRate);
          if (supportEnergy > 0.001) {
            // 支撑基底最多占 30%
            baseEnergy = Math.min(baseEnergy, supportEnergy * 0.3);
            console.log(`   → ${chakraKey} 作为支撑基底 (200-260Hz): ${baseEnergy.toFixed(4)} (限制在30%以下)`);
          }
        }
      }

      chakraEnergy[chakraKey] = baseEnergy;
    }

    console.log('');
    console.log('🔋 调整后脉轮能量:');
    Object.entries(chakraEnergy).forEach(([key, value]) => {
      console.log(`   ${key}: ${value.toFixed(2)}`);
    });

    return chakraEnergy;
  }

  private performSimpleFFT(audioData: Float32Array): Float32Array {
    const fftSize = 4096; // 【修复】使用4096匹配第三方软件
    const frequencyData = new Float32Array(fftSize / 2);

    // 取中间部分样本进行分析
    const startSample = Math.floor((audioData.length - fftSize) / 2);
    const segment = audioData.slice(startSample, startSample + fftSize);

    // 【修复】使用真正的DFT计算(简化版FFT)
    // 对于人声关键频段(100-1000Hz),使用更精确的计算
    for (let k = 0; k < frequencyData.length; k++) {
      let real = 0;
      let imag = 0;

      // 对每个频率bin进行DFT计算
      for (let n = 0; n < segment.length; n++) {
        const angle = (-2 * Math.PI * k * n) / fftSize;
        real += segment[n] * Math.cos(angle);
        imag += segment[n] * Math.sin(angle);
      }

      // 计算幅度
      frequencyData[k] = Math.sqrt(real * real + imag * imag) / fftSize;
    }

    return frequencyData;
  }

  async analyzeMediaStream(stream: MediaStream): Promise<VoiceAnalysisResult> {
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyzer);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const frequencyData = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(frequencyData);

    const sampleRate = this.audioContext.sampleRate;
    const fftData = this.convertFrequencyData(frequencyData);
    const chakraEnergy = this.extractChakraEnergy(fftData, sampleRate);
    const detectionDetails = this.generateDetectionDetails(fftData, sampleRate, chakraEnergy);

    const sourceType = this.determineSourceFromChakras(chakraEnergy);
    const quality = this.determineQuality(fftData, chakraEnergy);
    const phase = this.determinePhase(chakraEnergy);

    const { dominantChakra, gapChakras } = this.findDominantAndGaps(chakraEnergy);
    const chakraDistribution = this.calculateChakraDistribution(chakraEnergy);
    const recommendedFrequency = this.getRecommendedFrequency(dominantChakra, gapChakras);

    const dominantFrequency = CHAKRA_FREQUENCIES[dominantChakra].core;
    const prototypeMatch = await this.tryMatchPrototype(chakraEnergy, phase, quality, dominantFrequency);

    const profile = this.matchProfile(sourceType, quality, phase);

    source.disconnect();

    return {
      source: sourceType,
      quality,
      phase,
      profileId: prototypeMatch ? prototypeMatch.id : profile.id,
      profileName: prototypeMatch ? prototypeMatch.name : profile.name,
      message: prototypeMatch ? prototypeMatch.description : profile.message,
      dominantChakra,
      gapChakras,
      chakraEnergy,
      chakraDistribution,
      organMapping: ORGAN_MAPPING,
      recommendedFrequency,
      detectionDetails,
      prototypeMatch: prototypeMatch || undefined
    };
  }

  private async performFastFFT(audioBuffer: AudioBuffer): Promise<Float32Array> {
    console.log('[VoiceAnalyzer] Using simplified energy analysis (no FFT)');

    // SIMPLIFIED: Just create a fake frequency spectrum based on audio characteristics
    // This avoids the expensive FFT calculation entirely
    const channelData = audioBuffer.getChannelData(0);
    const binCount = 1024; // Smaller bin count
    const fftData = new Float32Array(binCount);

    // Calculate energy in different frequency bands using simple RMS
    const samplesPerBin = Math.floor(channelData.length / binCount);

    for (let i = 0; i < binCount; i++) {
      let sum = 0;
      const start = i * samplesPerBin;
      const end = Math.min(start + samplesPerBin, channelData.length);

      for (let j = start; j < end; j++) {
        sum += channelData[j] * channelData[j];
      }

      // Normalize and scale to 0-255 range
      fftData[i] = Math.sqrt(sum / samplesPerBin) * 255;
    }

    console.log('[VoiceAnalyzer] Simplified analysis complete, bins:', fftData.length);
    return fftData;
  }

  private performFFT(channelData: Float32Array, sampleRate: number): Float32Array {
    console.log('[VoiceAnalyzer] Starting FFT calculation...');
    const bufferSize = Math.min(this.fftSize, channelData.length);
    const buffer = new Float32Array(bufferSize);

    // Apply window function
    for (let i = 0; i < bufferSize; i++) {
      buffer[i] = channelData[i] * this.hammingWindow(i, bufferSize);
    }

    const fftResult = new Float32Array(bufferSize / 2);

    // Optimized FFT: only calculate frequencies we care about (every 4th bin)
    const stride = 4;
    for (let k = 0; k < bufferSize / 2; k += stride) {
      let real = 0;
      let imag = 0;

      // Calculate only for important frequency bins
      for (let n = 0; n < bufferSize; n += 2) { // Sample every other point
        const angle = (-2 * Math.PI * k * n) / bufferSize;
        real += buffer[n] * Math.cos(angle);
        imag += buffer[n] * Math.sin(angle);
      }

      const magnitude = Math.sqrt(real * real + imag * imag);

      // Fill in the stride gap with interpolated values
      for (let s = 0; s < stride && k + s < bufferSize / 2; s++) {
        fftResult[k + s] = magnitude;
      }
    }

    console.log('[VoiceAnalyzer] FFT calculation complete');
    return fftResult;
  }

  private hammingWindow(i: number, N: number): number {
    return 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (N - 1));
  }

  private convertFrequencyData(frequencyData: Uint8Array): Float32Array {
    const result = new Float32Array(frequencyData.length);
    for (let i = 0; i < frequencyData.length; i++) {
      result[i] = frequencyData[i] / 255.0;
    }
    return result;
  }

  private extractChakraEnergy(fftData: Float32Array, sampleRate: number): ChakraEnergy {
    const chakraEnergy: ChakraEnergy = {
      root: 0,
      sacral: 0,
      solar: 0,
      heart: 0,
      throat: 0,
      thirdEye: 0,
      crown: 0
    };

    const detectionOrder: Array<keyof ChakraEnergy> = ['heart', 'throat', 'thirdEye', 'sacral', 'solar', 'root', 'crown'];

    for (const chakraKey of detectionOrder) {
      const { core, range } = CHAKRA_FREQUENCIES[chakraKey];

      const coreEnergy = this.getEnergyAtFrequency(fftData, core, sampleRate);
      const rangeEnergy = this.getEnergyInRange(fftData, range[0], range[1], sampleRate);

      chakraEnergy[chakraKey] = (
        coreEnergy * 0.75 +
        rangeEnergy * 0.25
      );
    }

    return chakraEnergy;
  }

  private getEnergyAtFrequency(fftData: Float32Array, frequency: number, sampleRate: number): number {
    // 【修复】正确的频率到bin的映射公式
    // binIndex = (frequency * fftSize) / sampleRate
    const fftSize = fftData.length * 2; // FFT输出是 fftSize/2
    const binIndex = Math.round((frequency * fftSize) / sampleRate);
    const startBin = Math.max(0, binIndex - 3);
    const endBin = Math.min(fftData.length - 1, binIndex + 3);

    let energy = 0;
    for (let i = startBin; i <= endBin; i++) {
      energy += fftData[i] * fftData[i];
    }

    return energy / (endBin - startBin + 1);
  }

  private getEnergyInRange(fftData: Float32Array, minFreq: number, maxFreq: number, sampleRate: number): number {
    // 【修复】正确的频率范围映射
    const fftSize = fftData.length * 2;
    const minBin = Math.round((minFreq * fftSize) / sampleRate);
    const maxBin = Math.round((maxFreq * fftSize) / sampleRate);

    let energy = 0;
    for (let i = minBin; i <= maxBin && i < fftData.length; i++) {
      energy += fftData[i] * fftData[i];
    }

    return energy / (maxBin - minBin + 1);
  }

  private generateDetectionDetails(
    fftData: Float32Array,
    sampleRate: number,
    chakraEnergy: ChakraEnergy
  ): Array<{
    chakra: keyof ChakraEnergy;
    detectedFrequency: number;
    coreFrequency: number;
    organSystem: string;
  }> {
    const chakraNames = {
      root: '海底轮',
      sacral: '脐轮',
      solar: '太阳轮',
      heart: '心轮',
      throat: '喉轮',
      thirdEye: '眉心轮',
      crown: '顶轮'
    };

    const details: Array<{
      chakra: keyof ChakraEnergy;
      detectedFrequency: number;
      coreFrequency: number;
      organSystem: string;
    }> = [];

    for (const chakra in CHAKRA_FREQUENCIES) {
      const chakraKey = chakra as keyof ChakraEnergy;
      const { core, range } = CHAKRA_FREQUENCIES[chakraKey];

      const detectedFreq = this.findPeakFrequencyInRange(fftData, range[0], range[1], sampleRate);
      const organs = ORGAN_MAPPING[chakraKey].join('、');

      details.push({
        chakra: chakraKey,
        detectedFrequency: detectedFreq,
        coreFrequency: core,
        organSystem: `${chakraNames[chakraKey]}（${organs}）`
      });
    }

    return details.sort((a, b) => chakraEnergy[b.chakra] - chakraEnergy[a.chakra]);
  }

  private findPeakFrequencyInRange(
    fftData: Float32Array,
    minFreq: number,
    maxFreq: number,
    sampleRate: number
  ): number {
    // 【修复】正确的bin到频率映射
    const fftSize = fftData.length * 2;
    const minBin = Math.round((minFreq * fftSize) / sampleRate);
    const maxBin = Math.round((maxFreq * fftSize) / sampleRate);

    let peakBin = minBin;
    let peakValue = fftData[minBin] || 0;

    for (let i = minBin; i <= maxBin && i < fftData.length; i++) {
      if (fftData[i] > peakValue) {
        peakValue = fftData[i];
        peakBin = i;
      }
    }

    // 【修复】bin到Hz的正确公式: Hz = (bin * sampleRate) / fftSize
    return Math.round((peakBin * sampleRate) / fftSize);
  }

  private determineSourceFromChakras(chakraEnergy: ChakraEnergy): 'brain' | 'throat' | 'heart' | 'lower' {
    const upperChakras = chakraEnergy.thirdEye + chakraEnergy.crown;
    const throatChakra = chakraEnergy.throat;
    const heartChakra = chakraEnergy.heart;
    const lowerChakras = chakraEnergy.root + chakraEnergy.sacral + chakraEnergy.solar;

    const maxEnergy = Math.max(upperChakras, throatChakra, heartChakra, lowerChakras);

    if (maxEnergy === upperChakras) return 'brain';
    if (maxEnergy === throatChakra) return 'throat';
    if (maxEnergy === heartChakra) return 'heart';
    return 'lower';
  }

  private findDominantAndGaps(chakraEnergy: ChakraEnergy): {
    dominantChakra: keyof ChakraEnergy;
    gapChakras: Array<keyof ChakraEnergy>;
  } {
    const chakras = Object.entries(chakraEnergy).map(([name, energy]) => ({
      name: name as keyof ChakraEnergy,
      energy
    }));

    chakras.sort((a, b) => b.energy - a.energy);

    return {
      dominantChakra: chakras[0].name,
      gapChakras: [chakras[chakras.length - 1].name, chakras[chakras.length - 2].name]
    };
  }

  private calculateChakraDistribution(chakraEnergy: ChakraEnergy): ChakraEnergy {
    const total = Object.values(chakraEnergy).reduce((sum, energy) => sum + energy, 0);

    console.log('');
    console.log('📊 【归一化前】绝对能量值:');
    Object.entries(chakraEnergy).forEach(([key, value]) => {
      console.log(`   ${key}: ${value.toFixed(6)}`);
    });
    console.log(`   总能量: ${total.toFixed(6)}`);
    console.log('');

    if (total === 0) {
      return {
        root: 14.29,
        sacral: 14.29,
        solar: 14.29,
        heart: 14.29,
        throat: 14.29,
        thirdEye: 14.28,
        crown: 14.28
      };
    }

    const percentages = {
      root: Math.round((chakraEnergy.root / total) * 100),
      sacral: Math.round((chakraEnergy.sacral / total) * 100),
      solar: Math.round((chakraEnergy.solar / total) * 100),
      heart: Math.round((chakraEnergy.heart / total) * 100),
      throat: Math.round((chakraEnergy.throat / total) * 100),
      thirdEye: Math.round((chakraEnergy.thirdEye / total) * 100),
      crown: Math.round((chakraEnergy.crown / total) * 100)
    };

    console.log('📊 【归一化后】百分比:');
    Object.entries(percentages).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}%`);
    });
    console.log('');

    return percentages;
  }

  // 【禁用补足逻辑】不再基于"缺失频率"生成虚假诊断
  // 报告首要任务是定性当前状态的优点，而非强行寻找缺失频率
  private getRecommendedFrequency(
    dominant: keyof ChakraEnergy,
    gaps: Array<keyof ChakraEnergy>
  ): { hz: number; chakra: keyof ChakraEnergy; reason: string } {
    const chakraNames = {
      root: '海底轮',
      sacral: '脐轮',
      solar: '太阳轮',
      heart: '心轮',
      throat: '喉轮',
      thirdEye: '眉心轮',
      crown: '顶轮'
    };

    // 【核心变更】只推荐主导脉轮的共振频率，强化优势
    const dominantHz = CHAKRA_FREQUENCIES[dominant].core;
    const dominantOrgans = ORGAN_MAPPING[dominant].join('、');

    const reason = `你的${chakraNames[dominant]}能量稳定强劲，建议使用 ${dominantHz}Hz 共振音频持续滋养${dominantOrgans}系统，巩固现有优势。`;

    return {
      hz: dominantHz,
      chakra: dominant,
      reason
    };
  }

  private determineQuality(fftData: Float32Array, chakraEnergy: ChakraEnergy): 'smooth' | 'rough' | 'flat' {
    const roughness = this.calculateRoughnessFromFFT(fftData);
    const smoothness = this.calculateSmoothnessFromFFT(fftData);

    if (roughness > 0.15) {
      return 'rough';
    } else if (smoothness > 0.85 && roughness < 0.05) {
      return 'flat';
    } else {
      return 'smooth';
    }
  }

  private calculateRoughnessFromFFT(fftData: Float32Array): number {
    let roughness = 0;
    const highFreqStart = Math.floor(fftData.length * 0.6);

    for (let i = highFreqStart; i < fftData.length - 1; i++) {
      const diff = Math.abs(fftData[i + 1] - fftData[i]);
      roughness += diff;
    }

    return roughness / (fftData.length - highFreqStart);
  }

  private calculateSmoothnessFromFFT(fftData: Float32Array): number {
    let variance = 0;
    let mean = 0;

    for (let i = 0; i < fftData.length; i++) {
      mean += fftData[i];
    }
    mean /= fftData.length;

    for (let i = 0; i < fftData.length; i++) {
      variance += Math.pow(fftData[i] - mean, 2);
    }
    variance /= fftData.length;

    return 1 / (1 + variance);
  }

  private determinePhase(chakraEnergy: ChakraEnergy): 'grounded' | 'floating' | 'scattering' {
    const upperEnergy = chakraEnergy.crown + chakraEnergy.thirdEye;
    const lowerEnergy = chakraEnergy.root + chakraEnergy.sacral;
    const throatEnergy = chakraEnergy.throat;

    if (upperEnergy > lowerEnergy * 2) {
      return 'floating';
    } else if (throatEnergy > upperEnergy && throatEnergy > lowerEnergy) {
      return 'scattering';
    } else {
      return 'grounded';
    }
  }

  private matchProfile(source: string, quality: string, phase: string): EmotionProfile {
    let bestMatch = EMOTION_PROFILES[0];
    let bestScore = 0;

    for (const profile of EMOTION_PROFILES) {
      let score = 0;

      if (profile.source === source) score += 3;
      if (profile.quality === quality) score += 2;
      if (profile.phase === phase) score += 1;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = profile;
      }
    }

    return bestMatch;
  }

  private async tryMatchPrototype(
    chakraEnergy: ChakraEnergy,
    phase: 'grounded' | 'floating' | 'scattering',
    quality: 'smooth' | 'rough' | 'flat',
    dominantFrequency: number
  ): Promise<{
    id: string;
    name: string;
    tagName: string;
    similarity: number;
    description: string;
    color: string;
    advice?: string;
    organs?: string;
    doList?: string[];
    dontList?: string[];
    rechargeHz?: number;
  } | null> {
    try {
      console.log('[VoiceAnalyzer] Importing prototype matching modules...');
      const { matchPrototype } = await import('./prototypeMatching');
      const { generateDynamicPrototype } = await import('./dynamicPrototypeGenerator');
      console.log('[VoiceAnalyzer] Modules imported successfully');

      const phaseMapping: Record<'grounded' | 'floating' | 'scattering', 'grounded' | 'floating' | 'dispersed'> = {
        'grounded': 'grounded',
        'floating': 'floating',
        'scattering': 'dispersed'
      };

      const mappedPhase = phaseMapping[phase];
      console.log('[VoiceAnalyzer] Calling matchPrototype with mappedPhase:', mappedPhase);

      const match = await matchPrototype(chakraEnergy, mappedPhase, quality);
      console.log('[VoiceAnalyzer] matchPrototype returned:', match ? 'Match found' : 'No match');

      if (match && match.similarity >= 85) {
        console.log('[VoiceAnalyzer] Using database prototype:', match.prototype.name);
        return {
          id: match.prototype.id,
          name: match.prototype.name,
          tagName: match.prototype.tagName,
          similarity: match.similarity,
          description: match.prototype.description,
          color: match.prototype.color,
          advice: match.prototype.advice,
          organs: match.prototype.organs,
          doList: match.prototype.doList,
          dontList: match.prototype.dontList,
          rechargeHz: match.prototype.rechargeHz
        };
      }

      console.log('[VoiceAnalyzer] No database match, generating dynamic prototype...');
      const generated = generateDynamicPrototype(chakraEnergy, phase, quality, dominantFrequency);
      console.log('[VoiceAnalyzer] Dynamic prototype generated:', generated.name);

      return {
        id: generated.id,
        name: generated.name,
        tagName: generated.tagName,
        similarity: match?.similarity || 0,
        description: generated.description,
        color: generated.color,
        advice: generated.advice,
        organs: generated.organs,
        doList: generated.doList,
        dontList: generated.dontList,
        rechargeHz: generated.rechargeHz
      };
    } catch (error) {
      console.warn('Prototype matching failed:', error);
      return null;
    }
  }

  destroy() {
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}
