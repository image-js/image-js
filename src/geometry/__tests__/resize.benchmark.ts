import { test } from 'vitest';

const mandrill = await testUtils.loadDemoImage('standard/mandrill.png');

test('Resize smaller', async ({ bench }) => {
  await bench('Threshold', () => {
    mandrill.resize({
      width: Math.floor(mandrill.width / 2),
      height: Math.floor(mandrill.height / 2),
      interpolationType: 'bilinear',
    });
  }).run();
});

test('Resize larger', async ({ bench }) => {
  await bench('Threshold', () => {
    mandrill.resize({
      width: mandrill.width * 2,
      height: mandrill.height * 2,
      interpolationType: 'bilinear',
    });
  }).run();
});
