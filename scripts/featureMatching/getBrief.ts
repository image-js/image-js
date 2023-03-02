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
  const { windowSize = 15, bestKptRadius = 10 } = options;

  const allSourceKeypoints = getOrientedFastKeypoints(image, {
    windowSize,
  });
  const sourceKeypoints = getBestKeypointsInRadius(
    allSourceKeypoints,
    bestKptRadius,
  );
  return getBriefDescriptors(image, sourceKeypoints);
}
