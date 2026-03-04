import { useEffect, useRef } from 'react';
import { applyIOSVideoFix } from '../utils/iosVideoFix';

interface PortalBackgroundProps {
  videoSrc: string;
  posterImg: string;
  overlayGradient?: string;
  className?: string;
}

export default function PortalBackground({
  videoSrc,
  posterImg,
  overlayGradient = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(2, 13, 10, 0.25) 50%, rgba(0, 0, 0, 0.22) 100%)',
  className = '',
}: PortalBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const cleanup = applyIOSVideoFix(video);

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log('Autoplay restricted, static poster remains visible');
      }
    };

    playVideo();

    return cleanup;
  }, []);

  return (
    <div
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{
        zIndex: -1,
        backgroundColor: '#0a1e1a',
        background: 'linear-gradient(135deg, #0a1e1a 0%, #1a2f2a 50%, #0f2520 100%)',
      }}
    >
      <video
        ref={videoRef}
        autoPlay={true}
        loop={true}
        muted={true}
        playsInline={true}
        controls={false}
        crossOrigin="anonymous"
        preload="auto"
        poster={posterImg}
        disablePictureInPicture={true}
        disableRemotePlayback={true}
        className="absolute inset-0 w-full h-full object-cover portal-background-video"
        style={{
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform',
          filter: 'contrast(1.15) brightness(0.95) saturate(1.05)',
          opacity: 1,
          pointerEvents: 'none',
        }}
        onLoadedData={(e) => {
          const videoEl = e.target as HTMLVideoElement;
          videoEl.defaultMuted = true;
          videoEl.muted = true;
          videoEl.volume = 0;
          videoEl.play().catch(() => {});
        }}
        onCanPlay={(e) => {
          const videoEl = e.target as HTMLVideoElement;
          videoEl.muted = true;
          videoEl.volume = 0;
          videoEl.play().catch(() => {});
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: overlayGradient,
        }}
      />

      <style>{`
        .portal-background-video::-webkit-media-controls {
          display: none !important;
        }
        .portal-background-video::-webkit-media-controls-start-playback-button {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        .portal-background-video::-webkit-media-controls-play-button {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        .portal-background-video::-webkit-media-controls-panel {
          display: none !important;
        }
        .portal-background-video::-webkit-media-controls-overlay-play-button {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}</style>
    </div>
  );
}
