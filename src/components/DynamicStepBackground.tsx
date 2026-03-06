import { ReactNode } from 'react';
import VideoBackground from './VideoBackground';

interface DynamicStepBackgroundProps {
  backgroundUrl: string | null | undefined;
  fallbackUrl?: string;
  children: ReactNode;
}

export default function DynamicStepBackground({
  backgroundUrl,
  fallbackUrl = '',
  children
}: DynamicStepBackgroundProps) {
  const effectiveUrl = backgroundUrl && backgroundUrl.trim() !== '' ? backgroundUrl : fallbackUrl;

  if (!effectiveUrl) {
    return <>{children}</>;
  }

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(effectiveUrl);

  if (isVideo) {
    return (
      <div className="dynamic-step-container">
        <VideoBackground videoUrl={effectiveUrl} />
        {children}
      </div>
    );
  }

  return (
    <div
      className="dynamic-step-container"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${effectiveUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
