import { writeFile, writeFileSync } from 'fs';
import { extname } from 'path';
import { promisify } from 'util';

import { IJS } from '../IJS';

import {
  encode,
  ImageFormat,
  IEncodeOptionsPng,
  IEncodeOptionsJpeg,
} from './encode';

const writeFilePromise = promisify(writeFile);

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
  options: IEncodeOptionsPng,
): Promise<void>;
/**
 * Write an image to the disk as JPEG.
 * When the `jpeg` format is specified, the file's extension doesn't matter.
 */
export async function write(
  path: string,
  image: IJS,
  options: IEncodeOptionsJpeg,
): Promise<void>;
export async function write(
  path: string,
  image: IJS,
  options?: IEncodeOptionsPng | IEncodeOptionsJpeg,
): Promise<void> {
  const toWrite = getDataToWrite(path, image, options);
  await writeFilePromise(path, toWrite);
}

/**
 * Synchronous version of @see {@link write}.
 */
export function writeSync(
  path: string,
  image: IJS,
  options?: IEncodeOptionsPng | IEncodeOptionsJpeg,
): void {
  const toWrite = getDataToWrite(path, image, options);
  writeFileSync(path, toWrite);
}

function getDataToWrite(
  path: string,
  image: IJS,
  options?: IEncodeOptionsPng | IEncodeOptionsJpeg,
): Uint8Array {
  let format: ImageFormat;
  if (options === undefined) {
    const extension = extname(path).slice(1).toLowerCase();
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
