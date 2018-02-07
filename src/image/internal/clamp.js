export function clamp(value, image) {
  return Math.round(Math.min(Math.max(value, 0), image.maxValue));
}
