export interface EnergyCenter {
  name: string;
  percentage: number;
  mode: string;
  description: string;
  icon: string;
}

export interface EnergyPortrait {
  mode: string;
  perspective: string;
  essence: string;
  centers: EnergyCenter[];
}

export interface QuantumResonance {
  relationName: string;
  kin: number;
  type: 'pusher' | 'integrator' | 'mirror' | 'anchor';
  typeLabel: string;
  description: string;
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
}
