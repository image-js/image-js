import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { createRandomArray } from 'ml-spectra-processing';

const a = createRandomArray({
  distribution: 'normal',
  seed: 0,
  mean: 0,
  standardDeviation: 1,
  length: 10000,
});

writeFileSync(
  join(import.meta.dirname, 'test.json'),
  JSON.stringify(Array.from(a)),
);
