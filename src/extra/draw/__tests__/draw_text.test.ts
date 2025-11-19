import { expect, test } from 'vitest';

import { drawText } from '../draw_text.ts';

test('draw text', () => {
  const image = testUtils.load('various/screws.png');

  const newImage = drawText(image, {
    text: 'This is a test case text to check the functionality of the function.',
    position: { column: 40, row: 40 },
    fontColor: [255, 0, 0],
    font: '20px Arial',
  });

  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 0.05,
    failureThresholdType: 'percent',
  });
});
