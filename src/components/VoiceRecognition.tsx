import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Mic, Square, AlertTriangle } from 'lucide-react';
import { VoiceAnalyzer, VoiceAnalysisResult } from '../utils/voiceAnalysis';
import { supabase } from '../lib/supabase';
import { getProfileWithDynamicBalance, EnergyProfile } from '../data/energyDatabase';
import { AudioPreprocessor } from '../utils/audioPreprocessor';
import { generateReport, ReportData } from '../utils/reportGenerator';
import VoiceResults from './VoiceResults';

interface VoiceRecognitionProps {
  onBack?: () => void;
  onNext?: () => void;
  onResultStateChange?: (isShowingResult: boolean) => void;
}

type RecordingState = 'idle' | 'recording' | 'analyzing' | 'result';

export default function VoiceRecognition({ onBack, onNext, onResultStateChange }: VoiceRecognitionProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [energyProfile, setEnergyProfile] = useState<EnergyProfile | null>(null);
  const [rippleScale, setRippleScale] = useState(1);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [showNoiseWarning, setShowNoiseWarning] = useState(false);
  const [noiseWarningMessage, setNoiseWarningMessage] = useState('');
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
    try {
      audioChunksRef.current = [];
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
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const animate = () => {
      if (recordingState === 'idle' || recordingState === 'analyzing') return;

      analyserRef.current!.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const normalized = average / 255;

      setAudioLevel(normalized);
      setRippleScale(1 + normalized * 2);

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

      console.log('[VoiceRecognition] Step 1: Preprocessing audio...');
      let processedBlob = audioBlob;
      let shouldShowWarning = false;
      let warningMessage = '';

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

      if (shouldShowWarning) {
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
      const analysisResult = await voiceAnalyzerRef.current.analyzeAudioBuffer(processedBlob);
      console.log('[VoiceRecognition] Analysis result:', analysisResult);

      console.log('[VoiceRecognition] Saving to database...');
      await saveAnalysisToDatabase(analysisResult);
      console.log('[VoiceRecognition] Saved to database successfully');

      console.log('[VoiceRecognition] Step 4: Generating report...');
      console.log('[VoiceRecognition] Analysis data for report:', {
        dominantChakra: analysisResult.dominantChakra,
        gapChakras: analysisResult.gapChakras,
        profileName: analysisResult.profileName
      });

      const report = generateReport(analysisResult);
      console.log('[VoiceRecognition] Report generated successfully:', report);

      const timeoutId = setTimeout(() => {
        console.log('[VoiceRecognition] Setting result state...');
        setResult(analysisResult);
        setReportData(report);
        setRecordingState('result');
        setRippleScale(1);
        if (onResultStateChange) {
          onResultStateChange(true);
        }
        console.log('[VoiceRecognition] State updated - should show results now');
      }, 2000);

      console.log('[VoiceRecognition] Scheduled timeout with ID:', timeoutId);

    } catch (error) {
      console.error('[VoiceRecognition] Error analyzing voice:', error);
      setRecordingState('idle');
      setRippleScale(1);
      if (onResultStateChange) {
        onResultStateChange(false);
      }
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
    console.log('[VoiceRecognition] Returning from results');
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
        Has Report: {reportData ? 'Yes' : 'No'}
      </div>

      {recordingState === 'result' && result && reportData ? (
        <VoiceResults
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
            <div className="instruction-text recording-active">
              正在聆听你的声音...
            </div>
          )}

          {recordingState === 'analyzing' && (
            <div className="instruction-text">
              正在解析频谱数据...
            </div>
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
