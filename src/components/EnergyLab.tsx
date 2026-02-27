import { useState, useRef, useEffect } from 'react';
import { Activity, Circle } from 'lucide-react';

interface SpectrumPeak {
  frequency: number;
  magnitude: number;
}

export default function EnergyLab() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentPeakHz, setCurrentPeakHz] = useState<number | null>(null);
  const [peakData, setPeakData] = useState<number[]>([]);
  const [cindyDetected, setCindyDetected] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const peakHoldArrayRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const applyOctaveSmoothing = (spectrum: Float32Array, sampleRate: number, fftSize: number): Float32Array => {
    const smoothed = new Float32Array(spectrum.length);
    const frequencyResolution = sampleRate / fftSize;

    for (let i = 0; i < spectrum.length; i++) {
      const centerFreq = i * frequencyResolution;
      if (centerFreq < 100) {
        smoothed[i] = spectrum[i];
        continue;
      }

      const bandwidthRatio = Math.pow(2, 1 / 6);
      const lowerFreq = centerFreq / bandwidthRatio;
      const upperFreq = centerFreq * bandwidthRatio;

      const lowerBin = Math.floor(lowerFreq / frequencyResolution);
      const upperBin = Math.ceil(upperFreq / frequencyResolution);

      let sum = 0;
      let count = 0;

      for (let j = Math.max(0, lowerBin); j <= Math.min(spectrum.length - 1, upperBin); j++) {
        sum += spectrum[j];
        count++;
      }

      smoothed[i] = count > 0 ? sum / count : spectrum[i];
    }

    return smoothed;
  };

  const startRecording = async () => {
    try {
      console.log('');
      console.log('🧪 【峰值保持频谱引擎】启动');
      console.log('');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 48000 });
      audioContextRef.current = audioContext;

      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 4096;
      analyzer.smoothingTimeConstant = 0;
      analyzerRef.current = analyzer;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);

      peakHoldArrayRef.current = new Float32Array(analyzer.frequencyBinCount).fill(-120);

      console.log('[峰值保持引擎配置]');
      console.log(`  采样率: ${audioContext.sampleRate}Hz`);
      console.log(`  FFT Size: ${analyzer.fftSize}`);
      console.log(`  频率分辨率: ${(audioContext.sampleRate / analyzer.fftSize).toFixed(2)}Hz/bin`);
      console.log(`  dB范围: -20dB 至 -120dB`);
      console.log(`  平滑: 1/3 倍频程`);
      console.log('');

      setIsRecording(true);
      setCindyDetected(false);
      analyzeRealtime();
    } catch (error) {
      console.error('音频采集失败:', error);
    }
  };

  const stopRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    console.log('');
    console.log('🧪 峰值保持引擎已停止');
    console.log('');
  };

  const analyzeRealtime = () => {
    if (!analyzerRef.current || !audioContextRef.current || !peakHoldArrayRef.current) return;

    const analyzer = analyzerRef.current;
    const sampleRate = audioContextRef.current.sampleRate;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    const peakHoldArray = peakHoldArrayRef.current;

    const analyze = () => {
      analyzer.getFloatFrequencyData(dataArray);

      const smoothedData = applyOctaveSmoothing(dataArray, sampleRate, analyzer.fftSize);

      for (let i = 0; i < bufferLength; i++) {
        if (smoothedData[i] > peakHoldArray[i]) {
          peakHoldArray[i] = smoothedData[i];
        }
      }

      let peakHz = 0;
      let peakMagnitude = -Infinity;
      let peakIndex = 0;

      for (let i = 0; i < bufferLength; i++) {
        const frequency = (i * sampleRate) / analyzer.fftSize;
        const magnitude = peakHoldArray[i];

        if (frequency >= 100 && frequency <= 1200) {
          if (magnitude > peakMagnitude) {
            peakMagnitude = magnitude;
            peakHz = Math.round(frequency);
            peakIndex = i;
          }
        }
      }

      if (peakMagnitude > -120) {
        setCurrentPeakHz(peakHz);

        if (peakHz >= 340 && peakHz <= 345 && peakMagnitude > -60) {
          if (!cindyDetected) {
            setCindyDetected(true);
            console.log('');
            console.log('🎯 [核心ID检测]');
            console.log(`   识别到: 000 | Cindy 平衡态`);
            console.log(`   频率: ${peakHz}Hz`);
            console.log(`   强度: ${peakMagnitude.toFixed(2)}dB`);
            console.log('');
          }
        }
      }

      const displayData: number[] = [];
      const step = 2;
      for (let i = 0; i < bufferLength; i += step) {
        const frequency = (i * sampleRate) / analyzer.fftSize;
        if (frequency >= 100 && frequency <= 1200) {
          displayData.push(peakHoldArray[i]);
        }
      }

      setPeakData(displayData);

      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Activity className="w-10 h-10 text-blue-400" />
            <h1 className="text-5xl font-bold text-white tracking-wider">
              能量指纹实验室
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Peak-Hold Spectrum Curve Engine</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
          {cindyDetected && (
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl">
              <div className="text-center">
                <div className="text-purple-300 text-sm font-mono mb-2">CORE ID DETECTED</div>
                <div className="text-2xl font-bold text-white">
                  识别到核心 ID: 000 | Cindy 平衡态
                </div>
                <div className="text-purple-300 text-sm mt-2 font-mono">
                  {currentPeakHz}Hz @ Peak Magnitude
                </div>
              </div>
            </div>
          )}

          {peakData.length > 0 && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <div className="text-gray-400 text-sm font-mono">
                  Peak-Hold Spectrum (100-1200Hz)
                </div>
                <div className="text-gray-400 text-sm font-mono">
                  Range: -20dB ~ -120dB
                </div>
              </div>

              <div className="relative h-80 bg-black/40 rounded-xl p-6 border border-blue-500/30">
                <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="spectrumGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>

                  {Array.from({ length: 11 }).map((_, i) => {
                    const y = (i / 10) * 300;
                    const db = -20 - i * 10;
                    return (
                      <g key={i}>
                        <line
                          x1="0"
                          y1={y}
                          x2="1000"
                          y2={y}
                          stroke="#333"
                          strokeWidth="1"
                          strokeDasharray="5,5"
                        />
                        <text x="5" y={y - 5} fill="#666" fontSize="10" fontFamily="monospace">
                          {db}dB
                        </text>
                      </g>
                    );
                  })}

                  <polyline
                    fill="url(#spectrumGradient)"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    points={
                      peakData.map((magnitude, i) => {
                        const x = (i / peakData.length) * 1000;
                        const normalizedMag = Math.max(-120, Math.min(-20, magnitude));
                        const y = ((normalizedMag + 120) / 100) * 300;
                        return `${x},${300 - y}`;
                      }).join(' ') + ` 1000,300 0,300`
                    }
                  />

                  <polyline
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="3"
                    points={peakData.map((magnitude, i) => {
                      const x = (i / peakData.length) * 1000;
                      const normalizedMag = Math.max(-120, Math.min(-20, magnitude));
                      const y = ((normalizedMag + 120) / 100) * 300;
                      return `${x},${300 - y}`;
                    }).join(' ')}
                  />

                  {currentPeakHz !== null && (() => {
                    const peakIndex = peakData.findIndex((mag, i) => {
                      const freq = 100 + (i / peakData.length) * 1100;
                      return Math.abs(freq - currentPeakHz) < 10;
                    });

                    if (peakIndex !== -1) {
                      const x = (peakIndex / peakData.length) * 1000;
                      const normalizedMag = Math.max(-120, Math.min(-20, peakData[peakIndex]));
                      const y = ((normalizedMag + 120) / 100) * 300;

                      return (
                        <g>
                          <circle cx={x} cy={300 - y} r="6" fill="#fff" stroke="#8b5cf6" strokeWidth="2" />
                          <text
                            x={x}
                            y={300 - y - 15}
                            fill="#fff"
                            fontSize="14"
                            fontFamily="monospace"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            {currentPeakHz}Hz
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })()}
                </svg>
              </div>

              <div className="mt-4 flex justify-between text-gray-500 text-xs font-mono px-6">
                <span>100Hz</span>
                <span>400Hz</span>
                <span>700Hz</span>
                <span>1000Hz</span>
                <span>1200Hz</span>
              </div>
            </div>
          )}

          {currentPeakHz !== null && (
            <div className="mb-12">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-3 font-mono">Current_Peak_Hz</div>
                <div className="text-6xl font-bold text-blue-400 tracking-wider font-mono">
                  {currentPeakHz}
                  <span className="text-3xl ml-2">Hz</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="group relative px-16 py-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <Circle className="w-8 h-8" />
                  <span>采样 SAMPLE</span>
                </div>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="group relative px-16 py-8 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white rounded-sm"></div>
                  <span>停止 STOP</span>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block bg-black/40 rounded-lg px-6 py-3 border border-white/10">
            <p className="text-gray-400 text-sm font-mono">
              48kHz | FFT 4096 | dB校准: -20~-120 | 1/3倍频程平滑 | 峰值保持算法
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
