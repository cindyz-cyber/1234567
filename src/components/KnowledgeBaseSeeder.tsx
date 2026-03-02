import { useState } from 'react';
import { seedTotemData, seedToneData, seedKinDefinition } from '../utils/knowledgeBase';
import GoldButton from './GoldButton';

export default function KnowledgeBaseSeeder() {
  const [totemId, setTotemId] = useState(1);
  const [totemNameCn, setTotemNameCn] = useState('');
  const [totemNameEn, setTotemNameEn] = useState('');
  const [pinealGland, setPinealGland] = useState(50);
  const [throatChakra, setThroatChakra] = useState(50);
  const [operationMode, setOperationMode] = useState('');
  const [coreKeyword, setCoreKeyword] = useState('');
  const [description, setDescription] = useState('');
  const [energySignature, setEnergySignature] = useState('');

  const [toneId, setToneId] = useState(1);
  const [toneNameCn, setToneNameCn] = useState('');
  const [toneNameEn, setToneNameEn] = useState('');
  const [toneDescription, setToneDescription] = useState('');
  const [energyPattern, setEnergyPattern] = useState('');
  const [lifeStrategy, setLifeStrategy] = useState('');
  const [challenge, setChallenge] = useState('');
  const [gift, setGift] = useState('');

  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'totem' | 'tone'>('totem');

  const handleSeedTotem = async () => {
    try {
      await seedTotemData({
        id: totemId,
        name_cn: totemNameCn,
        name_en: totemNameEn,
        pineal_gland: pinealGland,
        throat_chakra: throatChakra,
        operation_mode: operationMode,
        core_keyword: coreKeyword,
        description,
        energy_signature: energySignature
      });
      setStatus(`图腾 ${totemNameCn} 已成功添加！`);
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('添加失败，请检查权限');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleSeedTone = async () => {
    try {
      await seedToneData({
        id: toneId,
        name_cn: toneNameCn,
        name_en: toneNameEn,
        description: toneDescription,
        energy_pattern: energyPattern,
        life_strategy: lifeStrategy,
        challenge,
        gift
      });
      setStatus(`调性 ${toneNameCn} 已成功添加！`);
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('添加失败，请检查权限');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-light text-center mb-8" style={{ color: '#EBC862', letterSpacing: '0.3em' }}>
          知识库数据录入
        </h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('totem')}
            className="flex-1 py-3 rounded-lg transition-all"
            style={{
              background: activeTab === 'totem' ? 'rgba(235, 200, 98, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${activeTab === 'totem' ? 'rgba(235, 200, 98, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
              color: activeTab === 'totem' ? '#EBC862' : '#888',
              letterSpacing: '0.2em'
            }}
          >
            图腾录入
          </button>
          <button
            onClick={() => setActiveTab('tone')}
            className="flex-1 py-3 rounded-lg transition-all"
            style={{
              background: activeTab === 'tone' ? 'rgba(235, 200, 98, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${activeTab === 'tone' ? 'rgba(235, 200, 98, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
              color: activeTab === 'tone' ? '#EBC862' : '#888',
              letterSpacing: '0.2em'
            }}
          >
            调性录入
          </button>
        </div>

        {activeTab === 'totem' && (
          <div className="space-y-6 p-8 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(235, 200, 98, 0.2)' }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>图腾编号 (1-20)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={totemId}
                  onChange={(e) => setTotemId(Number(e.target.value))}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>中文名称</label>
                <input
                  type="text"
                  value={totemNameCn}
                  onChange={(e) => setTotemNameCn(e.target.value)}
                  placeholder="例如: 白世界桥"
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>英文名称</label>
                <input
                  type="text"
                  value={totemNameEn}
                  onChange={(e) => setTotemNameEn(e.target.value)}
                  placeholder="例如: World-Bridger"
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>操作模式</label>
                <input
                  type="text"
                  value={operationMode}
                  onChange={(e) => setOperationMode(e.target.value)}
                  placeholder="例如: 跨越者模式"
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>松果体频率 (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={pinealGland}
                  onChange={(e) => setPinealGland(Number(e.target.value))}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>喉轮频率 (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={throatChakra}
                  onChange={(e) => setThroatChakra(Number(e.target.value))}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>核心关键词</label>
                <input
                  type="text"
                  value={coreKeyword}
                  onChange={(e) => setCoreKeyword(e.target.value)}
                  placeholder="例如: 断舍离/连接"
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>详细描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>能量签名</label>
                <textarea
                  value={energySignature}
                  onChange={(e) => setEnergySignature(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            <GoldButton onClick={handleSeedTotem} className="w-full">
              提交图腾数据
            </GoldButton>
          </div>
        )}

        {activeTab === 'tone' && (
          <div className="space-y-6 p-8 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(235, 200, 98, 0.2)' }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>调性编号 (1-13)</label>
                <input
                  type="number"
                  min={1}
                  max={13}
                  value={toneId}
                  onChange={(e) => setToneId(Number(e.target.value))}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>中文名称</label>
                <input
                  type="text"
                  value={toneNameCn}
                  onChange={(e) => setToneNameCn(e.target.value)}
                  placeholder="例如: 磁性"
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>英文名称</label>
                <input
                  type="text"
                  value={toneNameEn}
                  onChange={(e) => setToneNameEn(e.target.value)}
                  placeholder="例如: Magnetic"
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>核心描述</label>
                <textarea
                  value={toneDescription}
                  onChange={(e) => setToneDescription(e.target.value)}
                  placeholder="例如: 向内坍缩，极致克制"
                  rows={2}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>能量模式</label>
                <input
                  type="text"
                  value={energyPattern}
                  onChange={(e) => setEnergyPattern(e.target.value)}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>生命策略</label>
                <textarea
                  value={lifeStrategy}
                  onChange={(e) => setLifeStrategy(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>挑战</label>
                <input
                  type="text"
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: '#EBC862', letterSpacing: '0.15em' }}>天赋</label>
                <input
                  type="text"
                  value={gift}
                  onChange={(e) => setGift(e.target.value)}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <GoldButton onClick={handleSeedTone} className="w-full">
              提交调性数据
            </GoldButton>
          </div>
        )}

        {status && (
          <div className="mt-6 p-4 rounded-lg text-center" style={{
            background: 'rgba(235, 200, 98, 0.1)',
            border: '1px solid rgba(235, 200, 98, 0.3)',
            color: '#EBC862',
            letterSpacing: '0.2em'
          }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
