import { writeFile } from 'fs';
import { promisify } from 'util';

import { Omit } from 'type-fest';

import { Image } from '../Image';

import { encode, IEncodeOptions } from './encode';

const writeFilePromise = promisify(writeFile);

export type IWriteOptions = Omit<IEncodeOptions, 'format'>;

/**
 * Write an image to the disk.
 */
export async function write(
  path: string,
  image: Image,
  options?: IWriteOptions
): Promise<void> {
  const toWrite = encode(image, options);
  await writeFilePromise(path, toWrite);
}
