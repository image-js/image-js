import { match } from 'ts-pattern';

import type { RoisColorMode } from '../colorRois.js';
import type { RoiKind } from '../getRois.js';

import { getBinaryMap } from './colorMaps/getBinaryMap.js';
import { getRainbowMap } from './colorMaps/getRainbowMap.js';
import { getSaturationMap } from './colorMaps/getSaturationMap.js';

export interface GetColorMapOptions {
  /**
   * Number of black ROIs.
   */
  nbNegative: number;
  /**
   * Number of white ID ROIs.
   */
  nbPositive: number;
  /**
   * Specify the mode: what colors to use in the color map.
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
 * Return a map of 32 bits integers corresponding to the colors of each ROI.
 * @param options - Get color map options.
 * @returns The color map.
 */
export function getColorMap(options: GetColorMapOptions): Uint32Array {
  const { mode = 'binary' } = options;
  options = { roiKind: 'bw', ...options };

  return match(mode)
    .with('binary', () => getBinaryMap(options))
    .with('saturation', () => getSaturationMap(options))
    .with('rainbow', () => getRainbowMap(options))
    .exhaustive();
}
