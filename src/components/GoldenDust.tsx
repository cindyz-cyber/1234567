import { useEffect, useRef } from 'react';

export default function GoldenDust() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particleCount = 30;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'golden-dust-particle';

      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const endX = (Math.random() - 0.5) * 200;
      const endY = -100 - Math.random() * 100;
      const duration = 30 + Math.random() * 40;
      const delay = Math.random() * 20;
      const size = 1 + Math.random() * 2;

      particle.style.cssText = `
        left: ${startX}%;
        top: ${startY}%;
        width: ${size}px;
        height: ${size}px;
        --dust-x: ${endX}px;
        --dust-y: ${endY}px;
        animation: goldenDustFloat ${duration}s linear ${delay}s infinite;
      `;

      containerRef.current.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    />
  );
}
