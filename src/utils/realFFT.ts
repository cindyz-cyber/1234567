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
      // 【修复】降低阈值至 0.003,避免遗漏 342Hz 心轮频率
      if (curr > prev && curr > next && curr > 0.003) {
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
   * 【修复】估算基频 (F0) - 使用峰值法,避免自相关倍频误判
   */
  estimateFundamentalFrequency(
    frequencyData: Float32Array,
    sampleRate: number,
    fftSize: number,
    minHz: number = 100,
    maxHz: number = 500
  ): number {
    // 在人声基频范围内查找最强峰值
    const minBin = Math.floor((minHz * fftSize) / sampleRate);
    const maxBin = Math.floor((maxHz * fftSize) / sampleRate);

    let maxMagnitude = 0;
    let f0Bin = minBin;

    // 平滑处理: 3点平均
    for (let i = minBin + 1; i < maxBin - 1 && i < frequencyData.length - 1; i++) {
      const smoothed = (frequencyData[i - 1] + frequencyData[i] + frequencyData[i + 1]) / 3;

      if (smoothed > maxMagnitude) {
        maxMagnitude = smoothed;
        f0Bin = i;
      }
    }

    return Math.round((f0Bin * sampleRate) / fftSize);
  }

  /**
   * 【新增】倍频关系验证 - 检测是否为真实基频
   */
  verifyHarmonicStructure(
    frequencyData: Float32Array,
    sampleRate: number,
    fftSize: number,
    f0Candidate: number
  ): { isValid: boolean; confidence: number } {
    // 检查 2倍频、3倍频是否存在
    const harmonics = [2, 3, 4];
    let harmonicCount = 0;

    for (const h of harmonics) {
      const harmonicFreq = f0Candidate * h;
      const bin = Math.floor((harmonicFreq * fftSize) / sampleRate);

      if (bin < frequencyData.length) {
        const magnitude = frequencyData[bin];
        const f0Magnitude = frequencyData[Math.floor((f0Candidate * fftSize) / sampleRate)];

        // 谐波应该比基频弱,但存在
        if (magnitude > f0Magnitude * 0.2 && magnitude < f0Magnitude * 1.5) {
          harmonicCount++;
        }
      }
    }

    const confidence = harmonicCount / harmonics.length;
    return {
      isValid: harmonicCount >= 1, // 至少1个谐波
      confidence
    };
  }

  destroy() {
    this.audioContext.close();
  }
}
