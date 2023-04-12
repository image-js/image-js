import { RoisColorMode } from '../colorRois';
import { RoiKind } from '../getRois';

import { getBinaryMap } from './colorMaps/getBinaryMap';
import { getRainbowMap } from './colorMaps/getRainbowMap';
import { getSaturationMap } from './colorMaps/getSaturationMap';

export interface GetColorMapOptions {
  /**
   * Number of black ROIs
   */
  nbNegative: number;
  /**
   * Number of white ID ROIs
   */
  nbPositive: number;
  /**
   * Specify the mode: what colors to use in the color map
   *
   * @default 'BINARY'
   */
  mode?: RoisColorMode;

  /**
   * Specify which ROIs to colour.
   *
   * @default 'bw'
   */
  roiKind?: RoiKind;
}

/**
 * Return a map of 32 bits integers corresponding to the colors of each ROI.
 *
 * @param options - Get color map options.
 * @returns The color map.
 */
export function getColorMap(options: GetColorMapOptions): Uint32Array {
  const { mode = 'BINARY' } = options;
  options = { roiKind: 'bw', ...options };

  switch (mode) {
    case 'BINARY':
      return getBinaryMap(options);
    case 'saturation':
      return getSaturationMap(options);
    case 'rainbow':
      return getRainbowMap(options);
    default:
      throw new Error('getColorMap: unknown color mode');
  }
}
