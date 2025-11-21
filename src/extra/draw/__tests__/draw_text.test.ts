import { expect, test } from 'vitest';

import { Image, fromMask } from '../../../index_full.ts';
import type { DrawTextLabel } from '../draw_text.ts';
import { drawText } from '../draw_text.ts';

test('draw text', () => {
  const image = testUtils.load('various/screws.png');

  const newImage = drawText(image, {
    content:
      'This is a test case text to check the functionality of the function.',
    position: { column: 40, row: 40 },
    fontColor: [255, 0, 0],
    font: '20px Arial',
  });

  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 0.05,
    failureThresholdType: 'percent',
  });
});

test('draw H on an image', () => {
  const image = testUtils.createGreyImage(
    new Array(15).fill(new Array(15).fill(255)),
  );
  const newImage = drawText(image, [
    {
      content: 'H',
      position: { column: 1, row: 14 },
      font: '20px Arial',
      fontColor: [0, 0, 0],
    },
  ]);

  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 0.06,
    failureThresholdType: 'percent',
  });
});

test('draw transparent H', () => {
  const image = new Image(100, 100, { bitDepth: 8, colorModel: 'RGBA' });

  const newImage = drawText(image, [
    {
      content: 'Hell0',
      position: { column: 1, row: 70 },
      font: '40px Arial',
      fontColor: [255, 255, 255, 125],
    },
  ]);

  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 0.05,
    failureThresholdType: 'percent',
  });
});

test('draw several labels', () => {
  const mask = testUtils
    .load('various/screws.png')
    .blur({ width: 3, height: 3 })
    .grey()
    .threshold({ algorithm: 'minimum' });
  const rois = fromMask(mask).getRois({ kind: 'black' });
  const image = mask.convertColor('RGB');
  const labels: DrawTextLabel[] = rois.map((roi) => {
    return {
      content: roi.id,
      position: { column: roi.origin.column, row: roi.origin.row },
      font: '20px Arial',
      fontColor: [255, 0, 0],
    };
  });

  const newImage = drawText(image, labels);

  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 0.05,
    failureThresholdType: 'percent',
  });
});

test('image color model remains unchanged', () => {
  const image = testUtils.load('various/screws.png');

  const newImage = drawText(image, [
    {
      content: 'Hello world',
      position: { column: 200, row: 200 },
      font: '20px Arial',
      fontColor: [0, 0, 255],
    },
  ]);

  expect(newImage.colorModel).toStrictEqual(image.colorModel);
});

test('text written to the same image', () => {
  const image = testUtils.load('various/screws.png');

  drawText(
    image,
    [
      {
        content: 'Hello world',
        position: { column: 200, row: 200 },
        font: '20px Arial',
        fontColor: [0, 0, 255],
      },
    ],
    { out: image },
  );

  expect(image).toMatchImageSnapshot({
    failureThreshold: 0.08,
    failureThresholdType: 'percent',
  });
});

test('grey image', () => {
  const image = testUtils.load('various/screws.png').grey();

  const newImage = drawText(image, [
    {
      content: 'Hello world',
      position: { column: 200, row: 200 },
      font: '20px Arial',
      fontColor: [255, 255, 255],
    },
    {
      content: 255,
      position: { column: 255, row: 255 },
      font: '20px Arial',
      fontColor: [255, 255, 255],
    },
  ]);

  expect(newImage.colorModel).toStrictEqual(image.colorModel);
  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 0.05,
    failureThresholdType: 'percent',
  });
});

test('grey image with alpha', () => {
  const image = testUtils.createGreyaImage(
    new Array(15).fill(new Array(30).fill(255)),
  );

  const newImage = drawText(image, [
    {
      content: 'HI!',
      position: { column: 0, row: 13 },
      font: '10px monospace',
      fontColor: [0, 0, 0],
    },
  ]);

  expect(newImage.colorModel).toStrictEqual(image.colorModel);
  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 0.15,
    failureThresholdType: 'percent',
  });
});

test('check color and font priorities', () => {
  const image = testUtils.createRgbaImage(
    new Array(150).fill(new Array(512).fill(255)),
  );

  const newImage = drawText(
    image,
    [
      {
        content: 'HI!',
        position: { column: 2, row: 13 },
      },
      {
        content: 'HELLO!',
        position: { column: 15, row: 60 },
        font: '25px Arial',
        fontColor: [0, 0, 255],
      },
      {
        content: 'Y0!',
        position: { column: 40, row: 100 },
        fontColor: [0, 255, 0],
      },
    ],
    { fontColor: [255, 0, 0], font: '10px monospace' },
  );

  expect(newImage.colorModel).toStrictEqual(image.colorModel);
  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 0.15,
    failureThresholdType: 'percent',
  });
});

test('incomplete fill color', () => {
  const image = testUtils.createRgbaImage(
    new Array(40).fill(new Array(200).fill(255)),
  );

  const newImage = drawText(image, [
    {
      content: 'HI!',
      position: { column: 0, row: 23 },
      font: '20px Arial',
      fontColor: [0],
    },
  ]);

  expect(newImage.colorModel).toStrictEqual(image.colorModel);
  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 0.05,
    failureThresholdType: 'percent',
  });
});

test('must throw if arrays are empty', () => {
  const image = testUtils.createRgbaImage(
    new Array(40).fill(new Array(200).fill(255)),
  );

  expect(() => {
    const newImage = drawText(image, []);
    return newImage;
  }).toThrow('At least one text element must be provided');
});
