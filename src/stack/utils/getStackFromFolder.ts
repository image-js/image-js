import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { Stack } from '../../Stack';
import { readSync } from '../../load';

/**
 * Create a stack with all images at a given path.
 * @param path - Path to the folder containing the images.
 * @returns The stack.
 */
export function getStackFromFolder(path: string): Stack {
  const files = readdirSync(path);
  const imageNames = files.filter((file) => file.endsWith('.png'));
  const images = imageNames.map((name) => readSync(join(path, name)));
  return new Stack(images);
}
