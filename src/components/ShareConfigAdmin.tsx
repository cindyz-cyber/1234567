import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Unlock, Save, RefreshCw, Plus, Trash2, CreditCard as Edit2, Copy } from 'lucide-react';
import MediaUploader from './MediaUploader';

const ADMIN_PASSWORD = 'plantlogic2026';

interface H5ShareConfig {
  id: string;
  scene_token: string;
  scene_name: string;
  description: string;
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

interface SceneFormData {
  scene_token: string;
  scene_name: string;
  description: string;
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
}

export default function ShareConfigAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [scenes, setScenes] = useState<H5ShareConfig[]>([]);
  const [selectedScene, setSelectedScene] = useState<H5ShareConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const [formData, setFormData] = useState<SceneFormData>({
    scene_token: '',
    scene_name: '',
    description: '',
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
      loadScenes();
    }
  }, [isAuthenticated]);

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), duration);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      showMessage('密码错误', 'error');
    }
  };

  const loadScenes = async (currentSceneToken?: string) => {
    setLoading(true);
    console.log('🔄 加载所有场景配置...');

    try {
      const { data, error } = await supabase
        .from('h5_share_config')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ 加载场景失败:', error);
        throw error;
      }

      console.log('✅ 成功加载场景列表:', data);
      setScenes(data || []);

      // 如果指定了当前场景标识，选中该场景
      if (currentSceneToken && data) {
        const currentScene = data.find(s => s.scene_token === currentSceneToken);
        if (currentScene) {
          console.log('🎯 保持选中场景:', currentScene.scene_name);
          selectScene(currentScene);
          return;
        }
      }

      // 否则默认选中第一个场景
      if (data && data.length > 0 && !selectedScene) {
        selectScene(data[0]);
      }
    } catch (err: any) {
      console.error('❌ 加载失败:', err);
      showMessage('加载配置失败: ' + err.message, 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  const selectScene = (scene: H5ShareConfig) => {
    console.log('📝 选中场景:', scene.scene_name, scene.scene_token);
    setSelectedScene(scene);
    setIsCreating(false);
    setFormData({
      scene_token: scene.scene_token,
      scene_name: scene.scene_name,
      description: scene.description || '',
      is_active: scene.is_active,
      daily_token: scene.daily_token,
      bg_video_url: scene.bg_video_url || '',
      bg_music_url: scene.bg_music_url || '',
      card_bg_image_url: scene.card_bg_image_url || '',
      bg_naming_url: scene.bg_naming_url || '',
      bg_emotion_url: scene.bg_emotion_url || '',
      bg_journal_url: scene.bg_journal_url || '',
      bg_transition_url: scene.bg_transition_url || '',
      bg_answer_book_url: scene.bg_answer_book_url || '',
      card_inner_bg_url: scene.card_inner_bg_url || ''
    });
  };

  const startCreatingScene = () => {
    console.log('➕ 开始创建新场景');
    setIsCreating(true);
    setSelectedScene(null);
    setFormData({
      scene_token: '',
      scene_name: '',
      description: '',
      is_active: true,
      daily_token: 'zen2026',
      bg_video_url: '',
      bg_music_url: '',
      card_bg_image_url: '/0_0_640_N.webp',
      bg_naming_url: '',
      bg_emotion_url: '',
      bg_journal_url: '',
      bg_transition_url: '',
      bg_answer_book_url: '',
      card_inner_bg_url: ''
    });
  };

  const handleSave = async () => {
    if (!formData.scene_token || !formData.scene_name) {
      showMessage('场景标识和场景名称不能为空', 'error');
      return;
    }

    setSaving(true);
    console.log('💾 保存场景配置（UPSERT 模式）...', formData);

    try {
      // 使用 upsert 统一处理新建和更新
      const { data, error } = await supabase
        .from('h5_share_config')
        .upsert(formData, {
          onConflict: 'scene_token',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ 场景保存成功（UPSERT）:', data);
      showMessage('🌿 配置已同步至云端，前台已实时生效', 'success', 5000);

      // 退出创建模式
      setIsCreating(false);

      // 强制刷新场景列表，并保持选中当前场景
      await loadScenes(data.scene_token);

      // 更新当前选中场景和表单数据
      if (data) {
        setSelectedScene(data);
        setFormData({
          scene_token: data.scene_token,
          scene_name: data.scene_name,
          description: data.description || '',
          is_active: data.is_active,
          daily_token: data.daily_token,
          bg_video_url: data.bg_video_url || '',
          bg_music_url: data.bg_music_url || '',
          card_bg_image_url: data.card_bg_image_url || '',
          bg_naming_url: data.bg_naming_url || '',
          bg_emotion_url: data.bg_emotion_url || '',
          bg_journal_url: data.bg_journal_url || '',
          bg_transition_url: data.bg_transition_url || '',
          bg_answer_book_url: data.bg_answer_book_url || '',
          card_inner_bg_url: data.card_inner_bg_url || ''
        });
      }
    } catch (err: any) {
      console.error('❌ 保存失败:', err);
      showMessage('保存失败: ' + err.message, 'error', 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sceneId: string, sceneToken: string) => {
    if (sceneToken === 'default') {
      showMessage('默认场景不能删除', 'error');
      return;
    }

    if (!confirm('确定要删除这个场景配置吗？此操作不可恢复。')) {
      return;
    }

    console.log('🗑️ 删除场景:', sceneId);

    try {
      const { error } = await supabase
        .from('h5_share_config')
        .delete()
        .eq('id', sceneId);

      if (error) throw error;

      console.log('✅ 场景删除成功');
      showMessage('场景已删除', 'success');

      await loadScenes();
      setSelectedScene(null);
      setIsCreating(false);
    } catch (err: any) {
      console.error('❌ 删除失败:', err);
      showMessage('删除失败: ' + err.message, 'error', 5000);
    }
  };

  const copySceneUrl = (sceneToken: string) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/share/journal?scene=${sceneToken}&token=${formData.daily_token}`;
    navigator.clipboard.writeText(url);
    showMessage('链接已复制到剪贴板', 'success');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-12 h-12 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            多场景配置管理后台
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入管理密码"
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all"
            >
              登录
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-red-400">{message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Unlock className="w-8 h-8 text-emerald-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">多场景配置管理</h1>
                <p className="text-sm text-white/60">单页面、多场景动态加载系统</p>
              </div>
            </div>
            <button
              onClick={loadScenes}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">场景列表</h2>
              <button
                onClick={startCreatingScene}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg text-white text-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                新建
              </button>
            </div>

            <div className="space-y-2">
              {scenes.map((scene) => (
                <div
                  key={scene.id}
                  onClick={() => selectScene(scene)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedScene?.id === scene.id && !isCreating
                      ? 'bg-amber-500/30 border border-amber-400/50'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{scene.scene_name}</p>
                      <p className="text-xs text-white/60 font-mono">{scene.scene_token}</p>
                      {scene.description && (
                        <p className="text-xs text-white/50 mt-1 truncate">{scene.description}</p>
                      )}
                    </div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 ${scene.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                  </div>
                </div>
              ))}

              {scenes.length === 0 && !loading && (
                <div className="text-center py-8 text-white/50 text-sm">
                  暂无场景配置
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            {(selectedScene || isCreating) ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {isCreating ? '创建新场景' : '编辑场景配置'}
                  </h2>
                  <div className="flex gap-2">
                    {!isCreating && selectedScene && (
                      <>
                        <button
                          onClick={() => copySceneUrl(selectedScene.scene_token)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 transition-all"
                        >
                          <Copy className="w-4 h-4" />
                          复制链接
                        </button>
                        {selectedScene.scene_token !== 'default' && (
                          <button
                            onClick={() => handleDelete(selectedScene.id, selectedScene.scene_token)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            删除
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        场景标识 (scene_token) *
                      </label>
                      <input
                        type="text"
                        value={formData.scene_token}
                        onChange={(e) => setFormData({ ...formData, scene_token: e.target.value })}
                        disabled={!isCreating}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 font-mono"
                        placeholder="A, B, zen, healing..."
                      />
                      <p className="text-xs text-white/50 mt-1">用于 URL 参数: ?scene=xxx（创建后不可修改）</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        场景名称 *
                      </label>
                      <input
                        type="text"
                        value={formData.scene_name}
                        onChange={(e) => setFormData({ ...formData, scene_name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        placeholder="禅意疗愈、能量唤醒..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      场景描述
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                      placeholder="这个场景的用途和特点..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          className="w-5 h-5 rounded border-white/30 bg-white/10 text-amber-500 focus:ring-2 focus:ring-amber-400"
                        />
                        <span className="text-sm font-medium text-white/80">启用此场景</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        访问令牌 (daily_token)
                      </label>
                      <input
                        type="text"
                        value={formData.daily_token}
                        onChange={(e) => setFormData({ ...formData, daily_token: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                        placeholder="zen2026"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">场景资源配置</h3>

                    <div className="space-y-6">
                      <MediaUploader
                        label="背景媒体（支持 MP3 音频 / MP4 视频）"
                        currentValue={formData.bg_music_url}
                        onUploadComplete={(url) => setFormData({ ...formData, bg_music_url: url })}
                        accept=".mp3,.mp4,.webm"
                        maxSizeMB={100}
                        folder="background-music"
                      />

                      <MediaUploader
                        label="背景视频（支持 MP4）"
                        currentValue={formData.bg_video_url}
                        onUploadComplete={(url) => setFormData({ ...formData, bg_video_url: url })}
                        accept=".mp4,.webm"
                        maxSizeMB={100}
                        folder="background-music"
                      />

                      <MediaUploader
                        label="卡片背景图（支持 JPG/PNG/WEBP）"
                        currentValue={formData.card_bg_image_url}
                        onUploadComplete={(url) => setFormData({ ...formData, card_bg_image_url: url })}
                        accept=".jpg,.jpeg,.png,.webp"
                        maxSizeMB={10}
                        folder="background-music"
                      />

                      <MediaUploader
                        label="卡片内部背景（支持 JPG/PNG/WEBP）"
                        currentValue={formData.card_inner_bg_url}
                        onUploadComplete={(url) => setFormData({ ...formData, card_inner_bg_url: url })}
                        accept=".jpg,.jpeg,.png,.webp"
                        maxSizeMB={10}
                        folder="background-music"
                      />

                      <details className="bg-white/5 rounded-lg p-4">
                        <summary className="cursor-pointer font-semibold text-white/80 mb-2">
                          高级配置：各步骤专属背景（可选）
                        </summary>
                        <div className="space-y-6 mt-4">
                          <MediaUploader
                            label="起名页背景（支持 JPG/MP4）"
                            currentValue={formData.bg_naming_url}
                            onUploadComplete={(url) => setFormData({ ...formData, bg_naming_url: url })}
                            accept=".jpg,.jpeg,.png,.mp4,.webm"
                            maxSizeMB={100}
                            folder="background-music"
                          />
                          <MediaUploader
                            label="情绪选择页背景（支持 JPG/MP4）"
                            currentValue={formData.bg_emotion_url}
                            onUploadComplete={(url) => setFormData({ ...formData, bg_emotion_url: url })}
                            accept=".jpg,.jpeg,.png,.mp4,.webm"
                            maxSizeMB={100}
                            folder="background-music"
                          />
                          <MediaUploader
                            label="日记页背景（支持 JPG/MP4）"
                            currentValue={formData.bg_journal_url}
                            onUploadComplete={(url) => setFormData({ ...formData, bg_journal_url: url })}
                            accept=".jpg,.jpeg,.png,.mp4,.webm"
                            maxSizeMB={100}
                            folder="background-music"
                          />
                          <MediaUploader
                            label="过渡页背景（支持 JPG/MP4）"
                            currentValue={formData.bg_transition_url}
                            onUploadComplete={(url) => setFormData({ ...formData, bg_transition_url: url })}
                            accept=".jpg,.jpeg,.png,.mp4,.webm"
                            maxSizeMB={100}
                            folder="background-music"
                          />
                          <MediaUploader
                            label="答案之书背景（支持 JPG/MP4）"
                            currentValue={formData.bg_answer_book_url}
                            onUploadComplete={(url) => setFormData({ ...formData, bg_answer_book_url: url })}
                            accept=".jpg,.jpeg,.png,.mp4,.webm"
                            maxSizeMB={100}
                            folder="background-music"
                          />
                        </div>
                      </details>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-white/20">
                    <button
                      onClick={handleSave}
                      disabled={saving || !formData.scene_token || !formData.scene_name}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? '保存中...' : (isCreating ? '创建场景' : '保存配置')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-white/50">
                <Edit2 className="w-16 h-16 mb-4" />
                <p className="text-lg">请从左侧选择一个场景进行编辑</p>
                <p className="text-sm mt-2">或点击"新建"按钮创建新场景</p>
              </div>
            )}
          </div>
        </div>

        {message && (
          <div
            className={`fixed bottom-6 right-6 backdrop-blur-md border rounded-lg px-6 py-3 shadow-lg transition-all ${
              messageType === 'success'
                ? 'bg-green-500/20 border-green-400/50 text-green-100'
                : messageType === 'error'
                ? 'bg-red-500/20 border-red-400/50 text-red-100'
                : 'bg-white/10 border-white/20 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {messageType === 'success' && <span className="text-2xl">✅</span>}
              {messageType === 'error' && <span className="text-2xl">❌</span>}
              <span>{message}</span>
            </div>
          </div>
        )}

        {selectedScene && !isCreating && (
          <div className="mt-6 bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-300 mb-2">访问链接预览：</p>
            <p className="text-xs text-blue-200 font-mono break-all">
              {window.location.origin}/share/journal?scene={selectedScene.scene_token}&token={formData.daily_token}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
