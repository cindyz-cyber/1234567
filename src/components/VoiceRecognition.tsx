import { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';

interface VoiceRecognitionProps {
  onBack?: () => void;
}

type RecordingState = 'idle' | 'recording' | 'analyzing' | 'result';

interface AnalysisResult {
  label: string;
  hopeMessage: string;
}

const RESULTS: AnalysisResult[] = [
  {
    label: '疲惫但坚定',
    hopeMessage: '你的声音带着疲惫，但底色是坚定的。休息不是放弃，是为了走更远的路。'
  },
  {
    label: '压抑中的力量',
    hopeMessage: '声音里藏着未释放的力量。当你准备好，这股能量会带你突破当下。'
  },
  {
    label: '平静的觉察者',
    hopeMessage: '你的声音像湖面，平静之下有深度。这份沉稳会成为你的护盾。'
  },
  {
    label: '不安中的勇气',
    hopeMessage: '声音在颤抖，但你仍在说话。这本身就是勇气的证明。'
  },
  {
    label: '温柔的疗愈者',
    hopeMessage: '你的声音有温度，这份柔软不是弱点，是治愈自己和他人的能力。'
  },
  {
    label: '隐忍的爆发力',
    hopeMessage: '声音克制，但能量聚集。你在等待正确的时机释放。'
  },
  {
    label: '迷茫中的求索',
    hopeMessage: '声音里有迷茫，也有好奇。迷失是找到新方向的前奏。'
  },
  {
    label: '清澈的信念',
    hopeMessage: '你的声音清晰笃定，这份确定性会照亮前方的路。'
  }
];

export default function VoiceRecognition({ onBack }: VoiceRecognitionProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [rippleScale, setRippleScale] = useState(1);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setRecordingState('recording');

      visualizeAudio();

      setTimeout(() => {
        stopRecording();
      }, 5000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const animate = () => {
      if (recordingState === 'idle' || recordingState === 'analyzing') return;

      analyserRef.current!.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const normalized = average / 255;

      setAudioLevel(normalized);
      setRippleScale(1 + normalized * 0.5);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setRecordingState('analyzing');
    setAudioLevel(0);

    setTimeout(() => {
      setRippleScale(0.3);
    }, 100);

    setTimeout(() => {
      const randomResult = RESULTS[Math.floor(Math.random() * RESULTS.length)];
      setResult(randomResult);
      setRecordingState('result');
      setRippleScale(1);
    }, 2000);
  };

  const handleScreenClick = () => {
    if (recordingState === 'idle') {
      startRecording();
    } else if (recordingState === 'result') {
      setRecordingState('idle');
      setResult(null);
      setRippleScale(1);
    }
  };

  const getBreathingScale = () => {
    if (recordingState === 'idle') return 'breathing-idle';
    if (recordingState === 'analyzing') return 'analyzing-collapse';
    return '';
  };

  return (
    <div
      className="voice-recognition-container"
      onClick={handleScreenClick}
    >
      <div className="portal-background-layer">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="portal-background-video"
        >
          <source src="https://cdn.midjourney.com/video/661ffc10-0d89-43d1-b8f9-83e67d0421ae/2.mp4" type="video/mp4" />
        </video>
      </div>

      {onBack && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          className="back-button"
        >
          <ChevronLeft size={24} color="rgba(200, 220, 255, 0.9)" />
        </button>
      )}

      <div className="content-container">
        {recordingState === 'idle' && (
          <div className="instruction-text">
            点击屏幕，开始录音
          </div>
        )}

        {recordingState === 'recording' && (
          <div className="instruction-text">
            正在聆听你的声音...
          </div>
        )}

        {recordingState === 'analyzing' && (
          <div className="instruction-text">
            正在解析...
          </div>
        )}

        <div className="orb-container">
          <div className={`blue-orb ${getBreathingScale()}`} style={{ transform: `scale(${rippleScale})` }}>
            <div className="orb-core" />
            <div className="orb-glow" />
          </div>

          {recordingState === 'recording' && (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="ripple-wave"
                  style={{
                    animationDelay: `${i * 0.4}s`,
                    opacity: audioLevel * 0.6
                  }}
                />
              ))}
            </>
          )}

          {recordingState === 'analyzing' && (
            <div className="collapse-effect" />
          )}
        </div>

        {recordingState === 'result' && result && (
          <div className="result-container">
            <div className="result-label">
              {result.label}
            </div>
            <div className="result-message">
              {result.hopeMessage}
            </div>
            <div className="tap-hint">
              点击屏幕继续
            </div>
          </div>
        )}
      </div>

      <style>{`
        .voice-recognition-container {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
        }

        .portal-background-layer {
          position: fixed;
          inset: 0;
          z-index: 1;
        }

        .portal-background-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7) contrast(1.1);
        }

        .back-button {
          position: fixed;
          top: 32px;
          left: 24px;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(40px);
          border: 0.5px solid rgba(200, 220, 255, 0.15);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(200, 220, 255, 0.25);
          transform: scale(1.1);
        }

        .content-container {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 600px;
          padding: 0 24px;
        }

        .instruction-text {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(200, 220, 255, 0.9);
          font-size: 16px;
          font-weight: 200;
          letter-spacing: 0.2em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 0 20px rgba(200, 220, 255, 0.4);
          white-space: nowrap;
          animation: fadeInOut 2s ease-in-out infinite;
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .orb-container {
          position: relative;
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blue-orb {
          position: relative;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          transition: transform 0.1s ease-out;
        }

        .breathing-idle {
          animation: breathingPulse 4s ease-in-out infinite;
        }

        @keyframes breathingPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }

        .analyzing-collapse {
          animation: collapseExpand 2s ease-in-out;
        }

        @keyframes collapseExpand {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          40% {
            transform: scale(0.3);
            opacity: 0.8;
          }
          60% {
            transform: scale(0.3);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .orb-core {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(180, 200, 255, 0.8) 0%,
            rgba(150, 180, 240, 0.6) 30%,
            rgba(120, 160, 220, 0.4) 60%,
            rgba(100, 140, 200, 0.2) 80%,
            transparent 100%
          );
          box-shadow:
            inset 0 0 40px rgba(200, 220, 255, 0.3),
            inset 0 0 60px rgba(180, 200, 240, 0.2);
        }

        .orb-glow {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(180, 200, 255, 0.3) 0%,
            rgba(150, 180, 240, 0.15) 40%,
            transparent 70%
          );
          filter: blur(30px);
          animation: glowPulse 3s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        .ripple-wave {
          position: absolute;
          inset: -40px;
          border-radius: 50%;
          border: 1px solid rgba(200, 220, 255, 0.4);
          animation: rippleExpand 1.2s ease-out infinite;
        }

        @keyframes rippleExpand {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        .collapse-effect {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(200, 220, 255, 0.6) 0%,
            transparent 70%
          );
          animation: collapseRipple 2s ease-out;
        }

        @keyframes collapseRipple {
          0%, 40% {
            transform: scale(1);
            opacity: 0;
          }
          50% {
            transform: scale(0.5);
            opacity: 1;
          }
          70% {
            transform: scale(2);
            opacity: 0.6;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        .result-container {
          position: absolute;
          bottom: -220px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 400px;
          text-align: center;
          animation: resultFadeIn 1s ease-out;
        }

        @keyframes resultFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .result-label {
          color: rgba(200, 220, 255, 0.95);
          font-size: 24px;
          font-weight: 200;
          letter-spacing: 0.25em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 0 30px rgba(200, 220, 255, 0.5);
          margin-bottom: 24px;
        }

        .result-message {
          color: rgba(255, 255, 255, 0.8);
          font-size: 15px;
          font-weight: 200;
          line-height: 2;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
          padding: 0 32px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
        }

        .tap-hint {
          margin-top: 32px;
          color: rgba(200, 220, 255, 0.5);
          font-size: 13px;
          font-weight: 200;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
          animation: fadeInOut 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
