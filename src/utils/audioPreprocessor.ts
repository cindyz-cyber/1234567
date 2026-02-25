export interface PreprocessingResult {
  processedBuffer: AudioBuffer;
  noiseLevel: number;
  isNoisy: boolean;
  signalToNoiseRatio: number;
  averageAmplitude: number;
}

export class AudioPreprocessor {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new AudioContext();
  }

  async preprocessAudio(audioBlob: Blob): Promise<PreprocessingResult> {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    const noiseLevel = this.detectNoiseLevel(audioBuffer);
    const isNoisy = noiseLevel > 0.05;

    const gatedBuffer = this.applyNoiseGate(audioBuffer, -40);

    const filteredBuffer = this.applyBandpassFilter(gatedBuffer, 100, 1100);

    const normalizedBuffer = this.normalizeAudio(filteredBuffer);

    const averageAmplitude = this.calculateAverageAmplitude(normalizedBuffer);
    const signalToNoiseRatio = averageAmplitude / (noiseLevel + 0.001);

    return {
      processedBuffer: normalizedBuffer,
      noiseLevel,
      isNoisy,
      signalToNoiseRatio,
      averageAmplitude
    };
  }

  private detectNoiseLevel(buffer: AudioBuffer): number {
    const channelData = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    const silenceThreshold = 0.01;

    let silentSamples = 0;
    let silentAmplitudeSum = 0;

    for (let i = 0; i < channelData.length; i++) {
      const amplitude = Math.abs(channelData[i]);
      if (amplitude < silenceThreshold) {
        silentSamples++;
        silentAmplitudeSum += amplitude;
      }
    }

    return silentSamples > 0 ? silentAmplitudeSum / silentSamples : 0;
  }

  private applyNoiseGate(buffer: AudioBuffer, thresholdDb: number): AudioBuffer {
    const threshold = Math.pow(10, thresholdDb / 20);

    const processedBuffer = this.audioContext.createBuffer(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel);
      const outputData = processedBuffer.getChannelData(channel);

      for (let i = 0; i < inputData.length; i++) {
        const amplitude = Math.abs(inputData[i]);
        if (amplitude > threshold) {
          outputData[i] = inputData[i];
        } else {
          outputData[i] = 0;
        }
      }
    }

    return processedBuffer;
  }

  private applyBandpassFilter(buffer: AudioBuffer, lowFreq: number, highFreq: number): AudioBuffer {
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = buffer;

    const lowpassFilter = offlineContext.createBiquadFilter();
    lowpassFilter.type = 'lowpass';
    lowpassFilter.frequency.value = highFreq;
    lowpassFilter.Q.value = 1.0;

    const highpassFilter = offlineContext.createBiquadFilter();
    highpassFilter.type = 'highpass';
    highpassFilter.frequency.value = lowFreq;
    highpassFilter.Q.value = 1.0;

    source.connect(highpassFilter);
    highpassFilter.connect(lowpassFilter);
    lowpassFilter.connect(offlineContext.destination);

    source.start(0);

    return offlineContext.startRendering();
  }

  private normalizeAudio(buffer: AudioBuffer): AudioBuffer {
    const normalizedBuffer = this.audioContext.createBuffer(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel);
      const outputData = normalizedBuffer.getChannelData(channel);

      let maxAmplitude = 0;
      for (let i = 0; i < inputData.length; i++) {
        const amplitude = Math.abs(inputData[i]);
        if (amplitude > maxAmplitude) {
          maxAmplitude = amplitude;
        }
      }

      const targetLevel = 0.8;
      const normalizationFactor = maxAmplitude > 0 ? targetLevel / maxAmplitude : 1;

      for (let i = 0; i < inputData.length; i++) {
        outputData[i] = inputData[i] * normalizationFactor;
      }
    }

    return normalizedBuffer;
  }

  private calculateAverageAmplitude(buffer: AudioBuffer): number {
    const channelData = buffer.getChannelData(0);
    let sum = 0;

    for (let i = 0; i < channelData.length; i++) {
      sum += Math.abs(channelData[i]);
    }

    return sum / channelData.length;
  }

  async audioBufferToBlob(buffer: AudioBuffer): Promise<Blob> {
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = buffer;
    source.connect(offlineContext.destination);
    source.start(0);

    const renderedBuffer = await offlineContext.startRendering();

    const wav = this.encodeWAV(renderedBuffer);
    return new Blob([wav], { type: 'audio/wav' });
  }

  private encodeWAV(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, buffer.numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
    view.setUint16(32, buffer.numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length, true);

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }

  destroy() {
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}
