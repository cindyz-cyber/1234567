import { ReactNode } from 'react';
import FullScreenVideoBackground from './FullScreenVideoBackground';

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

  console.group('🎬 场景专属背景加载');
  console.log('📍 组件: DynamicStepBackground');
  console.log('🔗 优先级 1 - 专属背景 (backgroundUrl):', backgroundUrl || '❌ 未配置');
  console.log('🔗 优先级 2 - 通用背景 (fallbackUrl):', fallbackUrl || '❌ 未配置');
  console.log('✅ 最终使用 URL:', effectiveUrl || '❌ 无背景');
  console.log('🚀 资源来源:', effectiveUrl?.includes('supabase') ? 'Supabase Storage（引流后台）' : '❌ 未知来源');
  console.log('🚫 已禁用主 App 资源降级');
  console.groupEnd();

  if (!effectiveUrl) {
    return <>{children}</>;
  }

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(effectiveUrl);

  if (isVideo) {
    return (
      <div className="dynamic-step-container" style={{ position: 'relative', minHeight: '100vh' }}>
        <FullScreenVideoBackground videoUrl={effectiveUrl} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
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
