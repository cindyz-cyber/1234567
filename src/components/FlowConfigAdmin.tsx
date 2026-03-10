import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Plus, Trash2, Copy, ExternalLink } from 'lucide-react';

interface FlowConfig {
  id: string;
  scene_path: string;
  scene_name: string;
  access_token: string;
  description: string;
  is_active: boolean;
  bg_home_url: string | null;
  bg_step1_url: string | null;
  bg_step2_url: string | null;
  bg_step3_url: string | null;
  bg_step4_url: string | null;
  audio_step1_url: string | null;
  audio_step2_url: string | null;
  audio_step3_url: string | null;
  audio_step4_url: string | null;
}

export default function FlowConfigAdmin() {
  const [configs, setConfigs] = useState<FlowConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<FlowConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    scene_path: '',
    scene_name: '',
    access_token: '',
    description: '',
    is_active: true,
    bg_home_url: '',
    bg_step1_url: '',
    bg_step2_url: '',
    bg_step3_url: '',
    bg_step4_url: '',
    audio_step1_url: '',
    audio_step2_url: '',
    audio_step3_url: '',
    audio_step4_url: '',
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  async function loadConfigs() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('flow_config')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('加载配置失败:', error);
      alert('加载失败');
    } finally {
      setLoading(false);
    }
  }

  function handleSelectConfig(config: FlowConfig) {
    setSelectedConfig(config);
    setIsCreating(false);
    setFormData({
      scene_path: config.scene_path,
      scene_name: config.scene_name,
      access_token: config.access_token,
      description: config.description,
      is_active: config.is_active,
      bg_home_url: config.bg_home_url || '',
      bg_step1_url: config.bg_step1_url || '',
      bg_step2_url: config.bg_step2_url || '',
      bg_step3_url: config.bg_step3_url || '',
      bg_step4_url: config.bg_step4_url || '',
      audio_step1_url: config.audio_step1_url || '',
      audio_step2_url: config.audio_step2_url || '',
      audio_step3_url: config.audio_step3_url || '',
      audio_step4_url: config.audio_step4_url || '',
    });
  }

  function handleCreateNew() {
    setIsCreating(true);
    setSelectedConfig(null);
    setFormData({
      scene_path: '',
      scene_name: '',
      access_token: '',
      description: '',
      is_active: true,
      bg_home_url: '',
      bg_step1_url: '',
      bg_step2_url: '',
      bg_step3_url: '',
      bg_step4_url: '',
      audio_step1_url: '',
      audio_step2_url: '',
      audio_step3_url: '',
      audio_step4_url: '',
    });
  }

  async function handleSave() {
    if (!formData.scene_path || !formData.scene_name || !formData.access_token) {
      alert('请填写必填字段');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const { error } = await supabase.from('flow_config').insert([{
          scene_path: formData.scene_path,
          scene_name: formData.scene_name,
          access_token: formData.access_token,
          description: formData.description,
          is_active: formData.is_active,
          bg_home_url: formData.bg_home_url || null,
          bg_step1_url: formData.bg_step1_url || null,
          bg_step2_url: formData.bg_step2_url || null,
          bg_step3_url: formData.bg_step3_url || null,
          bg_step4_url: formData.bg_step4_url || null,
          audio_step1_url: formData.audio_step1_url || null,
          audio_step2_url: formData.audio_step2_url || null,
          audio_step3_url: formData.audio_step3_url || null,
          audio_step4_url: formData.audio_step4_url || null,
        }]);

        if (error) throw error;
        alert('创建成功');
      } else if (selectedConfig) {
        const { error } = await supabase
          .from('flow_config')
          .update({
            scene_path: formData.scene_path,
            scene_name: formData.scene_name,
            access_token: formData.access_token,
            description: formData.description,
            is_active: formData.is_active,
            bg_home_url: formData.bg_home_url || null,
            bg_step1_url: formData.bg_step1_url || null,
            bg_step2_url: formData.bg_step2_url || null,
            bg_step3_url: formData.bg_step3_url || null,
            bg_step4_url: formData.bg_step4_url || null,
            audio_step1_url: formData.audio_step1_url || null,
            audio_step2_url: formData.audio_step2_url || null,
            audio_step3_url: formData.audio_step3_url || null,
            audio_step4_url: formData.audio_step4_url || null,
          })
          .eq('id', selectedConfig.id);

        if (error) throw error;
        alert('保存成功');
      }

      await loadConfigs();
      setIsCreating(false);
      setSelectedConfig(null);
    } catch (error: any) {
      console.error('保存失败:', error);
      alert(`保存失败: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要删除这个配置吗？')) return;

    try {
      const { error } = await supabase
        .from('flow_config')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('删除成功');
      await loadConfigs();
      setSelectedConfig(null);
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  }

  function copyToClipboard(config: FlowConfig) {
    const url = `${window.location.origin}/flow/${config.scene_path}?token=${config.access_token}`;
    navigator.clipboard.writeText(url);
    alert('链接已复制到剪贴板');
  }

  function openInNewTab(config: FlowConfig) {
    const url = `${window.location.origin}/flow/${config.scene_path}?token=${config.access_token}`;
    window.open(url, '_blank');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Flow 路由管理</h1>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            新建场景
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">配置列表</h2>
              <div className="space-y-2">
                {configs.map(config => (
                  <div
                    key={config.id}
                    onClick={() => handleSelectConfig(config)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConfig?.id === config.id
                        ? 'bg-blue-600'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    <div className="font-medium">{config.scene_name}</div>
                    <div className="text-sm text-slate-400">/flow/{config.scene_path}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${config.is_active ? 'bg-green-600' : 'bg-red-600'}`}>
                        {config.is_active ? '激活' : '禁用'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(config);
                        }}
                        className="text-slate-400 hover:text-white"
                        title="复制链接"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openInNewTab(config);
                        }}
                        className="text-slate-400 hover:text-white"
                        title="新窗口打开"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {(selectedConfig || isCreating) && (
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {isCreating ? '创建新场景' : '编辑场景'}
                  </h2>
                  <div className="flex gap-2">
                    {selectedConfig && (
                      <button
                        onClick={() => handleDelete(selectedConfig.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                        删除
                      </button>
                    )}
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Save size={16} />
                      {saving ? '保存中...' : '保存'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">场景路径 (URL)</label>
                    <input
                      type="text"
                      value={formData.scene_path}
                      onChange={(e) => setFormData({...formData, scene_path: e.target.value})}
                      placeholder="例: inner-peace"
                      className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <div className="text-xs text-slate-400 mt-1">
                      完整链接: /flow/{formData.scene_path || '...'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">场景名称</label>
                    <input
                      type="text"
                      value={formData.scene_name}
                      onChange={(e) => setFormData({...formData, scene_name: e.target.value})}
                      placeholder="例: 内在宁静"
                      className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">访问令牌 (Token)</label>
                    <input
                      type="text"
                      value={formData.access_token}
                      onChange={(e) => setFormData({...formData, access_token: e.target.value})}
                      placeholder="例: peace2026"
                      className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">场景描述</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="简短描述这个场景..."
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">激活此场景</label>
                  </div>

                  <div className="border-t border-slate-700 pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-4">背景视频 (仅支持 MP4)</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.bg_home_url}
                        onChange={(e) => setFormData({...formData, bg_home_url: e.target.value})}
                        placeholder="首页背景视频 URL"
                        className="w-full px-4 py-2 bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        value={formData.bg_step1_url}
                        onChange={(e) => setFormData({...formData, bg_step1_url: e.target.value})}
                        placeholder="步骤1 背景视频 URL"
                        className="w-full px-4 py-2 bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        value={formData.bg_step2_url}
                        onChange={(e) => setFormData({...formData, bg_step2_url: e.target.value})}
                        placeholder="步骤2 背景视频 URL"
                        className="w-full px-4 py-2 bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        value={formData.bg_step3_url}
                        onChange={(e) => setFormData({...formData, bg_step3_url: e.target.value})}
                        placeholder="步骤3 背景视频 URL"
                        className="w-full px-4 py-2 bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        value={formData.bg_step4_url}
                        onChange={(e) => setFormData({...formData, bg_step4_url: e.target.value})}
                        placeholder="步骤4 背景视频 URL"
                        className="w-full px-4 py-2 bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <h3 className="text-lg font-semibold mb-4">音频配置</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.audio_step1_url}
                        onChange={(e) => setFormData({...formData, audio_step1_url: e.target.value})}
                        placeholder="步骤1 音频 URL"
                        className="w-full px-4 py-2 bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        value={formData.audio_step2_url}
                        onChange={(e) => setFormData({...formData, audio_step2_url: e.target.value})}
                        placeholder="步骤2 音频 URL"
                        className="w-full px-4 py-2 bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        value={formData.audio_step3_url}
                        onChange={(e) => setFormData({...formData, audio_step3_url: e.target.value})}
                        placeholder="步骤3 音频 URL"
                        className="w-full px-4 py-2 bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        value={formData.audio_step4_url}
                        onChange={(e) => setFormData({...formData, audio_step4_url: e.target.value})}
                        placeholder="步骤4 音频 URL"
                        className="w-full px-4 py-2 bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
