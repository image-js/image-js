import { RoiKind } from '../../RoiManager';
import { maxNumberRois, colorMapCenter } from '../constants';
import { hsvToRgb } from '../hsvToRgb';
import { rgbToNumber } from '../rgbToNumber';

export interface GetSaturationMapOptions {
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
  /**
   * Specify which ROIs to colour.
   *
   * @default RoiKind.BW
   */
  roiKind?: RoiKind;
  /**
   * Hue of white ROIs
   *
   * @default 0
   */
  whiteHue?: number;
  /**
   * Hue of black ROIs
   *
   * @default 240
   */
  blackHue?: number;
}

/**
 * Return a map where ROIs are different shades of red (positive) or blue (negative) depending on the ROI index. It it the saturation of the HSV color model that is varied.
 *
 * @param options - Get temperature map options
 * @returns The colored map.
 */
export function getSaturationMap(
  options: GetSaturationMapOptions,
): Uint32Array {
  const {
    nbNegative,
    nbPositive,
    roiKind = RoiKind.BW,
    whiteHue = 0,
    blackHue = 240,
  } = options;

  let colorMap = new Uint32Array(maxNumberRois);

  const range = 255 - 63;
  const negativeStep = range / nbNegative;
  const positiveStep = range / nbPositive;

  // negative values
  let counter = 0;
  if (roiKind === RoiKind.BW || roiKind === RoiKind.BLACK) {
    for (let i = colorMapCenter - nbNegative; i < colorMapCenter; i++) {
      const hsv = [blackHue, 255 - counter++ * negativeStep, 255];
      colorMap[i] = rgbToNumber(hsvToRgb(hsv));
    }
  }
  // positive values
  counter = 0;
  if (roiKind === RoiKind.BW || roiKind === RoiKind.WHITE) {
    for (let i = colorMapCenter + 1; i < colorMapCenter + 1 + nbPositive; i++) {
      const hsv = [whiteHue, 255 - counter++ * positiveStep, 255];
      colorMap[i] = rgbToNumber(hsvToRgb(hsv));
    }
  }
  return colorMap;
}
