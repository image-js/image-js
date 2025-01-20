import type { Brief } from '../getBriefDescriptors.js';

export interface SliceBriefOptions {
  /**
   * Start index.
   * @default `0`
   */
  start?: number;
  /**
   * End index.
   * @default `brief.keypoints.length`
   */
  end?: number;
}

/**
 * Slice a Brief to keep only the desired keypoints and the corresponding descriptors.
 * @param brief - Brief to process.
 * @param options - Slice Brief options.
 * @returns The desired keypoints + descriptors.
 */
export function sliceBrief(
  brief: Brief,
  options: SliceBriefOptions = {},
): Brief {
  const { start = 0, end = brief.keypoints.length } = options;
  if (start < 0 || end > brief.keypoints.length) {
    throw new RangeError('start or end are out of range');
  }
  return {
    keypoints: brief.keypoints.slice(start, end),
    descriptors: brief.descriptors.slice(start, end),
  };
}
