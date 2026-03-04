export function applyIOSVideoFix(videoElement: HTMLVideoElement) {
  if (!videoElement) return;

  videoElement.defaultMuted = true;
  videoElement.muted = true;
  videoElement.volume = 0;
  videoElement.setAttribute('muted', 'true');
  videoElement.setAttribute('playsinline', 'true');
  videoElement.setAttribute('webkit-playsinline', 'true');
  videoElement.setAttribute('x-webkit-airplay', 'deny');
  videoElement.removeAttribute('controls');

  const style = document.createElement('style');
  style.textContent = `
    video::-webkit-media-controls { display: none !important; }
    video::-webkit-media-controls-start-playback-button { display: none !important; }
    video::-webkit-media-controls-overlay-play-button { display: none !important; }
  `;

  if (videoElement.parentElement) {
    videoElement.parentElement.appendChild(style);
  }

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: auto;
    background: transparent;
    -webkit-tap-highlight-color: transparent;
  `;

  overlay.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    videoElement.muted = true;
    videoElement.play().catch(() => {});
  }, { capture: true });

  overlay.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    videoElement.muted = true;
    videoElement.play().catch(() => {});
  }, { capture: true, passive: false });

  if (videoElement.parentElement) {
    videoElement.parentElement.style.position = 'relative';
    videoElement.parentElement.appendChild(overlay);
  }

  const forcePlay = () => {
    videoElement.muted = true;
    videoElement.volume = 0;
    videoElement.play().catch(() => {});
  };

  videoElement.addEventListener('loadedmetadata', forcePlay);
  videoElement.addEventListener('canplay', forcePlay);
  videoElement.addEventListener('loadeddata', forcePlay);

  const intervalId = setInterval(() => {
    if (videoElement.paused) {
      videoElement.muted = true;
      videoElement.play().catch(() => {});
    }
  }, 1000);

  return () => {
    clearInterval(intervalId);
    overlay.remove();
    style.remove();
  };
}
