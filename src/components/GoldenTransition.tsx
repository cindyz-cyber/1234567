import { useEffect, useState, useRef } from 'react';
import {
  createAndPlayAudioFromZero,
  isVideoUrl,
  playAudioFromZero,
  stopAllAudio,
} from '../utils/audioManager';
import { cancelAllBackgroundPreloads } from '../utils/globalBackgroundPreloader';
import { supabase } from '../lib/supabase';

interface GoldenTransitionProps {
  userName: string;
  higherSelfName: string;
  onComplete: (backgroundMusic: HTMLAudioElement | null) => void;
  backgroundMusicUrl?: string | null;
  backgroundVideoUrl?: string | null;
  globalAudio?: HTMLAudioElement | null;
  isMusicVideo?: boolean;
  autoAdvance?: boolean;
}

export default function GoldenTransition({
  userName,
  higherSelfName,
  onComplete,
  backgroundMusicUrl,
  backgroundVideoUrl,
  globalAudio,
  isMusicVideo = false,
  autoAdvance = true,
}: GoldenTransitionProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [currentBackgroundMusic, setCurrentBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);
  const isInitializingRef = useRef(false);
  const transitionCompletedRef = useRef(false);

  const defaultVideoUrl =
    'https://cdn.midjourney.com/video/b84b7c1b-df4c-415a-915f-eb3a46e28f88/1.mp4';
  const isMediaUrlVideo = backgroundMusicUrl && isVideoUrl(backgroundMusicUrl);
  const effectiveVideoUrl = isMediaUrlVideo
    ? backgroundMusicUrl
    : backgroundVideoUrl || defaultVideoUrl;

  useEffect(() => {
    stopAllAudio();
    cancelAllBackgroundPreloads();

    let fadeOutTimer: number;
    let completeTimer: number;
    const transitionDuration = 10000;

    const initializeAudio = async () => {
      if (isInitializingRef.current) return;
      isInitializingRef.current = true;

      try {
        if (globalAudio) {
          await playAudioFromZero(globalAudio);
          audioInstanceRef.current = globalAudio;
          setCurrentBackgroundMusic(globalAudio);
        } else if (!isMediaUrlVideo) {
          let audioUrl = backgroundMusicUrl;
          if (!audioUrl) {
            const { data } = await supabase
              .from('audio_files')
              .select('file_path')
              .eq('is_active', true)
              .eq('file_type', 'guidance')
              .limit(1)
              .maybeSingle();
            if (data?.file_path) {
              audioUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/audio-files/${data.file_path}`;
            }
          }
          if (audioUrl) {
            const cacheBustedUrl = `${audioUrl}?t=${Date.now()}`;
            const instance = await createAndPlayAudioFromZero(cacheBustedUrl);
            audioInstanceRef.current = instance;
            if (instance) setCurrentBackgroundMusic(instance);
          }
        }
      } finally {
        isInitializingRef.current = false;
      }

      if (autoAdvance) {
        fadeOutTimer = window.setTimeout(() => setFadeOut(true), transitionDuration - 1000);
        completeTimer = window.setTimeout(() => {
          transitionCompletedRef.current = true;
          onComplete(audioInstanceRef.current);
        }, transitionDuration);
      }
    };

    initializeAudio();

    return () => {
      if (typeof fadeOutTimer !== 'undefined') clearTimeout(fadeOutTimer);
      if (typeof completeTimer !== 'undefined') clearTimeout(completeTimer);
      if (audioInstanceRef.current && !transitionCompletedRef.current) {
        try {
          audioInstanceRef.current.pause();
          audioInstanceRef.current.src = '';
          audioInstanceRef.current.load();
        } catch (_) {}
        audioInstanceRef.current = null;
      }
    };
    // 仅挂载时执行一次，避免重复触发导致双音/跳秒
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ opacity: fadeOut ? 0 : 1, transition: 'opacity 2s ease' }}
    >
      <div className="fixed inset-0 w-full h-full z-[-1] bg-[#020d0a]">
        <video
          autoPlay
          loop
          muted={!isMusicVideo}
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src={effectiveVideoUrl} type="video/mp4" />
        </video>
      </div>

      <div className="divine-golden-tree" />

      <div className="text-center z-10">
        <p className="text-[#F7E7CE] text-lg tracking-[0.4em] mb-4">
          带着问题，闭上眼， 打开心。。。
        </p>
        <p className="text-[#F7E7CE] opacity-70 tracking-[0.3em]">
          正在连接你的 {higherSelfName}
        </p>
      </div>

      <style>{`
        .divine-golden-tree {
          width: 280px; height: 280px; border-radius: 50%;
          border: 2px solid rgba(255, 230, 120, 0.8);
          box-shadow: 0 0 50px rgba(255, 220, 100, 0.5);
          margin-bottom: 2rem;
          animation: pulse 4s infinite;
        }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>
    </div>
  );
}
