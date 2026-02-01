export type System = 'android' | 'ios';
export type Sensitivity = 'low' | 'medium' | 'high';

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
}

export type GeneratedSettings = AndroidSettings | IosSettings;
