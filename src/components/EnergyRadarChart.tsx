import type { EnergyProfile, RelationshipSynergy, KinData } from '../utils/mayaCalendar';

interface EnergyRadarChartProps {
  profile: EnergyProfile;
  synergies?: RelationshipSynergy[];
  kinData?: KinData;
}

export default function EnergyRadarChart({ profile, synergies = [], kinData }: EnergyRadarChartProps) {
  const isKin200 = kinData?.kin === 200;

  const chakras = [
    {
      name: '心轮',
      value: profile.heart,
      color: '#10B981',
      mode: isKin200 ? '恒星模式' : profile.heart > 80 ? '恒星模式' : profile.heart > 60 ? '行星模式' : '地球模式',
      description: isKin200
        ? '心轮本质"全开"，具备天生的正义感与慈悲心。受黄战士波符影响，你拥有强大的爱之力量，注意预防"救世主情结"。'
        : '心轮能量温和稳定，在关系中能够保持平衡。'
    },
    {
      name: '喉轮',
      value: profile.throat,
      color: '#3B82F6',
      mode: isKin200 ? '指挥官模式' : profile.throat > 80 ? '指挥官模式' : profile.throat > 60 ? '传播者模式' : '倾听者模式',
      description: isKin200
        ? '言语具有天然威严，旨在"定调"而非单纯沟通。你的声音自带"定调"的重力感，表达具有穿透力，擅长建立规则。'
        : '表达清晰有力，能够有效传递信息。'
    },
    {
      name: '松果体',
      value: profile.pineal,
      color: '#8B5CF6',
      mode: isKin200 ? '战略家模式' : profile.pineal > 80 ? '先知模式' : profile.pineal > 60 ? '战略家模式' : '观察者模式',
      description: isKin200
        ? '受黄战士波符影响，底层代码是"质疑与逻辑"。直觉表现为极强的逻辑洞察力，而非纯粹的灵性感知。你会本能地质疑一切，包括自己的善意是否真的有用。'
        : '直觉稳步提升，多关注梦境与同步性信号。'
    }
  ];

  return (
    <div
      className="p-8 rounded-2xl mb-8"
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(247, 231, 206, 0.15)',
        backdropFilter: 'blur(30px)'
      }}
    >
      {/* 顶部摘要 - 毛玻璃卡片 */}
      {kinData && (
        <div
          className="mb-8 p-6 rounded-xl text-center"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(247, 231, 206, 0.2)'
          }}
        >
          <div
            className="text-3xl font-light tracking-wider mb-4"
            style={{ color: '#F7E7CE' }}
          >
            Kin {kinData.kin}
          </div>

          {/* 横向排版：调性 + 图腾 + 波符 */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div
              className="text-base tracking-widest"
              style={{ color: '#EBC862', opacity: 0.9 }}
            >
              {kinData.toneName}的{kinData.sealName}
            </div>
            <div
              className="w-px h-6"
              style={{ background: 'rgba(247, 231, 206, 0.2)' }}
            />
            <div
              className="text-base tracking-wide"
              style={{ color: '#F7E7CE', opacity: 0.8, letterSpacing: '0.15em' }}
            >
              {kinData.wavespellName}波符
            </div>
          </div>

          {/* Kin 199 特殊注解 */}
          {kinData.kin === 199 && (
            <div
              className="mt-4 text-xs tracking-widest"
              style={{
                color: '#8AB4F8',
                opacity: 0.7,
                letterSpacing: '0.2em'
              }}
            >
              自我存在的蓝风波
            </div>
          )}
        </div>
      )}

      <h3
        className="text-2xl mb-8 text-center font-light"
        style={{
          color: '#F7E7CE',
          letterSpacing: '0.15em'
        }}
      >
        能量画像
      </h3>

      {/* 横向能量卡片布局 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {chakras.map((chakra) => (
          <div
            key={chakra.name}
            className="p-6 rounded-xl transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(247, 231, 206, 0.15)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {chakra.name === '心轮' ? '❤️' : chakra.name === '喉轮' ? '💎' : '👁️'}
                </span>
                <span
                  className="font-light"
                  style={{
                    color: '#F7E7CE',
                    fontSize: '1rem',
                    letterSpacing: '0.1em'
                  }}
                >
                  {chakra.name}
                </span>
              </div>
              <span
                className="text-2xl font-light"
                style={{
                  color: chakra.color,
                  fontWeight: 300
                }}
              >
                {chakra.value}%
              </span>
            </div>

            <div
              className="text-xs mb-3 tracking-wider"
              style={{
                color: '#EBC862',
                opacity: 0.8,
                letterSpacing: '0.1em'
              }}
            >
              {chakra.mode}
            </div>

            <div
              className="w-full h-2 rounded-full overflow-hidden mb-4"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${chakra.value}%`,
                  background: `linear-gradient(90deg, ${chakra.color}40 0%, ${chakra.color} 100%)`,
                  boxShadow: `0 0 20px ${chakra.color}40`
                }}
              />
            </div>

            <p
              className="text-xs leading-relaxed font-light"
              style={{
                color: '#F7E7CE',
                opacity: 0.7,
                lineHeight: '1.7',
                letterSpacing: '0.05em'
              }}
            >
              {chakra.description}
            </p>
          </div>
        ))}
      </div>

      {/* 家族共振 */}
      {synergies.length > 0 && (
        <div className="mt-8 pt-8 border-t border-[rgba(247,231,206,0.1)]">
          <h4
            className="text-lg mb-4 font-light"
            style={{
              color: '#F7E7CE',
              letterSpacing: '0.1em',
              opacity: 0.8
            }}
          >
            量子共振
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {synergies.map((synergy, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(247, 231, 206, 0.1)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-sm font-light tracking-wider"
                    style={{
                      color: '#EBC862',
                      letterSpacing: '0.1em'
                    }}
                  >
                    {synergy.isChallengeRelation ? '挑战关系' : '推动因子'}
                  </span>
                  <span
                    className="text-xs opacity-60"
                    style={{
                      color: '#F7E7CE'
                    }}
                  >
                    强度 {Math.round(synergy.strength * 100)}%
                  </span>
                </div>
                <div
                  className="text-xs font-light leading-relaxed"
                  style={{
                    color: '#F7E7CE',
                    opacity: 0.7,
                    lineHeight: '1.6',
                    letterSpacing: '0.05em'
                  }}
                >
                  {synergy.description || synergy.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
