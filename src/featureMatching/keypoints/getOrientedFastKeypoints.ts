import { Image } from '../../Image';
import { getAngle } from '../../maskAnalysis/utils/getAngle';
import { toDegrees } from '../../utils/geometry/angles';
import { getRadius } from '../../utils/getRadius';
import { checkBorderDistance } from '../utils/checkBorderDistance';

import {
  FastKeypoint,
  getFastKeypoints,
  GetFastKeypointsOptions,
} from './getFastKeypoints';
import { getIntensityCentroid } from './getIntensityCentroid';

export interface GetOrientedFastKeypointsOptions
  extends GetFastKeypointsOptions {
  /**
   * Window size for the intensity centroid computation.
   *
   * @default 7
   */
  windowSize?: number;
}

export interface OrientedFastKeypoint extends FastKeypoint {
  /**
   * Clockwise angle of the keypoint in degrees with regard to a horizontal line.
   */
  angle: number;
}

/**
 * Find the oriented FAST features in a GREY image.
 * How to add orientation to FAST is described in: http://www.gwylab.com/download/ORB_2012.pdf
 * Basically, the intensity centroid of the window around the corner is computed and the
 * orientation is given by the vector from the center to the intensity centroid.
 *
 * @param image - The image to process.
 * @param options - Get oriented FAST keypoints options.
 * @returns The oriented FAST keypoints.
 */
export function getOrientedFastKeypoints(
  image: Image,
  options: GetOrientedFastKeypointsOptions = {},
): OrientedFastKeypoint[] {
  const { windowSize = 7 } = options;

  const fastKeypoints = getFastKeypoints(image, options);

  const borderDistance = getRadius(windowSize);

  // handle edge cases: remove keypoints too close to border
  for (let i = 0; i < fastKeypoints.length; i++) {
    if (!checkBorderDistance(image, fastKeypoints[i].origin, borderDistance)) {
      fastKeypoints.splice(i, 1);
    }
  }

  let orientedFastKeypoints: OrientedFastKeypoint[] = [];
  for (let keypoint of fastKeypoints) {
    const cropOrigin = {
      row: keypoint.origin.row - borderDistance,
      column: keypoint.origin.column - borderDistance,
    };
    const window = image.crop({
      origin: cropOrigin,
      width: windowSize,
      height: windowSize,
    });

    const centroid = getIntensityCentroid(window)[0];
    const angle = toDegrees(getAngle({ column: 0, row: 0 }, centroid));
    orientedFastKeypoints.push({ ...keypoint, angle });
  }
  return orientedFastKeypoints;
}
