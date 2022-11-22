import { ImageColorModel, Image } from '../../Image';
import { getCirclePoints, getCompassPoints } from '../../utils/getCirclePoints';
import { getHarrisScore } from '../getHarrisScore';
import { isFastKeypoint } from '../isFastKeypoint';

const fastRadius = 3;
const fastDiameter = 2 * fastRadius + 1;
const compassPoints = getCompassPoints(fastRadius);
const circlePoints = getCirclePoints(fastRadius);

test('7x7 image, not corner', () => {
  const image = new Image(fastDiameter, fastDiameter, {
    colorModel: ImageColorModel.GREY,
  });

  const origin = { row: fastRadius, column: fastRadius };

  let result = getHarrisScore(image, origin);

  expect(result).toBe(0);
});

test('7x7 image with straight line', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [255, 255, 255, 255, 255, 255, 255],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  let result = getHarrisScore(image, origin, { windowSize: 7 });

  expect(result).toBe(0);
});

test('7x7 image with corner 90 degrees', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 50, 0, 0, 0],
    [0, 0, 50, 0, 50, 0, 0],
    [0, 50, 0, 0, 0, 50, 0],
    [50, 0, 0, 0, 0, 0, 50],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  let result = getHarrisScore(image, origin);

  expect(result).toBe(0);
});

test('7x7 image with darker and lighter areas', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 50, 0, 0, 0],
    [0, 0, 0, 50, 50, 0, 0],
    [0, 0, 50, 100, 100, 50, 0],
    [0, 50, 100, 100, 100, 100, 50],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  let result = getHarrisScore(image, origin, { windowSize: 7 });

  expect(result).toBe(0);
});
test('7x7 image with segment', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 200, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  let result = getHarrisScore(image, origin, { windowSize: 7 });

  expect(result).toBe(0);
});
test('7x7 image, threshold = 60', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 50, 0, 0, 0],
    [0, 0, 0, 50, 50, 0, 0],
    [0, 0, 50, 100, 100, 50, 0],
    [0, 50, 100, 100, 100, 100, 50],
  ]);
  const origin = { row: fastRadius, column: fastRadius };

  let result = getHarrisScore(image, origin, { windowSize: 7 });

  expect(result).toBe(0);
});
test('7x7 image with corner 90 degrees, n=9', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 50, 0, 0, 0],
    [0, 0, 50, 0, 50, 0, 0],
    [0, 50, 0, 0, 0, 50, 0],
    [50, 0, 0, 0, 0, 0, 50],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  let result = getHarrisScore(image, origin, { windowSize: 7 });

  expect(result).toBe(0);
});
