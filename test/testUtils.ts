import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { Image, Point, Roi } from '../src/index.js';
import { fromMask, readSync } from '../src/index.js';

import type { TestImagePath } from './TestImagePath.js';
import type { CreateImageOptions } from './createImageFromData.js';
import { createImageFromData } from './createImageFromData.js';
import { createMask } from './createMask.js';

/**
 * Return the path to a given image.
 * @param name - Test image name.
 * @returns The path to the image.
 */
export function getPath(name: TestImagePath): string {
  return join(__dirname, 'img/', name);
}

/**
 * Returns a buffer of the given image.
 * @param path - Path to the image.
 * @returns Buffer of the image.
 */
export function loadBuffer(path: TestImagePath): Uint8Array {
  return readFileSync(join(__dirname, 'img', path));
}

/**
 * Load an image from the test/img directory.
 * @param path - Path to the image.
 * @returns The image.
 */
export function load(path: TestImagePath): Image {
  return readSync(join(__dirname, 'img', path));
}
/**
 * Create an image from 8-bit Grey data.
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
 * @param imageData - Raw image data.
 * @returns The greya Image.
 */
export function createGreyaImage(imageData: number[][] | string): Image {
  return createImageFromData(imageData, 'GREYA');
}
/**
 * Create an image from 8-bit RGB data.
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
    throw new Error('multiple ROIs found');
  }
  return rois[0];
}

/**
 * Create an image from 8-bit RGBA data.
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
 * @returns The path to the created directory.
 */
export function makeTmpDir(): string {
  return mkdtempSync(join(tmpdir(), 'image-js-test-'));
}

/**
 * Delete a previously created temporary directory.
 * @param dir - Path of the directory to remove.
 */
export function cleanTmpDir(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
}

/**
 * Creates an Int16Array from string
 * @param string - represents Int16Array data
 * @returns Int16Array
 */
export function getInt16Array(string: string) {
  return new Int16Array(
    string
      .split(/[\n\r ,]+/)
      .filter(Boolean)
      .map(Number),
  );
}

/**
 * Creates an Int32Array from string
 * @param string - represents Int32Array data
 * @returns Int32Array
 */
export function getInt32Array(string: string) {
  return new Int32Array(
    string
      .split(/[\n\r ,]+/)
      .filter(Boolean)
      .map(Number),
  );
}

export function createPoints(...points: Array<[number, number]>): Point[] {
  return points.map(([column, row]) => ({ column, row }));
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
    getInt16Array: typeof getInt16Array;
    getInt32Array: typeof getInt32Array;
    createPoints: typeof createPoints;
  };
}

export { createMask } from './createMask.js';
