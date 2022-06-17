import { colord, extend, RgbColor } from 'colord';
import labPlugin from 'colord/plugins/lab';
import MLR from 'ml-regression-multivariate-linear';

import { IJS } from '../IJS';
import { getClamp } from '../utils/clamp';

import { QpCard } from './referenceQpCard';

extend([labPlugin]);

/**
 * Compute the third order variables for the regression from an RGB color.
 *
 * @param r - Red component.
 * @param g - Green component.
 * @param b - Blue component.
 * @returns The variables for the multivariate linear regression.
 */
function getRegressionVariables(r: number, g: number, b: number): number[] {
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

function normalizeRgb(color: RgbColor, image: IJS): RgbColor {
  return {
    r: color.r / image.maxValue,
    g: color.g / image.maxValue,
    b: color.b / image.maxValue,
  };
}

/**
 * Reference QP card data formatted to be easier to use for the multivariate linear regression.
 */
interface ReferenceDataForMlr {
  r: number[][];
  g: number[][];
  b: number[][];
}

/**
 * Format data from a QP card to use as a reference in a multivariate linear regression.
 *
 * @param qpCard - Reference QP card from which to get the data to process
 * @returns The formatted data.
 */
export function formatReferenceForMlr(qpCard: QpCard): ReferenceDataForMlr {
  const referenceData: ReferenceDataForMlr = { r: [], g: [], b: [] };

  for (let square of qpCard) {
    const color = colord(square.lab).toRgb();
    referenceData.r.push([color.r]);
    referenceData.g.push([color.g]);
    referenceData.b.push([color.b]);
  }

  return referenceData;
}

/**
 * Compute the variables for the multivariate linear regression based on the the input colors.
 *
 * @param inputColors - The input colors as an array of rgb objects.
 * @returns The formatted input data for the regression.
 */
function formatInputForMlr(inputColors: RgbColor[]): number[][] {
  const inputData = [];
  for (let color of inputColors) {
    inputData.push(getRegressionVariables(color.r, color.g, color.b));
  }
  return inputData;
}

/**
 * @param arrayColors
 */
export function arraysToRgbColors(arrayColors: number[][]): RgbColor[] {
  const objectColors = [];
  for (let color of arrayColors) {
    objectColors.push({ r: color[0], g: color[1], b: color[2] });
  }
  return objectColors;
}

/**
 * Correct the colors in an image using the reference colors.
 *
 * @param image - Image to process.
 * @param inputColors - Colors from the image which will be compared to the reference.
 * @param referenceQpCard - QP card containing reference colors.
 * @returns Image with the colors corrected.
 */
export function correctColor(
  image: IJS,
  inputColors: RgbColor[],
  referenceQpCard: QpCard,
): IJS {
  const inputData = formatInputForMlr(inputColors);
  const referenceData = formatReferenceForMlr(referenceQpCard);

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
