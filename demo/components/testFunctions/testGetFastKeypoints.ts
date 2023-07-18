import { Image } from '../../../src';
import { getFastKeypoints } from '../../../src/featureMatching/keypoints/getFastKeypoints';

/**
 * Find the FAST keypoints in the video.
 *
 * @param image - Input image.
 * @returns The image with the fast keypoints.
 */
export function testGetFastKeypoints(image: Image): Image {
  const grey = image.convertColor('GREY');
  const blurred = grey.gaussianBlur({ size: 7, sigma: 4 });
  const keypoints = getFastKeypoints(blurred);

  for (const keypoint of keypoints) {
    image.drawCircle(keypoint.origin, 5, {
      color: [255, 0, 0, 255],
      out: image,
    });
  }
  return image;
}
