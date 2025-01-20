import type { Image } from '../Image.js';

export type ClampFunction = (value: number) => number;

export interface GetGaussianPointsOptions {
  /**
   * Number of points to generate.
   * @default `1024`
   */
  nbPoints?: number;
  /**
   * Seed of the gaussian distribution for the x coordinates.
   * @default `0`
   */
  xSeed?: number;
  /**
   * Seed of the gaussian distribution for the y coordinates.
   * @default `1`
   */
  ySeed?: number;
  /**
   * The standard deviation for the gaussian distribution.
   */
  sigma?: number;
}

export type BorderInterpolationFunction = (
  column: number,
  row: number,
  channel: number,
  image: Image,
) => number;
