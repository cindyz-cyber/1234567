import React, { useState, useRef, useEffect } from 'react';
import type { KinData } from '../utils/mayaCalendar';

interface ImmersiveDatePickerProps {
  label: string;
  value: Date | null;
  kinData: KinData | null;
  isMidnightBirth?: boolean;
  onChange: (date: string, isMidnightBirth: boolean) => void;
}

export default function ImmersiveDatePicker({
  label,
  value,
  kinData,
  isMidnightBirth = false,
  onChange
}: ImmersiveDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(value?.getFullYear() || new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(value?.getMonth() || 0);
  const [selectedDay, setSelectedDay] = useState(value?.getDate() || 1);
  const [midnightToggle, setMidnightToggle] = useState(isMidnightBirth);
  const [rippleActive, setRippleActive] = useState(false);

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
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
    onChange(dateStr, midnightToggle);
    setRippleActive(true);
    setTimeout(() => {
      setRippleActive(false);
      setShowPicker(false);
    }, 600);
  };

  const scrollToCenter = (ref: React.RefObject<HTMLDivElement>, index: number) => {
    if (ref.current) {
      const itemHeight = 48;
      ref.current.scrollTop = index * itemHeight - itemHeight * 2;
    }
  };

  useEffect(() => {
    if (showPicker) {
      setTimeout(() => {
        scrollToCenter(yearRef, years.indexOf(selectedYear));
        scrollToCenter(monthRef, selectedMonth);
        scrollToCenter(dayRef, selectedDay - 1);
      }, 100);
    }
  }, [showPicker]);

  return (
    <>
      <div
        className="p-8 rounded-2xl transition-all duration-500 cursor-pointer group"
        style={{
          background: value
            ? 'linear-gradient(135deg, rgba(247, 231, 206, 0.1) 0%, rgba(247, 231, 206, 0.05) 100%)'
            : 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${value ? 'rgba(247, 231, 206, 0.25)' : 'rgba(247, 231, 206, 0.1)'}`,
          backdropFilter: 'blur(30px)',
          boxShadow: value
            ? '0 8px 32px rgba(247, 231, 206, 0.1)'
            : '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}
        onClick={() => setShowPicker(true)}
      >
        <h2
          className="text-2xl mb-6 text-center"
          style={{
            color: '#F7E7CE',
            letterSpacing: '0.15em',
            fontFamily: '"Playfair Display", serif',
            fontWeight: 300
          }}
        >
          {label}
        </h2>

        {!value ? (
          <div
            className="text-center py-12 transition-opacity duration-300 group-hover:opacity-80"
            style={{ color: '#F7E7CE', opacity: 0.4, letterSpacing: '0.1em' }}
          >
            轻触以选择时刻
          </div>
        ) : (
          <div className="text-center">
            <div
              className="text-4xl mb-4"
              style={{
                color: '#EBC862',
                letterSpacing: '0.05em',
                fontFamily: '"Playfair Display", serif',
                textShadow: '0 0 20px rgba(235, 200, 98, 0.4)'
              }}
            >
              {value.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {kinData && (
              <div
                className="text-lg"
                style={{
                  color: '#F7E7CE',
                  opacity: 0.7,
                  letterSpacing: '0.1em'
                }}
              >
                Kin {kinData.kin} · {kinData.sealName} · {kinData.toneName}
                {kinData.isMidnightBirth && (
                  <span style={{ color: '#8AB4F8', marginLeft: '12px' }}>
                    子时双印记
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(40px)'
          }}
          onClick={() => setShowPicker(false)}
        >
          <div
            className="w-full max-w-md mx-6"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(8, 8, 8, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '32px',
              padding: '40px 32px 32px',
              boxShadow: '0 40px 120px rgba(0, 0, 0, 0.8)'
            }}
          >
            <h3
              className="text-center mb-16"
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '11px',
                letterSpacing: '0.25em',
                fontWeight: 400,
                textTransform: 'uppercase'
              }}
            >
              {label}
            </h3>

            <div className="flex gap-2 mb-12" style={{ height: '240px' }}>
              <ScrollWheelWithRef
                ref={yearRef}
                items={years}
                selectedValue={selectedYear}
                onChange={setSelectedYear}
                formatter={(y) => `${y}`}
              />
              <ScrollWheelWithRef
                ref={monthRef}
                items={months}
                selectedValue={selectedMonth}
                onChange={setSelectedMonth}
                formatter={(m) => `${m + 1 < 10 ? '0' : ''}${m + 1}`}
              />
              <ScrollWheelWithRef
                ref={dayRef}
                items={days}
                selectedValue={selectedDay}
                onChange={setSelectedDay}
                formatter={(d) => `${d < 10 ? '0' : ''}${d}`}
              />
            </div>

            <div
              className="mb-8 cursor-pointer transition-all duration-700"
              style={{
                background: 'transparent',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '24px'
              }}
              onClick={() => setMidnightToggle(!midnightToggle)}
            >
              <div className="flex items-center justify-between">
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    fontWeight: 300
                  }}
                >
                  子时降临
                </div>
                <div
                  className="transition-all duration-700"
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    background: midnightToggle
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'rgba(255, 255, 255, 0.06)',
                    position: 'relative',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div
                    className="transition-all duration-700"
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '9px',
                      background: midnightToggle ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
                      position: 'absolute',
                      top: '2px',
                      left: midnightToggle ? '22px' : '2px'
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full relative overflow-hidden transition-all duration-300"
              style={{
                height: '52px',
                borderRadius: '26px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.25em',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              {rippleActive && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                    animation: 'ripple 0.6s ease-out',
                    borderRadius: '26px'
                  }}
                />
              )}
              <span className="relative z-10">确认</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

interface ScrollWheelProps {
  items: number[];
  selectedValue: number;
  onChange: (value: number) => void;
  formatter: (value: number) => string;
}

const ScrollWheel = ({ items, selectedValue, onChange, formatter }: ScrollWheelProps, ref: React.Ref<HTMLDivElement>) => {
  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto relative"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)'
      }}
      onScroll={(e) => {
        const container = e.currentTarget;
        const scrollTop = container.scrollTop;
        const itemHeight = 48;
        const index = Math.round(scrollTop / itemHeight);
        if (items[index] !== undefined) {
          onChange(items[index]);
        }
      }}
    >
      <div style={{ height: '96px' }} />
      {items.map((item, index) => {
        const isSelected = item === selectedValue;
        const distance = Math.abs(items.indexOf(selectedValue) - index);
        const opacity = Math.max(0.3, 1 - distance * 0.25);

        return (
          <div
            key={item}
            onClick={() => onChange(item)}
            className="transition-all duration-500 cursor-pointer flex items-center justify-center"
            style={{
              height: '48px',
              color: isSelected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.5)',
              fontSize: isSelected ? '32px' : '22px',
              fontWeight: isSelected ? 300 : 200,
              letterSpacing: '0.02em',
              opacity,
              transform: `scale(${isSelected ? 1 : 0.9})`,
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {formatter(item)}
          </div>
        );
      })}
      <div style={{ height: '96px' }} />
    </div>
  );
};

const ScrollWheelWithRef = React.forwardRef(ScrollWheel);
