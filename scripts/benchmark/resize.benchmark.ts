// run with `ts-node-transpile-only scripts/benchmark/resize.benchmark.ts`

import { read } from '../../src';
import { join } from 'path';

async function doAll() {
  const image = await read(join(__dirname, 'large.jpg'));

  console.time('resize');

  image.resize({ width: 6000, height: 4000, interpolationType: 'bilinear' });
  console.timeEnd('resize');
}

doAll();
