import { Image } from '../Image';

/**
 * Read an image from the disk.
 * This method is not supported in the browser.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function read(path: string): Promise<Image> {
  throw new Error('read is not supported in the browser');
}
