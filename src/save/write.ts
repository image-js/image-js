import fs from 'fs';
import path from 'path';

import { IJS } from '../IJS';

import {
  encode,
  ImageFormat,
  EncodeOptionsPng,
  EncodeOptionsJpeg,
} from './encode';

/**
 * Write an image to the disk.
 * The file format is determined automatically from the file's extension.
 * If the extension is not supported, an error will be thrown.
 */
export async function write(path: string, image: IJS): Promise<void>;
/**
 * Write an image to the disk as PNG.
 * When the `png` format is specified, the file's extension doesn't matter.
 */
export async function write(
  path: string,
  image: IJS,
  options: EncodeOptionsPng,
): Promise<void>;
/**
 * Write an image to the disk as JPEG.
 * When the `jpeg` format is specified, the file's extension doesn't matter.
 */
export async function write(
  path: string,
  image: IJS,
  options: EncodeOptionsJpeg,
): Promise<void>;
/**
 * Asynchronously write an image to the disk.
 *
 * @param path - Path where the image should be written.
 * @param image - Image to save.
 * @param options - Encode options.
 */
export async function write(
  path: string,
  image: IJS,
  options?: EncodeOptionsPng | EncodeOptionsJpeg,
): Promise<void> {
  const toWrite = getDataToWrite(path, image, options);
  await fs.promises.writeFile(path, toWrite);
}

/**
 * Synchronous version of @see {@link write}.
 *
 * @param path - Path where the image should be written.
 * @param image - Image to save.
 * @param options - Encode options.
 */
export function writeSync(
  path: string,
  image: IJS,
  options?: EncodeOptionsPng | EncodeOptionsJpeg,
): void {
  const toWrite = getDataToWrite(path, image, options);
  fs.writeFileSync(path, toWrite);
}

/**
 * @param destinationPath
 * @param image - Image to save.
 * @param options - Encode options.
 */
function getDataToWrite(
  destinationPath: string,
  image: IJS,
  options?: EncodeOptionsPng | EncodeOptionsJpeg,
): Uint8Array {
  let format: ImageFormat;
  if (options === undefined) {
    const extension = path.extname(destinationPath).slice(1).toLowerCase();
    if (extension === 'png') {
      format = ImageFormat.png;
      return encode(image, { format });
    } else if (extension === 'jpg' || extension === 'jpeg') {
      format = ImageFormat.jpg;
      return encode(image, { format });
    } else {
      throw new Error(
        'image format could not be determined from file extension. Please use a supported extension or specify the format option',
      );
    }
  } else if (options.format === ImageFormat.png) {
    return encode(image, options);
  } else if (
    options.format === ImageFormat.jpg ||
    options.format === ImageFormat.jpeg
  ) {
    return encode(image, options);
  } else {
    throw new RangeError(`unknown format: ${options.format}`);
  }
}
