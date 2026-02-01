export type System = 'android' | 'ios';
export type Sensitivity = 'low' | 'medium' | 'high';
export type AdvancedSensitivity = 'minimo' | 'medio' | 'maximo';

export interface LoginData {
  system: System;
  deviceModel: string;
}

export interface AndroidSettings {
  dpi: number;
  cursorSpeed: number;
  animationScale: string;
}

export interface IosSettings {
  autoScan: string;
  pause: string;
  movementRepetition: string;
  longPress: string;
  cycles: number;
  mobileCursor: string;
  mobileCursorSpeed: number;
  mouseKeys: AdvancedSensitivity;
  trackingSensitivity: AdvancedSensitivity;
  movementTolerance: AdvancedSensitivity;
}

export type GeneratedSettings = AndroidSettings | IosSettings;
