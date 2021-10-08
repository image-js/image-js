import { readFile, readFileSync } from 'fs';
import { promisify } from 'util';

import { IJS } from '../IJS';

import { decode } from './decode';

const readFilePromise = promisify(readFile);

/**
 * Read an image from the disk.
 * The file format is automatically selected based on the first few bytes.
 * @param path - The file path to read.
 */
export async function read(path: string | URL): Promise<IJS> {
  const data = await readFilePromise(path);
  return decode(data);
}

/**
 * Synchronous version of @see {@link read}.
 */
export function readSync(path: string | URL): IJS {
  return decode(readFileSync(path));
}
