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
  relationName: string;
  relation: string;
  kin: number;
  type: 'pusher' | 'integrator' | 'mirror' | 'anchor';
  typeLabel: string;
  description: string;
  relationIcon: string;
  synergy: {
    type: string;
    strength: number;
    description?: string;
  };
}

export interface YearGuidance {
  year: number;
  theme: string;
  mainEnergy: string;
  advice: string;
}

export interface KinEnergyReport {
  kin: number;
  portrait: EnergyPortrait;
  quantumResonances: QuantumResonance[];
  yearGuidance: YearGuidance;
  weakestCenter: string;
  challengeAdvice: string;
  wavespellInfluence: string;
}
