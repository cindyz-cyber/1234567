interface H5ShareConfig {
  bg_video_url: string;
  bg_music_url: string;
  bg_naming_url: string;
  bg_emotion_url: string;
  bg_journal_url: string;
  bg_transition_url: string;
  bg_answer_book_url: string;
  card_inner_bg_url: string;
}

class ShareBackgroundPreloader {
  private preloadedVideos: Map<string, HTMLVideoElement> = new Map();
  private preloadedImages: Map<string, HTMLImageElement> = new Map();
  private preloadedAudio: Map<string, HTMLAudioElement> = new Map();

  async preloadAllAssets(config: H5ShareConfig): Promise<void> {
    const urls = [
      config.bg_naming_url,
      config.bg_emotion_url,
      config.bg_journal_url,
      config.bg_transition_url,
      config.bg_answer_book_url,
      config.card_inner_bg_url,
      config.bg_video_url
    ].filter(url => url && url.trim() !== '');

    const promises = urls.map(url => this.preloadAsset(url));

    if (config.bg_music_url && config.bg_music_url.trim() !== '') {
      promises.push(this.preloadAudio(config.bg_music_url));
    }

    await Promise.allSettled(promises);
  }

  private async preloadAsset(url: string): Promise<void> {
    if (this.isVideoUrl(url)) {
      return this.preloadVideo(url);
    } else {
      return this.preloadImage(url);
    }
  }

  private isVideoUrl(url: string): boolean {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  private preloadVideo(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedVideos.has(url)) {
        resolve();
        return;
      }

      const video = document.createElement('video');
      video.preload = 'auto';
      video.playsInline = true;
      video.muted = true;
      video.crossOrigin = 'anonymous';

      video.addEventListener('canplaythrough', () => {
        this.preloadedVideos.set(url, video);
        resolve();
      }, { once: true });

      video.addEventListener('error', (e) => {
        console.warn(`Video preload failed for ${url}:`, e);
        resolve();
      }, { once: true });

      video.src = url;
      video.load();
    });
  }

  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.preloadedImages.has(url)) {
        resolve();
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        this.preloadedImages.set(url, img);
        resolve();
      };

      img.onerror = (e) => {
        console.warn(`Image preload failed for ${url}:`, e);
        resolve();
      };

      img.src = url;
    });
  }

  private preloadAudio(url: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.preloadedAudio.has(url)) {
        resolve();
        return;
      }

      const audio = new Audio();
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';

      audio.addEventListener('canplaythrough', () => {
        this.preloadedAudio.set(url, audio);
        resolve();
      }, { once: true });

      audio.addEventListener('error', (e) => {
        console.warn(`Audio preload failed for ${url}:`, e);
        resolve();
      }, { once: true });

      audio.src = url;
      audio.load();
    });
  }

  getVideo(url: string): HTMLVideoElement | null {
    return this.preloadedVideos.get(url) || null;
  }

  getImage(url: string): HTMLImageElement | null {
    return this.preloadedImages.get(url) || null;
  }

  getAudio(url: string): HTMLAudioElement | null {
    return this.preloadedAudio.get(url) || null;
  }

  clear(): void {
    this.preloadedVideos.forEach(video => {
      video.pause();
      video.src = '';
      video.load();
    });
    this.preloadedVideos.clear();

    this.preloadedAudio.forEach(audio => {
      audio.pause();
      audio.src = '';
      audio.load();
    });
    this.preloadedAudio.clear();

    this.preloadedImages.clear();
  }
}

export const shareBackgroundPreloader = new ShareBackgroundPreloader();
