import { ImageCoordinates, Image } from '../../../Image';
import { getRadius } from '../../../utils/getRadius';
import { InterpolationType } from '../../../utils/interpolatePixel';
import { OrientedFastKeypoint } from '../../keypoints/getOrientedFastKeypoints';
import { checkBorderDistance } from '../../utils/checkBorderDistance';
import { extractSquareImage } from '../../utils/extractSquareImage';

export interface GetKeypointPatchOptions {
  /**
   * Size of the patch around the keypoint used to compute the descriptor.
   *
   * @default 31
   */
  patchSize?: number;
}

/**
 * Get the patch around the keypoint with given size.
 *
 * @param image - Image from which to extract the patch.
 * @param keypoint - Keypoint around which to extract the patch.
 * @param options - Get keypoint patch options.
 * @returns The patch around the keypoint.
 */
export function getKeypointPatch(
  image: Image,
  keypoint: OrientedFastKeypoint,
  options: GetKeypointPatchOptions = {},
): Image {
  const { patchSize = 31 } = options;
  // crop smallest square surrounding the tilted patch of the keypoint
  // we have to handle the fact that this square can have even dimensions

  const radAngle = (keypoint.angle * Math.PI) / 180;

  const rawWidth = Math.floor(
    patchSize * (Math.abs(Math.cos(radAngle)) + Math.abs(Math.sin(radAngle))),
  );

  const cropWidth = rawWidth % 2 ? rawWidth : rawWidth + 1;

  // we are not allowing keypoints that are too close to the border of the image
  let borderDistance = getRadius(cropWidth);

  if (!checkBorderDistance(image, keypoint.origin, borderDistance)) {
    throw new Error('keypoint is too close to border for given patch size');
  }

  const cropped = extractSquareImage(image, keypoint.origin, cropWidth);

  const rotated = cropped.transformRotate(-keypoint.angle, {
    center: ImageCoordinates.CENTER,
    interpolationType: InterpolationType.NEAREST,
  });

  const cropOrigin = rotated.getCoordinates(ImageCoordinates.CENTER);
  const result = extractSquareImage(rotated, cropOrigin, patchSize);

  return result;
}
