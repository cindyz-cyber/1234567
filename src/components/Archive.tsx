import { useEffect, useState, useRef } from 'react';
import { TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface JournalEntry {
  id: string;
  emotions: string[];
  body_states: string[];
  journal_content: string;
  higher_self_response: string;
  created_at: string;
}

interface EmotionCount {
  emotion: string;
  count: number;
}

interface Insight {
  text: string;
  emotion: string;
  count: number;
}

export default function Archive() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [emotionStats, setEmotionStats] = useState<EmotionCount[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (emotionStats.length > 0 && canvasRef.current) {
      drawEmotionChart();
    }
  }, [emotionStats]);

  async function loadData() {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      setEntries(data || []);
      calculateEmotionStats(data || []);
      generateInsights(data || []);
    } catch (error) {
      console.error('Error loading archive:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateEmotionStats(data: JournalEntry[]) {
    const emotionMap: Record<string, number> = {};

    data.forEach(entry => {
      entry.emotions.forEach(emotion => {
        emotionMap[emotion] = (emotionMap[emotion] || 0) + 1;
      });
    });

    const stats = Object.entries(emotionMap)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setEmotionStats(stats);
  }

  function generateInsights(data: JournalEntry[]) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentEntries = data.filter(
      entry => new Date(entry.created_at) >= weekAgo
    );

    const emotionPatterns: Record<string, number> = {};

    recentEntries.forEach(entry => {
      entry.emotions.forEach(emotion => {
        emotionPatterns[emotion] = (emotionPatterns[emotion] || 0) + 1;
      });
    });

    const generatedInsights: Insight[] = [];

    Object.entries(emotionPatterns).forEach(([emotion, count]) => {
      if (count >= 2) {
        generatedInsights.push({
          text: `系统发现，这周你有 ${count} 次记录到与"${emotion}"相关的情绪状态`,
          emotion,
          count,
        });
      }
    });

    setInsights(generatedInsights);
  }

  function drawEmotionChart() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    if (emotionStats.length === 0) return;

    const maxCount = Math.max(...emotionStats.map(s => s.count));
    const pointSpacing = chartWidth / (emotionStats.length - 1 || 1);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(235, 200, 98, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#EBC862';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(235, 200, 98, 0.5)';

    emotionStats.forEach((stat, index) => {
      const x = padding + index * pointSpacing;
      const y = padding + chartHeight - (stat.count / maxCount) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw points
    emotionStats.forEach((stat, index) => {
      const x = padding + index * pointSpacing;
      const y = padding + chartHeight - (stat.count / maxCount) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#EBC862';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(235, 200, 98, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw outer glow
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(235, 200, 98, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  const maxCount = Math.max(...emotionStats.map(s => s.count), 1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#EBC862', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-20 px-6 relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
        style={{ opacity: 0.3 }}
      >
        <source src="https://cdn.midjourney.com/video/73a6b711-fbab-490c-a0b9-f3e811e37ead/3.mp4" type="video/mp4" />
      </video>

      <div
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 31, 28, 0.95) 0%, rgba(2, 10, 9, 0.98) 100%)',
          pointerEvents: 'none'
        }}
      />

      <div className="max-w-md mx-auto space-y-8 relative z-10">
        <p className="text-sm font-light text-center" style={{ color: '#E0E0D0', opacity: 0.8, letterSpacing: '0.04em' }}>
          欢迎回来，植本人。这是你的情绪节律。
        </p>

        {/* Emotion Timeline Chart */}
        <div>
          <h2 className="text-2xl font-light mb-6" style={{ color: '#EBC862', letterSpacing: '0.06em' }}>
            情绪历程图
          </h2>

          {emotionStats.length > 0 ? (
            <div
              className="p-6 rounded-3xl backdrop-blur-xl"
              style={{
                backgroundColor: 'rgba(2, 10, 9, 0.6)',
                border: '0.5px solid #EBC862',
                boxShadow: '0 8px 32px rgba(235, 200, 98, 0.1)',
              }}
            >
              <canvas
                ref={canvasRef}
                width={320}
                height={180}
                className="w-full"
              />

              <div className="mt-4 flex justify-around">
                {emotionStats.map(stat => (
                  <div key={stat.emotion} className="text-center">
                    <p className="text-xs font-light" style={{ color: '#EBC862', opacity: 0.8, letterSpacing: '0.03em' }}>
                      {stat.emotion}
                    </p>
                    <p className="text-xs font-light mt-1" style={{ color: '#E0E0D0', opacity: 0.6 }}>
                      {stat.count}次
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center font-light py-8" style={{ color: '#E0E0D0', opacity: 0.6, letterSpacing: '0.03em' }}>
              暂无记录
            </p>
          )}
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} style={{ color: '#EBC862' }} />
              <h3 className="text-xl font-light" style={{ color: '#EBC862', letterSpacing: '0.05em' }}>
                规律洞察
              </h3>
            </div>

            {insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl glassmorphic-insight"
                style={{
                  backgroundColor: 'rgba(2, 10, 9, 0.6)',
                  border: '0.5px solid rgba(235, 200, 98, 0.3)',
                  backdropFilter: 'blur(15px)',
                }}
              >
                <p className="font-light leading-relaxed text-sm" style={{ color: '#E0E0D0', letterSpacing: '0.03em', opacity: 0.85 }}>
                  {insight.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Recent Entries */}
        {entries.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-light" style={{ color: '#EBC862', letterSpacing: '0.05em' }}>
              最近记录
            </h3>

            {entries.slice(0, 5).map(entry => (
              <div
                key={entry.id}
                className="p-5 rounded-2xl glassmorphic-entry"
                style={{
                  backgroundColor: 'rgba(2, 10, 9, 0.6)',
                  border: '0.5px solid #EBC862',
                  backdropFilter: 'blur(15px)',
                }}
              >
                <div className="flex gap-2 mb-3 flex-wrap">
                  {entry.emotions.map(emotion => (
                    <span
                      key={emotion}
                      className="px-3 py-1 rounded-full text-xs font-light glassmorphic-tag"
                      style={{
                        border: '0.5px solid #EBC862',
                        backgroundColor: 'rgba(235, 200, 98, 0.1)',
                        color: '#EBC862',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
                <p
                  className="text-sm font-light line-clamp-3 leading-relaxed"
                  style={{ color: '#E0E0D0', letterSpacing: '0.02em', opacity: 0.85 }}
                >
                  {entry.journal_content}
                </p>
                <p
                  className="text-xs font-light mt-3"
                  style={{ color: '#E0E0D0', opacity: 0.5, letterSpacing: '0.02em' }}
                >
                  {new Date(entry.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .glassmorphic-insight {
          transition: all 0.3s ease;
        }

        .glassmorphic-insight:hover {
          box-shadow: 0 6px 20px rgba(235, 200, 98, 0.15);
          transform: translateY(-1px);
        }

        .glassmorphic-entry {
          transition: all 0.3s ease;
        }

        .glassmorphic-entry:hover {
          box-shadow: 0 6px 20px rgba(235, 200, 98, 0.2);
          transform: translateY(-1px);
        }

        .glassmorphic-tag {
          transition: all 0.2s ease;
        }

        .glassmorphic-tag:hover {
          background-color: rgba(235, 200, 98, 0.2);
        }
      `}</style>
    </div>
  );
}
