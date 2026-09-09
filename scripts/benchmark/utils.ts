import { join } from 'node:path';

import { read } from '../../src/index.js';

/**
 * Load an image from the demo dataset
 * @param filename - Image path from the demo dataset root
 */
export function loadImage(filename: string) {
  return read(join(import.meta.dirname, `../images/${filename}`));
}
