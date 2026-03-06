import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Unlock, Save, RefreshCw } from 'lucide-react';

const ADMIN_PASSWORD = 'plantlogic2026';
const CONFIG_ID = '00000000-0000-0000-0000-000000000001';

interface H5ShareConfig {
  id: string;
  is_active: boolean;
  daily_token: string;
  bg_video_url: string;
  bg_music_url: string;
  card_bg_image_url: string;
  updated_at: string;
}

export default function ShareConfigAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState<H5ShareConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    is_active: true,
    daily_token: '',
    bg_video_url: '',
    bg_music_url: '',
    card_bg_image_url: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      loadConfig();
    } else {
      setMessage('密码错误');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const loadConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('h5_share_config')
        .select('*')
        .eq('id', CONFIG_ID)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setConfig(data);
        setFormData({
          is_active: data.is_active,
          daily_token: data.daily_token,
          bg_video_url: data.bg_video_url,
          bg_music_url: data.bg_music_url,
          card_bg_image_url: data.card_bg_image_url
        });
      }
    } catch (error) {
      console.error('加载配置失败:', error);
      setMessage('加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('h5_share_config')
        .update({
          is_active: formData.is_active,
          daily_token: formData.daily_token,
          bg_video_url: formData.bg_video_url,
          bg_music_url: formData.bg_music_url,
          card_bg_image_url: formData.card_bg_image_url
        })
        .eq('id', CONFIG_ID);

      if (error) throw error;

      setMessage('保存成功');
      loadConfig();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('保存失败:', error);
      setMessage('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-white/20">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-12 h-12 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            植本逻辑 - H5配置控制台
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                管理员密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="请输入密码"
              />
            </div>
            {message && (
              <div className="text-red-400 text-sm text-center">{message}</div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Unlock className="w-8 h-8 text-amber-400" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                H5引流页配置管理
              </h1>
            </div>
            <button
              onClick={loadConfig}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </button>
          </div>

          {config && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
              <p className="text-blue-200 text-sm">
                最后更新: {new Date(config.updated_at).toLocaleString('zh-CN')}
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-lg font-medium text-white">H5页面总开关</span>
                  <p className="text-sm text-white/60 mt-1">关闭后所有访问将被拦截</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-400/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                今日访问口令 (Token)
              </label>
              <input
                type="text"
                value={formData.daily_token}
                onChange={(e) => setFormData({ ...formData, daily_token: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="例如: zen2026"
              />
              <p className="text-xs text-white/50 mt-2">
                用户需要通过 ?token=xxx 参数访问
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                背景视频URL (阿里云/腾讯云)
              </label>
              <input
                type="text"
                value={formData.bg_video_url}
                onChange={(e) => setFormData({ ...formData, bg_video_url: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="https://your-cdn.com/video.mp4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                背景音乐URL (阿里云/腾讯云)
              </label>
              <input
                type="text"
                value={formData.bg_music_url}
                onChange={(e) => setFormData({ ...formData, bg_music_url: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="https://your-cdn.com/music.mp3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                分享卡片背景图URL
              </label>
              <input
                type="text"
                value={formData.card_bg_image_url}
                onChange={(e) => setFormData({ ...formData, card_bg_image_url: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="/0_0_640_N.webp 或云端图片链接"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes('成功') ? 'bg-green-500/20 border border-green-400/30 text-green-200' : 'bg-red-500/20 border border-red-400/30 text-red-200'}`}>
                {message}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? '保存中...' : '保存配置'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
