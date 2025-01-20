import type { Image } from '../../Image.js';
import type { GaussianBlurSigmaOptions } from '../../filters/index.js';
import type { GetGaussianPointsOptions } from '../../utils/utils.types.js';
import checkProcessable from '../../utils/validators/checkProcessable.js';
import type { OrientedFastKeypoint } from '../keypoints/getOrientedFastKeypoints.js';
import { compareIntensity } from '../utils/compareIntensity.js';
import { getGaussianPoints } from '../utils/getGaussianPoints.js';

import { getKeypointPatch } from './utils/getKeypointPatch.js';

export interface GetBriefDescriptorsOptions {
  /**
   * Options to smooth the image patch before comparing pairs of points.
   * Default values are the ones recommended in the original BRIEF article.
   * DOI: https://doi.org/10.1007/978-3-642-15561-1_56.
   */
  smoothingOptions?: GaussianBlurSigmaOptions;
  /**
   * Options to modify the gaussian distribution used to generate the points to compare.
   */
  pointsDistributionOptions?: Omit<GetGaussianPointsOptions, 'nbPoints'>;
  /**
   * Size of the patch around the keypoint used to compute the descriptor.
   * @default `31`
   */
  patchSize?: number;
  /**
   * Number of bits of the final descriptor. Typically a power or 2: 128, 256, 512.
   * @default `256`
   */
  descriptorLength?: number;
}

export type BriefDescriptor = Uint8Array;
export interface Brief {
  keypoints: OrientedFastKeypoint[];
  descriptors: BriefDescriptor[];
}

/**
 * Generate the rBRIEF descriptors for the desired keypoints of an image.
 * The rBRIEF descriptors are presented in these articles:
 * - ORB article: DOI: 10.1109/ICCV.2011.6126544
 * - rBRIEF article: DOI: 10.1007/978-3-642-15561-1_56.
 * @param image - Source image of the keypoints.
 * @param keypoints - Keypoints for which the descriptors are wanted.
 * @param options - Get rotated BRIEF descriptors options.
 * @returns The descriptors for the given keypoints.
 */
export function getBriefDescriptors(
  image: Image,
  keypoints: OrientedFastKeypoint[],
  options: GetBriefDescriptorsOptions = {},
): Brief {
  const {
    patchSize = 31,
    descriptorLength = 256,
    smoothingOptions = {
      sigma: Math.sqrt(2),
      size: Math.min(image.height, image.width, 9),
    },
    pointsDistributionOptions,
  } = options;

  checkProcessable(image, {
    alpha: false,
    colorModel: 'GREY',
  });

  if (!(patchSize % 2)) {
    throw new TypeError('patchSize must be an odd integer');
  }

  if (Math.min(image.width, image.height) < patchSize) {
    throw new RangeError(`image is too small for patchSize = ${patchSize}`);
  }

  const gaussianPoints = getGaussianPoints(patchSize, patchSize, {
    ...pointsDistributionOptions,
    nbPoints: descriptorLength * 2,
  });

  const smoothed = image.gaussianBlur(smoothingOptions);

  const descriptors: Uint8Array[] = [];
  const filteredKeypoints: OrientedFastKeypoint[] = [];

  for (const keypoint of keypoints) {
    let patch: Image;
    try {
      patch = getKeypointPatch(smoothed, keypoint, { patchSize });
    } catch {
      continue;
    }
    if (patch === null) continue;

    const descriptor = new Uint8Array(descriptorLength);
    for (let i = 0; i < descriptorLength; i++) {
      const p1 = gaussianPoints[i];
      const p2 = gaussianPoints[i + descriptorLength];
      descriptor[i] = Number(compareIntensity(patch, p1, p2));
    }
    descriptors.push(descriptor);
    filteredKeypoints.push(keypoint);
  }

  return { keypoints: filteredKeypoints, descriptors };
}
