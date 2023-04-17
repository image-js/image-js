import { Roi } from './Roi';
import { RoiMapManager } from './RoiMapManager';
import { computeRois } from './computeRois';

export const RoiKind = {
  BLACK: 'black',
  WHITE: 'white',
  BW: 'bw',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RoiKind = (typeof RoiKind)[keyof typeof RoiKind];

export interface GetRoisOptions {
  /**
   * Minimal surface of the ROIs to keep
   *
   * @default 0
   */
  minSurface?: number;
  /**
   * Maximal surface of the ROIs to keep
   *
   * @default Number.MAX_SAFE_INTEGER
   */
  maxSurface?: number;
  /**
   * Kind of ROIs to keep
   *
   * @default 'white'
   */
  kind?: RoiKind;
}

/**
 * Return an array of ROIs matching the options.
 *
 * @param roiMapManager - The ROI map manager containing the ROIs
 * @param options - Get ROIs options.
 * @returns The array of ROIs.
 */
export function getRois(
  roiMapManager: RoiMapManager,
  options: GetRoisOptions = {},
): Roi[] {
  const {
    minSurface = 0,
    maxSurface = Number.MAX_SAFE_INTEGER,
    kind = 'white',
  } = options;

  if (
    roiMapManager.blackRois.length === 0 &&
    roiMapManager.whiteRois.length === 0
  ) {
    computeRois(roiMapManager);
  }
  let rois;
  switch (kind) {
    case 'black': {
      rois = roiMapManager.blackRois;
      break;
    }
    case 'white': {
      rois = roiMapManager.whiteRois;
      break;
    }
    case 'bw': {
      rois = [...roiMapManager.whiteRois, ...roiMapManager.blackRois];
      break;
    }
    default: {
      throw new Error(`unknown ROI kind: ${kind}`);
    }
  }

  return rois.filter(
    (roi) => roi.surface >= minSurface && roi.surface <= maxSurface,
  );
}
