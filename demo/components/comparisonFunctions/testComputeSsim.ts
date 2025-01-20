import { computeSsim } from '../../../src/compare/computeSsim.js';
import { Image } from '../../../src/index.js';

/**
 * Compute the structural similarity of the input image and the image blurred.
 * @param image - Input image.
 * @param snapshot
 * @returns The structural similarity matrix.
 */
export function testComputeSsim(image: Image, snapshot: Image | null): Image {
  if (snapshot === null) return image;

  const ssim = computeSsim(image, snapshot, {
    windowSize: 100,
    algorithm: 'fast',
  });
  console.log(ssim.ssimMap);
  const data = new Uint8Array(ssim.ssimMap.data);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.abs(ssim.ssimMap.data[i]) * 255;
  }

  const ssimMap = new Image(ssim.ssimMap.width, ssim.ssimMap.height, {
    colorModel: 'GREY',
    data,
  });

  // console.log(image.width, image.height);
  // console.log(ssimMap.width, ssimMap.height);

  return ssimMap;
}
