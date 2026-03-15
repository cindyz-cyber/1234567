import { useEffect, useRef } from 'react';

interface WaveAnimationProps {
  waveSpeed: number;
  waveAmplitude: number;
  isPlaying: boolean;
}

export default function WaveAnimation({ waveSpeed, waveAmplitude, isPlaying }: WaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;
      const frequency = 0.02 / waveSpeed;
      const amplitude = waveAmplitude;

      // Draw three overlapping waves for richer effect
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        const opacity = 0.6 - wave * 0.15;
        const offset = wave * 0.3;

        ctx.strokeStyle = `rgba(235, 200, 98, ${opacity})`;
        ctx.lineWidth = 1.5 - wave * 0.3;
        ctx.shadowBlur = 20 - wave * 5;
        ctx.shadowColor = `rgba(235, 200, 98, ${opacity * 0.8})`;

        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * frequency + timeRef.current + offset) * (amplitude - wave * 5);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      timeRef.current += 0.05 / waveSpeed;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, waveSpeed, waveAmplitude]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={200}
      className="w-full h-full"
      style={{ opacity: isPlaying ? 1 : 0, transition: 'opacity 0.5s ease' }}
    />
  );
}
