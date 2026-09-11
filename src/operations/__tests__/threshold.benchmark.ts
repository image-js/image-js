import { test } from 'vitest';

const mandrill = await testUtils.loadDemoImage('standard/mandrill.png');
const grey = mandrill.grey();

test('Threshold benchmark', async ({ bench }) => {
  await bench('Threshold', () => {
    grey.threshold({
      threshold: 0.5,
    });
  }).run();
});
