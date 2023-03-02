import { option } from 'yargs';
import { Brief } from '../../src/featureMatching';

export interface SliceBriefOptions {
  /**
   * Start index.
   *
   * @default 0
   */
  start?: number;
  /**
   * End index.
   *
   * @default brief.keypoints.length
   */
  end?: number;
}

export function sliceBrief(
  brief: Brief,
  options: SliceBriefOptions = {},
): Brief {
  const { start = 0, end = brief.keypoints.length } = options;
  if (start < 0 || end > brief.keypoints.length - 1) {
    throw new Error('start or end are out of range');
  }
  return {
    keypoints: brief.keypoints.slice(start, end),
    descriptors: brief.descriptors.slice(start, end),
  };
}
