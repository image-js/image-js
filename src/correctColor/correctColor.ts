import { RgbColor } from 'colord';
import MLR from 'ml-regression-multivariate-linear';

import { IJS } from '../IJS';
import { getClamp } from '../utils/clamp';

import {
  formatInputForMlr,
  formatReferenceForMlr,
} from './__tests__/testUtil/formatData';

/**
 * Correct the colors in an image using the reference colors.
 *
 * @param image - Image to process.
 * @param measuredColors - Colors from the image, which will be compared to the reference.
 * @param referenceColors - Reference colors.
 * @returns Image with the colors corrected.
 */
export function correctColor(
  image: IJS,
  measuredColors: RgbColor[],
  referenceColors: RgbColor[],
): IJS {
  const inputData = formatInputForMlr(measuredColors);
  const referenceData = formatReferenceForMlr(referenceColors);

  const mlrRed = new MLR(inputData, referenceData.r);
  const mlrGreen = new MLR(inputData, referenceData.g);
  const mlrBlue = new MLR(inputData, referenceData.b);

  const result = IJS.createFrom(image);

  for (let i = 0; i < image.size; i++) {
    const pixel = image.getPixelByIndex(i);
    const variables = getRegressionVariables(pixel[0], pixel[1], pixel[2]);

    const clamp = getClamp(image);

    const newPixel = [0, 0, 0];
    newPixel[0] = clamp(mlrRed.predict(variables)[0]);
    newPixel[1] = clamp(mlrGreen.predict(variables)[0]);
    newPixel[2] = clamp(mlrBlue.predict(variables)[0]);

    result.setPixelByIndex(i, newPixel);
  }

  return result;
}

/**
 * Compute the third order variables for the regression from an RGB color.
 *
 * @param r - Red component.
 * @param g - Green component.
 * @param b - Blue component.
 * @returns The variables for the multivariate linear regression.
 */
export function getRegressionVariables(
  r: number,
  g: number,
  b: number,
): number[] {
  return [
    r,
    g,
    b,
    r ** 2,
    g ** 2,
    b ** 2,
    r ** 3,
    g ** 3,
    b ** 3,
    r * g,
    r * b,
    b * g,
  ];
}
