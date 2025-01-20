import { Image } from '../Image.js';

import type { RoiMapManager } from './RoiMapManager.js';
import type { RoiKind } from './getRois.js';
import { getColorMap } from './utils/getColorMap.js';

export const RoisColorMode = {
  /**
   * Only two acceptable values: red or green.
   */
  BINARY: 'binary',
  /**
   * Palette of reds and blues.
   */
  SATURATION: 'saturation',
  /**
   * All possible hues (gradient of colors).
   */
  RAINBOW: 'rainbow',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RoisColorMode = (typeof RoisColorMode)[keyof typeof RoisColorMode];

export interface ColorRoisOptions {
  /**
   * Define the color mode to use to color the ROIs.
   * @default `'binary'`
   */
  mode?: RoisColorMode;
  /**
   * Specify which ROIs to color.
   * @default `'bw'`
   */
  roiKind?: RoiKind;
}

/**
 * Generate an image with all the ROIs of various colors.
 * @param roiMapManager - The ROI map manager.
 * @param options - Color ROIs options.
 * @returns The colored image.
 */
export function colorRois(
  roiMapManager: RoiMapManager,
  options: ColorRoisOptions = {},
): Image {
  const { roiKind = 'bw', mode = 'binary' } = options;
  const map = roiMapManager.getMap();

  const image = new Image(map.width, map.height, {
    colorModel: 'RGBA',
  });

  const colorMap = getColorMap({
    roiKind,
    mode,
    nbNegative: map.nbNegative,
    nbPositive: map.nbPositive,
  });

  const data32 = new Uint32Array(image.getRawImage().data.buffer);

  for (let index = 0; index < image.size; index++) {
    data32[index] = colorMap[map.data[index] + map.nbNegative];
  }

  return image;
}
