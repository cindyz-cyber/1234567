import { useState, useEffect } from 'react';
import { Upload, Star, Trash2, CheckCircle } from 'lucide-react';
import { uploadSample, promoteToAnchor, listSamples, SampleUpload } from '../utils/sampleUploadService';
import { generateDynamicPrototype } from '../utils/dynamicPrototypeGenerator';
import { ChakraEnergy } from '../utils/voiceAnalysis';
import GoldButton from './GoldButton';

export default function SampleUploadPanel() {
  const [samples, setSamples] = useState<SampleUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    sampleName: '',
    coreFrequency: 343,
    root: 0.5,
    sacral: 0.5,
    solar: 0.5,
    heart: 0.5,
    throat: 0.5,
    thirdEye: 0.5,
    crown: 0.5,
    phase: 'grounded' as 'grounded' | 'floating' | 'dispersed',
    quality: 'smooth' as 'smooth' | 'rough' | 'flat'
  });

  useEffect(() => {
    loadSamples();
  }, []);

  const loadSamples = async () => {
    setLoading(true);
    const data = await listSamples();
    setSamples(data);
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!formData.sampleName.trim()) {
      alert('请输入样本名称');
      return;
    }

    setUploading(true);

    const chakraEnergy: ChakraEnergy = {
      root: formData.root,
      sacral: formData.sacral,
      solar: formData.solar,
      heart: formData.heart,
      throat: formData.throat,
      thirdEye: formData.thirdEye,
      crown: formData.crown
    };

    const generated = generateDynamicPrototype(
      chakraEnergy,
      formData.phase,
      formData.quality,
      formData.coreFrequency
    );

    const result = await uploadSample({
      sampleName: formData.sampleName,
      chakraSignature: chakraEnergy,
      coreFrequency: formData.coreFrequency,
      phasePattern: formData.phase,
      qualityType: formData.quality,
      tagName: generated.tagName,
      description: generated.description,
      color: generated.color,
      advice: generated.advice,
      organs: generated.organs,
      doList: generated.doList,
      dontList: generated.dontList,
      rechargeHz: generated.rechargeHz,
      uploadSource: 'manual_admin'
    });

    setUploading(false);

    if (result.success) {
      alert('样本上传成功！');
      setFormData({
        sampleName: '',
        coreFrequency: 343,
        root: 0.5,
        sacral: 0.5,
        solar: 0.5,
        heart: 0.5,
        throat: 0.5,
        thirdEye: 0.5,
        crown: 0.5,
        phase: 'grounded',
        quality: 'smooth'
      });
      loadSamples();
    } else {
      alert(`上传失败：${result.error}`);
    }
  };

  const handlePromote = async (sampleId: string) => {
    if (!confirm('确认将此样本提升为系统锚点？')) return;

    const result = await promoteToAnchor(sampleId);

    if (result.success) {
      alert('成功提升为锚点！');
      loadSamples();
    } else {
      alert(`提升失败：${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light mb-2" style={{ letterSpacing: '0.3em', color: '#F7E7CE' }}>
            样本上传中心
          </h1>
          <p className="text-sm" style={{ color: 'rgba(247, 231, 206, 0.6)', letterSpacing: '0.2em' }}>
            Upload & Learn · 动态校准系统
          </p>
        </div>

        <div className="bg-stone-800/30 backdrop-blur-sm rounded-2xl p-8 border border-stone-700/30">
          <h2 className="text-xl font-light mb-6" style={{ color: '#FFD966', letterSpacing: '0.25em' }}>
            上传新样本
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2" style={{ color: 'rgba(247, 231, 206, 0.8)', letterSpacing: '0.1em' }}>
                样本名称
              </label>
              <input
                type="text"
                value={formData.sampleName}
                onChange={(e) => setFormData({ ...formData, sampleName: e.target.value })}
                placeholder="例如：Cindy 新测样本"
                className="w-full px-4 py-3 bg-stone-900/50 border border-stone-600/30 rounded-lg text-white"
                style={{ letterSpacing: '0.1em' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: 'rgba(247, 231, 206, 0.8)', letterSpacing: '0.1em' }}>
                核心频率 (Hz)
              </label>
              <input
                type="number"
                value={formData.coreFrequency}
                onChange={(e) => setFormData({ ...formData, coreFrequency: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-stone-900/50 border border-stone-600/30 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['root', 'sacral', 'solar', 'heart', 'throat', 'thirdEye', 'crown'].map((chakra) => (
                <div key={chakra}>
                  <label className="block text-xs mb-1" style={{ color: 'rgba(247, 231, 206, 0.7)' }}>
                    {chakra}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData[chakra as keyof typeof formData] as number}
                    onChange={(e) => setFormData({ ...formData, [chakra]: parseFloat(e.target.value) })}
                    className="w-full px-2 py-2 bg-stone-900/50 border border-stone-600/30 rounded text-white text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: 'rgba(247, 231, 206, 0.8)', letterSpacing: '0.1em' }}>
                  相位模式
                </label>
                <select
                  value={formData.phase}
                  onChange={(e) => setFormData({ ...formData, phase: e.target.value as any })}
                  className="w-full px-4 py-3 bg-stone-900/50 border border-stone-600/30 rounded-lg text-white"
                >
                  <option value="grounded">扎根 (Grounded)</option>
                  <option value="floating">悬浮 (Floating)</option>
                  <option value="dispersed">分散 (Dispersed)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'rgba(247, 231, 206, 0.8)', letterSpacing: '0.1em' }}>
                  纹理质地
                </label>
                <select
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value as any })}
                  className="w-full px-4 py-3 bg-stone-900/50 border border-stone-600/30 rounded-lg text-white"
                >
                  <option value="smooth">流畅 (Smooth)</option>
                  <option value="rough">粗糙 (Rough)</option>
                  <option value="flat">平坦 (Flat)</option>
                </select>
              </div>
            </div>

            <GoldButton onClick={handleUpload} disabled={uploading} className="w-full py-4">
              <Upload size={18} />
              <span style={{ letterSpacing: '0.2em' }}>
                {uploading ? '上传中...' : '上传样本'}
              </span>
            </GoldButton>
          </div>
        </div>

        <div className="bg-stone-800/30 backdrop-blur-sm rounded-2xl p-8 border border-stone-700/30">
          <h2 className="text-xl font-light mb-6" style={{ color: '#FFD966', letterSpacing: '0.25em' }}>
            已上传样本
          </h2>

          {loading ? (
            <p className="text-center" style={{ color: 'rgba(247, 231, 206, 0.6)' }}>加载中...</p>
          ) : samples.length === 0 ? (
            <p className="text-center" style={{ color: 'rgba(247, 231, 206, 0.6)' }}>暂无样本</p>
          ) : (
            <div className="space-y-4">
              {samples.map((sample) => (
                <div
                  key={sample.id}
                  className="bg-stone-900/40 rounded-lg p-6 border border-stone-700/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3
                        className="text-lg font-medium mb-1"
                        style={{ color: sample.color, letterSpacing: '0.15em' }}
                      >
                        {sample.sampleName}
                      </h3>
                      <p className="text-xs" style={{ color: 'rgba(247, 231, 206, 0.7)', letterSpacing: '0.1em' }}>
                        {sample.tagName}
                      </p>
                    </div>
                    {sample.isPromotedToAnchor && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#FFD700' }}>
                        <CheckCircle size={14} />
                        <span>锚点</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs mb-4" style={{ color: 'rgba(247, 231, 206, 0.6)', lineHeight: 1.6 }}>
                    <p>核心频率：{sample.coreFrequency}Hz</p>
                    <p>相位：{sample.phasePattern} · 质地：{sample.qualityType}</p>
                    {sample.organs && <p>脏腑：{sample.organs}</p>}
                  </div>

                  {!sample.isPromotedToAnchor && (
                    <button
                      onClick={() => handlePromote(sample.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/40 rounded-lg text-yellow-200 text-sm transition-colors"
                      style={{ letterSpacing: '0.1em' }}
                    >
                      <Star size={14} />
                      提升为锚点
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
