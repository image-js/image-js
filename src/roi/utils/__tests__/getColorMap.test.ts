import { getBinaryMap } from '../colorMaps/getBinaryMap.js';
import { getColorMap } from '../getColorMap.js';

test('default options', () => {
  const colorMap = getBinaryMap({ nbNegative: 1, nbPositive: 1 });
  expect(Array.from(colorMap)).toStrictEqual([4278190335, 0, 4278255360]);
});

test('binary, BW', () => {
  const colorMap = getColorMap({
    nbNegative: 1,
    nbPositive: 1,
  });
  expect(Array.from(colorMap)).toStrictEqual([4278190335, 0, 4278255360]);
});

test('binary, WHITE', () => {
  const colorMap = getColorMap({
    nbNegative: 1,
    nbPositive: 1,
    roiKind: 'white',
  });
  expect(Array.from(colorMap)).toStrictEqual([0, 0, 4278255360]);
});

test('binary, BLACK', () => {
  const colorMap = getColorMap({
    nbNegative: 1,
    nbPositive: 1,
    roiKind: 'black',
  });
  expect(Array.from(colorMap)).toStrictEqual([4278190335, 0, 0]);
});

test('SATURATION, 1 negative and 1 positive ROIs', () => {
  const colorMap = getColorMap({
    mode: 'saturation',
    nbNegative: 1,
    nbPositive: 1,
  });
  expect(Array.from(colorMap)).toStrictEqual([4294901760, 0, 4278190335]);
});

test('RAINBOW, 1 negative and 2 positive ROIs, WHITE', () => {
  const colorMap = getColorMap({
    mode: 'rainbow',
    nbNegative: 1,
    nbPositive: 2,
    roiKind: 'white',
  });
  expect(Array.from(colorMap)).toStrictEqual([0, 0, 4278190335, 4294967040]);
});

test('RAINBOW, 1 negative and 2 positive ROIs, BLACK', () => {
  const colorMap = getColorMap({
    mode: 'rainbow',
    nbNegative: 1,
    nbPositive: 2,
    roiKind: 'black',
  });
  expect(Array.from(colorMap)).toStrictEqual([4278190335, 0, 0, 0]);
});

test('RAINBOW, 1 negative and 1 positive ROIs, BW', () => {
  const colorMap = getColorMap({
    mode: 'rainbow',
    nbNegative: 2,
    nbPositive: 1,
    roiKind: 'bw',
  });
  expect(Array.from(colorMap)).toStrictEqual([
    4278190335, 4278255360, 0, 4294901760,
  ]);
});
