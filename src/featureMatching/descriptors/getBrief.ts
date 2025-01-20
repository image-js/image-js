import type { Image } from '../../Image.js';
import { getBestKeypointsInRadius } from '../keypoints/getBestKeypointsInRadius.js';
import { getOrientedFastKeypoints } from '../keypoints/getOrientedFastKeypoints.js';

import type { Brief } from './getBriefDescriptors.js';
import { getBriefDescriptors } from './getBriefDescriptors.js';

export interface GetBriefOptions {
  centroidPatchDiameter?: number;
  bestKptRadius?: number;
  minScore?: number;
}

/**
 * Get the keypoints and corresponding descriptors for an image.
 * @param image - Image to process.
 * @param options - Get brief options.
 * @returns The Brief (keypoints and corresponding descriptors).
 */
export function getBrief(image: Image, options: GetBriefOptions = {}): Brief {
  const { centroidPatchDiameter = 15, bestKptRadius = 10, minScore } = options;
  const allSourceKeypoints = getOrientedFastKeypoints(image, {
    centroidPatchDiameter,
  });
  const sourceKeypoints = getBestKeypointsInRadius(
    allSourceKeypoints,
    bestKptRadius,
  );

  const brief = getBriefDescriptors(image, sourceKeypoints);
  if (minScore) {
    for (let i = 0; i < brief.keypoints.length; i++) {
      if (brief.keypoints[i].score < minScore) {
        return {
          keypoints: brief.keypoints.slice(0, i - 1),
          descriptors: brief.descriptors.slice(0, i - 1),
        };
      }
    }
  }
  return brief;
}
