import { useState, useEffect } from 'react';
import { KinEnergyReport } from '../types/energyPortrait';

interface Props {
  report: KinEnergyReport;
  onBack: () => void;
}

export default function EnergyPortraitReport({ report, onBack }: Props) {
  const [hoveredCenter, setHoveredCenter] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const hasQuantumResonance = report.quantumResonances.length > 0;

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="energy-portrait-container">
      <div className="portal-background-layer">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="portal-background-video"
        >
          <source src="https://cdn.midjourney.com/video/73a6b711-fbab-490c-a0b9-f3e811e37ead/3.mp4" type="video/mp4" />
        </video>
      </div>

      <div className={`energy-content-wrapper ${isVisible ? 'visible' : ''}`}>
        <button
          onClick={onBack}
          className="back-portal-button"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.9 }}>
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="hero-section" style={{ transform: `translateY(${scrollY * 0.15}px)` }}>
          <div className="seal-container animate-breath">
            <div className="seal-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="rgba(235, 200, 98, 0.3)" strokeWidth="0.5" fill="none"/>
                <circle cx="32" cy="32" r="24" stroke="rgba(235, 200, 98, 0.4)" strokeWidth="0.5" fill="none"/>
                <circle cx="32" cy="32" r="18" fill="url(#sealGradient)"/>
                <text x="32" y="38" textAnchor="middle" fill="rgba(10, 31, 28, 0.9)" fontSize="16" fontWeight="300">☀️</text>
                <defs>
                  <radialGradient id="sealGradient">
                    <stop offset="0%" stopColor="rgba(247, 231, 206, 0.95)" />
                    <stop offset="100%" stopColor="rgba(235, 200, 98, 0.8)" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
            <div className="kin-label">Kin {report.kin}</div>
          </div>

          <h1 className="portal-title">能量画像</h1>
          <p className="portal-subtitle">Quantum Energy Portrait</p>
        </div>

        <div className="scroll-card-wrapper">
          <div className="scroll-card">
            <div className="card-header-line"></div>

            <div className="portrait-grid">
              <div className="portrait-item">
                <span className="portrait-key">模式</span>
                <span className="portrait-value">{report.portrait.mode}</span>
              </div>

              <div className="portrait-item">
                <span className="portrait-key">视角</span>
                <span className="portrait-value">{report.portrait.perspective}</span>
              </div>

              <div className="portrait-item essence-item">
                <span className="portrait-key">本质</span>
                <span className="portrait-value essence-text">{report.portrait.essence}</span>
              </div>
            </div>

            <div className="card-footer-line"></div>
          </div>
        </div>

        <div className="radar-section-wrapper">
          {hasQuantumResonance && (
            <div className="resonance-badge-floating">
              <span>家族共振激活</span>
            </div>
          )}

          <div className="section-header">
            <h2 className="section-title">能量中心解析</h2>
            <p className="section-subtitle">Three-Dimensional Energy Radar</p>
          </div>

          <div className="radar-canvas-wrapper">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <defs>
                <radialGradient id="glowGradient">
                  <stop offset="0%" stopColor="rgba(235, 200, 98, 0.3)" />
                  <stop offset="50%" stopColor="rgba(247, 231, 206, 0.15)" />
                  <stop offset="100%" stopColor="rgba(235, 200, 98, 0)" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {[1, 2, 3, 4, 5].map(level => (
                <circle
                  key={level}
                  cx="200"
                  cy="200"
                  r={level * 30}
                  fill="none"
                  stroke="rgba(247, 231, 206, 0.08)"
                  strokeWidth="0.5"
                  className="animate-pulse-slow"
                  style={{ animationDelay: `${level * 0.2}s` }}
                />
              ))}

              {[0, 1, 2].map(i => {
                const angle = (i * 120 - 90) * (Math.PI / 180);
                const x2 = 200 + Math.cos(angle) * 150;
                const y2 = 200 + Math.sin(angle) * 150;
                return (
                  <line
                    key={i}
                    x1="200"
                    y1="200"
                    x2={x2}
                    y2={y2}
                    stroke="rgba(247, 231, 206, 0.1)"
                    strokeWidth="0.5"
                  />
                );
              })}

              <circle
                cx="200"
                cy="200"
                r="3"
                fill="rgba(235, 200, 98, 0.6)"
                filter="url(#softGlow)"
              />

              <path
                d={generateRadarPath(report.portrait.centers)}
                fill="url(#glowGradient)"
                stroke="rgba(235, 200, 98, 0.6)"
                strokeWidth="2"
                filter="url(#glow)"
                className="transition-all duration-700"
              />

              {report.portrait.centers.map((center, i) => {
                const angle = (i * 120 - 90) * (Math.PI / 180);
                const radius = (center.percentage / 100) * 150;
                const x = 200 + Math.cos(angle) * radius;
                const y = 200 + Math.sin(angle) * radius;
                const isHovered = hoveredCenter === i;

                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? "10" : "6"}
                      fill="rgba(235, 200, 98, 0.8)"
                      stroke="rgba(247, 231, 206, 0.9)"
                      strokeWidth={isHovered ? "3" : "2"}
                      filter="url(#softGlow)"
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredCenter(i)}
                      onMouseLeave={() => setHoveredCenter(null)}
                    />
                    {isHovered && (
                      <>
                        <circle
                          cx={x}
                          cy={y}
                          r="20"
                          fill="none"
                          stroke="rgba(235, 200, 98, 0.3)"
                          strokeWidth="1"
                          className="animate-pulse-slow"
                        />
                        <text
                          x={x}
                          y={y - 25}
                          textAnchor="middle"
                          fill="#EBC862"
                          fontSize="16"
                          fontWeight="300"
                          style={{ letterSpacing: '0.1em' }}
                        >
                          {center.percentage}%
                        </text>
                      </>
                    )}
                  </g>
                );
              })}

              {report.portrait.centers.map((center, i) => {
                const angle = (i * 120 - 90) * (Math.PI / 180);
                const labelRadius = 185;
                const x = 200 + Math.cos(angle) * labelRadius;
                const y = 200 + Math.sin(angle) * labelRadius;

                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fill="#F7E7CE"
                    fontSize="14"
                    fontWeight="300"
                    style={{ letterSpacing: '0.1em' }}
                    opacity="0.9"
                  >
                    {center.icon} {center.name}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="energy-centers-list">
            {report.portrait.centers.map((center, i) => (
              <div
                key={i}
                className={`center-card ${hoveredCenter === i ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCenter(i)}
                onMouseLeave={() => setHoveredCenter(null)}
              >
                <div className="center-header">
                  <div className="center-identity">
                    <span className="center-icon">{center.icon}</span>
                    <div className="center-info">
                      <h3 className="center-name">{center.name}</h3>
                      <span className="center-mode">{center.mode}</span>
                    </div>
                  </div>
                  <div className="center-percentage">{center.percentage}%</div>
                </div>
                <p className="center-description">{center.description}</p>
              </div>
            ))}
          </div>
        </div>

        {hasQuantumResonance && (
          <div className="quantum-section">
            <div className="quantum-ambient-layer">
              <div className="ambient-glow ambient-glow-left"></div>
              <div className="ambient-glow ambient-glow-right"></div>
            </div>

            <div className="section-header">
              <h2 className="section-title">量子信息共振</h2>
              <p className="section-subtitle">Quantum Family Entanglement</p>
            </div>

            <div className="resonance-list">
              {report.quantumResonances.map((resonance, i) => (
                <div key={i} className="resonance-card">
                  <div className="resonance-header">
                    <div className="resonance-identity">
                      <div className="resonance-avatar">
                        {resonance.relationName.slice(0, 1)}
                      </div>
                      <div className="resonance-info">
                        <h3 className="resonance-name">{resonance.relationName}</h3>
                        <span className="resonance-kin">Kin {resonance.kin}</span>
                      </div>
                    </div>
                    <div className="resonance-type">{resonance.typeLabel}</div>
                  </div>
                  <p className="resonance-description">{resonance.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="scroll-card-wrapper">
          <div className="scroll-card">
            <div className="card-header-line"></div>

            <div className="section-header">
              <h2 className="section-title">2026 白风年显化建议</h2>
              <p className="section-subtitle">Universal Cycle Guidance</p>
            </div>

            <div className="guidance-grid">
              <div className="guidance-item">
                <span className="guidance-key">年度主题</span>
                <span className="guidance-value">{report.yearGuidance.theme} - {report.yearGuidance.mainEnergy}</span>
              </div>

              <div className="guidance-item guidance-advice">
                <span className="guidance-key">实修建议</span>
                <span className="guidance-value advice-text">{report.yearGuidance.advice}</span>
              </div>
            </div>

            <div className="card-footer-line"></div>
          </div>
        </div>

        <div className="scroll-card-wrapper final-section">
          <div className="scroll-card">
            <div className="card-header-line"></div>

            <div className="section-header">
              <h2 className="section-title">核心卡点与突破路径</h2>
              <p className="section-subtitle">Breakthrough Path</p>
            </div>

            <div className="challenge-container">
              <div className="challenge-label">当前卡点</div>
              <div className="challenge-center">{report.weakestCenter}</div>
              <p className="challenge-advice">{report.challengeAdvice}</p>
            </div>

            <div className="card-footer-line"></div>
          </div>
        </div>
      </div>

      <style>{`
        .energy-portrait-container {
          position: fixed;
          inset: 0;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .portal-background-layer {
          position: fixed;
          inset: 0;
          z-index: 1;
        }

        .portal-background-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(1.1) contrast(1.05);
        }

        .energy-content-wrapper {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem 12rem;
          opacity: 0;
          transform: translateY(3rem);
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .energy-content-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .back-portal-button {
          position: fixed;
          top: 3rem;
          left: 3rem;
          z-index: 100;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(40px);
          border: 0.5px solid rgba(200, 220, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(247, 231, 206, 0.95);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .back-portal-button:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(200, 220, 255, 0.3);
          transform: scale(1.1);
        }

        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          justify-content: center;
          gap: 4rem;
          padding: 8rem 0;
          transition: transform 0.3s ease-out;
        }

        .seal-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .seal-icon {
          position: relative;
        }

        .kin-label {
          font-size: 1rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          color: rgba(235, 200, 98, 0.9);
          text-shadow: 0 0 20px rgba(235, 200, 98, 0.3);
        }

        .portal-title {
          font-size: 5rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          color: rgba(247, 231, 206, 0.95);
          text-shadow: 0 0 60px rgba(247, 231, 206, 0.25);
          margin: 0;
        }

        .portal-subtitle {
          font-size: 1rem;
          font-weight: 300;
          letter-spacing: 0.4em;
          color: rgba(247, 231, 206, 0.4);
          text-transform: uppercase;
          margin: 0;
        }

        .scroll-card-wrapper {
          margin: 8rem 0;
        }

        .scroll-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(60px);
          border: 0.5px solid rgba(247, 231, 206, 0.12);
          border-radius: 4px;
          padding: 6rem 8rem;
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 60px rgba(0, 0, 0, 0.4);
        }

        .scroll-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 80px rgba(0, 0, 0, 0.5);
          border-color: rgba(247, 231, 206, 0.18);
        }

        .card-header-line,
        .card-footer-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(235, 200, 98, 0.3) 50%,
            transparent 100%);
          margin: 3rem 0;
        }

        .portrait-grid {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .portrait-item {
          display: flex;
          align-items: center;
          gap: 4rem;
          padding: 2rem 0;
        }

        .portrait-item.essence-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 2rem;
        }

        .portrait-key {
          font-size: 1.125rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: rgba(247, 231, 206, 0.5);
          min-width: 160px;
        }

        .portrait-value {
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: rgba(247, 231, 206, 0.95);
          line-height: 1.8;
          flex: 1;
        }

        .portrait-value.essence-text {
          font-size: 1.25rem;
          line-height: 2.2;
          letter-spacing: 0.05em;
        }

        .section-header {
          text-align: center;
          margin-bottom: 6rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 300;
          letter-spacing: 0.25em;
          color: rgba(235, 200, 98, 0.9);
          margin-bottom: 1.5rem;
        }

        .section-subtitle {
          font-size: 0.875rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          color: rgba(247, 231, 206, 0.4);
          text-transform: uppercase;
        }

        .radar-section-wrapper {
          position: relative;
          margin: 12rem 0;
        }

        .resonance-badge-floating {
          position: absolute;
          top: -2rem;
          right: 0;
          z-index: 10;
          padding: 0.75rem 1.5rem;
          border-radius: 100px;
          background: rgba(235, 200, 98, 0.12);
          border: 0.5px solid rgba(235, 200, 98, 0.3);
          backdrop-filter: blur(20px);
        }

        .resonance-badge-floating span {
          font-size: 0.75rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: rgba(235, 200, 98, 0.95);
        }

        .radar-canvas-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          max-width: 600px;
          margin: 0 auto 8rem;
          z-index: 10;
        }

        .energy-centers-list {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          max-width: 100%;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .center-card {
          background: rgba(247, 231, 206, 0.02);
          backdrop-filter: blur(40px);
          border: 0.5px solid rgba(247, 231, 206, 0.08);
          border-radius: 4px;
          padding: 3rem 4rem;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .center-card:hover,
        .center-card.hovered {
          background: rgba(235, 200, 98, 0.06);
          border-color: rgba(235, 200, 98, 0.25);
          transform: translateX(12px);
          box-shadow: 0 8px 40px rgba(235, 200, 98, 0.12);
        }

        .center-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2rem;
          gap: 2rem;
        }

        .center-identity {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .center-icon {
          font-size: 2.5rem;
          opacity: 0.85;
        }

        .center-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .center-name {
          font-size: 1.75rem;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: rgba(247, 231, 206, 0.95);
          margin: 0;
        }

        .center-mode {
          font-size: 0.75rem;
          font-weight: 300;
          letter-spacing: 0.18em;
          color: rgba(235, 200, 98, 0.7);
        }

        .center-percentage {
          font-size: 3rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: rgba(235, 200, 98, 0.9);
        }

        .center-description {
          font-size: 1rem;
          font-weight: 300;
          line-height: 2;
          letter-spacing: 0.05em;
          color: rgba(247, 231, 206, 0.8);
          margin: 0;
          max-width: 100%;
        }

        .quantum-section {
          position: relative;
          background: rgba(235, 200, 98, 0.04);
          backdrop-filter: blur(60px);
          border: 0.5px solid rgba(235, 200, 98, 0.2);
          border-radius: 4px;
          padding: 6rem 4rem;
          margin: 8rem 0;
          overflow: hidden;
          box-shadow: 0 8px 60px rgba(235, 200, 98, 0.2);
        }

        .quantum-ambient-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .ambient-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
        }

        .ambient-glow-left {
          top: 0;
          left: 25%;
          width: 320px;
          height: 320px;
          background: rgba(235, 200, 98, 0.06);
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .ambient-glow-right {
          bottom: 0;
          right: 25%;
          width: 400px;
          height: 400px;
          background: rgba(247, 231, 206, 0.04);
          animation: pulse-slow-delayed 4s ease-in-out infinite;
        }

        .resonance-list {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .resonance-card {
          background: rgba(247, 231, 206, 0.03);
          backdrop-filter: blur(40px);
          border: 0.5px solid rgba(235, 200, 98, 0.18);
          border-radius: 4px;
          padding: 3rem;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .resonance-card:hover {
          transform: scale(1.01);
          box-shadow: 0 8px 40px rgba(235, 200, 98, 0.15);
        }

        .resonance-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          gap: 2rem;
        }

        .resonance-identity {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .resonance-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(235, 200, 98, 0.25) 0%, rgba(247, 231, 206, 0.15) 100%);
          border: 0.5px solid rgba(235, 200, 98, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: rgba(235, 200, 98, 0.95);
        }

        .resonance-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .resonance-name {
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: rgba(247, 231, 206, 0.95);
          margin: 0;
        }

        .resonance-kin {
          font-size: 0.875rem;
          font-weight: 300;
          letter-spacing: 0.18em;
          color: rgba(247, 231, 206, 0.5);
        }

        .resonance-type {
          padding: 0.75rem 1.5rem;
          border-radius: 100px;
          background: rgba(235, 200, 98, 0.12);
          border: 0.5px solid rgba(235, 200, 98, 0.3);
          font-size: 0.75rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: rgba(235, 200, 98, 0.95);
          white-space: nowrap;
        }

        .resonance-description {
          font-size: 1rem;
          font-weight: 300;
          line-height: 2;
          letter-spacing: 0.05em;
          color: rgba(247, 231, 206, 0.8);
          margin: 0;
        }

        .guidance-grid {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .guidance-item {
          display: flex;
          align-items: center;
          gap: 4rem;
          padding: 2rem 0;
        }

        .guidance-item.guidance-advice {
          flex-direction: column;
          align-items: flex-start;
          gap: 2rem;
        }

        .guidance-key {
          font-size: 1.125rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: rgba(247, 231, 206, 0.5);
          min-width: 160px;
        }

        .guidance-value {
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: rgba(247, 231, 206, 0.95);
          line-height: 1.8;
          flex: 1;
        }

        .guidance-value.advice-text {
          font-size: 1.125rem;
          line-height: 2.2;
          letter-spacing: 0.05em;
        }

        .final-section {
          margin-bottom: 4rem;
        }

        .challenge-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem;
          background: rgba(247, 231, 206, 0.02);
          border: 0.5px solid rgba(247, 231, 206, 0.12);
          border-radius: 4px;
        }

        .challenge-label {
          font-size: 1.125rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: rgba(247, 231, 206, 0.5);
          margin-bottom: 1.5rem;
        }

        .challenge-center {
          font-size: 2rem;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: rgba(235, 200, 98, 0.9);
          margin-bottom: 2.5rem;
        }

        .challenge-advice {
          font-size: 1rem;
          font-weight: 300;
          line-height: 2.2;
          letter-spacing: 0.05em;
          color: rgba(247, 231, 206, 0.8);
          margin: 0;
        }

        @media (max-width: 768px) {
          .portal-title {
            font-size: 3rem;
            letter-spacing: 0.2em;
          }

          .scroll-card {
            padding: 4rem 2rem;
          }

          .portrait-item,
          .guidance-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }

          .portrait-key,
          .guidance-key {
            min-width: auto;
          }

          .center-header {
            flex-direction: column;
          }

          .center-percentage {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}

function generateRadarPath(centers: Array<{ percentage: number }>): string {
  const points = centers.map((center, i) => {
    const angle = (i * 120 - 90) * (Math.PI / 180);
    const radius = (center.percentage / 100) * 150;
    const x = 200 + Math.cos(angle) * radius;
    const y = 200 + Math.sin(angle) * radius;
    return `${x},${y}`;
  });

  return `M ${points.join(' L ')} Z`;
}
