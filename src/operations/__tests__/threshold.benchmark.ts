import { test } from 'vitest';

const mandrill = await testUtils.loadDemoImage('standard/mandrill.png');

test('Threshold benchmark', async ({ bench }) => {
  await bench('Threshold', () => {
    mandrill.threshold({
      threshold: 0.5,
    });
  }).run();
});
