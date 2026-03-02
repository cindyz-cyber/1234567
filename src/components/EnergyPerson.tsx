import { useState, useEffect } from 'react';
import { Share2, Baby, Users } from 'lucide-react';
import {
  calculateKin,
  calculateEnergyProfile,
  calculateFamilyCollision,
  generateEnergyReport,
  generateDeepPortrait,
  detectRelationshipSynergy,
  type KinData,
  type EnergyProfile,
  type RelationshipSynergy
} from '../utils/mayaCalendar';
import ImmersiveDatePicker from './ImmersiveDatePicker';
import CalibrationButton from './CalibrationButton';
import EnergyRadarChart from './EnergyRadarChart';

interface PersonData {
  birthDate: Date | null;
  kinData: KinData | null;
  profile: EnergyProfile | null;
  midnightType?: 'early' | 'late' | null;
}

export default function EnergyPerson() {
  const [myData, setMyData] = useState<PersonData>({
    birthDate: null,
    kinData: null,
    profile: null,
    midnightType: null
  });

  const [fatherData, setFatherData] = useState<PersonData>({
    birthDate: null,
    kinData: null,
    profile: null,
    midnightType: null
  });

  const [motherData, setMotherData] = useState<PersonData>({
    birthDate: null,
    kinData: null,
    profile: null,
    midnightType: null
  });

  const [childData, setChildData] = useState<PersonData>({
    birthDate: null,
    kinData: null,
    profile: null,
    midnightType: null
  });

  const [showOptionalInputs, setShowOptionalInputs] = useState(false);
  const [finalProfile, setFinalProfile] = useState<EnergyProfile | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [synergies, setSynergies] = useState<RelationshipSynergy[]>([]);

  useEffect(() => {
    if (!myData.kinData) return;

    let profile = calculateEnergyProfile(
      myData.kinData,
      motherData.kinData?.kin,
      fatherData.kinData?.kin
    );
    const detectedSynergies: RelationshipSynergy[] = [];

    if (motherData.birthDate && motherData.kinData) {
      profile = calculateFamilyCollision(
        profile,
        myData.kinData,
        calculateEnergyProfile(motherData.kinData),
        motherData.kinData,
        'mother'
      );
      const synergy = detectRelationshipSynergy(myData.kinData, motherData.kinData, 'mother');
      detectedSynergies.push(synergy);
    }

    if (fatherData.birthDate && fatherData.kinData) {
      profile = calculateFamilyCollision(
        profile,
        myData.kinData,
        calculateEnergyProfile(fatherData.kinData),
        fatherData.kinData,
        'father'
      );
      const synergy = detectRelationshipSynergy(myData.kinData, fatherData.kinData, 'father');
      detectedSynergies.push(synergy);
    }

    if (childData.birthDate && childData.kinData) {
      profile = calculateFamilyCollision(
        profile,
        myData.kinData,
        calculateEnergyProfile(childData.kinData),
        childData.kinData,
        'child'
      );
      const synergy = detectRelationshipSynergy(myData.kinData, childData.kinData, 'child');
      detectedSynergies.push(synergy);
    }

    setFinalProfile(profile);
    setSynergies(detectedSynergies);
  }, [myData.kinData, motherData.kinData, fatherData.kinData, childData.kinData]);

  const handleDateSelect = (
    type: 'my' | 'father' | 'mother' | 'child',
    dateString: string,
    midnightType: 'early' | 'late' | null = null
  ) => {
    if (!dateString) return;

    const birthDate = new Date(dateString);
    const kinData = calculateKin(birthDate, midnightType);
    const profile = calculateEnergyProfile(kinData);

    const personData = { birthDate, kinData, profile, midnightType };

    switch (type) {
      case 'my':
        setMyData(personData);
        break;
      case 'father':
        setFatherData(personData);
        break;
      case 'mother':
        setMotherData(personData);
        break;
      case 'child':
        setChildData(personData);
        break;
    }
  };

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  const handleShare = async () => {
    if (!myData.kinData || !finalProfile) return;

    const report = generateEnergyReport(
      myData.kinData,
      finalProfile,
      motherData.kinData || undefined,
      fatherData.kinData || undefined,
      synergies
    );

    if (navigator.share) {
      try {
        await navigator.share({
          title: '我的先天能量版本',
          text: report
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(report);
      alert('报告已复制到剪贴板');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: -20 }}
      >
        <source src="https://cdn.midjourney.com/video/73a6b711-fbab-490c-a0b9-f3e811e37ead/3.mp4" type="video/mp4" />
      </video>

      <div
        className="fixed top-0 left-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 31, 28, 0.3) 0%, rgba(2, 10, 9, 0.4) 100%)',
          pointerEvents: 'none',
          zIndex: -10
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {!showReport ? (
          <>
            <div className="text-center mb-12">
              <h1
                className="text-5xl font-light mb-4"
                style={{
                  color: '#F7E7CE',
                  textShadow: '0 0 30px rgba(247, 231, 206, 0.3)',
                  letterSpacing: '0.05em'
                }}
              >
                听音识人
              </h1>
              <p
                className="text-lg"
                style={{
                  color: '#F7E7CE',
                  opacity: 0.6,
                  letterSpacing: '0.1em'
                }}
              >
                解码你的先天能量版本
              </p>
            </div>

            <div className="mb-8">
              <ImmersiveDatePicker
                label="我的出生日期"
                value={myData.birthDate}
                kinData={myData.kinData}
                midnightType={myData.midnightType}
                onChange={(date, midnight) => handleDateSelect('my', date, midnight)}
              />
            </div>

            <div className="mb-12">
              <button
                onClick={() => setShowOptionalInputs(!showOptionalInputs)}
                className="w-full p-5 rounded-2xl mb-6 transition-all duration-300"
                style={{
                  background: showOptionalInputs
                    ? 'linear-gradient(135deg, rgba(247, 231, 206, 0.12) 0%, rgba(247, 231, 206, 0.06) 100%)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${showOptionalInputs ? 'rgba(247, 231, 206, 0.3)' : 'rgba(247, 231, 206, 0.1)'}`,
                  backdropFilter: 'blur(20px)',
                  color: '#F7E7CE'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users size={20} style={{ opacity: 0.7 }} />
                    <span className="text-lg font-light" style={{ letterSpacing: '0.05em' }}>
                      {showOptionalInputs ? '收起' : '添加'}父母和孩子信息（可选）
                    </span>
                  </div>
                  <span className="text-sm opacity-60">
                    {showOptionalInputs ? '▲' : '▼'}
                  </span>
                </div>
              </button>

              {showOptionalInputs && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImmersiveDatePicker
                      icon={<Users size={20} />}
                      label="父亲的出生日期"
                      value={fatherData.birthDate}
                      kinData={fatherData.kinData}
                      midnightType={fatherData.midnightType}
                      onChange={(date, midnight) => handleDateSelect('father', date, midnight)}
                    />
                    <ImmersiveDatePicker
                      icon={<Users size={20} />}
                      label="母亲的出生日期"
                      value={motherData.birthDate}
                      kinData={motherData.kinData}
                      midnightType={motherData.midnightType}
                      onChange={(date, midnight) => handleDateSelect('mother', date, midnight)}
                    />
                  </div>

                  <ImmersiveDatePicker
                    icon={<Baby size={20} />}
                    label="孩子的出生日期"
                    value={childData.birthDate}
                    kinData={childData.kinData}
                    midnightType={childData.midnightType}
                    onChange={(date, midnight) => handleDateSelect('child', date, midnight)}
                  />
                </div>
              )}
            </div>

            {finalProfile && myData.kinData && (
              <div className="flex justify-center mt-8">
                <CalibrationButton onClick={handleGenerateReport} label="生成能量画像" />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1
                className="text-4xl font-light mb-4"
                style={{
                  color: '#F7E7CE',
                  textShadow: '0 0 30px rgba(247, 231, 206, 0.3)',
                  letterSpacing: '0.05em'
                }}
              >
                你的能量画像
              </h1>
              <p
                className="text-lg"
                style={{
                  color: '#F7E7CE',
                  opacity: 0.6,
                  letterSpacing: '0.1em'
                }}
              >
                Kin {myData.kinData?.kin} · {myData.kinData?.toneName}的{myData.kinData?.sealName}
              </p>
            </div>

            {finalProfile && myData.kinData && (
              <>
                <div
                  className="mb-8 p-8 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(247, 231, 206, 0.08) 0%, rgba(247, 231, 206, 0.03) 100%)',
                    border: '1px solid rgba(247, 231, 206, 0.2)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <h2 className="text-2xl text-center mb-6" style={{ color: '#F7E7CE', letterSpacing: '0.1em' }}>
                    核心计算维度
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <div className="text-sm opacity-60 mb-2" style={{ color: '#F7E7CE' }}>核心印记</div>
                      <div className="text-xl font-light" style={{ color: '#EBC862' }}>
                        {myData.kinData.toneName}的{myData.kinData.sealName}
                      </div>
                      <div className="text-sm mt-1 opacity-70" style={{ color: '#F7E7CE' }}>
                        Kin {myData.kinData.kin}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <div className="text-sm opacity-60 mb-2" style={{ color: '#F7E7CE' }}>所属波符</div>
                      <div className="text-xl font-light" style={{ color: '#EBC862' }}>
                        {myData.kinData.wavespellName}波符
                      </div>
                      <div className="text-sm mt-1 opacity-70" style={{ color: '#F7E7CE' }}>
                        第{myData.kinData.wavespell}波符
                      </div>
                    </div>

                    <div className="p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <div className="text-sm opacity-60 mb-2" style={{ color: '#F7E7CE' }}>隐藏推动力</div>
                      <div className="text-xl font-light" style={{ color: '#EBC862' }}>
                        {myData.kinData.hiddenPowerName}
                      </div>
                      <div className="text-sm mt-1 opacity-70" style={{ color: '#F7E7CE' }}>
                        Kin {myData.kinData.hiddenPower}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <div className="text-sm opacity-60 mb-2" style={{ color: '#F7E7CE' }}>调性特质</div>
                      <div className="text-xl font-light" style={{ color: '#EBC862' }}>
                        第{myData.kinData.tone}调性
                      </div>
                      <div className="text-sm mt-1 opacity-70" style={{ color: '#F7E7CE' }}>
                        {myData.kinData.toneType}
                      </div>
                    </div>
                  </div>
                </div>

                <EnergyRadarChart profile={finalProfile} synergies={synergies} />

                <div
                  className="mt-8 p-8 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(235, 200, 98, 0.08) 0%, rgba(235, 200, 98, 0.03) 100%)',
                    border: '1px solid rgba(235, 200, 98, 0.2)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <div
                    className="whitespace-pre-wrap font-sans"
                    style={{
                      color: '#F7E7CE',
                      lineHeight: '1.8',
                      fontSize: '0.95rem'
                    }}
                    dangerouslySetInnerHTML={{ __html: generateDeepPortrait(myData.kinData, finalProfile).replace(/\n/g, '<br/>').replace(/###/g, '<h3 style="color: #EBC862; margin: 1.5rem 0 1rem 0; font-size: 1.3rem;">').replace(/<h3/g, '</h3><h3').slice(6) }}
                  />
                </div>

                <div
                  className="mt-8 p-8 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(247, 231, 206, 0.1)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <pre
                    className="whitespace-pre-wrap font-sans"
                    style={{
                      color: '#F7E7CE',
                      lineHeight: '1.8',
                      fontSize: '0.95rem'
                    }}
                  >
                    {generateEnergyReport(
                      myData.kinData,
                      finalProfile,
                      motherData.kinData || undefined,
                      fatherData.kinData || undefined,
                      synergies
                    )}
                  </pre>
                </div>

                <div className="flex gap-4 justify-center mt-8">
                  <CalibrationButton onClick={handleShare} label="分享能量" icon={<Share2 size={20} />} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
