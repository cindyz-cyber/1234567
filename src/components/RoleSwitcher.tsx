interface RoleSwitcherProps {
  currentRole: 'self' | 'parent' | 'child';
  onChange: (role: 'self' | 'parent' | 'child') => void;
}

export default function RoleSwitcher({ currentRole, onChange }: RoleSwitcherProps) {
  const roles = [
    { id: 'self' as const, label: '我' },
    { id: 'parent' as const, label: '父/母' },
    { id: 'child' as const, label: '孩子' }
  ];

  return (
    <div className="flex justify-center mb-16">
      <div
        className="inline-flex rounded-full p-1.5"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(247, 231, 206, 0.1)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onChange(role.id)}
            className="px-8 py-3 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{
              color: currentRole === role.id ? '#0A1F1C' : '#F7E7CE',
              fontWeight: currentRole === role.id ? '500' : '300',
              letterSpacing: '0.1em',
              fontSize: '0.95rem',
              background: currentRole === role.id
                ? 'linear-gradient(135deg, #EBC862 0%, #D4AF37 100%)'
                : 'transparent',
              boxShadow: currentRole === role.id
                ? '0 4px 20px rgba(235, 200, 98, 0.3)'
                : 'none'
            }}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
}
