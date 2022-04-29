import { RoiKind } from '../../getRois';
import { maxNumberRois, colorMapCenter } from '../constants';
import { hsvToRgb } from '../hsvToRgb';
import { rgbToNumber } from '../rgbToNumber';

// warning: the values in a uint32 array are flipped!! e.g. [0,0,0,1] becomes 0x01000000
// the bits values are therefore in the following order: ABGR
// index 32768 corresponds to the middle of the array

export interface GetBinaryMapOptions {
  /**
   * Number of black ROIs
   */
  nbNegative: number;
  /**
   * Number of white ID ROIs
   */
  nbPositive: number;
  /**
   * Specify which ROIs to colour.
   *
   * @default RoiKind.BW
   */
  roiKind?: RoiKind;
  /**
   * Hue of white ROIs
   *
   * @default 120
   */
  whiteHue?: number;
  /**
   * Hue of black ROIs
   *
   * @default 0
   */
  blackHue?: number;
}

/**
 * Return a map where ROIs are red (negative) or green (positive) depending on the ROI index.
 *
 * @param options - Color maps options.
 * @returns The colored map.
 */
export function getBinaryMap(options: GetBinaryMapOptions): Uint32Array {
  const {
    nbNegative,
    nbPositive,
    whiteHue = 120,
    blackHue = 0,
    roiKind = RoiKind.BW,
  } = options;

  let colorMap = new Uint32Array(maxNumberRois);

  // negative values
  if (roiKind === RoiKind.BW || roiKind === RoiKind.BLACK) {
    for (let i = colorMapCenter - nbNegative; i < colorMapCenter; i++) {
      const hsv = [blackHue, 255, 255];
      colorMap[i] = rgbToNumber(hsvToRgb(hsv));
    }
  }
  if (roiKind === RoiKind.BW || roiKind === RoiKind.WHITE) {
    // positive values
    for (let i = colorMapCenter + 1; i < colorMapCenter + 1 + nbPositive; i++) {
      const hsv = [whiteHue, 255, 255];
      colorMap[i] = rgbToNumber(hsvToRgb(hsv));
    }
  }

  return colorMap;
}
