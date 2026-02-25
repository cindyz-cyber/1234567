export interface VoiceAnalysisResult {
  source: 'brain' | 'throat' | 'heart' | 'lower';
  quality: 'smooth' | 'rough' | 'flat';
  phase: 'grounded' | 'floating' | 'scattering';
  profileId: string;
  profileName: string;
  message: string;
  dominantCenter: 'brain' | 'throat' | 'heart';
  gapCenter: 'brain' | 'throat' | 'heart';
  energyData: {
    freq432Hz: number;
    freq384Hz: number;
    freq342Hz: number;
    roughness: number;
    smoothness: number;
    brainEnergy: number;
    throatEnergy: number;
    heartEnergy: number;
  };
  frequencyDistribution: {
    heart: number;
    throat: number;
    brain: number;
  };
  recommendedFrequency: {
    hz: number;
    center: 'brain' | 'throat' | 'heart';
    reason: string;
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
    message: '保持这种心口合一，你现在非常有感染力。'
  },
  {
    id: '065',
    name: '带刺的防御者',
    source: 'throat',
    quality: 'rough',
    phase: 'scattering',
    message: '这种尖锐是在保护你，试着对自己温柔一点。'
  },
  {
    id: '343',
    name: '高速运转的处理器',
    source: 'brain',
    quality: 'flat',
    phase: 'grounded',
    message: '逻辑很满，但也别忘了给你的心留一点空位。'
  },
  {
    id: '372',
    name: '云端漫步的理想家',
    source: 'brain',
    quality: 'smooth',
    phase: 'floating',
    message: '你的想法很高级，现在只需要把它带回到地面。'
  }
];

export class VoiceAnalyzer {
  private audioContext: AudioContext;
  private analyzer: AnalyserNode;
  private fftSize: number = 4096;

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
    const energyData = this.extractEnergyData(fftData, sampleRate);

    const source = this.determineSource(energyData);
    const quality = this.determineQuality(fftData, energyData);
    const phase = this.determinePhase(energyData);

    const { dominantCenter, gapCenter } = this.findDominantAndGap(energyData);
    const frequencyDistribution = this.calculateFrequencyDistribution(energyData);
    const recommendedFrequency = this.getRecommendedFrequency(dominantCenter, gapCenter);

    const profile = this.matchProfile(source, quality, phase);

    return {
      source,
      quality,
      phase,
      profileId: profile.id,
      profileName: profile.name,
      message: profile.message,
      dominantCenter,
      gapCenter,
      energyData,
      frequencyDistribution,
      recommendedFrequency
    };
  }

  async analyzeMediaStream(stream: MediaStream): Promise<VoiceAnalysisResult> {
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyzer);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const frequencyData = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(frequencyData);

    const timeData = new Float32Array(this.analyzer.frequencyBinCount);
    this.analyzer.getFloatTimeDomainData(timeData);

    const sampleRate = this.audioContext.sampleRate;
    const fftData = this.convertFrequencyData(frequencyData);
    const energyData = this.extractEnergyData(fftData, sampleRate);

    energyData.roughness = this.calculateRoughness(timeData);
    energyData.smoothness = this.calculateSmoothness(timeData);

    const sourceType = this.determineSource(energyData);
    const quality = this.determineQuality(fftData, energyData);
    const phase = this.determinePhase(energyData);

    const { dominantCenter, gapCenter } = this.findDominantAndGap(energyData);
    const frequencyDistribution = this.calculateFrequencyDistribution(energyData);
    const recommendedFrequency = this.getRecommendedFrequency(dominantCenter, gapCenter);

    const profile = this.matchProfile(sourceType, quality, phase);

    source.disconnect();

    return {
      source: sourceType,
      quality,
      phase,
      profileId: profile.id,
      profileName: profile.name,
      message: profile.message,
      dominantCenter,
      gapCenter,
      energyData,
      frequencyDistribution,
      recommendedFrequency
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

  private extractEnergyData(fftData: Float32Array, sampleRate: number): VoiceAnalysisResult['energyData'] {
    const freq342Hz = this.getEnergyAtFrequency(fftData, 342, sampleRate);
    const freq384Hz = this.getEnergyAtFrequency(fftData, 384, sampleRate);
    const freq432Hz = this.getEnergyAtFrequency(fftData, 432, sampleRate);

    const heartEnergy = this.getEnergyInRange(fftData, 300, 380, sampleRate);
    const throatEnergy = this.getEnergyInRange(fftData, 360, 410, sampleRate);
    const brainEnergy = this.getEnergyInRange(fftData, 410, 500, sampleRate);

    const roughness = this.calculateRoughnessFromFFT(fftData);
    const smoothness = this.calculateSmoothnessFromFFT(fftData);

    return {
      freq432Hz,
      freq384Hz,
      freq342Hz,
      roughness,
      smoothness,
      brainEnergy,
      throatEnergy,
      heartEnergy
    };
  }

  private getEnergyAtFrequency(fftData: Float32Array, frequency: number, sampleRate: number): number {
    const binIndex = Math.round((frequency * fftData.length) / (sampleRate / 2));
    const startBin = Math.max(0, binIndex - 2);
    const endBin = Math.min(fftData.length - 1, binIndex + 2);

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

  private calculateRoughness(timeData: Float32Array): number {
    let jitter = 0;

    for (let i = 1; i < timeData.length; i++) {
      jitter += Math.abs(timeData[i] - timeData[i - 1]);
    }

    return jitter / timeData.length;
  }

  private calculateSmoothness(timeData: Float32Array): number {
    let variance = 0;
    let mean = 0;

    for (let i = 0; i < timeData.length; i++) {
      mean += timeData[i];
    }
    mean /= timeData.length;

    for (let i = 0; i < timeData.length; i++) {
      variance += Math.pow(timeData[i] - mean, 2);
    }

    return 1 / (1 + Math.sqrt(variance / timeData.length));
  }

  private determineSource(energyData: VoiceAnalysisResult['energyData']): 'brain' | 'throat' | 'heart' | 'lower' {
    const { brainEnergy, throatEnergy, heartEnergy } = energyData;

    const maxEnergy = Math.max(brainEnergy, throatEnergy, heartEnergy);

    if (maxEnergy < 0.1) {
      return 'lower';
    }

    if (brainEnergy === maxEnergy) {
      return 'brain';
    } else if (throatEnergy === maxEnergy) {
      return 'throat';
    } else {
      return 'heart';
    }
  }

  private findDominantAndGap(energyData: VoiceAnalysisResult['energyData']): {
    dominantCenter: 'brain' | 'throat' | 'heart';
    gapCenter: 'brain' | 'throat' | 'heart';
  } {
    const centers = [
      { name: 'heart' as const, energy: energyData.heartEnergy },
      { name: 'throat' as const, energy: energyData.throatEnergy },
      { name: 'brain' as const, energy: energyData.brainEnergy }
    ];

    centers.sort((a, b) => b.energy - a.energy);

    return {
      dominantCenter: centers[0].name,
      gapCenter: centers[2].name
    };
  }

  private calculateFrequencyDistribution(energyData: VoiceAnalysisResult['energyData']): {
    heart: number;
    throat: number;
    brain: number;
  } {
    const total = energyData.heartEnergy + energyData.throatEnergy + energyData.brainEnergy;

    if (total === 0) {
      return { heart: 33.33, throat: 33.33, brain: 33.33 };
    }

    return {
      heart: Math.round((energyData.heartEnergy / total) * 100),
      throat: Math.round((energyData.throatEnergy / total) * 100),
      brain: Math.round((energyData.brainEnergy / total) * 100)
    };
  }

  private getRecommendedFrequency(
    dominant: 'brain' | 'throat' | 'heart',
    gap: 'brain' | 'throat' | 'heart'
  ): { hz: number; center: 'brain' | 'throat' | 'heart'; reason: string } {
    const frequencyMap = {
      heart: { hz: 342, name: '心轮' },
      throat: { hz: 384, name: '喉轮' },
      brain: { hz: 432, name: '脑轮' }
    };

    const dominantName = frequencyMap[dominant].name;
    const gapInfo = frequencyMap[gap];

    let reason = '';

    if (dominant === 'heart' && gap === 'brain') {
      reason = `你的${dominantName}能量充沛，但${gapInfo.name}较弱。建议补充 ${gapInfo.hz}Hz 频率，帮助理清思绪，平衡感性与理性。`;
    } else if (dominant === 'brain' && gap === 'heart') {
      reason = `你的${dominantName}能量活跃，但${gapInfo.name}能量不足。建议补充 ${gapInfo.hz}Hz 频率，连接内在情感，减少过度思考。`;
    } else if (dominant === 'throat' && gap === 'heart') {
      reason = `你的${dominantName}能量强劲，但${gapInfo.name}需要滋养。建议补充 ${gapInfo.hz}Hz 频率，让表达更有温度和深度。`;
    } else if (dominant === 'throat' && gap === 'brain') {
      reason = `你的${dominantName}能量旺盛，但${gapInfo.name}需要加强。建议补充 ${gapInfo.hz}Hz 频率，让表达更具条理性。`;
    } else if (dominant === 'heart' && gap === 'throat') {
      reason = `你的${dominantName}饱满，但${gapInfo.name}表达受阻。建议补充 ${gapInfo.hz}Hz 频率，帮助情感顺畅流动和表达。`;
    } else if (dominant === 'brain' && gap === 'throat') {
      reason = `你的${dominantName}能量高涨，但${gapInfo.name}沟通不畅。建议补充 ${gapInfo.hz}Hz 频率，让想法更容易传递出来。`;
    } else {
      reason = `建议补充 ${gapInfo.hz}Hz 频率，平衡整体能量场。`;
    }

    return {
      hz: gapInfo.hz,
      center: gap,
      reason
    };
  }

  private determineQuality(fftData: Float32Array, energyData: VoiceAnalysisResult['energyData']): 'smooth' | 'rough' | 'flat' {
    const { roughness, smoothness } = energyData;

    if (roughness > 0.15) {
      return 'rough';
    } else if (smoothness > 0.85 && roughness < 0.05) {
      return 'flat';
    } else {
      return 'smooth';
    }
  }

  private determinePhase(energyData: VoiceAnalysisResult['energyData']): 'grounded' | 'floating' | 'scattering' {
    const { brainEnergy, heartEnergy, throatEnergy } = energyData;

    if (brainEnergy > heartEnergy * 2) {
      return 'floating';
    } else if (throatEnergy > brainEnergy && throatEnergy > heartEnergy) {
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
