import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import {
  UrlModeContext,
  type UrlModeContextValue,
} from './context/urlModeContext';
import { isMeditationModeFromSearch } from './utils/urlModeBootstrap';
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

function App() {
  const renderModeLogged = useRef(false);
  if (!renderModeLogged.current) {
    renderModeLogged.current = true;
    console.log(
      '🔥 最终确定的渲染模式:',
      isMeditationModeFromSearch() ? 'MEDITATION' : 'DEFAULT'
    );
  }

  return (
    <UrlModeProvider>
      <Routes>
        {/* Marketing / public linear flow */}
        <Route path="/" element={<MarketingFlowEntry />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/emotions" element={<EmotionScan />} />
        <Route path="/journal" element={<InnerWhisperJournal />} />
        <Route path="/transition" element={<GoldenTransition />} />
        <Route path="/dialogue" element={<HigherSelfDialogue />} />
        <Route path="/answers" element={<BookOfAnswers />} />
        <Route path="/share" element={<ShareJournal />} />

        {/* Internal app shell — same components & UX, paths prefixed with /app */}
        <Route path="/app" element={<MarketingFlowEntry />} />
        <Route path="/app/home" element={<HomePage />} />
        <Route path="/app/emotions" element={<EmotionScan />} />
        <Route path="/app/journal" element={<InnerWhisperJournal />} />
        <Route path="/app/transition" element={<GoldenTransition />} />
        <Route path="/app/dialogue" element={<HigherSelfDialogue />} />
        <Route path="/app/answers" element={<BookOfAnswers />} />

        <Route path="*" element={<NavigateToHomePreserveSearch />} />
      </Routes>
    </UrlModeProvider>
  );
}

export default App;
