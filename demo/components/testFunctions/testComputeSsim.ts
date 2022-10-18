import { Image, ImageColorModel } from '../../../src';
import { computeSsim } from '../../../src/compare';

/**
 * Compute the structural similarity of the input image and the image blurred.
 *
 * @param image - Input image.
 * @returns The structural similarity matrix.
 */
export function testComputeSsim(image: Image): Image {
  // It is the gaussian blur that is slow.
  const blurry = image.gaussianBlur({ sigma: 5 });
  const ssim = computeSsim(image, blurry, { windowSize: 100 });

  console.log(ssim.ssimMap.data);
  let data = new Uint8Array(ssim.ssimMap.data);
  console.log({ data });
  for (let i = 0; i < data.length; i++) {
    data[i] = ssim.ssimMap.data[i] * 255;
  }

  console.log(data);
  const ssimMap = new Image(ssim.ssimMap.width, ssim.ssimMap.height, {
    colorModel: ImageColorModel.GREY,
    data,
  });
  return ssimMap;
}
