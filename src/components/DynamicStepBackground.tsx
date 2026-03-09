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
  // 🔥 修复背景丢失：强制使用 fallbackUrl 作为全局兜底
  const effectiveUrl = backgroundUrl && backgroundUrl.trim() !== '' ? backgroundUrl : fallbackUrl;

  console.group('🎬 场景专属背景加载 - 强制兜底策略');
  console.log('📍 组件: DynamicStepBackground');
  console.log('🔗 优先级 1 - 专属背景 (backgroundUrl):', backgroundUrl || '❌ 未配置');
  console.log('🔗 优先级 2 - 通用背景 (fallbackUrl):', fallbackUrl || '❌ 未配置');
  console.log('✅ 最终使用 URL:', effectiveUrl || '❌ 无背景');
  console.log('🚀 资源来源:', effectiveUrl?.includes('supabase') ? '✅ Supabase Storage（引流后台）' : effectiveUrl ? '⚠️ 其他来源' : '❌ 无背景');
  console.log('🚫 已禁用主 App 资源降级');

  if (!effectiveUrl || effectiveUrl.trim() === '') {
    console.error('❌ 严重错误：无背景 URL 可用！');
    console.error('💡 请检查：');
    console.error('  1. config.bg_video_url 是否配置');
    console.error('  2. 各步骤专属背景是否配置');
    console.error('  3. 后台是否正确保存配置');
    console.error('🔧 建议：至少配置 bg_video_url 作为全局兜底');
  } else {
    console.log('✅ 背景 URL 有效，将渲染背景');
  }
  console.groupEnd();

  if (!effectiveUrl || effectiveUrl.trim() === '') {
    console.warn('⚠️ 无背景可用，渲染纯黑背景');
    return (
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a1a2e 100%)'
      }}>
        {children}
      </div>
    );
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
          zIndex: 0,
          opacity: 1,
          transition: 'opacity 0.5s ease-in-out',
          willChange: 'opacity',
          transform: 'translate3d(0, 0, 0)'
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
