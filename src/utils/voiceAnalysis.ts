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
  sacral: { base: 417, range: [200, 339], core: 417 },
  solar: { base: 528, range: [480, 580], core: 528 },
  heart: { base: 343, range: [340, 355], core: 343 },
  throat: { base: 384, range: [375, 405], core: 384 },
  thirdEye: { base: 432, range: [420, 460], core: 432 },
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
  private fftSize: number = 8192;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = this.fftSize;
    this.analyzer.smoothingTimeConstant = 0.3;
  }

  async analyzeAudioBuffer(audioBlob: Blob): Promise<VoiceAnalysisResult> {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;

    const fftData = this.performFFT(channelData, sampleRate);
    const chakraEnergy = this.extractChakraEnergy(fftData, sampleRate);
    const detectionDetails = this.generateDetectionDetails(fftData, sampleRate, chakraEnergy);

    const source = this.determineSourceFromChakras(chakraEnergy);
    const quality = this.determineQuality(fftData, chakraEnergy);
    const phase = this.determinePhase(chakraEnergy);

    const { dominantChakra, gapChakras } = this.findDominantAndGaps(chakraEnergy);
    const chakraDistribution = this.calculateChakraDistribution(chakraEnergy);
    const recommendedFrequency = this.getRecommendedFrequency(dominantChakra, gapChakras);

    const profile = this.matchProfile(source, quality, phase);

    return {
      source,
      quality,
      phase,
      profileId: profile.id,
      profileName: profile.name,
      message: profile.message,
      dominantChakra,
      gapChakras,
      chakraEnergy,
      chakraDistribution,
      organMapping: ORGAN_MAPPING,
      recommendedFrequency,
      detectionDetails
    };
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

    const profile = this.matchProfile(sourceType, quality, phase);

    source.disconnect();

    return {
      source: sourceType,
      quality,
      phase,
      profileId: profile.id,
      profileName: profile.name,
      message: profile.message,
      dominantChakra,
      gapChakras,
      chakraEnergy,
      chakraDistribution,
      organMapping: ORGAN_MAPPING,
      recommendedFrequency,
      detectionDetails
    };
  }

  private performFFT(channelData: Float32Array, sampleRate: number): Float32Array {
    const bufferSize = Math.min(this.fftSize, channelData.length);
    const buffer = new Float32Array(bufferSize);

    for (let i = 0; i < bufferSize; i++) {
      buffer[i] = channelData[i] * this.hammingWindow(i, bufferSize);
    }

    const fftResult = new Float32Array(bufferSize / 2);

    for (let k = 0; k < bufferSize / 2; k++) {
      let real = 0;
      let imag = 0;

      for (let n = 0; n < bufferSize; n++) {
        const angle = (-2 * Math.PI * k * n) / bufferSize;
        real += buffer[n] * Math.cos(angle);
        imag += buffer[n] * Math.sin(angle);
      }

      fftResult[k] = Math.sqrt(real * real + imag * imag);
    }

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

    const detectionOrder: Array<keyof ChakraEnergy> = ['heart', 'throat', 'thirdEye', 'solar', 'root', 'sacral', 'crown'];

    for (const chakraKey of detectionOrder) {
      const { core, range } = CHAKRA_FREQUENCIES[chakraKey];

      const coreEnergy = this.getEnergyAtFrequency(fftData, core, sampleRate);
      const rangeEnergy = this.getEnergyInRange(fftData, range[0], range[1], sampleRate);

      chakraEnergy[chakraKey] = (
        coreEnergy * 0.7 +
        rangeEnergy * 0.3
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

  destroy() {
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}
