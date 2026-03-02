export interface EnergyCenter {
  name: string;
  percentage: number;
  mode: string;
  description: string;
  icon: string;
  traits?: string;
  weaknesses?: string;
}

export interface EnergyPortrait {
  mode: string;
  perspective: string;
  essence: string;
  centers: EnergyCenter[];
}

export interface QuantumResonance {
  familyMember: string;
  type: string;
  typeLabel: string;
  description: string;
  synergyType: string;
  synergyStrength: number;
  synergyDescription: string;
}

export interface YearGuidance {
  year: number;
  theme: string;
  mainEnergy: string;
  advice: string;
}

export interface KinEnergyReport {
  kin: number;
  midnightType?: 'early' | 'late' | null;
  secondaryKin?: number;
  toneName?: string;
  sealName?: string;
  portrait: EnergyPortrait;
  quantumResonances: QuantumResonance[];
  yearGuidance: YearGuidance;
  weakestCenter: string;
  challengeAdvice: string;
  wavespellInfluence: string;
}
