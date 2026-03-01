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
      const itemHeight = 60;
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
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(20px)'
          }}
          onClick={() => setShowPicker(false)}
        >
          <div
            className="w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(10, 31, 28, 0.98) 0%, rgba(2, 10, 9, 0.98) 100%)',
              border: '1px solid rgba(247, 231, 206, 0.2)',
              borderRadius: '24px',
              padding: '48px',
              boxShadow: '0 20px 80px rgba(0, 0, 0, 0.5)'
            }}
          >
            <h3
              className="text-3xl text-center mb-12"
              style={{
                color: '#F7E7CE',
                letterSpacing: '0.15em',
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300
              }}
            >
              {label}
            </h3>

            <div className="flex gap-6 mb-8" style={{ height: '300px' }}>
              <ScrollWheel
                ref={yearRef}
                items={years}
                selectedValue={selectedYear}
                onChange={setSelectedYear}
                formatter={(y) => `${y}年`}
              />
              <ScrollWheel
                ref={monthRef}
                items={months}
                selectedValue={selectedMonth}
                onChange={setSelectedMonth}
                formatter={(m) => monthNames[m]}
              />
              <ScrollWheel
                ref={dayRef}
                items={days}
                selectedValue={selectedDay}
                onChange={setSelectedDay}
                formatter={(d) => `${d}日`}
              />
            </div>

            <div
              className="mb-8 p-6 rounded-2xl cursor-pointer transition-all duration-500"
              style={{
                background: midnightToggle
                  ? 'linear-gradient(135deg, rgba(138, 180, 248, 0.15) 0%, rgba(100, 120, 200, 0.1) 100%)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${midnightToggle ? 'rgba(138, 180, 248, 0.4)' : 'rgba(247, 231, 206, 0.1)'}`,
                boxShadow: midnightToggle ? '0 0 30px rgba(138, 180, 248, 0.2)' : 'none'
              }}
              onClick={() => setMidnightToggle(!midnightToggle)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div
                    style={{
                      color: midnightToggle ? '#8AB4F8' : '#F7E7CE',
                      fontSize: '1.1rem',
                      letterSpacing: '0.1em',
                      marginBottom: '6px'
                    }}
                  >
                    是否在子时（00:00 - 01:00）降临？
                  </div>
                  <div
                    style={{
                      color: '#F7E7CE',
                      opacity: 0.5,
                      fontSize: '0.85rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {midnightToggle ? '双印记能量已激活' : '单印记模式'}
                  </div>
                </div>
                <div
                  className="transition-all duration-500"
                  style={{
                    width: '60px',
                    height: '32px',
                    borderRadius: '16px',
                    background: midnightToggle
                      ? 'linear-gradient(135deg, #8AB4F8 0%, #6B94E0 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    boxShadow: midnightToggle ? '0 0 20px rgba(138, 180, 248, 0.5)' : 'none'
                  }}
                >
                  <div
                    className="transition-all duration-500"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '12px',
                      background: '#F7E7CE',
                      position: 'absolute',
                      top: '4px',
                      left: midnightToggle ? '32px' : '4px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full relative overflow-hidden"
              style={{
                height: '64px',
                borderRadius: '32px',
                background: 'linear-gradient(135deg, #EBC862 0%, #D4AF37 100%)',
                color: '#0A1F1C',
                fontSize: '1.1rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(235, 200, 98, 0.3)'
              }}
            >
              {rippleActive && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
                    animation: 'ripple 0.6s ease-out'
                  }}
                />
              )}
              <span className="relative z-10">校准能量</span>
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
        maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
      }}
      onScroll={(e) => {
        const container = e.currentTarget;
        const scrollTop = container.scrollTop;
        const itemHeight = 60;
        const index = Math.round(scrollTop / itemHeight);
        if (items[index] !== undefined) {
          onChange(items[index]);
        }
      }}
    >
      <div style={{ height: '120px' }} />
      {items.map((item, index) => {
        const isSelected = item === selectedValue;
        const distance = Math.abs(items.indexOf(selectedValue) - index);
        const opacity = Math.max(0.2, 1 - distance * 0.3);
        const scale = isSelected ? 1.2 : Math.max(0.8, 1 - distance * 0.1);

        return (
          <div
            key={item}
            onClick={() => onChange(item)}
            className="transition-all duration-300 cursor-pointer flex items-center justify-center"
            style={{
              height: '60px',
              color: isSelected ? '#EBC862' : '#F7E7CE',
              fontSize: isSelected ? '2rem' : '1.2rem',
              fontFamily: '"Playfair Display", serif',
              fontWeight: isSelected ? 400 : 300,
              letterSpacing: '0.1em',
              opacity,
              transform: `scale(${scale})`,
              textShadow: isSelected ? '0 0 20px rgba(235, 200, 98, 0.6)' : 'none',
              filter: isSelected ? 'blur(0px)' : `blur(${Math.min(2, distance * 0.5)}px)`
            }}
          >
            {formatter(item)}
          </div>
        );
      })}
      <div style={{ height: '120px' }} />
    </div>
  );
};

const ScrollWheelWithRef = React.forwardRef(ScrollWheel);
export { ScrollWheelWithRef as ScrollWheel };
