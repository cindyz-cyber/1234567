import { useState } from 'react';
import { TreeDeciduous } from 'lucide-react';
import logoImage from '../assets/227c82c549f3edf64f327b2a617f0246.jpg';

export default function Header() {
  const [imageError, setImageError] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 border-b ethereal-transition header-glass"
      style={{
        backgroundColor: 'transparent',
        borderBottomColor: 'rgba(235, 200, 98, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="max-w-md mx-auto px-6 py-3 flex items-center justify-center"
        style={{ backgroundColor: 'transparent' }}
      >
        {!imageError ? (
          <div
            className="logo-container"
            style={{
              backgroundColor: 'transparent !important',
              padding: 0,
              margin: 0,
              border: 'none',
              boxShadow: 'none'
            }}
          >
            <img
              src={logoImage}
              alt="植本逻辑"
              className="logo-image"
              style={{
                height: '40px',
                width: 'auto',
                backgroundColor: 'transparent !important',
                border: 'none',
                padding: 0,
                margin: '0 auto',
                boxShadow: 'none',
                display: 'block'
              }}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <>
            <div className="golden-icon-wrapper">
              <TreeDeciduous size={24} style={{ color: '#EAD0A8', opacity: 0.7 }} strokeWidth={1.5} />
            </div>
            <span className="ml-2 text-lg font-light brand-text" style={{ color: '#EAD0A8', letterSpacing: '0.08em', opacity: 0.9 }}>
              植本逻辑
            </span>
          </>
        )}
      </div>

      <style>{`
        .header-glass {
          -webkit-backdrop-filter: blur(10px);
          background-color: transparent !important;
        }

        .logo-container {
          background: transparent !important;
          background-color: transparent !important;
        }

        .logo-image {
          filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.4));
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          mix-blend-mode: screen;
          background: transparent !important;
          background-color: transparent !important;
          object-fit: contain;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 auto !important;
          display: block;
          height: 40px;
          width: auto;
        }

        .logo-image:hover {
          filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.6));
          transform: scale(1.02);
        }

        @media (max-width: 640px) {
          .logo-image {
            margin: 0 auto !important;
          }
        }

        .golden-icon-wrapper {
          filter: drop-shadow(0 2px 12px rgba(235, 200, 98, 0.5));
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .golden-icon-wrapper:hover {
          filter: drop-shadow(0 2px 16px rgba(235, 200, 98, 0.7));
        }

        .brand-text {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        header * {
          background-color: transparent !important;
        }
      `}</style>
    </header>
  );
}
