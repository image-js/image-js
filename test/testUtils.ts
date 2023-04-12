import { readFileSync, mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { fromMask, Image, readSync } from '../src';
import { Roi } from '../src/roi/Roi';

import { TestImagePath } from './TestImagePath';
import { createImageFromData, CreateImageOptions } from './createImageFromData';
import { createMask } from './createMask';

export { createMask };

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
export function load(path: TestImagePath): Image {
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
): Image {
  return createImageFromData(imageData, 'GREY', options);
}

/**
 * Create an image from 8-bit Greya data.
 *
 * @param imageData - Raw image data.
 * @returns The greya Image.
 */
export function createGreyaImage(imageData: number[][] | string): Image {
  return createImageFromData(imageData, 'GREYA');
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
): Image {
  return createImageFromData(imageData, 'RGB', options);
}

export interface CreateRoiOptions {
  /**
   * Are pixels connected by corners considered as the same ROI?
   */
  allowCorners?: boolean;
}

/**
 * Create an ROI from a mask data array or a string. The data should only contain one ROI!
 *
 * @param imageData - Raw mask data.
 * @param options - Create ROI options
 * @returns The corresponding ROI.
 */
export function createRoi(
  imageData: number[][] | string,
  options: CreateRoiOptions = {},
): Roi {
  const mask = createMask(imageData);
  const roiMapManager = fromMask(mask, options);

  const rois = roiMapManager.getRois({ kind: 'white' });
  if (rois.length > 1) {
    throw new Error('createRoi: multiple ROIs found.');
  }
  return rois[0];
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
): Image {
  return createImageFromData(imageData, 'RGBA', options);
}

/**
 * Creates a new temporary directory.
 *
 * @returns The path to the created directory.
 */
export function makeTmpDir(): string {
  return mkdtempSync(join(tmpdir(), 'image-js-test-'));
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
    createMask: typeof createMask;
    createRoi: typeof createRoi;
    makeTmpDir: typeof makeTmpDir;
    cleanTmpDir: typeof cleanTmpDir;
  };
}
