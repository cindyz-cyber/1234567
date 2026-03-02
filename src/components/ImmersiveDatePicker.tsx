import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { KinData } from '../utils/mayaCalendar';

interface ImmersiveDatePickerProps {
  icon?: React.ReactNode;
  label: string;
  value: Date | null;
  kinData: KinData | null;
  midnightType?: 'early' | 'late' | null;
  onChange: (date: string, midnightType: 'early' | 'late' | null) => void;
}

export default function ImmersiveDatePicker({
  icon,
  label,
  value,
  kinData,
  midnightType = null,
  onChange
}: ImmersiveDatePickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedYear, setSelectedYear] = useState(value?.getFullYear() || new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(value?.getMonth() || 0);
  const [selectedDay, setSelectedDay] = useState(value?.getDate() || 1);
  const [selectedMidnightType, setSelectedMidnightType] = useState<'early' | 'late' | null>(midnightType);

  const years = Array.from({ length: new Date().getFullYear() - 1980 + 1 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  const handleConfirm = () => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    onChange(dateStr, selectedMidnightType);
    setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  };

  const scrollToCenter = (ref: React.RefObject<HTMLDivElement>, index: number) => {
    if (ref.current) {
      const itemHeight = 40;
      const containerHeight = ref.current.clientHeight;
      const centerOffset = (containerHeight - itemHeight) / 2;
      ref.current.scrollTop = index * itemHeight - centerOffset;
    }
  };

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        scrollToCenter(yearRef, years.indexOf(selectedYear));
        scrollToCenter(monthRef, selectedMonth);
        scrollToCenter(dayRef, selectedDay - 1);
      }, 100);
    }
  }, [isExpanded]);

  return (
    <div
      className="rounded-2xl transition-all duration-500"
      style={{
        background: value
          ? 'linear-gradient(135deg, rgba(247, 231, 206, 0.08) 0%, rgba(247, 231, 206, 0.03) 100%)'
          : 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${value ? 'rgba(247, 231, 206, 0.2)' : 'rgba(247, 231, 206, 0.08)'}`,
        backdropFilter: 'blur(20px)'
      }}
    >
      <div
        className="p-6 cursor-pointer transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div style={{ color: '#EBC862', opacity: 0.6 }}>
                {icon}
              </div>
            )}
            <h3
              className="text-lg"
              style={{
                color: '#F7E7CE',
                letterSpacing: '0.1em',
                fontWeight: 300,
                opacity: 0.7
              }}
            >
              {label}
            </h3>
          </div>
          <div
            className="transition-transform duration-300"
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              color: '#F7E7CE',
              opacity: 0.4
            }}
          >
            <ChevronDown size={20} />
          </div>
        </div>

        {!value ? (
          <div
            className="text-center py-3"
            style={{ color: '#F7E7CE', opacity: 0.3, fontSize: '0.9rem', letterSpacing: '0.05em' }}
          >
            轻触展开选择时刻
          </div>
        ) : (
          <div className="text-center">
            <div
              className="text-2xl mb-2"
              style={{
                color: '#EBC862',
                letterSpacing: '0.05em',
                fontWeight: 300
              }}
            >
              {value.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {kinData && (
              <div
                className="text-sm"
                style={{
                  color: '#F7E7CE',
                  opacity: 0.6,
                  letterSpacing: '0.05em'
                }}
              >
                Kin {kinData.kin} · {kinData.toneName}的{kinData.sealName}
                {kinData.midnightType && (
                  <span style={{ color: '#8AB4F8', marginLeft: '8px' }}>
                    ⦿ {kinData.midnightType === 'early' ? '前子时' : '后子时'}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="overflow-hidden transition-all duration-500"
        style={{
          maxHeight: isExpanded ? '600px' : '0',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div
          className="px-6 pb-6"
          style={{
            borderTop: '1px solid rgba(247, 231, 206, 0.08)'
          }}
        >
          <div className="pt-6">
            <div className="flex gap-2 mb-6" style={{ height: '200px' }}>
              <ScrollWheelWithRef
                ref={yearRef}
                items={years}
                selectedValue={selectedYear}
                onChange={setSelectedYear}
                formatter={(y) => `${y}`}
                label="年"
              />
              <ScrollWheelWithRef
                ref={monthRef}
                items={months}
                selectedValue={selectedMonth}
                onChange={setSelectedMonth}
                formatter={(m) => monthNames[m]}
                label="月"
              />
              <ScrollWheelWithRef
                ref={dayRef}
                items={days}
                selectedValue={selectedDay}
                onChange={setSelectedDay}
                formatter={(d) => `${d}日`}
                label="日"
              />
            </div>

            <div
              className="mb-6"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(247, 231, 206, 0.08)',
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              <div
                style={{
                  color: '#F7E7CE',
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  fontWeight: 300,
                  opacity: 0.6,
                  marginBottom: '12px'
                }}
              >
                子时出生（可选）
              </div>

              <div className="space-y-2">
                <div
                  className="cursor-pointer transition-all duration-300 p-3 rounded-lg"
                  style={{
                    background: selectedMidnightType === 'early'
                      ? 'rgba(235, 200, 98, 0.15)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${selectedMidnightType === 'early' ? 'rgba(235, 200, 98, 0.3)' : 'rgba(247, 231, 206, 0.08)'}`
                  }}
                  onClick={() => setSelectedMidnightType(selectedMidnightType === 'early' ? null : 'early')}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="transition-all duration-300"
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        background: selectedMidnightType === 'early'
                          ? 'rgba(235, 200, 98, 0.2)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${selectedMidnightType === 'early' ? '#EBC862' : 'rgba(247, 231, 206, 0.2)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {selectedMidnightType === 'early' && (
                        <Check size={12} style={{ color: '#EBC862' }} />
                      )}
                    </div>
                    <div>
                      <div
                        style={{
                          color: '#F7E7CE',
                          fontSize: '0.85rem',
                          letterSpacing: '0.05em',
                          fontWeight: 300
                        }}
                      >
                        前子时（23:00-00:00）
                      </div>
                      <div
                        style={{
                          color: '#F7E7CE',
                          fontSize: '0.7rem',
                          opacity: 0.5,
                          marginTop: '2px'
                        }}
                      >
                        当天 + 次日Kin互相影响
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="cursor-pointer transition-all duration-300 p-3 rounded-lg"
                  style={{
                    background: selectedMidnightType === 'late'
                      ? 'rgba(235, 200, 98, 0.15)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${selectedMidnightType === 'late' ? 'rgba(235, 200, 98, 0.3)' : 'rgba(247, 231, 206, 0.08)'}`
                  }}
                  onClick={() => setSelectedMidnightType(selectedMidnightType === 'late' ? null : 'late')}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="transition-all duration-300"
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        background: selectedMidnightType === 'late'
                          ? 'rgba(235, 200, 98, 0.2)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${selectedMidnightType === 'late' ? '#EBC862' : 'rgba(247, 231, 206, 0.2)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {selectedMidnightType === 'late' && (
                        <Check size={12} style={{ color: '#EBC862' }} />
                      )}
                    </div>
                    <div>
                      <div
                        style={{
                          color: '#F7E7CE',
                          fontSize: '0.85rem',
                          letterSpacing: '0.05em',
                          fontWeight: 300
                        }}
                      >
                        后子时（00:00-01:00）
                      </div>
                      <div
                        style={{
                          color: '#F7E7CE',
                          fontSize: '0.7rem',
                          opacity: 0.5,
                          marginTop: '2px'
                        }}
                      >
                        当天 + 前日Kin互相影响
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full relative overflow-hidden transition-all duration-300"
              style={{
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(235, 200, 98, 0.1)',
                color: '#EBC862',
                fontSize: '0.9rem',
                fontWeight: 300,
                letterSpacing: '0.15em',
                border: '1px solid rgba(235, 200, 98, 0.2)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(235, 200, 98, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(235, 200, 98, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(235, 200, 98, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(235, 200, 98, 0.2)';
              }}
            >
              锁定时刻
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ScrollWheelProps {
  items: number[];
  selectedValue: number;
  onChange: (value: number) => void;
  formatter: (value: number) => string;
  label: string;
}

const ScrollWheel = ({ items, selectedValue, onChange, formatter, label }: ScrollWheelProps, ref: React.Ref<HTMLDivElement>) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="flex-1 flex flex-col">
      <div
        className="text-center mb-2"
        style={{
          color: '#F7E7CE',
          opacity: 0.6,
          fontSize: '0.7rem',
          letterSpacing: '0.1em'
        }}
      >
        {label}
      </div>
      <div
        ref={ref}
        className="overflow-y-auto relative flex-1 rounded-lg"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(247, 231, 206, 0.2)',
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
        }}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onScroll={(e) => {
          if (!isDragging) return;
          const container = e.currentTarget;
          const scrollTop = container.scrollTop;
          const itemHeight = 40;
          const index = Math.round(scrollTop / itemHeight);
          if (items[index] !== undefined && items[index] !== selectedValue) {
            onChange(items[index]);
          }
        }}
      >
        <div style={{ height: '50%' }} />
        {items.map((item, index) => {
          const isSelected = item === selectedValue;
          const distance = Math.abs(items.indexOf(selectedValue) - index);
          const opacity = Math.max(0.4, 1 - distance * 0.2);

          return (
            <div
              key={item}
              onClick={() => {
                onChange(item);
                if (ref && 'current' in ref && ref.current) {
                  const itemHeight = 40;
                  const containerHeight = ref.current.clientHeight;
                  const centerOffset = (containerHeight - itemHeight) / 2;
                  ref.current.scrollTop = index * itemHeight - centerOffset;
                }
              }}
              className="transition-all duration-200 cursor-pointer flex items-center justify-center"
              style={{
                height: '40px',
                color: isSelected ? '#EBC862' : '#F7E7CE',
                fontSize: '0.95rem',
                fontWeight: isSelected ? 400 : 200,
                letterSpacing: '0.05em',
                opacity,
                background: isSelected ? 'rgba(235, 200, 98, 0.12)' : 'transparent',
                borderLeft: isSelected ? '2px solid #EBC862' : '2px solid transparent',
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {formatter(item)}
            </div>
          );
        })}
        <div style={{ height: '50%' }} />
      </div>
    </div>
  );
};

const ScrollWheelWithRef = React.forwardRef(ScrollWheel);
