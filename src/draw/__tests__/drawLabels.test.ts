import { expect, test } from 'vitest';

import { fromMask } from '../../roi/fromMask.js';
import { drawLabels } from '../drawLabels.js';

test('draw H on an image', () => {
  const image = testUtils.createGreyImage(
    new Array(15).fill(new Array(15).fill(0)),
  );

  const newImage = drawLabels(image, ['H'], [{ column: 1, row: 14 }], {
    font: '20px Arial',
    fontColor: [255, 255, 255],
  });

  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 10,
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
  const labelNames = rois.map((roi) => {
    return roi.id;
  });
  const labelCoords = rois.map((roi) => {
    return {
      column: roi.origin.column,
      row: roi.origin.row,
    };
  });
  const newImage = drawLabels(image, labelNames, labelCoords, {
    font: '20px Arial',
    fontColor: [255, 0, 0],
  });

  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 10,
    failureThresholdType: 'percent',
  });
});

test('image color model remains unchanged', () => {
  const image = testUtils.load('various/screws.png');

  const newImage = drawLabels(
    image,
    ['Hello world'],
    [{ column: 200, row: 200 }],
    {
      font: '20px Arial',
      fontColor: [0, 0, 255],
    },
  );

  expect(newImage.colorModel).toStrictEqual(image.colorModel);
});

test('test grey image', () => {
  const image = testUtils.load('various/screws.png').grey();

  const newImage = drawLabels(
    image,
    ['Hello world', 255],
    [
      { column: 200, row: 200 },
      { column: 255, row: 255 },
    ],
    {
      font: '20px Arial',
      fontColor: [0, 0, 0],
    },
  );

  expect(newImage.colorModel).toStrictEqual(image.colorModel);
  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 10,
    failureThresholdType: 'percent',
  });
});

test('test grey image with alpha', () => {
  const image = testUtils.createGreyaImage(
    new Array(15).fill(new Array(30).fill(255)),
  );

  const newImage = drawLabels(image, ['HI!'], [{ column: 0, row: 13 }], {
    font: '10px Arial',
    fontColor: [0, 0, 0],
  });

  expect(newImage.colorModel).toStrictEqual(image.colorModel);
  expect(newImage).toMatchImageSnapshot({
    failureThreshold: 10,
    failureThresholdType: 'percent',
  });
});
