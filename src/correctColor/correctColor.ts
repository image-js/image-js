import { colord, extend, RgbColor } from 'colord';
import labPlugin from 'colord/plugins/lab';
import MLR from 'ml-regression-multivariate-linear';

import { IJS } from '../IJS';

import { QpCard } from './qpCardData';

extend([labPlugin]);

/**
 * Compute the third order variables for the regression from an RGB color.
 *
 * @param rgb - The rgb color.
 * @returns The variables for the multivariate linear regression.
 */
function getRegressionVariables(rgb: RgbColor): number[] {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

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
    inputData.push(getRegressionVariables(color));
  }
  return inputData;
}

/**
 * @param inputData
 * @param referenceData
 */
export function getChannelCoefficients(
  inputData: number[][],
  referenceData: number[][],
): number[] {
  const mlr = new MLR(inputData, referenceData);

  return mlr.tStats;
}

export function correctColor(
  image: IJS,
  inputColors,
  referenceQpCard: QpCard,
): IJS;
