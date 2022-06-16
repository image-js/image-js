import { colord, RgbColor } from 'colord';
import MLR from 'ml-regression-multivariate-linear';

import { IJS } from '../IJS';

import { QpCard } from './qpCardData';

function getCorrectionVariables(rgb: RgbColor): number[] {
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
type RgbChannels = 'r' | 'g' | 'b';

interface RgbReferenceData {
  r: number[][];
  g: number[][];
  b: number[][];
}

function formatReferenceForMLR(qpCard: QpCard): RgbReferenceData {
  const referenceData: RgbReferenceData = { r: [], g: [], b: [] };

  for (let square of qpCard) {
    const color = colord(square.lab).toRgb();
    referenceData.r.push([color.r]);
    referenceData.g.push([color.g]);
    referenceData.b.push([color.b]);
  }

  return referenceData;
}

function getChannelCoefficients(
  imageColors: number[],
  referenceColors: number[],
): number[];

export function correctColor(image: IJS, coefficients): IJS;
