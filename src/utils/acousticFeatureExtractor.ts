/**
 * 声学特征提取器 - 多维指纹交叉验证系统
 * 用于防止单一频率误判，执行"粗糙度审计"和能量心理学权重修正
 */

export interface AcousticFeatures {
  // 基础频率特征
  fundamentalFrequency: number; // 基频
  dominantFrequencies: number[]; // 主导频率列表

  // 粗糙度 (Roughness) 指标
  roughness: number; // 0-100，声音的刺耳程度
  harmonicClarity: number; // 0-100，谐波清晰度
  highFrequencyNoise: number; // 0-100，高频噪点程度
  jitter: number; // 频率抖动

  // 能量分布
  lowFrequencyEnergy: number; // 100-300Hz 能量
  midFrequencyEnergy: number; // 300-1000Hz 能量
  highFrequencyEnergy: number; // 1000-4000Hz 能量

  // 音色质量
  brightness: number; // 亮度（高频丰富度）
  warmth: number; // 温暖度（中低频丰富度）
  transparency: number; // 通透度（谐波整齐度）

  // 心理状态指标
  stressIndicator: number; // 应激紧绷感 0-100
  defenseLevel: number; // 防御性 0-100
  groundedness: number; // 稳定接地性 0-100
}

export interface VoiceHealthWarning {
  hasWarning: boolean;
  level: 'none' | 'mild' | 'moderate' | 'severe';
  message: string;
  recommendation: string;
}

export class AcousticFeatureExtractor {
  private sampleRate: number;

  constructor(sampleRate: number = 44100) {
    this.sampleRate = sampleRate;
  }

  /**
   * 从音频数据中提取完整的声学特征
   */
  extractFeatures(audioData: Float32Array, frequencyData: Float32Array): AcousticFeatures {
    // 1. 基频检测
    const fundamentalFrequency = this.detectFundamentalFrequency(frequencyData);
    const dominantFrequencies = this.detectDominantFrequencies(frequencyData, 5);

    // 2. 粗糙度审计 - 关键创新点
    const roughnessMetrics = this.analyzeRoughness(frequencyData, fundamentalFrequency);

    // 3. 能量分布分析
    const energyDistribution = this.analyzeEnergyDistribution(frequencyData);

    // 4. 音色质量分析
    const timbreQuality = this.analyzeTimbreQuality(frequencyData, roughnessMetrics);

    // 5. 心理状态指标
    const psychologicalIndicators = this.analyzePsychologicalState(
      roughnessMetrics,
      energyDistribution,
      timbreQuality
    );

    return {
      fundamentalFrequency,
      dominantFrequencies,
      roughness: roughnessMetrics.overallRoughness,
      harmonicClarity: roughnessMetrics.harmonicClarity,
      highFrequencyNoise: roughnessMetrics.highFrequencyNoise,
      jitter: roughnessMetrics.jitter,
      lowFrequencyEnergy: energyDistribution.low,
      midFrequencyEnergy: energyDistribution.mid,
      highFrequencyEnergy: energyDistribution.high,
      brightness: timbreQuality.brightness,
      warmth: timbreQuality.warmth,
      transparency: timbreQuality.transparency,
      stressIndicator: psychologicalIndicators.stress,
      defenseLevel: psychologicalIndicators.defense,
      groundedness: psychologicalIndicators.groundedness
    };
  }

  /**
   * 粗糙度审计 - 核心诊断逻辑
   */
  private analyzeRoughness(frequencyData: Float32Array, fundamentalFreq: number) {
    const highFreqStart = this.frequencyToIndex(1000);
    const highFreqEnd = this.frequencyToIndex(4000);

    // 提取高频段 (1000-4000Hz)
    const highFreqSegment = frequencyData.slice(highFreqStart, highFreqEnd);

    // 计算谐波整齐度
    const harmonicClarity = this.calculateHarmonicClarity(frequencyData, fundamentalFreq);

    // 计算高频噪点
    const highFrequencyNoise = this.calculateHighFrequencyNoise(highFreqSegment);

    // 计算频率抖动 (Jitter)
    const jitter = this.calculateJitter(frequencyData);

    // 综合粗糙度评分
    const overallRoughness = this.calculateOverallRoughness(
      harmonicClarity,
      highFrequencyNoise,
      jitter
    );

    return {
      overallRoughness,
      harmonicClarity,
      highFrequencyNoise,
      jitter
    };
  }

  /**
   * 计算谐波清晰度
   * 返回值: 0-100，越高越清晰
   */
  private calculateHarmonicClarity(frequencyData: Float32Array, fundamentalFreq: number): number {
    if (fundamentalFreq === 0) return 50;

    const harmonics = [1, 2, 3, 4, 5, 6]; // 基频的倍频
    let harmonicStrength = 0;
    let noiseStrength = 0;

    harmonics.forEach(harmonic => {
      const targetFreq = fundamentalFreq * harmonic;
      const targetIndex = this.frequencyToIndex(targetFreq);

      if (targetIndex < frequencyData.length) {
        // 谐波能量
        harmonicStrength += frequencyData[targetIndex];

        // 谐波周围的噪音（±20Hz范围）
        const noiseRange = 5;
        for (let offset = -noiseRange; offset <= noiseRange; offset++) {
          const noiseIndex = targetIndex + offset;
          if (noiseIndex >= 0 && noiseIndex < frequencyData.length && Math.abs(offset) > 1) {
            noiseStrength += frequencyData[noiseIndex];
          }
        }
      }
    });

    // 信噪比转换为清晰度分数
    const snr = harmonicStrength / (noiseStrength + 1);
    return Math.min(100, snr * 20);
  }

  /**
   * 计算高频噪点程度
   * 返回值: 0-100，越高噪点越多
   */
  private calculateHighFrequencyNoise(highFreqSegment: Float32Array): number {
    // 计算高频段的能量变化剧烈程度
    let totalVariation = 0;
    for (let i = 1; i < highFreqSegment.length; i++) {
      totalVariation += Math.abs(highFreqSegment[i] - highFreqSegment[i - 1]);
    }

    const averageVariation = totalVariation / highFreqSegment.length;
    return Math.min(100, averageVariation * 5);
  }

  /**
   * 计算频率抖动 (Jitter)
   */
  private calculateJitter(frequencyData: Float32Array): number {
    // 简化版：计算频谱的不稳定性
    let variance = 0;
    const mean = frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;

    for (let i = 0; i < frequencyData.length; i++) {
      variance += Math.pow(frequencyData[i] - mean, 2);
    }
    variance /= frequencyData.length;

    return Math.min(100, Math.sqrt(variance) * 2);
  }

  /**
   * 计算综合粗糙度
   */
  private calculateOverallRoughness(
    harmonicClarity: number,
    highFrequencyNoise: number,
    jitter: number
  ): number {
    // 清晰度越低、噪点越多、抖动越大 = 粗糙度越高
    const clarityFactor = 100 - harmonicClarity; // 反转清晰度
    const roughness = (clarityFactor * 0.4) + (highFrequencyNoise * 0.4) + (jitter * 0.2);
    return Math.min(100, Math.max(0, roughness));
  }

  /**
   * 能量分布分析
   */
  private analyzeEnergyDistribution(frequencyData: Float32Array) {
    const lowEnd = this.frequencyToIndex(300);
    const midEnd = this.frequencyToIndex(1000);
    const highEnd = this.frequencyToIndex(4000);

    const lowEnergy = this.calculateBandEnergy(frequencyData, 0, lowEnd);
    const midEnergy = this.calculateBandEnergy(frequencyData, lowEnd, midEnd);
    const highEnergy = this.calculateBandEnergy(frequencyData, midEnd, highEnd);

    const totalEnergy = lowEnergy + midEnergy + highEnergy;

    return {
      low: totalEnergy > 0 ? (lowEnergy / totalEnergy) * 100 : 33,
      mid: totalEnergy > 0 ? (midEnergy / totalEnergy) * 100 : 33,
      high: totalEnergy > 0 ? (highEnergy / totalEnergy) * 100 : 33
    };
  }

  /**
   * 音色质量分析
   */
  private analyzeTimbreQuality(frequencyData: Float32Array, roughnessMetrics: any) {
    // 亮度 = 高频能量丰富度
    const brightness = this.calculateBrightness(frequencyData);

    // 温暖度 = 中低频能量丰富度
    const warmth = this.calculateWarmth(frequencyData);

    // 通透度 = 谐波整齐度（直接使用harmonicClarity）
    const transparency = roughnessMetrics.harmonicClarity;

    return { brightness, warmth, transparency };
  }

  private calculateBrightness(frequencyData: Float32Array): number {
    const highStart = this.frequencyToIndex(2000);
    const highEnd = this.frequencyToIndex(8000);
    const totalEnergy = frequencyData.reduce((a, b) => a + b, 0);
    const highEnergy = this.calculateBandEnergy(frequencyData, highStart, highEnd);

    return totalEnergy > 0 ? (highEnergy / totalEnergy) * 100 : 50;
  }

  private calculateWarmth(frequencyData: Float32Array): number {
    const lowEnd = this.frequencyToIndex(500);
    const totalEnergy = frequencyData.reduce((a, b) => a + b, 0);
    const lowEnergy = this.calculateBandEnergy(frequencyData, 0, lowEnd);

    return totalEnergy > 0 ? (lowEnergy / totalEnergy) * 100 : 50;
  }

  /**
   * 心理状态指标分析 - 能量心理学
   */
  private analyzePsychologicalState(
    roughnessMetrics: any,
    energyDistribution: any,
    timbreQuality: any
  ) {
    // 应激紧绷感 = 粗糙度 + 高频噪点
    const stress = (roughnessMetrics.overallRoughness * 0.6) +
                   (roughnessMetrics.highFrequencyNoise * 0.4);

    // 防御性 = 刺耳度（粗糙度高且高频噪点多）
    const defense = roughnessMetrics.overallRoughness > 60 ?
                    Math.min(100, roughnessMetrics.overallRoughness + 10) :
                    roughnessMetrics.overallRoughness * 0.8;

    // 稳定接地性 = 低频能量 - 粗糙度影响
    const groundedness = Math.max(0, energyDistribution.low - (roughnessMetrics.overallRoughness * 0.3));

    return {
      stress: Math.min(100, stress),
      defense: Math.min(100, defense),
      groundedness: Math.min(100, groundedness)
    };
  }

  /**
   * 生成健康预警
   */
  generateHealthWarning(features: AcousticFeatures): VoiceHealthWarning {
    // 关键判定：Roughness > 60% 触发预警
    if (features.roughness > 60) {
      return {
        hasWarning: true,
        level: features.roughness > 80 ? 'severe' : 'moderate',
        message: '检测到声音中存在应激紧绷感',
        recommendation: '建议优先关注疏肝排淤，避免硬性能量内耗。可以尝试深呼吸、放松练习，或通过音频疗愈释放紧张感。'
      };
    }

    if (features.stressIndicator > 50) {
      return {
        hasWarning: true,
        level: 'mild',
        message: '声音中带有轻微紧张',
        recommendation: '建议关注身心放松，保持呼吸顺畅。'
      };
    }

    return {
      hasWarning: false,
      level: 'none',
      message: '',
      recommendation: ''
    };
  }

  /**
   * 修正脉轮判断 - 应用"刺耳度"修正规则
   */
  correctChakraDiagnosis(
    originalDiagnosis: string,
    dominantChakra: string,
    features: AcousticFeatures
  ): { correctedDiagnosis: string; correctedMessage: string } {
    // 如果粗糙度 > 60%，修正诊断
    if (features.roughness > 60) {
      // 即便基频在下三轮，也要修正为应激状态
      if (['root', 'sacral', 'solar'].includes(dominantChakra)) {
        return {
          correctedDiagnosis: '应激防御型',
          correctedMessage: '虽然声音具有底气，但检测到防御性紧绷。建议先疏导肝气，释放应激状态，再补充能量。'
        };
      }

      // 其他脉轮也需要强调紧张状态
      return {
        correctedDiagnosis: originalDiagnosis + '（紧绷状态）',
        correctedMessage: '能量通道虽然活跃，但存在紧张阻滞。建议放松身心，让能量自然流动。'
      };
    }

    return {
      correctedDiagnosis: originalDiagnosis,
      correctedMessage: ''
    };
  }

  // 辅助方法
  private detectFundamentalFrequency(frequencyData: Float32Array): number {
    let maxIndex = 0;
    let maxValue = 0;

    const startIndex = this.frequencyToIndex(80);
    const endIndex = this.frequencyToIndex(500);

    for (let i = startIndex; i < endIndex && i < frequencyData.length; i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i];
        maxIndex = i;
      }
    }

    return this.indexToFrequency(maxIndex);
  }

  private detectDominantFrequencies(frequencyData: Float32Array, count: number): number[] {
    const peaks: { index: number; value: number }[] = [];

    for (let i = 1; i < frequencyData.length - 1; i++) {
      if (frequencyData[i] > frequencyData[i - 1] &&
          frequencyData[i] > frequencyData[i + 1] &&
          frequencyData[i] > 10) {
        peaks.push({ index: i, value: frequencyData[i] });
      }
    }

    peaks.sort((a, b) => b.value - a.value);
    return peaks.slice(0, count).map(p => this.indexToFrequency(p.index));
  }

  private calculateBandEnergy(
    frequencyData: Float32Array,
    startIndex: number,
    endIndex: number
  ): number {
    let energy = 0;
    for (let i = startIndex; i < endIndex && i < frequencyData.length; i++) {
      energy += frequencyData[i] * frequencyData[i];
    }
    return Math.sqrt(energy);
  }

  private frequencyToIndex(frequency: number): number {
    return Math.floor(frequency * this.fftSize / this.sampleRate);
  }

  private indexToFrequency(index: number): number {
    return index * this.sampleRate / this.fftSize;
  }

  private get fftSize(): number {
    return 2048; // 匹配 VoiceAnalyzer 的 fftSize
  }

  destroy() {
    // Cleanup if needed
  }
}
