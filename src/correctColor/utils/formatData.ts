import type { RgbColor } from 'colord';
import { colord, extend } from 'colord';
import labPlugin from 'colord/plugins/lab';

import { getRegressionVariables } from '../correctColor.js';

import type { ColorCard } from './referenceColorCard.ts';

// We can't use ts-expect-error because it's not an error when compiling for CJS.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Module exports are not correctly typed.
extend([labPlugin]);

/**
 * Reference QP card data formatted to be easier to use for the multivariate linear regression.
 */
export interface ReferenceDataForMlr {
  r: number[][];
  g: number[][];
  b: number[][];
}

/**
 * Convert RGB array colors to RGB object colors. Used to get the properly formatted measured colors.
 * @param arrayColors - Array of RGB colors as 3 elements array.
 * @returns Array of RGB objects.
 */
export function getMeasuredColors(arrayColors: number[][]): RgbColor[] {
  const objectColors = [];
  for (const color of arrayColors) {
    objectColors.push({ r: color[0], g: color[1], b: color[2] });
  }
  return objectColors;
}

/**
 * Extract the colors from a QP card and convert them to RGB.
 * @param qpCard - QP card containing the color reference values in L*a*b*.
 * @returns Array of reference RGB colors.
 */
export function getReferenceColors(qpCard: ColorCard): RgbColor[] {
  const result: RgbColor[] = [];
  for (const square of qpCard) {
    result.push(colord(square.lab).toRgb());
  }

  return result;
}

/**
 * Format and normalize data from a QP card to use as a reference in a multivariate linear regression.
 * @param referenceColors - Array of RGB colors used as a reference.
 * @param maxValue - Maximal acceptable value for the image to process.
 * @returns The formatted data.
 */
export function formatReferenceForMlr(
  referenceColors: RgbColor[],
  maxValue: number,
): ReferenceDataForMlr {
  const referenceData: ReferenceDataForMlr = { r: [], g: [], b: [] };

  for (const color of referenceColors) {
    referenceData.r.push([color.r / maxValue]);
    referenceData.g.push([color.g / maxValue]);
    referenceData.b.push([color.b / maxValue]);
  }

  return referenceData;
}

/**
 * Compute the variables for the multivariate linear regression based on the the input colors. Values are normalized between 0 and 1.
 * @param inputColors - The input colors as an array of rgb objects.
 * @param maxValue - Maximal acceptable value for the image to process.
 * @returns The formatted input data for the regression.
 */
export function formatInputForMlr(
  inputColors: RgbColor[],
  maxValue: number,
): number[][] {
  const inputData = [];
  for (const color of inputColors) {
    inputData.push(getRegressionVariables(color.r, color.g, color.b, maxValue));
  }
  return inputData;
}
