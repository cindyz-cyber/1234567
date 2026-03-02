import { useState } from 'react';
import { Plus, X, Users, Baby, Heart } from 'lucide-react';
import ImmersiveDatePicker from './ImmersiveDatePicker';
import type { KinData } from '../utils/mayaCalendar';

interface ResonancePerson {
  id: string;
  relationship: 'father' | 'mother' | 'child' | 'partner' | 'other';
  birthDate: Date | null;
  kinData: KinData | null;
  midnightType: 'early' | 'late' | null;
  customLabel?: string;
}

interface QuantumResonanceAdderProps {
  onPersonsChange: (persons: ResonancePerson[]) => void;
  onDateSelect: (
    id: string,
    dateString: string,
    midnightType: 'early' | 'late' | null
  ) => void;
}

export default function QuantumResonanceAdder({
  onPersonsChange,
  onDateSelect
}: QuantumResonanceAdderProps) {
  const [persons, setPersons] = useState<ResonancePerson[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState<'father' | 'mother' | 'child' | 'partner' | 'other'>('father');
  const [customLabel, setCustomLabel] = useState('');

  const relationshipOptions = [
    { value: 'father' as const, label: '父亲', icon: <Users size={18} /> },
    { value: 'mother' as const, label: '母亲', icon: <Users size={18} /> },
    { value: 'child' as const, label: '孩子', icon: <Baby size={18} /> },
    { value: 'partner' as const, label: '伴侣', icon: <Heart size={18} /> },
    { value: 'other' as const, label: '其他', icon: <Users size={18} /> }
  ];

  const handleAddPerson = () => {
    const newPerson: ResonancePerson = {
      id: Date.now().toString(),
      relationship: selectedRelationship,
      birthDate: null,
      kinData: null,
      midnightType: null,
      customLabel: selectedRelationship === 'other' ? customLabel : undefined
    };
    const updatedPersons = [...persons, newPerson];
    setPersons(updatedPersons);
    onPersonsChange(updatedPersons);
    setIsAdding(false);
    setCustomLabel('');
  };

  const handleRemovePerson = (id: string) => {
    const updatedPersons = persons.filter(p => p.id !== id);
    setPersons(updatedPersons);
    onPersonsChange(updatedPersons);
  };

  const getRelationshipLabel = (person: ResonancePerson) => {
    if (person.relationship === 'other' && person.customLabel) {
      return person.customLabel;
    }
    return relationshipOptions.find(r => r.value === person.relationship)?.label || '其他';
  };

  const getRelationshipIcon = (relationship: string) => {
    return relationshipOptions.find(r => r.value === relationship)?.icon || <Users size={18} />;
  };

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(247, 231, 206, 0.08)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div
          className="p-5 cursor-pointer transition-all duration-300"
          onClick={() => setIsAdding(!isAdding)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  width: '32px',
                  height: '32px',
                  background: isAdding ? 'rgba(235, 200, 98, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${isAdding ? 'rgba(235, 200, 98, 0.3)' : 'rgba(247, 231, 206, 0.1)'}`,
                  transform: isAdding ? 'rotate(45deg)' : 'rotate(0deg)'
                }}
              >
                <Plus size={18} style={{ color: '#EBC862' }} />
              </div>
              <span
                style={{
                  color: '#F7E7CE',
                  fontSize: '1rem',
                  letterSpacing: '0.05em',
                  fontWeight: 300,
                  opacity: 0.7
                }}
              >
                添加量子共振因素
              </span>
            </div>
            <span
              style={{
                color: '#EBC862',
                fontSize: '0.85rem',
                opacity: 0.5
              }}
            >
              {persons.length > 0 && `已添加 ${persons.length} 人`}
            </span>
          </div>
        </div>

        <div
          className="overflow-hidden transition-all duration-500"
          style={{
            maxHeight: isAdding ? '400px' : '0',
            opacity: isAdding ? 1 : 0
          }}
        >
          <div
            className="px-5 pb-5"
            style={{
              borderTop: '1px solid rgba(247, 231, 206, 0.08)'
            }}
          >
            <div className="pt-5 space-y-4">
              <div>
                <div
                  className="mb-3"
                  style={{
                    color: '#F7E7CE',
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em',
                    opacity: 0.6
                  }}
                >
                  选择关系
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {relationshipOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => setSelectedRelationship(option.value)}
                      className="cursor-pointer transition-all duration-300 p-3 rounded-lg"
                      style={{
                        background: selectedRelationship === option.value
                          ? 'rgba(235, 200, 98, 0.15)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${selectedRelationship === option.value ? 'rgba(235, 200, 98, 0.3)' : 'rgba(247, 231, 206, 0.08)'}`,
                        textAlign: 'center'
                      }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div style={{ color: '#EBC862', opacity: 0.7 }}>
                          {option.icon}
                        </div>
                        <span
                          style={{
                            color: '#F7E7CE',
                            fontSize: '0.9rem',
                            letterSpacing: '0.05em',
                            fontWeight: 300
                          }}
                        >
                          {option.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRelationship === 'other' && (
                <div>
                  <input
                    type="text"
                    placeholder="自定义关系（如：朋友、导师等）"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    className="w-full p-3 rounded-lg transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(247, 231, 206, 0.1)',
                      color: '#F7E7CE',
                      fontSize: '0.9rem',
                      letterSpacing: '0.05em',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(235, 200, 98, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(247, 231, 206, 0.1)';
                    }}
                  />
                </div>
              )}

              <button
                onClick={handleAddPerson}
                disabled={selectedRelationship === 'other' && !customLabel.trim()}
                className="w-full p-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(235, 200, 98, 0.1)',
                  border: '1px solid rgba(235, 200, 98, 0.2)',
                  color: '#EBC862',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  fontWeight: 300,
                  cursor: selectedRelationship === 'other' && !customLabel.trim() ? 'not-allowed' : 'pointer',
                  opacity: selectedRelationship === 'other' && !customLabel.trim() ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!(selectedRelationship === 'other' && !customLabel.trim())) {
                    e.currentTarget.style.background = 'rgba(235, 200, 98, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(235, 200, 98, 0.1)';
                }}
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      </div>

      {persons.map((person) => (
        <div key={person.id} className="relative">
          <ImmersiveDatePicker
            icon={getRelationshipIcon(person.relationship)}
            label={`${getRelationshipLabel(person)}的出生日期`}
            value={person.birthDate}
            kinData={person.kinData}
            midnightType={person.midnightType}
            onChange={(date, midnight) => onDateSelect(person.id, date, midnight)}
          />
          <button
            onClick={() => handleRemovePerson(person.id)}
            className="absolute top-4 right-4 transition-all duration-300 rounded-full flex items-center justify-center"
            style={{
              width: '28px',
              height: '28px',
              background: 'rgba(255, 100, 100, 0.1)',
              border: '1px solid rgba(255, 100, 100, 0.2)',
              color: '#ff6464',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 100, 100, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 100, 100, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 100, 100, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 100, 100, 0.2)';
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export type { ResonancePerson };
