import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Mic, Square, RotateCcw, FileText, Activity, Heart, Zap, ListChecks, Music } from 'lucide-react';
import { VoiceAnalyzer, VoiceAnalysisResult } from '../utils/voiceAnalysis';
import { supabase } from '../lib/supabase';
import { getProfileWithDynamicBalance, EnergyProfile } from '../data/energyDatabase';
import { generateReport, ReportData } from '../utils/reportGenerator';
import ReportSection from './ReportSection';
import HealingStation from './HealingStation';

interface VoiceRecognitionProps {
  onBack?: () => void;
  onNext?: () => void;
}

type RecordingState = 'idle' | 'recording' | 'analyzing' | 'result';

export default function VoiceRecognition({ onBack, onNext }: VoiceRecognitionProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);
  const [energyProfile, setEnergyProfile] = useState<EnergyProfile | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [rippleScale, setRippleScale] = useState(1);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const voiceAnalyzerRef = useRef<VoiceAnalyzer | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    voiceAnalyzerRef.current = new VoiceAnalyzer();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (voiceAnalyzerRef.current) {
        voiceAnalyzerRef.current.destroy();
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
      if (!voiceAnalyzerRef.current) return;

      const analysisResult = await voiceAnalyzerRef.current.analyzeAudioBuffer(audioBlob);

      await saveAnalysisToDatabase(analysisResult);

      setTimeout(() => {
        setResult(analysisResult);

        const profile = getProfileWithDynamicBalance(
          analysisResult.profileId,
          analysisResult.dominantChakra,
          analysisResult.gapChakras,
          analysisResult.quality,
          analysisResult.phase
        );
        setEnergyProfile(profile);

        const generatedReport = generateReport(analysisResult);
        setReport(generatedReport);

        setRecordingState('result');
        setRippleScale(1);
      }, 2000);

    } catch (error) {
      console.error('Error analyzing voice:', error);
      setRecordingState('idle');
      setRippleScale(1);
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

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecordingState('idle');
    setResult(null);
    setEnergyProfile(null);
    setRippleScale(1);
  };

  const getBreathingScale = () => {
    if (recordingState === 'idle') return 'breathing-idle';
    if (recordingState === 'analyzing') return 'analyzing-collapse';
    return '';
  };

  return (
    <div className="voice-recognition-container">
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

      {recordingState === 'result' && result && energyProfile ? (
        <div className="result-full-page">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onBack) onBack();
            }}
            className="back-button"
            style={{ position: 'fixed', top: '40px', left: '40px', zIndex: 101 }}
          >
            <ChevronLeft size={24} color="rgba(255, 255, 255, 0.95)" />
          </button>
          <div className="result-content">
            <div className="result-profile-id">
              ID {result.profileId}
            </div>
            <div className="result-label">
              {energyProfile.tagName}
            </div>
            <div className="result-message">
              {result.message}
            </div>

            {report && (
              <div className="report-container">
                <ReportSection
                  title="核心综述"
                  icon={<FileText size={20} />}
                  summary={report.coreSummary.summary}
                  summaryColor="rgba(255, 100, 100, 0.95)"
                  defaultExpanded={true}
                >
                  <div className="report-detail-content">
                    <div className="report-subsection">
                      <div className="report-subsection-title">情绪画像</div>
                      <div style={{ marginTop: '8px' }}>
                        {report.coreSummary.details.profile}
                      </div>
                    </div>

                    <div className="report-subsection">
                      <div className="report-subsection-title">发声源定位</div>
                      <div style={{ marginTop: '8px' }}>
                        {report.coreSummary.details.sourceAnalysis}
                      </div>
                    </div>

                    <div className="report-subsection">
                      <div className="report-subsection-title">声音质地</div>
                      <div style={{ marginTop: '8px' }}>
                        {report.coreSummary.details.qualityAnalysis}
                      </div>
                    </div>

                    <div className="report-subsection">
                      <div className="report-subsection-title">能量相位</div>
                      <div style={{ marginTop: '8px' }}>
                        {report.coreSummary.details.phaseAnalysis}
                      </div>
                    </div>
                  </div>
                </ReportSection>

                <ReportSection
                  title="脉轮能量"
                  icon={<Activity size={20} />}
                  summary={report.chakraAnalysis.summary}
                  summaryColor="rgba(100, 220, 100, 0.95)"
                >
                  <div className="report-detail-content">
                    <div className="report-subsection">
                      <div className="report-subsection-title">物理计算公式</div>
                      <div className="report-formula">
                        {report.chakraAnalysis.details.formula}
                      </div>
                    </div>

                    <div className="report-subsection">
                      <div className="report-subsection-title">优势脉轮</div>
                      <div style={{ marginTop: '8px' }}>
                        {report.chakraAnalysis.details.dominantChakra}
                      </div>
                    </div>

                    <div className="report-subsection">
                      <div className="report-subsection-title">缺口脉轮</div>
                      <div style={{ marginTop: '8px' }}>
                        {report.chakraAnalysis.details.gapChakras}
                      </div>
                    </div>

                    <div className="report-subsection">
                      <div className="report-subsection-title">完整能量分布</div>
                      <div className="report-formula" style={{ borderColor: 'rgba(255, 200, 100, 0.3)', color: 'rgba(255, 200, 100, 0.95)' }}>
                        {report.chakraAnalysis.details.distribution}
                      </div>
                    </div>

                    <div className="report-subsection">
                      <div className="report-subsection-title">能量流动解析</div>
                      <div style={{ marginTop: '8px' }}>
                        {report.chakraAnalysis.details.energyFlow}
                      </div>
                    </div>
                  </div>
                </ReportSection>

                <ReportSection
                  title="脏腑调理"
                  icon={<Heart size={20} />}
                  summary={report.organTherapy.summary}
                  summaryColor="rgba(100, 180, 255, 0.95)"
                >
                  <div className="report-detail-content">
                    <div className="report-subsection">
                      <div className="report-subsection-title">主要调理目标</div>
                      <div style={{ marginTop: '8px' }}>
                        {report.organTherapy.details.primaryOrgan}
                      </div>
                    </div>

                    <div className="report-subsection">
                      <div className="report-subsection-title">次要调理目标</div>
                      <div style={{ marginTop: '8px' }}>
                        {report.organTherapy.details.secondaryOrgan}
                      </div>
                    </div>

                    <div className="report-subsection">
                      <div className="report-subsection-title">调理建议</div>
                      <ul className="report-list">
                        {report.organTherapy.details.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ReportSection>

                <ReportSection
                  title="行动红黑榜"
                  icon={<ListChecks size={20} />}
                  summary={report.actionPlan.summary}
                  summaryColor="rgba(255, 180, 80, 0.95)"
                >
                  <div className="report-detail-content">
                    <div className="report-subsection">
                      <div className="report-subsection-title" style={{ color: 'rgba(100, 220, 120, 0.95)' }}>
                        ✓ 建议多做
                      </div>
                      <ul className="report-list do-list">
                        {report.actionPlan.details.doList.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="report-subsection">
                      <div className="report-subsection-title" style={{ color: 'rgba(255, 100, 100, 0.95)' }}>
                        ✗ 建议避免
                      </div>
                      <ul className="report-list avoid-list">
                        {report.actionPlan.details.avoidList.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ReportSection>

                <ReportSection
                  title="能量补给站"
                  icon={<Music size={20} />}
                  summary={report.healingStation.summary}
                  summaryColor="rgba(200, 150, 255, 0.95)"
                  customContent={
                    <HealingStation
                      frequencyHz={report.healingStation.details.recommendedFrequency}
                      chakraName={report.healingStation.details.chakraTarget}
                    />
                  }
                >
                  <div className="report-detail-content">
                    <div className="report-subsection">
                      <div className="report-subsection-title">推荐频率</div>
                      <div className="report-formula" style={{ borderColor: 'rgba(200, 150, 255, 0.3)', color: 'rgba(200, 150, 255, 0.95)' }}>
                        {report.healingStation.details.recommendedFrequency}Hz → {report.healingStation.details.chakraTarget}
                      </div>
                    </div>

                    <div className="report-subsection">
                      <div className="report-subsection-title">为什么选择这个频率</div>
                      <div style={{ marginTop: '8px' }}>
                        {report.healingStation.details.reason}
                      </div>
                    </div>

                    <div className="report-subsection">
                      <div className="report-subsection-title">使用指南</div>
                      <ul className="report-list">
                        {report.healingStation.details.howToUse.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ReportSection>
              </div>
            )}

            <div className="hope-note" style={{ marginTop: '32px' }}>
              {energyProfile.hopeNote}
            </div>

            <div className="result-action-buttons">
              <button onClick={handleRestart} className="restart-button secondary">
                <RotateCcw size={18} />
                <span>重新测试</span>
              </button>
              <button onClick={(e) => {
                e.stopPropagation();
                if (onBack) onBack();
              }} className="restart-button primary">
                <span>完成</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="content-container">
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

        .result-full-page {
          position: fixed;
          inset: 0;
          z-index: 100;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          animation: resultPageFadeIn 0.8s ease-out;
        }

        @keyframes resultPageFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .result-content {
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
          padding: 80px 40px 120px;
          text-align: center;
          animation: resultContentSlideIn 0.8s ease-out;
        }

        @keyframes resultContentSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .result-profile-id {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.3em;
          font-family: 'Noto Serif SC', serif;
          margin-bottom: 20px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .result-label {
          color: rgba(255, 255, 255, 0.98);
          font-size: 36px;
          font-weight: 200;
          letter-spacing: 0.3em;
          font-family: 'Noto Serif SC', serif;
          text-shadow:
            0 0 40px rgba(200, 220, 255, 0.6),
            0 4px 20px rgba(0, 0, 0, 0.5);
          margin-bottom: 32px;
        }

        .result-message {
          color: rgba(255, 255, 255, 0.9);
          font-size: 17px;
          font-weight: 300;
          line-height: 2.2;
          letter-spacing: 0.12em;
          font-family: 'Noto Serif SC', serif;
          padding: 0 40px;
          text-shadow: 0 2px 15px rgba(0, 0, 0, 0.6);
          margin-bottom: 48px;
        }

        .result-details {
          margin: 48px auto;
          padding: 32px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(30px);
          border-radius: 20px;
          border: 1.5px solid rgba(200, 220, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid rgba(200, 220, 255, 0.1);
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: rgba(200, 220, 255, 0.7);
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.2em;
          font-family: 'Noto Serif SC', serif;
        }

        .detail-value {
          color: rgba(255, 255, 255, 0.95);
          font-size: 15px;
          font-weight: 300;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .result-action-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 32px;
        }

        .restart-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 48px;
          font-size: 16px;
          font-weight: 300;
          letter-spacing: 0.2em;
          font-family: 'Noto Serif SC', serif;
          color: rgba(255, 255, 255, 0.95);
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(30px);
          border: 2px solid rgba(200, 220, 255, 0.4);
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 30px rgba(200, 220, 255, 0.2);
        }

        .restart-button.primary {
          background: linear-gradient(135deg, rgba(247, 231, 206, 0.2), rgba(235, 200, 98, 0.15));
          border-color: rgba(247, 231, 206, 0.6);
          box-shadow: 0 0 30px rgba(247, 231, 206, 0.3);
        }

        .restart-button.primary:hover {
          background: linear-gradient(135deg, rgba(247, 231, 206, 0.3), rgba(235, 200, 98, 0.25));
          border-color: rgba(247, 231, 206, 0.9);
          transform: scale(1.05);
          box-shadow: 0 0 50px rgba(247, 231, 206, 0.5);
        }

        .restart-button.secondary:hover {
          background: rgba(200, 220, 255, 0.15);
          border-color: rgba(200, 220, 255, 0.7);
          transform: scale(1.05);
          box-shadow: 0 0 50px rgba(200, 220, 255, 0.4);
        }

        .report-container {
          margin-top: 32px;
          width: 100%;
        }

        .energy-flow-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 24px 0;
          padding: 12px 24px;
          color: rgba(255, 220, 150, 0.9);
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
          background: rgba(255, 220, 100, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 220, 100, 0.2);
          animation: flowHintGlow 3s ease-in-out infinite;
        }

        @keyframes flowHintGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 220, 100, 0.2);
          }
          50% {
            box-shadow: 0 0 35px rgba(255, 220, 100, 0.4);
          }
        }

        .frequency-distribution-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(30px);
          border-radius: 16px;
          border: 1.5px solid rgba(200, 220, 255, 0.15);
          padding: 24px;
          margin: 24px 0;
          text-align: left;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .frequency-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          color: rgba(200, 220, 255, 0.9);
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
        }

        .frequency-bars {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .frequency-bar-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .frequency-bar-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
        }

        .frequency-percentage {
          color: rgba(200, 220, 255, 0.9);
          font-weight: 400;
        }

        .frequency-bar-track {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .frequency-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .root-bar {
          background: linear-gradient(90deg, rgba(200, 50, 50, 0.8), rgba(230, 80, 80, 0.9));
          box-shadow: 0 0 15px rgba(200, 50, 50, 0.5);
        }

        .sacral-bar {
          background: linear-gradient(90deg, rgba(255, 120, 50, 0.8), rgba(255, 150, 80, 0.9));
          box-shadow: 0 0 15px rgba(255, 120, 50, 0.5);
        }

        .solar-bar {
          background: linear-gradient(90deg, rgba(255, 200, 50, 0.8), rgba(255, 220, 100, 0.9));
          box-shadow: 0 0 15px rgba(255, 200, 50, 0.5);
        }

        .heart-bar {
          background: linear-gradient(90deg, rgba(100, 220, 100, 0.8), rgba(120, 240, 120, 0.9));
          box-shadow: 0 0 15px rgba(100, 220, 100, 0.5);
        }

        .throat-bar {
          background: linear-gradient(90deg, rgba(80, 160, 255, 0.8), rgba(120, 190, 255, 0.9));
          box-shadow: 0 0 15px rgba(80, 160, 255, 0.5);
        }

        .thirdeye-bar {
          background: linear-gradient(90deg, rgba(100, 100, 200, 0.8), rgba(130, 130, 230, 0.9));
          box-shadow: 0 0 15px rgba(100, 100, 200, 0.5);
        }

        .crown-bar {
          background: linear-gradient(90deg, rgba(200, 150, 255, 0.8), rgba(220, 180, 255, 0.9));
          box-shadow: 0 0 15px rgba(200, 150, 255, 0.5);
        }

        .healing-station-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(30px);
          border-radius: 16px;
          border: 1.5px solid rgba(255, 200, 100, 0.2);
          padding: 24px;
          margin: 24px 0;
          text-align: left;
          box-shadow: 0 4px 20px rgba(255, 200, 100, 0.15);
        }

        .healing-station-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          color: rgba(255, 220, 150, 0.9);
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
        }

        .healing-station-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .recommended-frequency {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .frequency-badge {
          display: inline-block;
          padding: 10px 20px;
          background: linear-gradient(135deg, rgba(255, 200, 100, 0.2), rgba(255, 220, 150, 0.15));
          border: 1px solid rgba(255, 220, 150, 0.3);
          border-radius: 20px;
          color: rgba(255, 240, 200, 0.95);
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
          box-shadow: 0 2px 10px rgba(255, 200, 100, 0.2);
        }

        .frequency-reason {
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 300;
          line-height: 2;
          letter-spacing: 0.08em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
        }

        .energy-flow-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(30px);
          border-radius: 16px;
          border: 1.5px solid rgba(200, 220, 255, 0.15);
          padding: 24px;
          margin: 24px 0;
          text-align: left;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .energy-flow-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          color: rgba(200, 220, 255, 0.9);
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
        }

        .energy-flow-content {
          white-space: pre-line;
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 300;
          line-height: 2;
          letter-spacing: 0.08em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
        }

        .hope-note {
          margin: 32px 0;
          padding: 24px 32px;
          color: rgba(255, 240, 200, 0.95);
          font-size: 15px;
          font-weight: 300;
          line-height: 2.2;
          letter-spacing: 0.12em;
          font-family: 'Noto Serif SC', serif;
          background: linear-gradient(
            135deg,
            rgba(255, 220, 100, 0.12) 0%,
            rgba(200, 220, 255, 0.08) 100%
          );
          backdrop-filter: blur(25px);
          border-radius: 16px;
          border: 1px solid rgba(255, 220, 150, 0.2);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          box-shadow: 0 4px 20px rgba(255, 220, 100, 0.15);
        }

        @media (max-width: 640px) {
          .result-content {
            padding: 0 20px;
          }

          .result-label {
            font-size: 28px;
          }

          .healing-card {
            padding: 20px;
          }

          .hope-note {
            padding: 20px 24px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
