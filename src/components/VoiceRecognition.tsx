import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Mic, Square, AlertTriangle } from 'lucide-react';
import { VoiceAnalyzer, VoiceAnalysisResult } from '../utils/voiceAnalysis';
import { supabase } from '../lib/supabase';
import { getProfileWithDynamicBalance, EnergyProfile } from '../data/energyDatabase';
import { AudioPreprocessor } from '../utils/audioPreprocessor';
import { generateReport, ReportData } from '../utils/reportGenerator';
import ZenVoiceResults from './ZenVoiceResults';

interface VoiceRecognitionProps {
  onBack?: () => void;
  onNext?: () => void;
  onResultStateChange?: (isShowingResult: boolean) => void;
}

type RecordingState = 'idle' | 'recording' | 'analyzing' | 'result';

export default function VoiceRecognition({ onBack, onNext, onResultStateChange }: VoiceRecognitionProps) {
  // Lock ref must be declared first
  const resultLockRef = useRef<boolean>(false);

  const [recordingState, setRecordingStateInternal] = useState<RecordingState>('idle');

  // Wrapped setState to protect against unwanted changes
  const setRecordingState = (newState: RecordingState) => {
    console.log('[VoiceRecognition] setRecordingState called with:', newState, 'locked:', resultLockRef.current);
    if (resultLockRef.current && newState !== 'result') {
      console.warn('[VoiceRecognition] BLOCKED state change from', recordingState, 'to', newState, '- result is locked');
      console.trace('[VoiceRecognition] Stack trace for blocked state change');
      return;
    }
    setRecordingStateInternal(newState);
  };

  // Debug state changes
  useEffect(() => {
    console.log('[VoiceRecognition] STATE CHANGED:', recordingState);
    console.trace('[VoiceRecognition] State change stack trace');
  }, [recordingState]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);

  // Debug result changes
  useEffect(() => {
    console.log('[VoiceRecognition] RESULT CHANGED:', result ? 'HAS RESULT' : 'NO RESULT');
    if (result) {
      console.log('[VoiceRecognition] Result details:', {
        profileName: result.profileName,
        dominantChakra: result.dominantChakra,
        hasPrototypeMatch: !!result.prototypeMatch
      });
    }
  }, [result]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [energyProfile, setEnergyProfile] = useState<EnergyProfile | null>(null);
  const [rippleScale, setRippleScale] = useState(1);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [showNoiseWarning, setShowNoiseWarning] = useState(false);
  const [noiseWarningMessage, setNoiseWarningMessage] = useState('');
  const [showEmergencyExit, setShowEmergencyExit] = useState(false);
  const [currentPeakHz, setCurrentPeakHz] = useState<number>(0); // 【新增】实时峰值频率
  const emergencyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const voiceAnalyzerRef = useRef<VoiceAnalyzer | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPreprocessorRef = useRef<AudioPreprocessor | null>(null);

  useEffect(() => {
    console.log('[VoiceRecognition] Component MOUNTED');
    voiceAnalyzerRef.current = new VoiceAnalyzer();
    audioPreprocessorRef.current = new AudioPreprocessor();

    return () => {
      console.log('[VoiceRecognition] Component UNMOUNTING - cleaning up');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (voiceAnalyzerRef.current) {
        voiceAnalyzerRef.current.destroy();
      }
      if (audioPreprocessorRef.current) {
        audioPreprocessorRef.current.destroy();
      }
    };
  }, []);

  const startRecording = async () => {
    if (resultLockRef.current) {
      console.log('[VoiceRecognition] Result is locked, ignoring startRecording call');
      return;
    }

    try {
      audioChunksRef.current = [];
      // 【强制禁用所有音频预处理】Raw PCM 采集
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1,
          sampleRate: 48000 // 高采样率确保频率精度
        }
      });

      const audioContext = new AudioContext({ sampleRate: 48000 });
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 8192; // 【极精细低频解析】8192 bins
      analyser.smoothingTimeConstant = 0; // 【禁止平滑】展示原始波形

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await analyzeVoice(audioBlob);
      };

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
    if (!analyserRef.current || !audioContextRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const animate = () => {
      if (recordingState === 'idle' || recordingState === 'analyzing') return;

      analyserRef.current!.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const normalized = average / 255;

      setAudioLevel(normalized);
      setRippleScale(1 + normalized * 2);

      // 【新增】实时峰值频率检测 (100-500Hz 人声范围)
      const sampleRate = audioContextRef.current!.sampleRate;
      const fftSize = analyserRef.current!.fftSize;
      const minBin = Math.floor((100 * fftSize) / sampleRate);
      const maxBin = Math.floor((500 * fftSize) / sampleRate);

      let maxMagnitude = 0;
      let peakBin = minBin;

      for (let i = minBin; i <= maxBin && i < dataArray.length; i++) {
        if (dataArray[i] > maxMagnitude) {
          maxMagnitude = dataArray[i];
          peakBin = i;
        }
      }

      const peakHz = Math.round((peakBin * sampleRate) / fftSize);
      setCurrentPeakHz(peakHz);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const analyzeVoice = async (audioBlob: Blob) => {
    try {
      console.log('[VoiceRecognition] Starting voice analysis...');
      if (!voiceAnalyzerRef.current || !audioPreprocessorRef.current) {
        console.error('[VoiceRecognition] No analyzer or preprocessor available');
        return;
      }

      console.log('[VoiceRecognition] SKIP preprocessing (debugging freeze)...');
      let processedBlob = audioBlob;
      let shouldShowWarning = false;
      let warningMessage = '';

      // TEMPORARILY DISABLED - preprocessing has O(n²) FFT causing freeze
      /*
      try {
        const preprocessingResult = await audioPreprocessorRef.current.preprocessAudio(audioBlob);
        console.log('[VoiceRecognition] Preprocessing complete:', {
          noiseLevel: preprocessingResult.noiseLevel,
          isNoisy: preprocessingResult.isNoisy,
          signalToNoiseRatio: preprocessingResult.signalToNoiseRatio,
          averageAmplitude: preprocessingResult.averageAmplitude
        });

        if (preprocessingResult.averageAmplitude < 0.002) {
          console.warn('[VoiceRecognition] No valid voice detected');
          shouldShowWarning = true;
          warningMessage = '未检测到有效人声，请确保环境安静并靠近麦克风重新录制';
        } else if (preprocessingResult.signalToNoiseRatio < 1.5) {
          console.warn('[VoiceRecognition] Environment quite noisy but processing anyway');
        }

        if (!shouldShowWarning) {
          console.log('[VoiceRecognition] Step 2: Converting preprocessed audio to blob...');
          processedBlob = await audioPreprocessorRef.current.audioBufferToBlob(preprocessingResult.processedBuffer);
        }
      } catch (preprocessError) {
        console.error('[VoiceRecognition] Preprocessing error, using original audio:', preprocessError);
        processedBlob = audioBlob;
      }
      */
      console.log('[VoiceRecognition] Using raw audio directly');

      if (shouldShowWarning) {
        if (resultLockRef.current) {
          console.log('[VoiceRecognition] Result is locked, ignoring noise warning');
          return;
        }
        setNoiseWarningMessage(warningMessage);
        setShowNoiseWarning(true);
        setRecordingState('idle');
        setRippleScale(1);
        if (onResultStateChange) {
          onResultStateChange(false);
        }
        return;
      }

      console.log('[VoiceRecognition] Step 3: Analyzing processed audio...');

      // Show emergency exit button after 10 seconds
      emergencyTimerRef.current = setTimeout(() => {
        console.log('[VoiceRecognition] Analysis taking too long, showing emergency exit');
        setShowEmergencyExit(true);
      }, 10000);

      // Add timeout protection (reduced to 20 seconds)
      const analysisPromise = voiceAnalyzerRef.current.analyzeAudioBuffer(processedBlob);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('分析超时 (20秒)')), 20000)
      );

      const analysisResult = await Promise.race([analysisPromise, timeoutPromise]) as any;
      console.log('[VoiceRecognition] Analysis result:', analysisResult);

      // Clear emergency timer if analysis succeeds
      if (emergencyTimerRef.current) {
        clearTimeout(emergencyTimerRef.current);
        emergencyTimerRef.current = null;
      }
      setShowEmergencyExit(false);

      console.log('[VoiceRecognition] SKIP DB save (debugging freeze)...');
      // TEMPORARILY DISABLED TO DEBUG
      // await saveAnalysisToDatabase(analysisResult);
      console.log('[VoiceRecognition] Skip complete');

      console.log('[VoiceRecognition] Step 4: Generating report...');
      console.log('[VoiceRecognition] Analysis data for report:', {
        dominantChakra: analysisResult.dominantChakra,
        gapChakras: analysisResult.gapChakras,
        profileName: analysisResult.profileName
      });

      const report = generateReport(analysisResult);
      console.log('[VoiceRecognition] Report generated successfully:', report);

      console.log('[VoiceRecognition] Setting result state IMMEDIATELY...');
      resultLockRef.current = true; // LOCK the result state
      setResult(analysisResult);
      setReportData(report);
      setRecordingState('result');
      setRippleScale(1);
      if (onResultStateChange) {
        onResultStateChange(true);
      }
      console.log('[VoiceRecognition] State updated - should show results now');
      console.log('[VoiceRecognition] Result state LOCKED to prevent resets');

    } catch (error) {
      console.error('[VoiceRecognition] Error analyzing voice:', error);

      if (resultLockRef.current) {
        console.log('[VoiceRecognition] Result is locked, not resetting on error');
        return;
      }

      // Clear emergency timer
      if (emergencyTimerRef.current) {
        clearTimeout(emergencyTimerRef.current);
        emergencyTimerRef.current = null;
      }
      setShowEmergencyExit(false);

      alert(`分析失败: ${error instanceof Error ? error.message : '未知错误'}\n\n请重试或联系技术支持`);
      setRecordingState('idle');
      setRippleScale(1);
      if (onResultStateChange) {
        onResultStateChange(false);
      }
    }
  };

  const handleEmergencyExit = () => {
    console.log('[VoiceRecognition] Emergency exit triggered');
    if (resultLockRef.current) {
      console.log('[VoiceRecognition] Result is locked, ignoring emergency exit');
      return;
    }
    if (emergencyTimerRef.current) {
      clearTimeout(emergencyTimerRef.current);
      emergencyTimerRef.current = null;
    }
    setShowEmergencyExit(false);
    setRecordingState('idle');
    setRippleScale(1);
    if (onResultStateChange) {
      onResultStateChange(false);
    }
  };

  const saveAnalysisToDatabase = async (analysis: VoiceAnalysisResult) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const profile = getProfileWithDynamicBalance(
        analysis.profileId,
        analysis.dominantChakra,
        analysis.gapChakras,
        analysis.quality,
        analysis.phase
      );

      const { error } = await supabase
        .from('voice_analysis_results')
        .insert({
          user_id: user?.id || null,
          session_id: sessionId,
          source: analysis.source,
          quality: analysis.quality,
          phase: analysis.phase,
          profile_id: analysis.profileId,
          profile_name: profile.tagName,
          message: analysis.message,
          energy_data: analysis.energyData,
          audio_duration: 5,
          healing_audio_id: profile.healingAudioId || null
        });

      if (error) {
        console.error('Error saving analysis:', error);
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  };

  const stopRecording = () => {
    if (resultLockRef.current) {
      console.log('[VoiceRecognition] Result is locked, ignoring stopRecording call');
      return;
    }

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
  };

  const handleStartRecording = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (recordingState === 'idle') {
      startRecording();
    }
  };

  const handleStopRecording = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (recordingState === 'recording') {
      stopRecording();
    }
  };

  const handlePlayAudio = (frequency: number) => {
    console.log(`Playing healing audio at ${frequency}Hz`);
  };

  const handleBackFromResult = () => {
    console.log('[VoiceRecognition] ⚠️ handleBackFromResult called - WHO CALLED THIS?');
    console.trace('[VoiceRecognition] Stack trace:');
    resultLockRef.current = false; // UNLOCK when user explicitly goes back
    setResult(null);
    setReportData(null);
    setRecordingState('idle');
    setRippleScale(1);
    if (onResultStateChange) {
      onResultStateChange(false);
    }
    if (onBack) {
      onBack();
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
      onClick={(e) => {
        if (recordingState === 'result') {
          e.stopPropagation();
        }
      }}
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

      {onBack && recordingState !== 'result' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          className="back-button"
        >
          <ChevronLeft size={24} color="rgba(255, 255, 255, 0.95)" />
        </button>
      )}

      {/* Debug info - remove in production */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        fontSize: '12px',
        zIndex: 9999,
        borderRadius: '8px'
      }}>
        State: {recordingState}<br/>
        Has Result: {result ? 'Yes' : 'No'}<br/>
        Has Report: {reportData ? 'Yes' : 'No'}<br/>
        Locked: {resultLockRef.current ? 'Yes' : 'No'}
      </div>

      {recordingState === 'result' && result && reportData ? (
        <ZenVoiceResults
          result={result}
          reportData={reportData}
          onPlayAudio={handlePlayAudio}
          onBack={handleBackFromResult}
        />
      ) : (
        <div className="content-container">
          {showNoiseWarning && (
            <div
              className="noise-warning-overlay"
              onClick={() => setShowNoiseWarning(false)}
            >
              <div
                className="noise-warning-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="noise-warning-icon">
                  <AlertTriangle size={48} color="#FFB800" />
                </div>
                <div className="noise-warning-title">环境噪音过大</div>
                <div className="noise-warning-message">
                  {noiseWarningMessage}
                </div>
                <button
                  className="noise-warning-button"
                  onClick={() => setShowNoiseWarning(false)}
                >
                  我知道了
                </button>
              </div>
            </div>
          )}

          {recordingState === 'idle' && (
            <div className="instruction-text">
              点击下方按钮开始录音
            </div>
          )}

          {recordingState === 'recording' && (
            <>
              {/* 【重构指令A】实时调试透明化 */}
              <div style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.9)',
                border: '2px solid #00FF00',
                borderRadius: '12px',
                padding: '20px 40px',
                zIndex: 10000,
                boxShadow: '0 4px 20px rgba(0, 255, 0, 0.4)'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#00FF00',
                  marginBottom: '8px',
                  fontFamily: 'monospace',
                  textAlign: 'center'
                }}>
                  🔬 实时物理检测
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#FFD700',
                  textShadow: '0 2px 8px rgba(255, 215, 0, 0.6)',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  letterSpacing: '2px'
                }}>
                  Detected_Primary_Hz: {currentPeakHz}
                </div>
                <div style={{
                  marginTop: '12px',
                  fontSize: '16px',
                  color: '#FFF',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  {currentPeakHz >= 342 && currentPeakHz <= 345 && '🔒 Heart (Primary) - Cindy Baseline ID:000'}
                  {currentPeakHz >= 300 && currentPeakHz <= 360 && currentPeakHz < 342 && '❤️ Heart Chakra (300-360Hz)'}
                  {currentPeakHz >= 200 && currentPeakHz <= 299 && '🔥 Sacral Chakra (200-299Hz)'}
                  {currentPeakHz >= 100 && currentPeakHz <= 199 && '🌱 Root Chakra (100-199Hz)'}
                  {currentPeakHz >= 361 && currentPeakHz <= 410 && '🗣️ Throat Chakra (361-410Hz)'}
                  {currentPeakHz >= 411 && currentPeakHz <= 460 && '👁️ ThirdEye Chakra (411-460Hz)'}
                  {currentPeakHz >= 461 && currentPeakHz <= 600 && '☀️ Solar Chakra (461-600Hz)'}
                  {currentPeakHz >= 601 && '👑 Crown Chakra (601+Hz)'}
                  {currentPeakHz === 0 && '⏳ 等待音频输入...'}
                </div>
              </div>

              <div className="instruction-text recording-active" style={{ marginTop: '140px' }}>
                正在聆听你的声音...
              </div>
            </>
          )}

          {recordingState === 'analyzing' && (
            <>
              <div className="instruction-text">
                正在解析频谱数据...
              </div>
              {showEmergencyExit && (
                <button
                  onClick={handleEmergencyExit}
                  className="emergency-exit-btn"
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(255, 107, 107, 0.4)',
                    animation: 'pulse 2s infinite'
                  }}
                >
                  分析时间过长，点击退出
                </button>
              )}
            </>
          )}

          <div className="orb-container">
            <div className={`blue-orb ${getBreathingScale()}`} style={{ transform: `scale(${rippleScale})` }}>
              <div className="orb-core" />
              <div className="orb-glow" />
            </div>

            {recordingState === 'recording' && (
              <>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="ripple-wave"
                    style={{
                      animationDelay: `${i * 0.3}s`,
                      opacity: Math.max(0.3, audioLevel * 1.5)
                    }}
                  />
                ))}
              </>
            )}

            {recordingState === 'analyzing' && (
              <div className="collapse-effect" />
            )}
          </div>

          <div className="control-buttons">
            {recordingState === 'idle' && (
              <button onClick={handleStartRecording} className="control-button start-button">
                <Mic size={24} />
                <span>开始录音</span>
              </button>
            )}

            {recordingState === 'recording' && (
              <button onClick={handleStopRecording} className="control-button stop-button">
                <Square size={20} />
                <span>停止录音</span>
              </button>
            )}

            {recordingState === 'analyzing' && (
              <div className="analyzing-text">
                正在分析声音特征...
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .voice-recognition-container {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
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
          filter: brightness(1.1) contrast(1.05);
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
          top: -150px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.95);
          font-size: 18px;
          font-weight: 300;
          letter-spacing: 0.2em;
          font-family: 'Noto Serif SC', serif;
          text-shadow:
            0 0 30px rgba(200, 220, 255, 0.8),
            0 2px 10px rgba(0, 0, 0, 0.5);
          white-space: nowrap;
          background: rgba(20, 30, 50, 0.4);
          backdrop-filter: blur(20px);
          padding: 12px 32px;
          border-radius: 24px;
          border: 1px solid rgba(200, 220, 255, 0.3);
        }

        .recording-active {
          animation: recordingPulse 1.5s ease-in-out infinite;
          color: rgba(255, 220, 100, 1);
          border-color: rgba(255, 220, 100, 0.4);
        }

        @keyframes recordingPulse {
          0%, 100% {
            opacity: 0.8;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scale(1.05);
          }
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
          inset: -50px;
          border-radius: 50%;
          border: 2px solid rgba(200, 220, 255, 0.6);
          box-shadow: 0 0 20px rgba(200, 220, 255, 0.4);
          animation: rippleExpand 1s ease-out infinite;
        }

        @keyframes rippleExpand {
          0% {
            transform: scale(0.7);
            opacity: 1;
            border-width: 3px;
          }
          50% {
            opacity: 0.8;
            border-width: 2px;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
            border-width: 1px;
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

        .control-buttons {
          position: absolute;
          bottom: -200px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 16px;
          align-items: center;
          justify-content: center;
        }

        .control-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 40px;
          font-size: 16px;
          font-weight: 300;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
          border-radius: 50px;
          border: 2px solid;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(30px);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .start-button {
          color: rgba(255, 255, 255, 0.95);
          border-color: rgba(200, 220, 255, 0.6);
          box-shadow: 0 0 30px rgba(200, 220, 255, 0.3);
        }

        .start-button:hover {
          background: rgba(200, 220, 255, 0.15);
          border-color: rgba(200, 220, 255, 0.9);
          transform: scale(1.05);
          box-shadow: 0 0 50px rgba(200, 220, 255, 0.5);
        }

        .stop-button {
          color: rgba(255, 200, 200, 0.95);
          border-color: rgba(255, 150, 150, 0.6);
          box-shadow: 0 0 30px rgba(255, 150, 150, 0.3);
          animation: stopButtonPulse 1.5s ease-in-out infinite;
        }

        .stop-button:hover {
          background: rgba(255, 150, 150, 0.15);
          border-color: rgba(255, 150, 150, 0.9);
          transform: scale(1.05);
        }

        @keyframes stopButtonPulse {
          0%, 100% {
            box-shadow: 0 0 30px rgba(255, 150, 150, 0.3);
          }
          50% {
            box-shadow: 0 0 50px rgba(255, 150, 150, 0.6);
          }
        }

        .analyzing-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          font-weight: 300;
          letter-spacing: 0.2em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 0 20px rgba(200, 220, 255, 0.6);
          animation: analyzingPulse 1.5s ease-in-out infinite;
        }

        @keyframes analyzingPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .noise-warning-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          animation: fadeIn 0.3s ease-out;
        }

        .noise-warning-modal {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(30px);
          border-radius: 24px;
          border: 2px solid rgba(255, 184, 0, 0.3);
          padding: 40px;
          max-width: 400px;
          margin: 0 24px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          animation: modalSlideUp 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .noise-warning-icon {
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
        }

        .noise-warning-title {
          color: rgba(255, 255, 255, 0.95);
          font-size: 20px;
          font-weight: 400;
          letter-spacing: 0.2em;
          font-family: 'Noto Serif SC', serif;
          margin-bottom: 16px;
        }

        .noise-warning-message {
          color: rgba(255, 255, 255, 0.8);
          font-size: 15px;
          font-weight: 300;
          line-height: 2;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
          margin-bottom: 24px;
        }

        .noise-warning-button {
          padding: 14px 40px;
          background: rgba(255, 184, 0, 0.2);
          border: 2px solid rgba(255, 184, 0, 0.5);
          border-radius: 50px;
          color: rgba(255, 220, 100, 0.95);
          font-size: 15px;
          font-weight: 300;
          letter-spacing: 0.2em;
          font-family: 'Noto Serif SC', serif;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .noise-warning-button:hover {
          background: rgba(255, 184, 0, 0.3);
          border-color: rgba(255, 184, 0, 0.7);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
