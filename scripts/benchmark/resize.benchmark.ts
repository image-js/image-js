import { join } from 'node:path';

import { read } from '../../src/index.js';

const image = await read(join(import.meta.dirname, 'large.jpg'));

console.time('resize');

image.resize({ width: 6000, height: 4000, interpolationType: 'bilinear' });
console.timeEnd('resize');
