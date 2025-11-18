import { expect, test } from 'vitest';

import { drawText } from '../draw_text.ts';

test('draw text', () => {
  const image = testUtils.load('various/screws.png');

  const newImage = drawText(
    image,
    'This is a test case text to check the functionality of the function.',
    { column: 40, row: 40 },
    {
      font: '20px Arial',
      fontColor: [255, 0, 0],
    },
  );

  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 0.05,
    failureThresholdType: 'percent',
  });
});
