import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import EmotionScan from './EmotionScan';
import InnerWhisperJournal from './InnerWhisperJournal';
import GoldenTransition from './GoldenTransition';
import HigherSelfDialogue from './HigherSelfDialogue';
import BookOfAnswers from './BookOfAnswers';
import OptimizedVideoBackground from './OptimizedVideoBackground';

interface FlowConfig {
  scene_path: string;
  scene_name: string;
  access_token: string;
  description: string;
  bg_home_url: string | null;
  bg_step1_url: string | null;
  bg_step2_url: string | null;
  bg_step3_url: string | null;
  bg_step4_url: string | null;
  audio_step1_url: string | null;
  audio_step2_url: string | null;
  audio_step3_url: string | null;
  audio_step4_url: string | null;
}

type FlowStep = 'home' | 'emotion' | 'innerWhisper' | 'transition' | 'dialogue' | 'answers';

interface JourneyData {
  emotions: string[];
  bodyStates: string[];
  journalContent: string;
  higherSelfResponse: string;
}

export default function FlowJourney() {
  const { scenePath } = useParams<{ scenePath: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<FlowConfig | null>(null);
  const [currentStep, setCurrentStep] = useState<FlowStep>('home');
  const [backgroundAudio, setBackgroundAudio] = useState<HTMLAudioElement | null>(null);
  const [journeyData, setJourneyData] = useState<JourneyData>({
    emotions: [],
    bodyStates: [],
    journalContent: '',
    higherSelfResponse: '',
  });

  useEffect(() => {
    validateAndLoadConfig();
  }, [scenePath, token]);

  async function validateAndLoadConfig() {
    if (!scenePath || !token) {
      setError('缺少必要参数');
      setLoading(false);
      return;
    }

    try {
      const { data, error: dbError } = await supabase
        .from('flow_config')
        .select('*')
        .eq('scene_path', scenePath)
        .eq('access_token', token)
        .eq('is_active', true)
        .maybeSingle();

      if (dbError) {
        console.error('数据库查询错误:', dbError);
        setError('配置加载失败');
        setLoading(false);
        return;
      }

      if (!data) {
        setError('无效的访问链接');
        setLoading(false);
        return;
      }

      setConfig(data);
      setLoading(false);
    } catch (err) {
      console.error('加载配置失败:', err);
      setError('系统错误');
      setLoading(false);
    }
  }

  function handleStartJourney() {
    setCurrentStep('emotion');
  }

  function handleEmotionComplete(emotions: string[], bodyStates: string[]) {
    setJourneyData(prev => ({
      ...prev,
      emotions,
      bodyStates,
    }));
    setCurrentStep('innerWhisper');
  }

  function handleInnerWhisperComplete(journalText: string) {
    setJourneyData(prev => ({
      ...prev,
      journalContent: journalText
    }));
    setCurrentStep('transition');
  }

  function handleTransitionComplete(backgroundMusic: HTMLAudioElement | null) {
    setBackgroundAudio(backgroundMusic);
    setCurrentStep('dialogue');
  }

  async function handleDialogueComplete(response: string, audio: HTMLAudioElement | null) {
    if (!response || response.trim() === '') {
      alert('高我建议生成失败，请重新输入');
      return;
    }

    try {
      setJourneyData(prev => ({
        ...prev,
        higherSelfResponse: response
      }));

      await supabase
        .from('journal_entries')
        .insert({
          emotions: journeyData.emotions,
          body_states: journeyData.bodyStates,
          journal_content: journeyData.journalContent,
          higher_self_response: response,
          source: `flow:${scenePath}`,
        });

      setBackgroundAudio(audio);
      setCurrentStep('answers');
    } catch (error) {
      console.error('保存失败:', error);
      setBackgroundAudio(audio);
      setCurrentStep('answers');
    }
  }

  function handleAnswersComplete() {
    setCurrentStep('home');
  }

  function handleBackToHome() {
    setCurrentStep('home');
  }

  function handleBackToEmotion() {
    setCurrentStep('emotion');
  }

  function handleBackToInnerWhisper() {
    setCurrentStep('innerWhisper');
  }

  function handleBackToDialogue() {
    setCurrentStep('dialogue');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#EBC862', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
        <div className="text-6xl mb-6 opacity-50">🔒</div>
        <h1 className="text-2xl font-semibold mb-3">无法访问</h1>
        <p className="text-slate-400 mb-8">{error || '链接无效或已过期'}</p>
        <a
          href="/"
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:scale-105 transition-transform"
        >
          返回首页
        </a>
      </div>
    );
  }

  if (currentStep === 'emotion') {
    return <EmotionScan onNext={handleEmotionComplete} onBack={handleBackToHome} />;
  }

  if (currentStep === 'innerWhisper') {
    return (
      <InnerWhisperJournal
        emotions={journeyData.emotions}
        bodyStates={journeyData.bodyStates}
        onBack={handleBackToEmotion}
        onNext={handleInnerWhisperComplete}
      />
    );
  }

  if (currentStep === 'transition') {
    return (
      <GoldenTransition
        userName="访客"
        higherSelfName="高我"
        onComplete={handleTransitionComplete}
        backgroundMusicUrl={config.audio_step1_url || undefined}
        globalAudio={null}
      />
    );
  }

  if (currentStep === 'dialogue') {
    return (
      <HigherSelfDialogue
        userName="访客"
        higherSelfName="高我"
        journalContent={journeyData.journalContent}
        backgroundMusic={backgroundAudio}
        onComplete={handleDialogueComplete}
        onBack={handleBackToInnerWhisper}
      />
    );
  }

  if (currentStep === 'answers') {
    return (
      <BookOfAnswers
        onComplete={handleAnswersComplete}
        backgroundAudio={backgroundAudio}
        onBack={handleBackToDialogue}
        higherSelfAdvice={journeyData.higherSelfResponse}
        userName="访客"
      />
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white">
      {config.bg_home_url && (
        <OptimizedVideoBackground videoUrl={config.bg_home_url} />
      )}

      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl font-bold mb-4">{config.scene_name}</h1>
        <p className="text-lg text-slate-300 mb-8 max-w-md mx-auto">{config.description}</p>

        <button
          onClick={handleStartJourney}
          className="px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full text-lg font-semibold hover:scale-105 transition-transform shadow-lg"
        >
          开始体验
        </button>
      </div>
    </div>
  );
}
