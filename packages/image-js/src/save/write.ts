import { writeFile } from 'fs';
import { extname } from 'path';
import { promisify } from 'util';

import { Image } from '../Image';

import {
  encode,
  ImageFormat,
  IEncodeOptionsPng,
  IEncodeOptionsJpeg
} from './encode';

const writeFilePromise = promisify(writeFile);

/**
 * Write an image to the disk.
 * The file format is determined automatically from the file's extension.
 * If the extension is not supported, an error will be thrown.
 */
export async function write(path: string, image: Image): Promise<void>;
/**
 * Write an image to the disk as PNG.
 * When the `png` format is specified, the file's extension doesn't matter.
 */
export async function write(
  path: string,
  image: Image,
  options: IEncodeOptionsPng
): Promise<void>;
/**
 * Write an image to the disk as JPEG.
 * When the `jpeg` format is specified, the file's extension doesn't matter.
 */
export async function write(
  path: string,
  image: Image,
  options: IEncodeOptionsJpeg
): Promise<void>;
export async function write(
  path: string,
  image: Image,
  options?: IEncodeOptionsPng | IEncodeOptionsJpeg
): Promise<void> {
  let format: ImageFormat;
  let toWrite: Uint8Array;

  if (options === undefined) {
    const extension = extname(path)
      .slice(1)
      .toLowerCase();
    if (extension === 'png') {
      format = ImageFormat.png;
      toWrite = encode(image, { format });
    } else if (extension === 'jpg' || extension === 'jpeg') {
      format = ImageFormat.jpg;
      toWrite = encode(image, { format });
    } else {
      throw new Error(
        'image format could not be determined from file extension. Please use a supported extension or specify the format option'
      );
    }
  } else if (options.format === ImageFormat.png) {
    toWrite = encode(image, options);
  } else if (
    options.format === ImageFormat.jpg ||
    options.format === ImageFormat.jpeg
  ) {
    toWrite = encode(image, options);
  } else {
    throw new RangeError(`unknown format: ${options.format}`);
  }
  await writeFilePromise(path, toWrite);
}
