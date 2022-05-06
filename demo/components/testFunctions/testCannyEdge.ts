import { convertBinaryToGrey, IJS, ImageColorModel } from '../../../src';

/**
 * Detect the edges in the image using Canny edge detection
 *
 * @param image - Input image.
 * @returns The treated image.
 */
export function testCannyEdge(image: IJS): IJS {
  let result = image.convertColor(ImageColorModel.GREY);
  result = result.gaussianBlur({ size: 7, sigma: 4 });
  const edges = result.cannyEdgeDetector({
    lowThreshold: 0.08,
    highThreshold: 0.1,
  });
  convertBinaryToGrey(edges, result);
  return result;
}

/**
 * Detect the edges in the image using Canny edge detection and overlay the edges on the original image.
 *
 * @param image - Input image.
 * @returns The treated image.
 */
export function testCannyEdgeOverlay(image: IJS): IJS {
  let result = image.convertColor(ImageColorModel.GREY);
  const edges = result.cannyEdgeDetector({
    lowThreshold: 0.08,
    highThreshold: 0.1,
  });
  let greyEdges = edges.convertColor(ImageColorModel.GREY);
  greyEdges = greyEdges.convertColor(ImageColorModel.RGBA);
  greyEdges = greyEdges.invert();
  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      if (greyEdges.getValue(row, column, 0) === greyEdges.maxValue) {
        greyEdges.setValue(row, column, 3, 0);
      }
    }
  }
  result = greyEdges.copyTo(image);
  return result;
}
