import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { read } from '../../lib/index.js';

/**
 * Load an image from the demo dataset
 * @param filename - Image path from the demo dataset root
 */
export function loadImage(filename: string) {
  return read(join(import.meta.dirname, `../images/${filename}`));
}

/**
 * Parse benchmark CLI arguments
 */
export function parseBenchmarkArgs() {
  const outputFormatChoices = ['json', 'quiet', 'mitata', 'markdown'] as const;
  const config = parseArgs({
    allowPositionals: false,
    strict: true,
    options: {
      format: {
        type: 'string',
        short: 'f',
        default: 'mitata',
        choices: outputFormatChoices,
      },
    },
  });
  return {
    format: config.values.format as (typeof outputFormatChoices)[number],
  };
}
