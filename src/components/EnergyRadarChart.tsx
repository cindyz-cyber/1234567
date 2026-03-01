import type { EnergyProfile, RelationshipSynergy } from '../utils/mayaCalendar';

interface EnergyRadarChartProps {
  profile: EnergyProfile;
  synergies?: RelationshipSynergy[];
}

export default function EnergyRadarChart({ profile, synergies = [] }: EnergyRadarChartProps) {
  const chakras = [
    { name: '心轮', value: profile.heart, color: '#10B981' },
    { name: '喉轮', value: profile.throat, color: '#3B82F6' },
    { name: '松果体', value: profile.pineal, color: '#8B5CF6' }
  ];

  return (
    <div
      className="p-8 rounded-2xl mb-8"
      style={{
        background: 'linear-gradient(135deg, rgba(247, 231, 206, 0.08) 0%, rgba(247, 231, 206, 0.03) 100%)',
        border: '1px solid rgba(247, 231, 206, 0.15)',
        backdropFilter: 'blur(30px)'
      }}
    >
      <h3
        className="text-2xl mb-8 text-center"
        style={{
          color: '#F7E7CE',
          letterSpacing: '0.15em',
          fontWeight: 300
        }}
      >
        能量画像
      </h3>

      <div className="space-y-6">
        {chakras.map((chakra) => (
          <div key={chakra.name}>
            <div className="flex justify-between items-center mb-2">
              <span
                style={{
                  color: '#F7E7CE',
                  fontSize: '1rem',
                  letterSpacing: '0.1em'
                }}
              >
                {chakra.name}
              </span>
              <span
                style={{
                  color: chakra.color,
                  fontSize: '1.2rem',
                  fontWeight: 500
                }}
              >
                {chakra.value}%
              </span>
            </div>
            <div
              className="w-full h-3 rounded-full overflow-hidden"
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
          </div>
        ))}
      </div>

      {synergies.length > 0 && (
        <div className="mt-8 pt-8 border-t border-[rgba(247,231,206,0.1)]">
          <h4
            className="text-lg mb-4"
            style={{
              color: '#F7E7CE',
              letterSpacing: '0.1em',
              opacity: 0.8
            }}
          >
            家族共振
          </h4>
          <div className="space-y-3">
            {synergies.map((synergy, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(247, 231, 206, 0.08)'
                }}
              >
                <div
                  className="text-sm mb-1"
                  style={{
                    color: '#EBC862',
                    letterSpacing: '0.05em'
                  }}
                >
                  {synergy.relationship === 'mother' ? '与母亲' : '与父亲'}
                </div>
                <div
                  className="text-sm"
                  style={{
                    color: '#F7E7CE',
                    opacity: 0.7,
                    lineHeight: '1.6'
                  }}
                >
                  {synergy.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
