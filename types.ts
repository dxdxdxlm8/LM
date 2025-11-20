
export enum CableType {
  POWER = 'Power Cable (电源线)',
  USB = 'USB Cable (USB线)',
  INTERCONNECT = 'Interconnect (信号线)',
  ETHERNET = 'Ethernet (网线)'
}

export interface TechnicalSpecs {
  resistance: string;
  capacitance: string;
  inductance: string;
  skinEffectFactor: string;
  shieldingQuality: string;
  estimatedGauge: string;
}

export interface SoundProfile {
  bass: number;        // 0-100
  mids: number;        // 0-100
  treble: number;      // 0-100
  soundstage: number;  // 0-100
  dynamics: number;    // 0-100
  resolution: number;  // 0-100
  warmth: number;      // 0-100 (0=Cold/Analytical, 100=Warm/Analog)
}

export interface SimulationResult {
  technicalSpecs: TechnicalSpecs;
  soundProfile: SoundProfile;
  analysis: string;
  soundSignature: string; // New field for detailed sound prediction
  recommendations: string;
}

export interface DesignState {
  cableType: CableType | null;
  description: string;
  imageBase64: string | null;
}
