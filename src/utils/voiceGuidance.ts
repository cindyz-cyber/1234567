export const guidanceMessages = [
  '闭上眼，感受那股金色的力量正通过你的呼吸...',
  '现在，你就是那颗发光的树，对他/她说出第一句话...',
  '别思考，去感受',
  '写下第一个跳出的词',
  '他在听你说话',
  '让那些未被说出的情绪，化为文字流淌出来...',
  '你的内在智慧正在等待你倾听',
  '深呼吸，感受当下这一刻的宁静',
  '信任第一个涌现的画面或词语',
  '你已经知道答案了，只是需要说出来'
];

export const getRandomGuidanceMessages = (count: number = 3): string[] => {
  const shuffled = [...guidanceMessages].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const generate342HzTone = (duration: number = 60): string => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const numSamples = sampleRate * duration;
  const audioBuffer = audioContext.createBuffer(1, numSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    channelData[i] =
      Math.sin(2 * Math.PI * 342 * t) * 0.15 +
      Math.sin(2 * Math.PI * 684 * t) * 0.08 +
      Math.sin(2 * Math.PI * 171 * t) * 0.05;
  }

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);

  return '342hz-generated';
};
