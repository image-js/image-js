import { writeFileSync } from 'fs';
import { join } from 'path';

import { createRandomArray } from 'ml-spectra-processing';

const a = createRandomArray({
  distribution: 'normal',
  seed: 0,
  mean: 0,
  standardDeviation: 1,
  length: 10000,
});

writeFileSync(join(__dirname, 'test.json'), JSON.stringify(Array.from(a)));
