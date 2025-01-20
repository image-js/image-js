import { PolynomialRegression2D } from 'ml-regression-polynomial-2d';

import type { Image } from '../Image.js';
import type { Point } from '../geometry/index.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

export interface CorrectBackgroundOptions {
  /**
   * @param background - Points that are considered the background of an image.
   */
  background: Point[];
  /**
   * @param order - Order of regression function.
   * @default `2`
   */
  order?: number;
  /**
   * Checks if the image background is light or dark. If the background is
   *  light, the output image will be inverted.
   * @default `'light'`
   */
  backgroundKind?: 'dark' | 'light';
}

/**
 * Corrects background from an image for baseline correction.
 * @param image - Image to subtract background from.
 * @param options - CorrectBackgroundOptions.
 * @returns Image with corrected baseline.
 */
export function correctBackground(
  image: Image,
  options: CorrectBackgroundOptions,
) {
  const { background, order = 2, backgroundKind = 'light' } = options;
  checkProcessable(image, { colorModel: ['GREY'] });
  const columns = new Array<number>();
  const rows = new Array<number>();
  const values = new Array<number>();
  for (const point of background) {
    columns.push(point.column);
    rows.push(point.row);
    values.push(image.getValueByPoint(point, 0));
  }

  const model = new PolynomialRegression2D({ x: columns, y: rows }, values, {
    order,
  });
  const points: { x: number[]; y: number[] } = { x: [], y: [] };

  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      points.x.push(column);
      points.y.push(row);
    }
  }
  const Y = model.predict(points);
  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      const value = Math.abs(
        image.getValue(column, row, 0) - Y[row * image.width + column],
      );
      image.setValue(column, row, 0, value);
    }
  }
  if (backgroundKind === 'light') {
    return image.invert();
  } else {
    return image;
  }
}
