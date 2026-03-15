import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface BrainShutdownProps {
  onClose: () => void;
}

const SCENES = [
  {
    name: '深邃森林',
    url: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    name: '星空',
    url: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    name: '暮色森林',
    url: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    name: '夜空',
    url: 'https://images.pexels.com/photos/1252814/pexels-photo-1252814.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
];

export default function BrainShutdown({ onClose }: BrainShutdownProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % SCENES.length);
        setOpacity(1);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 rounded-full backdrop-blur-xl transition-all hover:scale-110"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(235, 200, 98, 0.5)',
          color: '#EBC862',
        }}
      >
        <X size={24} />
      </button>

      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${SCENES[currentIndex].url})`,
          opacity,
        }}
      />

      <div className="absolute inset-0 bg-black bg-opacity-30" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1
            className="text-4xl font-light"
            style={{
              color: '#EBC862',
              letterSpacing: '0.15em',
              textShadow: '0 0 30px rgba(235, 200, 98, 0.6)',
            }}
          >
            进入深层静默
          </h1>
          <p
            className="text-sm font-light"
            style={{
              color: '#E0E0D0',
              letterSpacing: '0.08em',
              opacity: 0.7,
            }}
          >
            {SCENES[currentIndex].name}
          </p>
        </div>
      </div>
    </div>
  );
}
