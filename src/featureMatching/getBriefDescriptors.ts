import { Image } from '../Image';
import { GaussianBlurOptions } from '../filters';

import { OrientedFastKeypoint } from './getOrientedFastKeypoints';

export interface GetBriefDescriptorsOptions {
  /**
   * Options to smooth the image patch before comparing pairs of points.
   */
  smoothingOptions: GaussianBlurOptions;
  patchSize: number;
  descriptorLength: 128 | 256 | 512;
}

export type BriefDescriptor = Uint8Array;

/**
 *
 * @param image
 * @param keypoints
 * @param options
 */
export function getBriefDescriptors(
  image: Image,
  keypoints: OrientedFastKeypoint[],
  options: GetBriefDescriptorsOptions,
): BriefDescriptor[] {
  const {
    patchSize = 31,
    descriptorLength = 256,
    smoothingOptions = { sigma: Math.sqrt(2), size: 9 },
  } = options;

  if (!(patchSize % 2)) {
    throw new Error('getBriefDescriptors: patchSize should be an odd integer');
  }

  const smoothed = image.gaussianBlur(smoothingOptions);

  for (let keypoint of keypoints) {
    let rotatedImage = image.rotate(keypoint.angle, {
      origin: keypoint.origin,
    });
  }
}
