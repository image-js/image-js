export interface HsvColor {
  h: number;
  s: number;
  v: number;
}
export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert HSV (hue, saturation, value) color code to RGB.
 * - Hue: angle in the color wheel (from red to purple), in range 0-359.
 * - Saturation: how strong the color is (from white to bright color), in range 0-255.
 * - Value: basically the brightness (from black to intense color), in range 0-255.
 * @param hsv - The HSV color.
 * @returns The RGB color.
 */
export function hsvToRgb(hsv: number[]): Uint8Array {
  const h = hsv[0];
  const s = hsv[1] / 255;
  const v = hsv[2] / 255;
  const C = s * v;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - C;

  let r, g, b;

  if (h >= 0 && h < 60) {
    r = C;
    g = X;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = X;
    g = C;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = C;
    b = X;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = X;
    b = C;
  } else if (h >= 240 && h < 300) {
    r = X;
    g = 0;
    b = C;
  } else {
    r = C;
    g = 0;
    b = X;
  }

  const rgb = new Uint8Array(3);
  rgb[0] = (r + m) * 255;
  rgb[1] = (g + m) * 255;
  rgb[2] = (b + m) * 255;
  return rgb;
}
