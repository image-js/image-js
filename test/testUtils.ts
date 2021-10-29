import { readFileSync, mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { IJS, ImageColorModel, readSync } from '../src';

import { TestImagePath } from './TestImagePath';
import { createImageFromData, CreateImageOptions } from './createImageFromData';

/**
 * Return the path to a given image.
 *
 * @param name - Test image name.
 * @returns The path to the image.
 */
export function getPath(name: TestImagePath): string {
  return join(__dirname, 'img/', name);
}

/**
 * Returns a buffer of the given image.
 *
 * @param path - Path to the image.
 * @returns Buffer of the image.
 */
export function loadBuffer(path: TestImagePath): Uint8Array {
  return readFileSync(join(__dirname, 'img', path));
}

/**
 * Load an image from the test/img directory.
 *
 * @param path - Path to the image.
 * @returns The image.
 */
export function load(path: TestImagePath): IJS {
  return readSync(join(__dirname, 'img', path));
}
/**
 * Create an image from 8-bit Grey data.
 *
 * @param imageData - Raw image data.
 * @param options - Additional options to create the image.
 * @returns The grey image.
 */
export function createGreyImage(
  imageData: number[][] | string,
  options?: CreateImageOptions,
): IJS {
  return createImageFromData(imageData, ImageColorModel.GREY, options);
}

/**
 * Create an image from 8-bit Greya data.
 *
 * @param imageData - Raw image data.
 * @returns The greya Image.
 */
export function createGreyaImage(imageData: number[][] | string): IJS {
  return createImageFromData(imageData, ImageColorModel.GREYA);
}
/**
 * Create an image from 8-bit RGB data.
 *
 * @param imageData - Raw image data.
 * @param options - Additional options to create the image.
 * @returns The RGB image.
 */
export function createRgbImage(
  imageData: number[][] | string,
  options?: CreateImageOptions,
): IJS {
  return createImageFromData(imageData, ImageColorModel.RGB, options);
}

/**
 * Create an image from 8-bit RGBA data.
 *
 * @param imageData - Raw image data.
 * @param options - Additional options to create the image.
 * @returns The RGBA image.
 */
export function createRgbaImage(
  imageData: number[][] | string,
  options?: CreateImageOptions,
): IJS {
  return createImageFromData(imageData, ImageColorModel.RGBA, options);
}

/**
 * Creates a new temporary directory.
 *
 * @returns The path to the created directory.
 */
export function makeTmpDir(): string {
  return mkdtempSync(join(tmpdir(), 'ijs-test-'));
}

/**
 * Delete a previously created temporary directory.
 *
 * @param dir - Path of the directory to remove.
 */
export function cleanTmpDir(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
}

declare global {
  // eslint-disable-next-line no-var
  var testUtils: {
    getPath: typeof getPath;
    loadBuffer: typeof loadBuffer;
    load: typeof load;
    createGreyImage: typeof createGreyImage;
    createGreyaImage: typeof createGreyaImage;
    createRgbImage: typeof createRgbImage;
    createRgbaImage: typeof createRgbaImage;
    makeTmpDir: typeof makeTmpDir;
    cleanTmpDir: typeof cleanTmpDir;
  };
}
