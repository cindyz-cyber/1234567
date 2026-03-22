import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { runEntryPreload } from '../../main/runEntryPreload';
import {
  UrlModeContext,
  type UrlModeContextValue,
} from '../../context/urlModeContext';
import MarketingFlowEntry from '../MarketingFlowEntry';
import HomePage from '../HomePage';
import EmotionScan from '../EmotionScan';
import InnerWhisperJournal from '../InnerWhisperJournal';
import GoldenTransition from '../GoldenTransition';
import HigherSelfDialogue from '../HigherSelfDialogue';
import BookOfAnswers from '../BookOfAnswers';
import ShareJournal from '../ShareJournal';
import NavigateToHomePreserveSearch from '../NavigateToHomePreserveSearch';

function UrlModeProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [searchFromWindow, setSearchFromWindow] = useState(
    () => (typeof window !== 'undefined' ? window.location.search : '')
  );

  useEffect(() => {
    const readWindowSearch = () => {
      if (typeof window === 'undefined') return;
      const mode = new URLSearchParams(window.location.search).get('mode');
      console.log('Current URL Mode:', mode);
      setSearchFromWindow(window.location.search);
    };

    readWindowSearch();
    window.addEventListener('popstate', readWindowSearch);
    return () => window.removeEventListener('popstate', readWindowSearch);
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

/**
 * 默认营销视图：挂载后触发全局预加载（runEntryPreload）。
 */
export default function DefaultView() {
  useEffect(() => {
    void runEntryPreload().catch((err) => {
      console.warn('入口预加载失败（非致命）:', err);
    });
  }, []);

  return (
    <UrlModeProvider>
      <div data-app-shell="default" className="contents">
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
      </div>
    </UrlModeProvider>
  );
}
