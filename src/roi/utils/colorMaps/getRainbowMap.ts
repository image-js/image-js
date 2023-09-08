import { RoiKind } from '../../getRois';
import { hsvToRgb } from '../hsvToRgb';
import { rgbToNumber } from '../rgbToNumber';

export interface GetRainbowMapOptions {
  /**
   * Number of black ROIs.
   */
  nbNegative: number;
  /**
   * Number of white ID ROIs.
   */
  nbPositive: number;
  /**
   * Specify which ROIs to color.
   * @default `'bw'`
   */
  roiKind?: RoiKind;
}

/**
 * Return a map where ROIs are all different hues.
 * @param options - Get temperature map options.
 * @returns The colored map.
 */
export function getRainbowMap(options: GetRainbowMapOptions): Uint32Array {
  const { nbNegative, nbPositive, roiKind = 'bw' } = options;

  const colorMap = new Uint32Array(nbNegative + nbPositive + 1);

  const hueRange = 360;

  let step: number;
  switch (roiKind) {
    case 'bw': {
      step = hueRange / (nbNegative + nbPositive);
      break;
    }
    case 'black': {
      step = hueRange / nbNegative;
      break;
    }
    case 'white': {
      step = hueRange / nbPositive;
      break;
    }
    default: {
      throw new RangeError(`invalid ROI kind: ${roiKind}`);
    }
  }

  // negative values
  let hue = 0;
  if (roiKind === 'bw' || roiKind === 'black') {
    for (let i = -nbNegative; i < 0; i++) {
      const hsv = [hue, 255, 255];
      colorMap[i + nbNegative] = rgbToNumber(hsvToRgb(hsv));
      hue += step;
    }
  }
  // positive values
  if (roiKind === 'bw' || roiKind === 'white') {
    for (let i = 1; i <= nbPositive; i++) {
      const hsv = [hue, 255, 255];
      colorMap[i + nbNegative] = rgbToNumber(hsvToRgb(hsv));
      hue += step;
    }
  }
  return colorMap;
}
