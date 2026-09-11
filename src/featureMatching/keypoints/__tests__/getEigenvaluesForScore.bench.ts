import { test } from 'vitest';

import { getEigenvaluesForScore } from '../getEigenvaluesForScore.ts';

const image = await testUtils.loadDemoImage('standard/house.png');
const grey = image.grey();

test('Get all eigenvalues on 128x128 grey image', async ({ bench }) => {
  await bench('shi-tomasi score', () => {
    for (let i = 3; i < grey.width - 3; i++) {
      for (let j = 3; j < grey.height - 3; j++) {
        getEigenvaluesForScore(grey, { row: i, column: j });
      }
    }
  }).run();
});
