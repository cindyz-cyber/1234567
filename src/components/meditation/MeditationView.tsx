import { Routes, Route, Navigate } from 'react-router-dom';
import MarketingFlowEntry from '../MarketingFlowEntry';
import MeditationTransitionPage from './MeditationTransitionPage';
import HigherSelfDialogue from '../HigherSelfDialogue';
import BookOfAnswers from '../BookOfAnswers';
import ShareJournal from '../ShareJournal';
import NavigateToHomePreserveSearch from '../NavigateToHomePreserveSearch';
import { flowPath, useFlowMode } from '../../hooks/useFlowMode';

function MeditationSkipToTransition() {
  const { flowBase } = useFlowMode();
  const q =
    typeof window !== 'undefined' && window.location.search
      ? window.location.search
      : '?mode=meditation';
  return <Navigate to={`${flowPath(flowBase, '/transition')}${q}`} replace />;
}

/**
 * 冥想独立视图：不挂载默认营销背景；不调用 GlobalBackgroundPreloader。
 */
export default function MeditationView() {
  return (
    <Routes>
      <Route path="/" element={<MarketingFlowEntry />} />
      <Route path="/app" element={<MarketingFlowEntry />} />
      <Route path="/transition" element={<MeditationTransitionPage />} />
      <Route path="/app/transition" element={<MeditationTransitionPage />} />
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
