import { Image } from '../Image';
import { GaussianBlurOptions } from '../filters';
import { Point } from '../geometry';
import { InterpolationType } from '../utils/interpolatePixel';

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
    const currentRow = keypoint.origin.row;
    const currentColumn = keypoint.origin.column;
    // crop smallest square surrounding the tilted patch of the keypoint
    const cropWidth =
      patchSize * (Math.cos(keypoint.angle) + Math.sin(keypoint.angle));
    const cropped = extractSquareImage(smoothed, keypoint.origin, cropWidth);

    const rotated = cropped.rotate(keypoint.angle, {
      center: [currentColumn, currentRow],
      interpolationType: InterpolationType.NEAREST,
    });
    const patch = extractSquareImage(
      rotated,
      // I need this function a lot here -> refactor it??
      image.getCoordinates('CENTER'),
      patchSize,
    );
  }
}
/**
 * Crop the source image to given dimensions around the origin.
 *
 * @param image - Source image.
 * @param origin - Center point for the crop.
 * @param patchSize - Size of the returned image.
 * @returns The square image around the origin extracted from the source image.
 */
function extractSquareImage(
  image: Image,
  origin: Point,
  patchSize: number,
): Image {
  const cropOffset = (patchSize - 1) / 2;
  const cropOrigin = {
    column: origin.column - cropOffset,
    row: origin.row - cropOffset,
  };
  return image.crop({
    origin: cropOrigin,
    width: patchSize,
    height: patchSize,
  });
}
