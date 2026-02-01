import type { System, Sensitivity, AndroidSettings, IosSettings, GeneratedSettings } from './types';

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

const generateIosSettings = (sensitivity: Sensitivity): IosSettings => {
  let scanValues, pauseValues, repetitionValues, cursorSpeedRange;

  const allScanValues = [1.00, 1.35, 0.25, 0.30];
  const allPauseValues = [1.00, 1.35, 0.25, 0.30, 0.50];
  const allRepetitionValues = [1.00, 1.35, 0.25, 0.30, 0.50];

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

  return {
    autoScan: getRandomFloatFrom(scanValues),
    pause: getRandomFloatFrom(pauseValues),
    movementRepetition: getRandomFloatFrom(repetitionValues),
    longPress: '1.00',
    cycles: getRandom(1, 10),
    mobileCursor: getRandomFrom(['Preciso', 'Refinado', 'Individual']),
    mobileCursorSpeed: getRandom(cursorSpeedRange.min, cursorSpeedRange.max),
  };
};

export const generateSettings = (system: System, sensitivity: Sensitivity): GeneratedSettings => {
  if (system === 'android') {
    return generateAndroidSettings(sensitivity);
  }
  return generateIosSettings(sensitivity);
};
