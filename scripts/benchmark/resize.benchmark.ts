import { bench, run } from 'mitata';

import { loadImage, parseBenchmarkArgs } from './utils.ts';

const { format } = parseBenchmarkArgs();

const mandrill = await loadImage('standard/mandrill.png');

bench(function resizeSmaller() {
  mandrill.resize({
    width: Math.floor(mandrill.width / 2),
    height: Math.floor(mandrill.height / 2),
    interpolationType: 'bilinear',
  });
});

bench(function resizeLarger() {
  mandrill.resize({
    width: mandrill.width * 2,
    height: mandrill.height * 2,
    interpolationType: 'bilinear',
  });
});

await run({ format });
