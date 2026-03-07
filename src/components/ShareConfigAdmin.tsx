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
  bg_naming_url: string;
  bg_emotion_url: string;
  bg_journal_url: string;
  bg_transition_url: string;
  bg_answer_book_url: string;
  card_inner_bg_url: string;
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
    card_bg_image_url: '',
    bg_naming_url: '',
    bg_emotion_url: '',
    bg_journal_url: '',
    bg_transition_url: '',
    bg_answer_book_url: '',
    card_inner_bg_url: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadConfig();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
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
          card_bg_image_url: data.card_bg_image_url,
          bg_naming_url: data.bg_naming_url || '',
          bg_emotion_url: data.bg_emotion_url || '',
          bg_journal_url: data.bg_journal_url || '',
          bg_transition_url: data.bg_transition_url || '',
          bg_answer_book_url: data.bg_answer_book_url || '',
          card_inner_bg_url: data.card_inner_bg_url || ''
        });
      }
    } catch (error) {
      console.error('加载配置失败:', error);
      setMessage('加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  const validateImageFormat = (url: string, fieldName: string, isRequired: boolean = false): string | null => {
    if (!url || url.trim() === '') return null;

    const lowerUrl = url.toLowerCase();

    // 允许视频格式（.mp4）
    if (lowerUrl.includes('.mp4')) return null;

    // 图片必须是 WebP 格式
    const hasWebpExtension = lowerUrl.endsWith('.webp');
    const hasWebpParam = lowerUrl.includes('.webp?') || lowerUrl.includes('.webp&');

    if (!hasWebpExtension && !hasWebpParam) {
      if (isRequired) {
        return `${fieldName} 必须使用 WebP 格式图片（.webp 后缀）`;
      }
      // 非必需字段只警告，不阻止保存
      return null;
    }

    return null;
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // 核心字段必须验证 WebP 格式
      const criticalImageFields = [
        { url: formData.card_inner_bg_url, name: '能量卡片分享背景图（Card Poster BG）', isRequired: true }
      ];

      // 可选字段允许视频或图片
      const optionalFields = [
        { url: formData.card_bg_image_url, name: '卡片背景图', isRequired: false },
        { url: formData.bg_naming_url, name: '起名页背景', isRequired: false },
        { url: formData.bg_emotion_url, name: '情绪扫描页背景', isRequired: false },
        { url: formData.bg_journal_url, name: '日记页背景', isRequired: false },
        { url: formData.bg_transition_url, name: '过渡页背景', isRequired: false },
        { url: formData.bg_answer_book_url, name: '答案之书页背景', isRequired: false }
      ];

      // 验证核心字段
      for (const field of criticalImageFields) {
        const error = validateImageFormat(field.url, field.name, field.isRequired);
        if (error) {
          setMessage(`❌ ${error}`);
          setTimeout(() => setMessage(''), 5000);
          setSaving(false);
          return;
        }
      }

      // 验证可选字段（不阻止保存，只警告）
      for (const field of optionalFields) {
        validateImageFormat(field.url, field.name, field.isRequired);
      }

      const { error } = await supabase
        .from('h5_share_config')
        .update({
          is_active: formData.is_active,
          daily_token: formData.daily_token,
          bg_video_url: formData.bg_video_url,
          bg_music_url: formData.bg_music_url,
          card_bg_image_url: formData.card_bg_image_url,
          bg_naming_url: formData.bg_naming_url,
          bg_emotion_url: formData.bg_emotion_url,
          bg_journal_url: formData.bg_journal_url,
          bg_transition_url: formData.bg_transition_url,
          bg_answer_book_url: formData.bg_answer_book_url,
          card_inner_bg_url: formData.card_inner_bg_url
        })
        .eq('id', CONFIG_ID);

      if (error) throw error;

      setMessage('🌿 配置已同步至云端，前台已实时生效');
      await loadConfig();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('保存失败:', error);
      setMessage('❌ 保存失败，请稍后重试');
      setTimeout(() => setMessage(''), 5000);
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

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
              <h2 className="text-lg font-semibold text-amber-400 mb-4">媒体资源配置</h2>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  通用背景视频URL
                </label>
                <input
                  type="text"
                  value={formData.bg_video_url}
                  onChange={(e) => setFormData({ ...formData, bg_video_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="https://your-cdn.com/video.mp4"
                />
                {formData.bg_video_url && (
                  <p className="text-xs text-emerald-400 mt-2">✓ 当前值: {formData.bg_video_url}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  背景音乐URL
                </label>
                <input
                  type="text"
                  value={formData.bg_music_url}
                  onChange={(e) => setFormData({ ...formData, bg_music_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="https://your-cdn.com/music.mp3"
                />
                {formData.bg_music_url && (
                  <p className="text-xs text-emerald-400 mt-2">✓ 当前值: {formData.bg_music_url}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  分享卡片背景图URL（已废弃，请使用下方"能量卡片分享背景图"字段）
                </label>
                <input
                  type="text"
                  value={formData.card_bg_image_url}
                  onChange={(e) => setFormData({ ...formData, card_bg_image_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white/50 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="/0_0_640_N.webp 或云端图片链接"
                  disabled
                />
                <p className="text-xs text-white/40 mt-1">此字段已废弃，请使用下方"卡片视觉配置"区域的新字段</p>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-amber-400/30 space-y-4">
              <h2 className="text-lg font-semibold text-amber-400 mb-4">流程背景配置</h2>
              <p className="text-xs text-white/60 mb-4">为每个页面设置独立的背景（视频或图片）</p>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  起名页面背景（视频 .mp4 或图片 .webp）
                </label>
                <input
                  type="text"
                  value={formData.bg_naming_url}
                  onChange={(e) => setFormData({ ...formData, bg_naming_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="https://cdn.com/naming-bg.webp"
                />
                {formData.bg_naming_url && (
                  <p className="text-xs text-emerald-400 mt-2 break-all">✓ 当前值: {formData.bg_naming_url}</p>
                )}
                {formData.bg_naming_url && !formData.bg_naming_url.toLowerCase().includes('.webp') && !formData.bg_naming_url.toLowerCase().includes('.mp4') && (
                  <p className="text-xs text-yellow-400 mt-2">⚠️ 建议使用 .webp 格式图片或 .mp4 视频</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  情绪选择页面背景（视频 .mp4 或图片 .webp）
                </label>
                <input
                  type="text"
                  value={formData.bg_emotion_url}
                  onChange={(e) => setFormData({ ...formData, bg_emotion_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="https://cdn.com/emotion-bg.webp"
                />
                {formData.bg_emotion_url && (
                  <p className="text-xs text-emerald-400 mt-2 break-all">✓ 当前值: {formData.bg_emotion_url}</p>
                )}
                {formData.bg_emotion_url && !formData.bg_emotion_url.toLowerCase().includes('.webp') && !formData.bg_emotion_url.toLowerCase().includes('.mp4') && (
                  <p className="text-xs text-yellow-400 mt-2">⚠️ 建议使用 .webp 格式图片或 .mp4 视频</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  觉察日记书写页背景（视频 .mp4 或图片 .webp）
                </label>
                <input
                  type="text"
                  value={formData.bg_journal_url}
                  onChange={(e) => setFormData({ ...formData, bg_journal_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="https://cdn.com/journal-bg.webp"
                />
                {formData.bg_journal_url && (
                  <p className="text-xs text-emerald-400 mt-2 break-all">✓ 当前值: {formData.bg_journal_url}</p>
                )}
                {formData.bg_journal_url && !formData.bg_journal_url.toLowerCase().includes('.webp') && !formData.bg_journal_url.toLowerCase().includes('.mp4') && (
                  <p className="text-xs text-yellow-400 mt-2">⚠️ 建议使用 .webp 格式图片或 .mp4 视频</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  黄金过渡页背景（视频 .mp4 或图片 .webp）
                </label>
                <input
                  type="text"
                  value={formData.bg_transition_url}
                  onChange={(e) => setFormData({ ...formData, bg_transition_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="https://cdn.com/transition-bg.webp"
                />
                {formData.bg_transition_url && (
                  <p className="text-xs text-emerald-400 mt-2 break-all">✓ 当前值: {formData.bg_transition_url}</p>
                )}
                {formData.bg_transition_url && !formData.bg_transition_url.toLowerCase().includes('.webp') && !formData.bg_transition_url.toLowerCase().includes('.mp4') && (
                  <p className="text-xs text-yellow-400 mt-2">⚠️ 建议使用 .webp 格式图片或 .mp4 视频</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  答案之书结果页全屏背景（视频 .mp4 或图片 .webp）
                </label>
                <input
                  type="text"
                  value={formData.bg_answer_book_url}
                  onChange={(e) => setFormData({ ...formData, bg_answer_book_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="https://cdn.com/answer-bg.webp"
                />
                {formData.bg_answer_book_url && (
                  <p className="text-xs text-emerald-400 mt-2 break-all">✓ 当前值: {formData.bg_answer_book_url}</p>
                )}
                {formData.bg_answer_book_url && !formData.bg_answer_book_url.toLowerCase().includes('.webp') && !formData.bg_answer_book_url.toLowerCase().includes('.mp4') && (
                  <p className="text-xs text-yellow-400 mt-2">⚠️ 建议使用 .webp 格式图片或 .mp4 视频</p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6 rounded-xl border-2 border-amber-400/60 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-amber-300">能量卡片分享背景图（Card Poster BG）</h2>
                  <p className="text-xs text-amber-200/80 mt-1">此字段控制 html2canvas 生成海报时的底层背景图</p>
                </div>
                <div className="bg-amber-400/20 rounded-full px-3 py-1 border border-amber-400/40">
                  <span className="text-amber-200 text-xs font-medium">核心配置</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">
                  能量卡片分享背景图（Card Poster BG）⚡ 必须使用 .webp 格式
                </label>
                <input
                  type="text"
                  value={formData.card_inner_bg_url}
                  onChange={(e) => setFormData({ ...formData, card_inner_bg_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-amber-400/30 rounded-lg text-white placeholder-amber-200/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="https://cdn.com/card-inner-bg.webp"
                />
                <div className="mt-3 space-y-2">
                  {formData.card_inner_bg_url ? (
                    <>
                      {formData.card_inner_bg_url.toLowerCase().includes('.webp') ? (
                        <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-lg">
                          <p className="text-xs text-emerald-300 font-medium mb-1">✓ 当前配置（此链接将直接替换 0_0_640_N.webp）:</p>
                          <p className="text-xs text-emerald-200 break-all">{formData.card_inner_bg_url}</p>
                        </div>
                      ) : (
                        <div className="p-3 bg-red-500/30 border border-red-400/50 rounded-lg">
                          <p className="text-xs text-red-300 font-bold mb-1">❌ 格式错误！必须使用 .webp 格式图片</p>
                          <p className="text-xs text-red-200 break-all">当前链接: {formData.card_inner_bg_url}</p>
                          <p className="text-xs text-red-200 mt-2">请确保链接以 .webp 结尾（例如：https://cdn.com/image.webp）</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-3 bg-orange-500/20 border border-orange-400/30 rounded-lg">
                      <p className="text-xs text-orange-200">⚠️ 未配置，将使用默认图片 /0_0_640_N.webp</p>
                    </div>
                  )}
                  <div className="p-3 bg-purple-500/10 border border-purple-400/20 rounded-lg">
                    <p className="text-xs text-purple-200">
                      <strong>格式要求：</strong>必须使用 WebP 格式图片（.webp 后缀），推荐尺寸 750×1334px
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                    <p className="text-xs text-blue-200">
                      <strong>技术说明：</strong>此字段对应数据库 h5_share_config.card_inner_bg_url，
                      用于 ShareJournal 组件生成能量卡时的 html2canvas 截图背景
                    </p>
                  </div>
                </div>
              </div>
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
