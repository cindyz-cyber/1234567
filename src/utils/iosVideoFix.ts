export function applyIOSVideoFix(videoElement: HTMLVideoElement) {
  if (!videoElement) return;

  videoElement.defaultMuted = true;
  videoElement.muted = true;
  videoElement.volume = 0;
  videoElement.setAttribute('muted', 'true');
  videoElement.setAttribute('playsinline', 'true');
  videoElement.setAttribute('webkit-playsinline', 'true');
  videoElement.setAttribute('x-webkit-airplay', 'deny');
  videoElement.setAttribute('x5-playsinline', 'true');
  videoElement.setAttribute('x5-video-player-type', 'h5');
  videoElement.setAttribute('x5-video-player-fullscreen', 'false');
  videoElement.removeAttribute('controls');

  const forcePlay = () => {
    videoElement.muted = true;
    videoElement.volume = 0;
    videoElement.play().catch(() => {});
  };

  videoElement.addEventListener('loadedmetadata', forcePlay);
  videoElement.addEventListener('canplay', forcePlay);
  videoElement.addEventListener('loadeddata', forcePlay);
  videoElement.addEventListener('play', () => {
    videoElement.muted = true;
    videoElement.volume = 0;
  });

  const clickHandler = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    videoElement.muted = true;
    videoElement.play().catch(() => {});
  };

  videoElement.addEventListener('click', clickHandler, { capture: true });
  videoElement.addEventListener('touchstart', clickHandler, { capture: true, passive: false });
  videoElement.addEventListener('touchend', clickHandler, { capture: true, passive: false });

  const intervalId = setInterval(() => {
    if (videoElement.paused) {
      videoElement.muted = true;
      videoElement.play().catch(() => {});
    }
  }, 1000);

  return () => {
    clearInterval(intervalId);
    videoElement.removeEventListener('loadedmetadata', forcePlay);
    videoElement.removeEventListener('canplay', forcePlay);
    videoElement.removeEventListener('loadeddata', forcePlay);
    videoElement.removeEventListener('click', clickHandler, true);
    videoElement.removeEventListener('touchstart', clickHandler, true);
    videoElement.removeEventListener('touchend', clickHandler, true);
  };
}
