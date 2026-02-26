/**
 * 真正的Web Audio API FFT分析器
 * 使用浏览器内置AnalyserNode,避免暴力DFT
 */

export class RealFFTAnalyzer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private fftSize: number = 8192; // 更高精度

  constructor(sampleRate: number = 48000) {
    this.audioContext = new AudioContext({ sampleRate });
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = this.fftSize;
    this.analyser.smoothingTimeConstant = 0; // 无平滑,原始数据
  }

  /**
   * 使用Web Audio API的原生FFT
   */
  async analyzeAudioBuffer(audioBuffer: AudioBuffer): Promise<{
    frequencyData: Float32Array;
    timeData: Float32Array;
    sampleRate: number;
    fftSize: number;
  }> {
    // 创建离线上下文处理
    const offlineContext = new OfflineAudioContext(
      1,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const analyser = offlineContext.createAnalyser();
    analyser.fftSize = this.fftSize;
    analyser.smoothingTimeConstant = 0;

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(offlineContext.destination);

    source.start(0);

    // 渲染音频
    await offlineContext.startRendering();

    // 获取FFT结果
    const frequencyData = new Float32Array(analyser.frequencyBinCount);
    const timeData = new Float32Array(analyser.fftSize);

    analyser.getFloatFrequencyData(frequencyData); // 单位: dB
    analyser.getFloatTimeDomainData(timeData);

    // 转换dB到线性幅度
    const linearFrequencyData = new Float32Array(frequencyData.length);
    for (let i = 0; i < frequencyData.length; i++) {
      // dB转幅度: amplitude = 10^(dB/20)
      linearFrequencyData[i] = Math.pow(10, frequencyData[i] / 20);
    }

    return {
      frequencyData: linearFrequencyData,
      timeData,
      sampleRate: audioBuffer.sampleRate,
      fftSize: this.fftSize
    };
  }

  /**
   * 查找Top N 峰值频率
   */
  findTopPeaks(
    frequencyData: Float32Array,
    sampleRate: number,
    fftSize: number,
    n: number = 5,
    minHz: number = 80,
    maxHz: number = 1000
  ): Array<{ frequency: number; magnitude: number; binIndex: number }> {
    const peaks: Array<{ frequency: number; magnitude: number; binIndex: number }> = [];

    const minBin = Math.floor((minHz * fftSize) / sampleRate);
    const maxBin = Math.floor((maxHz * fftSize) / sampleRate);

    // 峰值检测: 寻找局部最大值
    for (let i = minBin + 1; i < maxBin - 1 && i < frequencyData.length - 1; i++) {
      const prev = frequencyData[i - 1];
      const curr = frequencyData[i];
      const next = frequencyData[i + 1];

      // 局部峰值: 比左右邻居都大
      if (curr > prev && curr > next && curr > 0.01) {
        const frequency = (i * sampleRate) / fftSize;
        peaks.push({
          frequency: Math.round(frequency),
          magnitude: curr,
          binIndex: i
        });
      }
    }

    // 按幅度排序
    peaks.sort((a, b) => b.magnitude - a.magnitude);

    return peaks.slice(0, n);
  }

  /**
   * 计算绝对能量分布
   */
  calculateEnergyDistribution(
    frequencyData: Float32Array,
    sampleRate: number,
    fftSize: number
  ): {
    bands: Record<string, number>;
    totalEnergy: number;
    dominantBand: string;
  } {
    const getBandEnergy = (startHz: number, endHz: number): number => {
      const startBin = Math.floor((startHz * fftSize) / sampleRate);
      const endBin = Math.floor((endHz * fftSize) / sampleRate);
      let energy = 0;
      for (let i = startBin; i <= endBin && i < frequencyData.length; i++) {
        energy += frequencyData[i] * frequencyData[i]; // 能量 = 幅度²
      }
      return energy;
    };

    const bands = {
      'sub-bass': getBandEnergy(20, 60),
      'bass': getBandEnergy(60, 250),
      'low-mid': getBandEnergy(250, 500),
      'mid': getBandEnergy(500, 2000),
      'high-mid': getBandEnergy(2000, 4000),
      'presence': getBandEnergy(4000, 6000),
      'brilliance': getBandEnergy(6000, 20000)
    };

    const totalEnergy = Object.values(bands).reduce((sum, e) => sum + e, 0);

    // 找能量最大的频段
    let dominantBand = 'bass';
    let maxEnergy = 0;
    for (const [band, energy] of Object.entries(bands)) {
      if (energy > maxEnergy) {
        maxEnergy = energy;
        dominantBand = band;
      }
    }

    return { bands, totalEnergy, dominantBand };
  }

  /**
   * 计算频谱质心 (Spectral Centroid)
   * 反映声音的"亮度"
   */
  calculateSpectralCentroid(
    frequencyData: Float32Array,
    sampleRate: number,
    fftSize: number
  ): number {
    let weightedSum = 0;
    let magnitudeSum = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      const frequency = (i * sampleRate) / fftSize;
      const magnitude = frequencyData[i];
      weightedSum += frequency * magnitude;
      magnitudeSum += magnitude;
    }

    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
  }

  /**
   * 估算基频 (F0) - 简化版自相关法
   */
  estimateFundamentalFrequency(
    timeData: Float32Array,
    sampleRate: number,
    minHz: number = 80,
    maxHz: number = 400
  ): number {
    const minPeriod = Math.floor(sampleRate / maxHz);
    const maxPeriod = Math.floor(sampleRate / minHz);

    let bestPeriod = minPeriod;
    let bestCorrelation = -1;

    // 自相关计算
    for (let period = minPeriod; period <= maxPeriod; period++) {
      let correlation = 0;
      let count = 0;

      for (let i = 0; i < timeData.length - period; i++) {
        correlation += timeData[i] * timeData[i + period];
        count++;
      }

      correlation /= count;

      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }

    return Math.round(sampleRate / bestPeriod);
  }

  destroy() {
    this.audioContext.close();
  }
}
