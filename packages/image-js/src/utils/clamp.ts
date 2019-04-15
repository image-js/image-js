import { Image } from '../Image';

export type ClampFunction = (value: number) => number;

export function getClamp(image: Image): ClampFunction {
  if (image.maxValue === 255) {
    return clamp255;
  }
  if (image.maxValue === 65535) {
    return clamp65535;
  }
  throw new Error(`unknown maxValue: ${image.maxValue}`);
}

function clamp255(value: number): number {
  return Math.min(Math.max(value, 0), 255);
}

function clamp65535(value: number): number {
  return Math.min(Math.max(value, 0), 65535);
}
