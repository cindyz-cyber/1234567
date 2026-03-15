export const createHypnosisAudio = (): {
  start: () => void;
  stop: () => void;
  fadeOut: (duration: number) => void;
} => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  const oscillator342Hz = audioContext.createOscillator();
  const oscillator171Hz = audioContext.createOscillator();
  const noiseNode = audioContext.createBufferSource();
  const meditationTone1 = audioContext.createOscillator();
  const meditationTone2 = audioContext.createOscillator();

  const masterGain = audioContext.createGain();
  const oscillatorGain = audioContext.createGain();
  const noiseGain = audioContext.createGain();
  const meditationGain = audioContext.createGain();

  oscillator342Hz.type = 'sine';
  oscillator342Hz.frequency.setValueAtTime(342, audioContext.currentTime);

  oscillator171Hz.type = 'sine';
  oscillator171Hz.frequency.setValueAtTime(171, audioContext.currentTime);

  meditationTone1.type = 'sine';
  meditationTone1.frequency.setValueAtTime(528, audioContext.currentTime);

  meditationTone2.type = 'triangle';
  meditationTone2.frequency.setValueAtTime(396, audioContext.currentTime);

  const bufferSize = audioContext.sampleRate * 4;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const wave1 = Math.sin(2 * Math.PI * 0.08 * i / audioContext.sampleRate);
    const wave2 = Math.sin(2 * Math.PI * 0.13 * i / audioContext.sampleRate);
    output[i] = (Math.random() * 2 - 1) * 0.012 * (wave1 * 0.6 + wave2 * 0.4);
  }

  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;

  oscillatorGain.gain.setValueAtTime(0.05, audioContext.currentTime);
  noiseGain.gain.setValueAtTime(0.07, audioContext.currentTime);
  meditationGain.gain.setValueAtTime(0.04, audioContext.currentTime);
  masterGain.gain.setValueAtTime(0, audioContext.currentTime);

  oscillator342Hz.connect(oscillatorGain);
  oscillator171Hz.connect(oscillatorGain);
  meditationTone1.connect(meditationGain);
  meditationTone2.connect(meditationGain);
  noiseNode.connect(noiseGain);

  oscillatorGain.connect(masterGain);
  noiseGain.connect(masterGain);
  meditationGain.connect(masterGain);
  masterGain.connect(audioContext.destination);

  let started = false;

  return {
    start: () => {
      if (!started) {
        oscillator342Hz.start();
        oscillator171Hz.start();
        meditationTone1.start();
        meditationTone2.start();
        noiseNode.start();
        masterGain.gain.linearRampToValueAtTime(1, audioContext.currentTime + 2.5);
        started = true;
      }
    },
    stop: () => {
      if (started) {
        try {
          oscillator342Hz.stop();
          oscillator171Hz.stop();
          meditationTone1.stop();
          meditationTone2.stop();
          noiseNode.stop();
        } catch (e) {
        }
        audioContext.close();
      }
    },
    fadeOut: (duration: number) => {
      masterGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    }
  };
};

export const guidanceTimeline = [
  { time: 0, text: '亲爱的朋友，欢迎你来到与自我的对话空间' },
  { time: 6, text: '请静静地等待那个灵感的声音' },
  { time: 12, text: '你正在关闭头脑的时刻...' },
  { time: 18, text: '深呼吸，感受内在的宁静' },
  { time: 24, text: '让金色的光芒温柔地包裹你' },
  { time: 30, text: '准备好，开始对话' },
];
