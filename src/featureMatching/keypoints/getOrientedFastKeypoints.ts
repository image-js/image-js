import type { Image } from '../../Image.js';
import { getClockwiseAngle } from '../../maskAnalysis/utils/getAngle.js';
import { toDegrees } from '../../utils/geometry/angles.js';
import { getRadius } from '../../utils/getRadius.js';
import { checkBorderDistance } from '../utils/checkBorderDistance.js';

import type {
  FastKeypoint,
  GetFastKeypointsOptions,
} from './getFastKeypoints.js';
import { getFastKeypoints } from './getFastKeypoints.js';
import { getPatchIntensityCentroid } from './getPatchIntensityCentroid.js';

export interface GetOrientedFastKeypointsOptions
  extends GetFastKeypointsOptions {
  /**
   * Diameter of the circle used for compotuation of the intensity centroid.
   * @default `7`
   */
  centroidPatchDiameter?: number;
}

export interface OrientedFastKeypoint extends FastKeypoint {
  /**
   * Orientation of the keypoint defined as the angle in degrees between the x axis , the keypoints origin and the center of mass of the keypoint.
   */
  angle: number;
}

/**
 * Find the oriented FAST features in a GREY image.
 * How to add orientation to FAST is described in: http://www.gwylab.com/download/ORB_2012.pdf
 * Basically, the intensity centroid of the window around the corner is computed and the
 * orientation is given by the vector from the center to the intensity centroid.
 * @param image - The image to process.
 * @param options - Get oriented FAST keypoints options.
 * @returns The oriented FAST keypoints.
 */
export function getOrientedFastKeypoints(
  image: Image,
  options: GetOrientedFastKeypointsOptions = {},
): OrientedFastKeypoint[] {
  const { centroidPatchDiameter: windowSize = 7 } = options;

  const fastKeypoints = getFastKeypoints(image, options);

  const radius = getRadius(windowSize);

  // handle edge cases: remove keypoints too close to border
  const keypoints: FastKeypoint[] = [];
  for (const keypoint of fastKeypoints) {
    if (checkBorderDistance(image, keypoint.origin, radius)) {
      keypoints.push(keypoint);
    }
  }

  const orientedFastKeypoints: OrientedFastKeypoint[] = [];
  for (const keypoint of keypoints) {
    const centroid = getPatchIntensityCentroid(image, {
      center: keypoint.origin,
      radius,
    })[0];
    const angle = toDegrees(getClockwiseAngle({ column: 0, row: 0 }, centroid));
    orientedFastKeypoints.push({ ...keypoint, angle });
  }
  return orientedFastKeypoints;
}
