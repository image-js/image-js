import { Roi } from './Roi';
import { RoiMapManager } from './RoiMapManager';
import { computeRois } from './computeRois';

export enum RoiKind {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  BW = 'BW',
}

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
   * @default RoiKind.WHITE
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
    kind = 'WHITE',
  } = options;

  if (
    roiMapManager.blackRois.length === 0 &&
    roiMapManager.whiteRois.length === 0
  ) {
    computeRois(roiMapManager);
  }
  let rois;
  if (kind === RoiKind.BLACK) {
    rois = roiMapManager.blackRois;
  } else if (kind === RoiKind.WHITE) {
    rois = roiMapManager.whiteRois;
  } else if (kind === RoiKind.BW) {
    rois = [...roiMapManager.whiteRois, ...roiMapManager.blackRois];
  } else {
    throw new Error('getRois: unknown ROI kind');
  }

  return rois.filter(
    (roi) => roi.surface >= minSurface && roi.surface <= maxSurface,
  );
}
