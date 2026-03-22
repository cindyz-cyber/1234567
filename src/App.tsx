import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { isMeditationUrlNativeIncludes } from './utils/urlModeBootstrap';
import {
  UrlModeContext,
  type UrlModeContextValue,
} from './context/urlModeContext';
import { flowPath, useFlowMode } from './hooks/useFlowMode';
import MarketingFlowEntry from './components/MarketingFlowEntry';
import HomePage from './components/HomePage';
import EmotionScan from './components/EmotionScan';
import InnerWhisperJournal from './components/InnerWhisperJournal';
import GoldenTransition from './components/GoldenTransition';
import HigherSelfDialogue from './components/HigherSelfDialogue';
import BookOfAnswers from './components/BookOfAnswers';
import ShareJournal from './components/ShareJournal';
import NavigateToHomePreserveSearch from './components/NavigateToHomePreserveSearch';

/**
 * 冥想模式下禁止挂载起名/首页/情绪/日记等默认背景页，统一重定向到过渡页。
 */
function MeditationSkipToTransition() {
  const { flowBase } = useFlowMode();
  const q =
    typeof window !== 'undefined' && window.location.search
      ? window.location.search
      : '?mode=meditation';
  return <Navigate to={`${flowPath(flowBase, '/transition')}${q}`} replace />;
}

/**
 * 监听 `window.location.search`（含 popstate + React Router 导航后再次读取 window），
 * 解决生产环境 query 与路由不同步、404 回首页丢参数等问题。
 */
function UrlModeProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [searchFromWindow, setSearchFromWindow] = useState(
    () => (typeof window !== 'undefined' ? window.location.search : '')
  );

  useEffect(() => {
    const readWindowSearch = () => {
      if (typeof window === 'undefined') return;
      const mode = new URLSearchParams(window.location.search).get('mode');
      console.log("Current URL Mode:", mode);
      setSearchFromWindow(window.location.search);
    };

    readWindowSearch();

    window.addEventListener('popstate', readWindowSearch);

    return () => {
      window.removeEventListener('popstate', readWindowSearch);
    };
  }, [location.pathname, location.search, location.hash, location.key]);

  const modeFromWindow = useMemo(() => {
    return new URLSearchParams(searchFromWindow).get('mode');
  }, [searchFromWindow]);

  const value = useMemo<UrlModeContextValue>(
    () => ({ modeFromWindow, searchFromWindow }),
    [modeFromWindow, searchFromWindow]
  );

  useEffect(() => {
    if (modeFromWindow !== 'meditation') return;
    try {
      localStorage.clear();
      console.log('[Meditation] localStorage cleared for mode=meditation entry');
    } catch (e) {
      console.warn('[Meditation] localStorage.clear failed:', e);
    }
  }, [modeFromWindow]);

  return (
    <UrlModeContext.Provider value={value}>{children}</UrlModeContext.Provider>
  );
}

/** 默认漏斗：含起名、首页、情绪、日记等（会加载 PortalBackground / 默认素材） */
function DefaultAppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MarketingFlowEntry />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/emotions" element={<EmotionScan />} />
      <Route path="/journal" element={<InnerWhisperJournal />} />
      <Route path="/transition" element={<GoldenTransition />} />
      <Route path="/dialogue" element={<HigherSelfDialogue />} />
      <Route path="/answers" element={<BookOfAnswers />} />
      <Route path="/share" element={<ShareJournal />} />

      <Route path="/app" element={<MarketingFlowEntry />} />
      <Route path="/app/home" element={<HomePage />} />
      <Route path="/app/emotions" element={<EmotionScan />} />
      <Route path="/app/journal" element={<InnerWhisperJournal />} />
      <Route path="/app/transition" element={<GoldenTransition />} />
      <Route path="/app/dialogue" element={<HigherSelfDialogue />} />
      <Route path="/app/answers" element={<BookOfAnswers />} />

      <Route path="*" element={<NavigateToHomePreserveSearch />} />
    </Routes>
  );
}

/**
 * 冥想漏斗：不注册 HomePage / EmotionScan / InnerWhisperJournal，避免默认背景组件挂载。
 */
function MeditationAppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MarketingFlowEntry />} />
      <Route path="/app" element={<MarketingFlowEntry />} />
      <Route path="/transition" element={<GoldenTransition />} />
      <Route path="/app/transition" element={<GoldenTransition />} />
      <Route path="/dialogue" element={<HigherSelfDialogue />} />
      <Route path="/app/dialogue" element={<HigherSelfDialogue />} />
      <Route path="/answers" element={<BookOfAnswers />} />
      <Route path="/app/answers" element={<BookOfAnswers />} />
      <Route path="/share" element={<ShareJournal />} />

      <Route path="/home" element={<MeditationSkipToTransition />} />
      <Route path="/app/home" element={<MeditationSkipToTransition />} />
      <Route path="/emotions" element={<MeditationSkipToTransition />} />
      <Route path="/app/emotions" element={<MeditationSkipToTransition />} />
      <Route path="/journal" element={<MeditationSkipToTransition />} />
      <Route path="/app/journal" element={<MeditationSkipToTransition />} />

      <Route path="*" element={<NavigateToHomePreserveSearch />} />
    </Routes>
  );
}

function App() {
  const renderModeLogged = useRef(false);
  const nativeMeditation =
    typeof window !== 'undefined' && window.location.search.includes('meditation');

  if (!renderModeLogged.current) {
    renderModeLogged.current = true;
    console.log(
      '🔥 最终确定的渲染模式:',
      nativeMeditation ? 'MEDITATION' : 'DEFAULT'
    );
  }

  return (
    <UrlModeProvider>
      {isMeditationUrlNativeIncludes() ? (
        <div data-app-shell="meditation" className="contents">
          <MeditationAppRoutes />
        </div>
      ) : (
        <div data-app-shell="default" className="contents">
          <DefaultAppRoutes />
        </div>
      )}
    </UrlModeProvider>
  );
}

export default App;
