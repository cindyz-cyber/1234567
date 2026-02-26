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

const CHAKRA_FREQUENCIES = {
  root: { base: 194, range: [100, 199], core: 194 },
  heart: { base: 343, range: [340, 355], core: 343 },
  throat: { base: 384, range: [375, 405], core: 384 },
  sacral: { base: 417, range: [406, 419], core: 417 },
  thirdEye: { base: 432, range: [420, 460], core: 432 },
  solar: { base: 528, range: [480, 580], core: 528 },
  crown: { base: 963, range: [920, 1200], core: 963 }
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
  private fftSize: number = 2048; // Reduced from 8192 to fix performance issue
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

      // 2. Perform FFT analysis
      const channelData = audioBuffer.getChannelData(0);
      const frequencyData = this.performSimpleFFT(channelData);
      console.log('[VoiceAnalyzer] FFT analysis complete');

      // 【诊断模式】输出原始频谱分布
      const spectrumDiagnostics = this.analyzeSpectrumDistribution(frequencyData, audioBuffer.sampleRate);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('【开发者模式：频谱排查报告】');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 原始频谱分布 (Raw Spectrum):');
      console.log(`   100-200Hz: ${spectrumDiagnostics.bands['100-200Hz'].toFixed(2)}%`);
      console.log(`   200-300Hz: ${spectrumDiagnostics.bands['200-300Hz'].toFixed(2)}%`);
      console.log(`   300-400Hz: ${spectrumDiagnostics.bands['300-400Hz'].toFixed(2)}%`);
      console.log(`   400-500Hz: ${spectrumDiagnostics.bands['400-500Hz'].toFixed(2)}%`);
      console.log(`   500-600Hz: ${spectrumDiagnostics.bands['500-600Hz'].toFixed(2)}%`);
      console.log(`   600Hz+: ${spectrumDiagnostics.bands['600Hz+'].toFixed(2)}%`);
      console.log('');
      console.log('🎯 基频偏移检查:');
      console.log(`   检测到的主导频率: ${spectrumDiagnostics.dominantFrequency}Hz`);
      console.log(`   260Hz附近能量: ${spectrumDiagnostics.energy260Hz.toFixed(2)}%`);
      console.log(`   432Hz附近能量: ${spectrumDiagnostics.energy432Hz.toFixed(2)}%`);
      console.log(`   是否为低频主导: ${spectrumDiagnostics.isLowFreqDominant ? '✓ 是' : '✗ 否'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // 3. Extract chakra energy from frequency data (with weight adjustment)
      const chakraEnergy = this.extractChakraEnergyWithDiagnostics(
        frequencyData,
        audioBuffer.sampleRate,
        spectrumDiagnostics
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

      // 7. 尝试匹配原型
      const prototypeMatch = await this.tryMatchPrototype(
        chakraEnergy,
        phase,
        quality,
        dominantFrequency
      );

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
        audioBuffer.sampleRate,
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
   * 简化的FFT实现 - 提取频谱数据
   */
  /**
   * 分析频谱分布 - 诊断模式
   */
  private analyzeSpectrumDistribution(frequencyData: Float32Array, sampleRate: number) {
    const totalEnergy = frequencyData.reduce((sum, val) => sum + val, 0);

    // 计算各频段占比
    const getBandEnergy = (startHz: number, endHz: number) => {
      const startIdx = Math.floor((startHz * frequencyData.length) / (sampleRate / 2));
      const endIdx = Math.floor((endHz * frequencyData.length) / (sampleRate / 2));
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
    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxEnergy) {
        maxEnergy = frequencyData[i];
        dominantFrequency = Math.floor((i * sampleRate) / (2 * frequencyData.length));
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
    diagnostics: any
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
    console.log('⚖️ 权重调整策略:');
    console.log('   - 紫色/灵性维度权重: -30%');
    console.log('   - 下三轮（100-300Hz）权重: +30%');
    console.log('');

    for (const chakraKey of detectionOrder) {
      const { core, range } = CHAKRA_FREQUENCIES[chakraKey];

      const coreEnergy = this.getEnergyAtFrequency(fftData, core, sampleRate);
      const rangeEnergy = this.getEnergyInRange(fftData, range[0], range[1], sampleRate);

      let baseEnergy = (coreEnergy * 0.75 + rangeEnergy * 0.25);

      // 【权重调整】应用临时修正
      if (chakraKey === 'crown' || chakraKey === 'thirdEye') {
        // 降低紫色/灵性维度权重 30%
        baseEnergy *= 0.7;
      }

      if (chakraKey === 'root' || chakraKey === 'sacral') {
        // 增加下三轮权重 30%
        baseEnergy *= 1.3;
      }

      // 如果检测到低频主导，进一步强化root
      if (diagnostics.isLowFreqDominant && chakraKey === 'root') {
        baseEnergy *= 1.2;
        console.log(`   ✓ 检测到低频主导，Root脉轮额外提升20%`);
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
    const fftSize = 2048;
    const frequencyData = new Float32Array(fftSize / 2);

    // 取中间部分样本进行分析
    const startSample = Math.floor((audioData.length - fftSize) / 2);
    const segment = audioData.slice(startSample, startSample + fftSize);

    // 简化的频谱能量计算（实际应用中会使用完整的FFT）
    for (let i = 0; i < frequencyData.length; i++) {
      let sum = 0;
      const freqBin = i * 2;
      for (let j = 0; j < segment.length; j += freqBin + 1) {
        sum += Math.abs(segment[j]);
      }
      frequencyData[i] = sum / (segment.length / (freqBin + 1));
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
    const binIndex = Math.round((frequency * fftData.length) / (sampleRate / 2));
    const startBin = Math.max(0, binIndex - 3);
    const endBin = Math.min(fftData.length - 1, binIndex + 3);

    let energy = 0;
    for (let i = startBin; i <= endBin; i++) {
      energy += fftData[i] * fftData[i];
    }

    return energy / (endBin - startBin + 1);
  }

  private getEnergyInRange(fftData: Float32Array, minFreq: number, maxFreq: number, sampleRate: number): number {
    const minBin = Math.round((minFreq * fftData.length) / (sampleRate / 2));
    const maxBin = Math.round((maxFreq * fftData.length) / (sampleRate / 2));

    let energy = 0;
    for (let i = minBin; i <= maxBin; i++) {
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
    const minBin = Math.round((minFreq * fftData.length) / (sampleRate / 2));
    const maxBin = Math.round((maxFreq * fftData.length) / (sampleRate / 2));

    let peakBin = minBin;
    let peakValue = fftData[minBin];

    for (let i = minBin; i <= maxBin; i++) {
      if (fftData[i] > peakValue) {
        peakValue = fftData[i];
        peakBin = i;
      }
    }

    return Math.round((peakBin * sampleRate / 2) / fftData.length);
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

    return {
      root: Math.round((chakraEnergy.root / total) * 100),
      sacral: Math.round((chakraEnergy.sacral / total) * 100),
      solar: Math.round((chakraEnergy.solar / total) * 100),
      heart: Math.round((chakraEnergy.heart / total) * 100),
      throat: Math.round((chakraEnergy.throat / total) * 100),
      thirdEye: Math.round((chakraEnergy.thirdEye / total) * 100),
      crown: Math.round((chakraEnergy.crown / total) * 100)
    };
  }

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

    const primaryGap = gaps[0];
    const gapHz = CHAKRA_FREQUENCIES[primaryGap].core;
    const gapOrgans = ORGAN_MAPPING[primaryGap].join('、');

    const reason = `由于${chakraNames[primaryGap]}能量断层，建议补充 ${gapHz}Hz 频率的音频，滋养${gapOrgans}系统，恢复整体能量平衡。`;

    return {
      hz: gapHz,
      chakra: primaryGap,
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
