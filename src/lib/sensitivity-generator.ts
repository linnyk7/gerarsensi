import type { System, Sensitivity, AndroidSettings, IosSettings, GeneratedSettings, AdvancedSensitivity } from './types';

const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomFloatFrom = (arr: number[]): string => arr[Math.floor(Math.random() * arr.length)].toFixed(2);


const generateAndroidSettings = (sensitivity: Sensitivity): AndroidSettings => {
  let dpiRange, cursorSpeedRange, animationScaleOptions;

  switch (sensitivity) {
    case 'low':
      dpiRange = { min: 320, max: 480 };
      cursorSpeedRange = { min: 1, max: 40 };
      animationScaleOptions = ['0.5x', '1x'];
      break;
    case 'medium':
      dpiRange = { min: 481, max: 640 };
      cursorSpeedRange = { min: 41, max: 80 };
      animationScaleOptions = ['1x', '1.5x'];
      break;
    case 'high':
      dpiRange = { min: 641, max: 960 };
      cursorSpeedRange = { min: 81, max: 120 };
      animationScaleOptions = ['1.5x', '2x'];
      break;
  }

  return {
    dpi: getRandom(dpiRange.min, dpiRange.max),
    cursorSpeed: getRandom(cursorSpeedRange.min, cursorSpeedRange.max),
    animationScale: getRandomFrom(animationScaleOptions),
  };
};

const generateAdvancedSetting = (sensitivity: Sensitivity): AdvancedSensitivity => {
  const options: Record<Sensitivity, AdvancedSensitivity[]> = {
    low: ['minimo', 'minimo', 'medio'],
    medium: ['minimo', 'medio', 'maximo'],
    high: ['medio', 'maximo', 'maximo'],
  };
  return getRandomFrom(options[sensitivity]);
};

const generateIosSettings = (sensitivity: Sensitivity): IosSettings => {
  let scanValues, pauseValues, repetitionValues, cursorSpeedRange;
  let cyclesRange = { min: 1, max: 10 };

  const advancedSettings = {
    mouseKeys: generateAdvancedSetting(sensitivity),
    trackingSensitivity: generateAdvancedSetting(sensitivity),
    movementTolerance: generateAdvancedSetting(sensitivity),
  };

  const trackingMultiplier = {
    minimo: 0.8,
    medio: 1.0,
    maximo: 1.2,
  };

  const mouseKeysMultiplier = {
    minimo: 0.85,
    medio: 1.0,
    maximo: 1.15,
  };
  
  const toleranceMultiplier = {
    minimo: 1.2, // More tolerance -> more cycles
    medio: 1.0,
    maximo: 0.8, // Less tolerance -> fewer cycles
  };

  const { trackingSensitivity, mouseKeys, movementTolerance } = advancedSettings;

  switch (sensitivity) {
    case 'low':
      scanValues = [0.25, 0.30];
      pauseValues = [0.25, 0.30, 0.50];
      repetitionValues = [0.25, 0.30, 0.50];
      cursorSpeedRange = { min: 1, max: 40 };
      break;
    case 'medium':
      scanValues = [0.30, 1.00];
      pauseValues = [0.50, 1.00];
      repetitionValues = [0.50, 1.00];
      cursorSpeedRange = { min: 41, max: 80 };
      break;
    case 'high':
      scanValues = [1.00, 1.35];
      pauseValues = [1.00, 1.35];
      repetitionValues = [1.00, 1.35];
      cursorSpeedRange = { min: 81, max: 120 };
      break;
  }
  
  // Apply multipliers
  const finalTrackingMultiplier = trackingMultiplier[trackingSensitivity];
  scanValues = scanValues.map(v => v * finalTrackingMultiplier);
  pauseValues = pauseValues.map(v => v * finalTrackingMultiplier);
  repetitionValues = repetitionValues.map(v => v * finalTrackingMultiplier);

  const finalMouseMultiplier = mouseKeysMultiplier[mouseKeys];
  cursorSpeedRange = {
      min: Math.round(cursorSpeedRange.min * finalMouseMultiplier),
      max: Math.round(cursorSpeedRange.max * finalMouseMultiplier),
  };
  cursorSpeedRange.max = Math.min(120, cursorSpeedRange.max);
  if (cursorSpeedRange.min > cursorSpeedRange.max) {
    cursorSpeedRange.min = cursorSpeedRange.max;
  }


  const finalToleranceMultiplier = toleranceMultiplier[movementTolerance];
  cyclesRange = {
      min: Math.max(1, Math.round(cyclesRange.min * finalToleranceMultiplier)),
      max: Math.max(1, Math.round(cyclesRange.max * finalToleranceMultiplier)),
  };
  cyclesRange.max = Math.min(10, cyclesRange.max);


  // Ensure min is not greater than max
  if (cyclesRange.min > cyclesRange.max) [cyclesRange.min, cyclesRange.max] = [cyclesRange.max, cyclesRange.min];


  return {
    autoScan: getRandomFloatFrom(scanValues),
    pause: getRandomFloatFrom(pauseValues),
    movementRepetition: getRandomFloatFrom(repetitionValues),
    longPress: '1.00',
    cycles: getRandom(cyclesRange.min, cyclesRange.max),
    mobileCursor: getRandomFrom(['Preciso', 'Refinado', 'Individual']),
    mobileCursorSpeed: getRandom(cursorSpeedRange.min, cursorSpeedRange.max),
    mouseKeys: advancedSettings.mouseKeys,
    trackingSensitivity: advancedSettings.trackingSensitivity,
    movementTolerance: advancedSettings.movementTolerance,
  };
};

export const generateSettings = (system: System, sensitivity: Sensitivity): GeneratedSettings => {
  if (system === 'android') {
    return generateAndroidSettings(sensitivity);
  }
  return generateIosSettings(sensitivity);
};
