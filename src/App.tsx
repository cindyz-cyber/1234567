import { Routes, Route, Navigate } from 'react-router-dom';
import NamingRitual from './components/NamingRitual';
import HomePage from './components/HomePage';
import EmotionScan from './components/EmotionScan';
import InnerWhisperJournal from './components/InnerWhisperJournal';
import GoldenTransition from './components/GoldenTransition';
import HigherSelfDialogue from './components/HigherSelfDialogue';
import BookOfAnswers from './components/BookOfAnswers';
import ShareJournal from './components/ShareJournal';

function App() {
  return (
    <Routes>
      {/* Marketing / public linear flow */}
      <Route path="/" element={<NamingRitual />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/emotions" element={<EmotionScan />} />
      <Route path="/journal" element={<InnerWhisperJournal />} />
      <Route path="/transition" element={<GoldenTransition />} />
      <Route path="/dialogue" element={<HigherSelfDialogue />} />
      <Route path="/answers" element={<BookOfAnswers />} />
      <Route path="/share" element={<ShareJournal />} />

      {/* Internal app shell — same components & UX, paths prefixed with /app */}
      <Route path="/app" element={<NamingRitual />} />
      <Route path="/app/home" element={<HomePage />} />
      <Route path="/app/emotions" element={<EmotionScan />} />
      <Route path="/app/journal" element={<InnerWhisperJournal />} />
      <Route path="/app/transition" element={<GoldenTransition />} />
      <Route path="/app/dialogue" element={<HigherSelfDialogue />} />
      <Route path="/app/answers" element={<BookOfAnswers />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;