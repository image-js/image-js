import { Image } from '../Image';

export default function clamp(value: number, image: Image): number {
  value = Math.min(Math.max(value, 0), image.maxValue);
  if (value % 0.5 !== 0) {
    return Math.round(value);
  }
  return Math.floor(value) % 2 === 0 ? Math.floor(value) : Math.ceil(value);
}
