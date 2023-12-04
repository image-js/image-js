export interface GetColorsOptions {
  /**
   * Number of shades to generate.
   * @default `6`
   */
  nbShades?: number;
  /**
   * Factor between 0 and 1 by which to multiply the maximal value of the color to obtain the minimum value.
   * @default `0.2`
   */
  minValueFactor?: number;
}

export interface GetHarrisScoreOptions {
  /**
   * Size of the window to compute the Harris score.
   * Should be an odd number so that the window can be centered on the corner.
   * @default `7`
   */
  windowSize?: number;
  /**
   * Constant for the score computation. Should be between 0.04 and 0.06 (empirical values). This consant is commonly called k.
   * @default `0.04`
   */
  harrisConstant?: number;
}
