import { Image } from '../../src';
import { getBestKeypointsInRadius } from '../../src/featureMatching';
import {
  Brief,
  getBriefDescriptors,
} from '../../src/featureMatching/descriptors/getBriefDescriptors';
import { getOrientedFastKeypoints } from '../../src/featureMatching/keypoints/getOrientedFastKeypoints';

export interface GetBriefOptions {
  windowSize?: number;
  bestKptRadius?: number;
  minScore?: number;
}

/**
 * Get the keypoints and corresponding descriptors for an image.
 *
 * @param image
 * @param imagePath
 * @param options
 * @returns The Brief.
 */
export function getBrief(image: Image, options: GetBriefOptions = {}): Brief {
  const { windowSize = 15, bestKptRadius = 10, minScore } = options;
  const allSourceKeypoints = getOrientedFastKeypoints(image, {
    windowSize,
  });
  let sourceKeypoints = getBestKeypointsInRadius(
    allSourceKeypoints,
    bestKptRadius,
  );

  const brief = getBriefDescriptors(image, sourceKeypoints);
  if (minScore) {
    for (let i = 0; i < brief.keypoints.length; i++) {
      if (brief.keypoints[i].score < minScore)
        return {
          keypoints: brief.keypoints.slice(0, i - 1),
          descriptors: brief.descriptors.slice(0, i - 1),
        };
    }
  }
  return brief;
}
