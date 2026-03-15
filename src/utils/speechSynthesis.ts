export interface SpeechConfig {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const speak = (config: SpeechConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(config.text);
    utterance.lang = config.lang || 'zh-CN';
    utterance.rate = config.rate || 0.75;
    utterance.pitch = config.pitch || 0.9;
    utterance.volume = config.volume || 0.85;

    utterance.onend = () => resolve();
    utterance.onerror = (error) => {
      console.warn('Speech synthesis error:', error);
      resolve();
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const createGuidanceSpeaker = () => {
  let isActive = true;

  const speakGuidance = async (messages: { time: number; text: string }[]) => {
    const startTime = Date.now();

    for (const message of messages) {
      if (!isActive) break;

      const elapsed = Date.now() - startTime;
      const delay = message.time * 1000 - elapsed;

      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      if (!isActive) break;

      await speak({
        text: message.text,
        rate: 0.7,
        pitch: 0.85,
        volume: 0.8,
      });
    }
  };

  return {
    start: (messages: { time: number; text: string }[]) => {
      isActive = true;
      return speakGuidance(messages);
    },
    stop: () => {
      isActive = false;
      stopSpeaking();
    },
  };
};
