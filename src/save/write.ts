import fs from 'node:fs';
import nodePath from 'node:path';
import url from 'node:url';

import type { Image } from '../Image.js';
import { Mask } from '../Mask.js';

import type {
  EncodeOptionsBmp,
  EncodeOptionsJpeg,
  EncodeOptionsPng,
} from './encode.js';
import { encode } from './encode.js';

export interface WriteOptions {
  /**
   * If true, attempts to create all the missing directories recursively.
   */
  recursive?: boolean;
}

export type WriteOptionsPng = WriteOptions & EncodeOptionsPng;
export type WriteOptionsJpeg = WriteOptions & EncodeOptionsJpeg;
export type WriteOptionsBmp = WriteOptions & EncodeOptionsBmp;

/**
 * Write an image to the disk.
 * The file format is determined automatically from the file's extension.
 * If the extension is not supported, an error will be thrown.
 * @param path - Path or file URL where the image should be written.
 * @param image - Image to save.
 * @param options - Write options.
 * @returns A promise that resolves when the image is written.
 */
export async function write(
  path: string | URL,
  image: Image | Mask,
  options?: WriteOptions,
): Promise<void>;
/**
 * Write an image to the disk as PNG.
 * When the `png` format is specified, the file's extension doesn't matter.
 * @param path - Path or file URL where the image should be written.
 * @param image - Image to save.
 * @param options - Encode options for png images.
 * @returns A promise that resolves when the image is written.
 */
export async function write(
  path: string | URL,
  image: Image | Mask,
  options: WriteOptionsPng,
): Promise<void>;
/**
 * Write an image to the disk as JPEG.
 * When the `jpeg` format is specified, the file's extension doesn't matter.
 * @param path - Path or file URL where the image should be written.
 * @param image - Image to save.
 * @param options - Encode options for jpeg images.
 * @returns A promise that resolves when the image is written.
 */
export async function write(
  path: string | URL,
  image: Image | Mask,
  options: WriteOptionsJpeg,
): Promise<void>;

/**
 * Write an image to the disk as BMP.
 * When the `bmp` format is specified, the file's extension doesn't matter.
 * @param path - Path or file URL where the image should be written.
 * @param image - Image to save.
 * @param options - Encode options for bmp images.
 * @returns A promise that resolves when the image is written.
 */
export async function write(
  path: string | URL,
  image: Mask,
  options?: WriteOptionsBmp,
): Promise<void>;
/**
 * Asynchronously write an image to the disk.
 * @param path - Path where the image should be written.
 * @param image - Image to save.
 * @param options - Encode options.
 */
export async function write(
  path: string | URL,
  image: Image | Mask,
  options?: WriteOptionsBmp | WriteOptionsPng | WriteOptionsJpeg | WriteOptions,
): Promise<void> {
  if (typeof path !== 'string') {
    path = url.fileURLToPath(path);
  }
  if (image instanceof Mask) {
    image = image.convertColor('GREY');
  }
  const toWrite = getDataToWrite(path, image, options);
  if (options?.recursive) {
    const dir = nodePath.dirname(path);
    await fs.promises.mkdir(dir, { recursive: true });
  }
  await fs.promises.writeFile(path, toWrite);
}

/**
 * Synchronous version of @see {@link write}.
 * @param path - Path where the image should be written.
 * @param image - Image to save.
 * @param options - Encode options.
 */
export function writeSync(
  path: string | URL,
  image: Image | Mask,
  options?: WriteOptionsBmp | WriteOptionsPng | WriteOptionsJpeg | WriteOptions,
): void {
  if (typeof path !== 'string') {
    path = url.fileURLToPath(path);
  }
  const toWrite = getDataToWrite(path, image, options);
  if (options?.recursive) {
    const dir = nodePath.dirname(path);
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path, toWrite);
}

/**
 * Encode the image to the format specified by the file's extension.
 * @param destinationPath - Image destination.
 * @param image - Image to save.
 * @param options - Encode options.
 * @returns Buffer containing the encoded image.
 */
function getDataToWrite(
  destinationPath: string,
  image: Image | Mask,
  options?: WriteOptionsBmp | WriteOptionsPng | WriteOptionsJpeg | WriteOptions,
): Uint8Array {
  if (!options || !('format' in options)) {
    const extension = nodePath.extname(destinationPath).slice(1).toLowerCase();
    if (
      extension === 'png' ||
      extension === 'jpg' ||
      extension === 'jpeg' ||
      extension === 'bmp'
    ) {
      return encode(image, { ...options, format: extension });
    } else {
      throw new RangeError(
        'image format could not be determined from file extension. Use a supported extension or specify the format option',
      );
    }
  } else {
    return encode(image, options);
  }
}
