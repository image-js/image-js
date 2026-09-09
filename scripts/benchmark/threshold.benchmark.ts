/* eslint-disable @typescript-eslint/no-explicit-any */

import { bench, run } from 'mitata';

import { loadImage, parseBenchmarkArgs } from './utils.ts';

const { format } = parseBenchmarkArgs();

const mandrill = await loadImage('standard/mandrill.png');

bench('Threshold - $threshold', function* threshold(state: any) {
  const thresholdValue = state.get('threshold');
  yield () =>
    mandrill.threshold({
      threshold: thresholdValue,
    });
}).args('threshold', [0.25, 0.5, 0.75]);

await run({ format });
