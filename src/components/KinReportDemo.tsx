import React, { useState } from 'react';
import UniversalKinReport from './UniversalKinReport';
import { Sparkles } from 'lucide-react';

export default function KinReportDemo() {
  const [selectedKin, setSelectedKin] = useState<number | null>(null);
  const [customKin, setCustomKin] = useState('');
  const [familyKins, setFamilyKins] = useState<Array<{ kin: number; name: string }>>([]);

  // 示例数据
  const examples = [
    {
      kin: 200,
      name: 'Kin 200 (超频黄太阳)',
      family: [
        { kin: 243, name: '女儿' },
        { kin: 8, name: '儿子' }
      ]
    },
    {
      kin: 1,
      name: 'Kin 1 (磁性红龙)',
      family: []
    },
    {
      kin: 260,
      name: 'Kin 260 (宇宙黄太阳)',
      family: []
    }
  ];

  const handleSelectExample = (example: typeof examples[0]) => {
    setSelectedKin(example.kin);
    setFamilyKins(example.family);
  };

  const handleCustomKin = () => {
    const kinNumber = parseInt(customKin);
    if (kinNumber >= 1 && kinNumber <= 260) {
      setSelectedKin(kinNumber);
      setFamilyKins([]);
    } else {
      alert('请输入 1-260 之间的 Kin 号码');
    }
  };

  if (selectedKin) {
    return (
      <UniversalKinReport
        kin={selectedKin}
        familyData={familyKins.length > 0 ? familyKins : undefined}
        onClose={() => setSelectedKin(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-light text-amber-300">Kin 能量报告系统</h1>
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-amber-200/60 tracking-widest text-sm">
            UNIVERSAL KIN ENERGY REPORT SYSTEM
          </p>
        </div>

        {/* 示例选择 */}
        <div className="mb-8">
          <h2 className="text-xl text-amber-300 mb-4 font-light">选择示例</h2>
          <div className="space-y-3">
            {examples.map((example) => (
              <button
                key={example.kin}
                onClick={() => handleSelectExample(example)}
                className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20 hover:border-amber-500/40 transition-all text-left"
              >
                <div className="text-amber-100 mb-1">{example.name}</div>
                {example.family.length > 0 && (
                  <div className="text-sm text-amber-200/60">
                    包含家人数据：{example.family.map(f => f.name).join('、')}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 自定义输入 */}
        <div>
          <h2 className="text-xl text-amber-300 mb-4 font-light">或输入 Kin 号码</h2>
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              max="260"
              value={customKin}
              onChange={(e) => setCustomKin(e.target.value)}
              placeholder="输入 1-260"
              className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-amber-500/20 focus:border-amber-500/40 focus:outline-none text-amber-100"
            />
            <button
              onClick={handleCustomKin}
              className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl border border-amber-500/40 transition-all text-amber-300"
            >
              生成报告
            </button>
          </div>
        </div>

        {/* 说明 */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-amber-500/20">
          <h3 className="text-amber-300 mb-3 font-light">系统特性</h3>
          <ul className="space-y-2 text-amber-200/80 text-sm">
            <li>✨ 动态画像生成：根据调性和波符自动匹配模式、视角、本质</li>
            <li>⚡ 非线性评分：根据图腾属性给出极高或极低的初始分，体现不对称美感</li>
            <li>🌟 量子修正：当输入家人数据时，自动分析能量共振并修正评分</li>
            <li>🎯 2026 避坑建议：基于核心卡点，结合白风年能量给出实操建议</li>
            <li>🎨 沉浸式视觉：深色背景 + 雷达图 + 量子涟漪特效</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
