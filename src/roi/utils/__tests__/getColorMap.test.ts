import { getBinaryMap } from '../colorMaps/getBinaryMap';
import { maxNumberRois, colorMapCenter } from '../constants';
import { getColorMap } from '../getColorMap';

test('default options', () => {
  const colorMap = getBinaryMap({ nbNegative: 1, nbPositive: 1 });

  expect(colorMap).toHaveLength(maxNumberRois);
  expect(colorMap[colorMapCenter - 1]).toBe(0xff0000ff); // red
  expect(colorMap[colorMapCenter + 1]).toBe(0xff00ff00); // green
});

test('binary, BW', () => {
  const colorMap = getColorMap({
    nbNegative: 1,
    nbPositive: 1,
  });

  expect(colorMap).toHaveLength(maxNumberRois);
  expect(colorMap[colorMapCenter - 1]).toBe(0xff0000ff); // red
  expect(colorMap[colorMapCenter + 1]).toBe(0xff00ff00); // green
});

test('binary, WHITE', () => {
  const colorMap = getColorMap({
    nbNegative: 1,
    nbPositive: 1,
    roiKind: 'white',
  });

  expect(colorMap[colorMapCenter - 1]).toBe(0);
  expect(colorMap[colorMapCenter + 1]).toBe(0xff00ff00);
});

test('binary, BLACK', () => {
  const colorMap = getColorMap({
    nbNegative: 1,
    nbPositive: 1,
    roiKind: 'black',
  });

  expect(colorMap[colorMapCenter - 1]).toBe(0xff0000ff);
  expect(colorMap[colorMapCenter + 1]).toBe(0);
});

test('SATURATION, 1 negative and 1 positive ROIs', () => {
  const colorMap = getColorMap({
    mode: 'saturation',
    nbNegative: 1,
    nbPositive: 1,
  });

  expect(colorMap[colorMapCenter - 1]).toBe(0xffff0000); // blue
  expect(colorMap[colorMapCenter + 1]).toBe(0xff0000ff); // red
});

test('RAINBOW, 1 negative and 2 positive ROIs, WHITE', () => {
  const colorMap = getColorMap({
    mode: 'rainbow',
    nbNegative: 1,
    nbPositive: 2,
    roiKind: 'white',
  });

  expect(colorMap[colorMapCenter - 1]).toBe(0); // transparent
  expect(colorMap[colorMapCenter + 1]).toBe(0xff0000ff); // red
  expect(colorMap[colorMapCenter + 2]).toBe(0xffffff00); // turquoise
});

test('RAINBOW, 1 negative and 2 positive ROIs, BLACK', () => {
  const colorMap = getColorMap({
    mode: 'rainbow',
    nbNegative: 1,
    nbPositive: 2,
    roiKind: 'black',
  });

  expect(colorMap[colorMapCenter - 1]).toBe(0xff0000ff);
  expect(colorMap[colorMapCenter + 1]).toBe(0);
  expect(colorMap[colorMapCenter + 2]).toBe(0);
});

test('RAINBOW, 1 negative and 1 positive ROIs, BW', () => {
  const colorMap = getColorMap({
    mode: 'rainbow',
    nbNegative: 1,
    nbPositive: 1,
    roiKind: 'bw',
  });

  expect(colorMap[colorMapCenter - 1]).toBe(0xff0000ff);
  expect(colorMap[colorMapCenter + 1]).toBe(0xffffff00);
  expect(colorMap[colorMapCenter + 2]).toBe(0);
});
