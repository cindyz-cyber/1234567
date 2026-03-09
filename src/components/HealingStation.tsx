import { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import {
  getTracksByFrequency,
  getRandomTrack,
  getAudioUrl,
  formatDuration,
  HealingTrack,
  FREQUENCY_BENEFITS
} from '../utils/healingAudioService';
import { playAudioFromZero } from '../utils/audioManager';

interface HealingStationProps {
  frequencyHz: number;
  chakraName: string;
}

export default function HealingStation({ frequencyHz, chakraName }: HealingStationProps) {
  const [tracks, setTracks] = useState<HealingTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<HealingTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const benefit = FREQUENCY_BENEFITS[frequencyHz];

  useEffect(() => {
    loadTracks();
  }, [frequencyHz]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = getAudioUrl(currentTrack.filePath);
      audioRef.current.load();
      if (isPlaying) {
        // 🔥 使用双重强制归零播放器
        playAudioFromZero(audioRef.current).catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]);

  const loadTracks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTracks = await getTracksByFrequency(frequencyHz);
      setTracks(fetchedTracks);

      if (fetchedTracks.length > 0) {
        setCurrentTrack(fetchedTracks[0]);
      } else {
        setError('暂无可用的疗愈音频');
      }
    } catch (err) {
      console.error('Error loading tracks:', err);
      setError('加载音频失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tracks.length === 0) return;

    const newTrack = getRandomTrack(tracks, currentTrack?.id);
    if (newTrack) {
      setCurrentTrack(newTrack);
      setCurrentTime(0);
      // 双重强制归零将在 useEffect 中处理
    }
  };

  const togglePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // 🔥 使用双重强制归零播放器
      try {
        await playAudioFromZero(audioRef.current);
        setIsPlaying(true);
      } catch (err) {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!audioRef.current || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="healing-station-container">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {benefit && (
        <div className="frequency-benefit-banner" style={{ borderLeftColor: benefit.color }}>
          <Sparkles size={18} style={{ color: benefit.color }} />
          <div className="benefit-text">
            <span className="benefit-label">补足 {frequencyHz}Hz 将获得：</span>
            <span className="benefit-description">{benefit.benefit}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="healing-station-loading">
          <Music size={24} className="pulse-icon" />
          <span>正在加载疗愈音频...</span>
        </div>
      ) : error ? (
        <div className="healing-station-error">
          <Music size={24} />
          <span>{error}</span>
          <p className="error-hint">管理员可在后台上传 {frequencyHz}Hz 频率的音频文件</p>
        </div>
      ) : currentTrack ? (
        <div className="healing-player">
          <div className="player-track-info">
            {currentTrack.coverImageUrl ? (
              <img
                src={currentTrack.coverImageUrl}
                alt={currentTrack.title}
                className="track-cover"
              />
            ) : (
              <div className="track-cover-placeholder">
                <Music size={32} />
              </div>
            )}

            <div className="track-details">
              <div className="track-title">{currentTrack.title}</div>
              <div className="track-frequency">
                {frequencyHz}Hz • {chakraName}
              </div>
              {tracks.length > 1 && (
                <div className="track-count">
                  音频池：{tracks.length} 首可选
                </div>
              )}
            </div>

            {tracks.length > 1 && (
              <button className="shuffle-button" onClick={handleShuffle} title="换一换">
                <RotateCcw size={20} />
                <span>换一换</span>
              </button>
            )}
          </div>

          <div className="player-controls">
            <button className="play-button" onClick={togglePlayPause}>
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <div className="player-timeline">
              <span className="time-display">{formatDuration(Math.floor(currentTime))}</span>
              <div className="progress-bar" onClick={handleSeek}>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <span className="time-display">{formatDuration(Math.floor(duration))}</span>
            </div>

            <div className="volume-indicator">
              <Volume2 size={18} />
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        .healing-station-container {
          margin-top: 20px;
        }

        .frequency-benefit-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 20px 24px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          border-left: 4px solid;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }

        .benefit-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .benefit-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
        }

        .benefit-description {
          color: rgba(255, 255, 255, 0.95);
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.08em;
          line-height: 1.8;
          font-family: 'Noto Serif SC', serif;
        }

        .healing-station-loading,
        .healing-station-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px 20px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
        }

        .pulse-icon {
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .error-hint {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 8px;
        }

        .healing-player {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .player-track-info {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .track-cover,
        .track-cover-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .track-cover-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.3);
        }

        .track-details {
          flex: 1;
          min-width: 0;
        }

        .track-title {
          color: rgba(255, 255, 255, 0.95);
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.08em;
          font-family: 'Noto Serif SC', serif;
          margin-bottom: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .track-frequency {
          color: rgba(255, 200, 100, 0.8);
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
          margin-bottom: 4px;
        }

        .track-count {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          letter-spacing: 0.08em;
          font-family: 'Noto Serif SC', serif;
        }

        .shuffle-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: linear-gradient(135deg, rgba(100, 200, 255, 0.15), rgba(150, 100, 255, 0.15));
          border: 1.5px solid rgba(150, 150, 255, 0.4);
          border-radius: 10px;
          color: rgba(200, 200, 255, 0.95);
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .shuffle-button:hover {
          background: linear-gradient(135deg, rgba(100, 200, 255, 0.25), rgba(150, 100, 255, 0.25));
          border-color: rgba(150, 150, 255, 0.7);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(150, 100, 255, 0.3);
        }

        .shuffle-button:active {
          transform: translateY(0);
        }

        .player-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .play-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(247, 231, 206, 0.2), rgba(235, 200, 98, 0.2));
          border: 2px solid rgba(247, 231, 206, 0.5);
          color: rgba(255, 255, 255, 0.95);
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .play-button:hover {
          background: linear-gradient(135deg, rgba(247, 231, 206, 0.3), rgba(235, 200, 98, 0.3));
          border-color: rgba(247, 231, 206, 0.8);
          transform: scale(1.1);
          box-shadow: 0 4px 20px rgba(247, 231, 206, 0.4);
        }

        .player-timeline {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .time-display {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          font-family: monospace;
          min-width: 40px;
          text-align: center;
        }

        .progress-bar {
          flex: 1;
          cursor: pointer;
          padding: 4px 0;
        }

        .progress-track {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, rgba(247, 231, 206, 0.8), rgba(235, 200, 98, 0.8));
          border-radius: 2px;
          transition: width 0.1s linear;
        }

        .volume-indicator {
          color: rgba(255, 255, 255, 0.5);
          display: flex;
          align-items: center;
        }

        @media (max-width: 640px) {
          .player-track-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .shuffle-button {
            width: 100%;
            justify-content: center;
          }

          .track-cover,
          .track-cover-placeholder {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}
