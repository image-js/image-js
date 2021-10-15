import { join } from 'path';

import { IJS, ImageColorModel, readSync } from '../src';

import { TestImagePath } from './TestImagePath';
import { createImageFromData } from './createImageFromData';

/**
 * Load an image from the test/img directory.
 */
export function load(path: TestImagePath): IJS {
  return readSync(join(__dirname, 'img', path));
}

/**
 * Create an image from 8-bit Grey data.
 */
export function createGreyImage(imageData: number[][] | string): IJS {
  return createImageFromData(imageData, ImageColorModel.GREY);
}

/**
 * Create an image from 8-bit RGB data.
 */
export function createRgbImage(imageData: number[][] | string): IJS {
  return createImageFromData(imageData, ImageColorModel.RGB);
}

/**
 * Create an image from 8-bit RGBA data.
 */
export function createRgbaImage(imageData: number[][] | string): IJS {
  return createImageFromData(imageData, ImageColorModel.RGBA);
}

declare global {
  // eslint-disable-next-line no-var
  var testUtils: {
    load: typeof load;
    createGreyImage: typeof createGreyImage;
    createRgbImage: typeof createRgbImage;
    createRgbaImage: typeof createRgbaImage;
  };
}
