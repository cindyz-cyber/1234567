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

    const noiseProfile = this.estimateNoiseProfile(audioBuffer);

    const spectralSubtractedBuffer = await this.applySpectralSubtraction(audioBuffer, noiseProfile);

    const gatedBuffer = this.applyNoiseGate(spectralSubtractedBuffer, -35);

    const filteredBuffer = this.applyBandpassFilter(gatedBuffer, 80, 1200);

    const smoothedBuffer = await this.applySpectralSmoothing(filteredBuffer);

    const normalizedBuffer = this.normalizeAudio(smoothedBuffer);

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
    const silenceThreshold = 0.02;
    const sampleSize = Math.min(44100, channelData.length);

    let silentSamples = 0;
    let silentAmplitudeSum = 0;

    for (let i = 0; i < sampleSize; i++) {
      const amplitude = Math.abs(channelData[i]);
      if (amplitude < silenceThreshold) {
        silentSamples++;
        silentAmplitudeSum += amplitude;
      }
    }

    return silentSamples > 0 ? silentAmplitudeSum / silentSamples : 0;
  }

  private estimateNoiseProfile(buffer: AudioBuffer): Float32Array {
    const channelData = buffer.getChannelData(0);
    const fftSize = 2048;
    const noiseProfileLength = fftSize / 2;
    const noiseProfile = new Float32Array(noiseProfileLength);
    const silenceThreshold = 0.015;

    let silentFrameCount = 0;

    for (let i = 0; i < channelData.length - fftSize; i += fftSize) {
      let frameAmplitude = 0;
      for (let j = 0; j < fftSize; j++) {
        frameAmplitude += Math.abs(channelData[i + j]);
      }
      frameAmplitude /= fftSize;

      if (frameAmplitude < silenceThreshold) {
        const spectrum = this.computeFFT(channelData.slice(i, i + fftSize));
        for (let k = 0; k < noiseProfileLength; k++) {
          noiseProfile[k] += spectrum[k];
        }
        silentFrameCount++;
      }
    }

    if (silentFrameCount > 0) {
      for (let i = 0; i < noiseProfileLength; i++) {
        noiseProfile[i] /= silentFrameCount;
      }
    }

    return noiseProfile;
  }

  private computeFFT(signal: Float32Array): Float32Array {
    const n = signal.length;
    const magnitude = new Float32Array(n / 2);

    for (let k = 0; k < n / 2; k++) {
      let real = 0;
      let imag = 0;
      for (let t = 0; t < n; t++) {
        const angle = (2 * Math.PI * k * t) / n;
        real += signal[t] * Math.cos(angle);
        imag -= signal[t] * Math.sin(angle);
      }
      magnitude[k] = Math.sqrt(real * real + imag * imag);
    }

    return magnitude;
  }

  private async applySpectralSubtraction(buffer: AudioBuffer, noiseProfile: Float32Array): Promise<AudioBuffer> {
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );

    const channelData = buffer.getChannelData(0);
    const processedData = new Float32Array(channelData.length);
    const fftSize = 2048;
    const hopSize = fftSize / 4;
    const overSubtractionFactor = 1.8;

    for (let i = 0; i < channelData.length - fftSize; i += hopSize) {
      const frame = channelData.slice(i, i + fftSize);
      const spectrum = this.computeFFT(frame);

      for (let k = 0; k < spectrum.length; k++) {
        const noiseMagnitude = noiseProfile[k] * overSubtractionFactor;
        spectrum[k] = Math.max(0, spectrum[k] - noiseMagnitude);
      }

      const cleanFrame = this.inverseFFT(spectrum, fftSize);
      for (let j = 0; j < Math.min(hopSize, cleanFrame.length); j++) {
        if (i + j < processedData.length) {
          processedData[i + j] += cleanFrame[j] * 0.5;
        }
      }
    }

    const processedBuffer = offlineContext.createBuffer(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );

    processedBuffer.copyToChannel(processedData, 0);

    return processedBuffer;
  }

  private inverseFFT(magnitude: Float32Array, size: number): Float32Array {
    const signal = new Float32Array(size);

    for (let t = 0; t < size; t++) {
      let sum = 0;
      for (let k = 0; k < magnitude.length; k++) {
        const angle = (2 * Math.PI * k * t) / size;
        sum += magnitude[k] * Math.cos(angle);
      }
      signal[t] = sum / size;
    }

    return signal;
  }

  private async applySpectralSmoothing(buffer: AudioBuffer): Promise<AudioBuffer> {
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = buffer;

    const compressor = offlineContext.createDynamicsCompressor();
    compressor.threshold.value = -30;
    compressor.knee.value = 15;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.05;

    source.connect(compressor);
    compressor.connect(offlineContext.destination);

    source.start(0);

    return offlineContext.startRendering();
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
