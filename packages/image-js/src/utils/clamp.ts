import { Image } from '../Image';

export function clamp(value: number, image: Image): number {
  return Math.min(Math.max(value, 0), image.maxValue);
}
