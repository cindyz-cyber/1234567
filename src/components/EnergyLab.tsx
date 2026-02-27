import { useState, useRef, useEffect } from 'react';
import { Activity, Circle } from 'lucide-react';

export default function EnergyLab() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentPeakHz, setCurrentPeakHz] = useState<number | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      console.log('');
      console.log('🧪 【能量指纹实验室】启动原始音频采集');
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

      console.log('[配置完成]');
      console.log(`  采样率: ${audioContext.sampleRate}Hz`);
      console.log(`  FFT Size: ${analyzer.fftSize}`);
      console.log(`  频率分辨率: ${(audioContext.sampleRate / analyzer.fftSize).toFixed(2)}Hz/bin`);
      console.log(`  降噪: 关闭`);
      console.log(`  自动增益: 关闭`);
      console.log(`  回声消除: 关闭`);
      console.log('');

      setIsRecording(true);
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
    console.log('🧪 采样结束');
    console.log('');
  };

  const analyzeRealtime = () => {
    if (!analyzerRef.current || !audioContextRef.current) return;

    const analyzer = analyzerRef.current;
    const sampleRate = audioContextRef.current.sampleRate;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    const timeDataArray = new Uint8Array(bufferLength);

    const analyze = () => {
      analyzer.getFloatFrequencyData(dataArray);
      analyzer.getByteTimeDomainData(timeDataArray);

      let peakHz = 0;
      let peakMagnitude = -Infinity;

      for (let i = 0; i < dataArray.length; i++) {
        const frequency = (i * sampleRate) / analyzer.fftSize;
        const magnitude = dataArray[i];

        if (frequency >= 100 && frequency <= 1200) {
          if (magnitude > peakMagnitude) {
            peakMagnitude = magnitude;
            peakHz = Math.round(frequency);
          }
        }
      }

      if (peakMagnitude > -100) {
        setCurrentPeakHz(peakHz);
        console.log(`[实时] Peak: ${peakHz}Hz (${peakMagnitude.toFixed(2)}dB)`);
      }

      const waveform = Array.from(timeDataArray.slice(0, 200));
      setWaveformData(waveform);

      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Activity className="w-10 h-10 text-emerald-400" />
            <h1 className="text-5xl font-bold text-white tracking-wider">
              能量指纹实验室
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Energy Lab - Raw Frequency Detection</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
          {isRecording && waveformData.length > 0 && (
            <div className="mb-12">
              <div className="text-gray-400 text-sm mb-4 text-center font-mono">
                Raw Waveform (原始波形)
              </div>
              <div className="h-32 bg-black/40 rounded-xl p-4 border border-emerald-500/30">
                <svg width="100%" height="100%" viewBox="0 0 800 100" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    points={waveformData.map((val, i) => {
                      const x = (i / waveformData.length) * 800;
                      const y = ((val - 128) / 128) * 40 + 50;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                  <line x1="0" y1="50" x2="800" y2="50" stroke="#555" strokeWidth="1" strokeDasharray="5,5" />
                </svg>
              </div>
            </div>
          )}

          {currentPeakHz !== null && (
            <div className="mb-12">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-3 font-mono">Current_Peak_Hz</div>
                <div className="text-8xl font-bold text-emerald-400 tracking-wider font-mono">
                  {currentPeakHz}
                  <span className="text-4xl ml-2">Hz</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="group relative px-16 py-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
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
              采样率: 48kHz | FFT: 4096 | 滤波器: 全部关闭
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
