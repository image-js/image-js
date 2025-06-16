import type { Image } from '../Image.js';
import { getNodeApiOrThrow } from '../utils/cross_platform.js';

import { decode } from './decode.js';

/**
 * Read an image from the disk.
 * The file format is automatically selected based on the first few bytes.
 * This method is only implemented for Node.js.
 * @param path - The path to the image.
 * @returns Image instance.
 */
export async function read(path: string | URL): Promise<Image> {
  const nodeApi = getNodeApiOrThrow('read');
  const data = await nodeApi.fs.promises.readFile(path);
  return decode(data);
}

/**
 * Synchronous version of @see {@link read}.
 * This method is only implemented for Node.js.
 * @param path - The path to the image.
 * @returns Image instance.
 */
export function readSync(path: string | URL): Image {
  const nodeApi = getNodeApiOrThrow('readSync');
  return decode(nodeApi.fs.readFileSync(path));
}
