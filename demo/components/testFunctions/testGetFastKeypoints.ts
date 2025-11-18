import type { Image } from '../../image_js.ts';
import { getFastKeypoints } from '../../image_js.ts';

/**
 * Find the FAST keypoints in the video.
 * @param image - Input image.
 * @returns The image with the fast keypoints.
 */
export function testGetFastKeypoints(image: Image): Image {
  const grey = image.convertColor('GREY');
  const blurred = grey.gaussianBlur({ size: 7, sigma: 4 });
  const keypoints = getFastKeypoints(blurred);

  for (const keypoint of keypoints) {
    image.drawCircle(keypoint.origin, 5, {
      strokeColor: [255, 0, 0, 255],
      out: image,
    });
  }
  return image;
}
