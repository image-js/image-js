import { ImageColorModel, Image } from '../../Image';
import { getCompassPoints } from '../../utils/getCirclePoints';
import { isFastKeypoint } from '../isFastKeypoint';

const fastRadius = 3;
const fastDiameter = 2 * fastRadius + 1;
const compassPoints = getCompassPoints(fastRadius);
const circlePoints = [
  { row: 0, column: 3 },
  { row: 1, column: 3 },
  { row: 2, column: 2 },
  { row: 3, column: 1 },
  { row: 3, column: 0 },
  { row: 3, column: -1 },
  { row: 2, column: -2 },
  { row: 1, column: -3 },
  { row: 0, column: -3 },
  { row: -1, column: -3 },
  { row: -2, column: -2 },
  { row: -3, column: -1 },
  { row: -3, column: 0 },
  { row: -3, column: 1 },
  { row: -2, column: 2 },
  { row: -1, column: 3 },
];

test('7x7 image, not corner', () => {
  const image = new Image(fastDiameter, fastDiameter, {
    colorModel: ImageColorModel.GREY,
  });

  const origin = { row: fastRadius, column: fastRadius };

  let result = isFastKeypoint(origin, image, compassPoints, circlePoints);

  expect(result).toBeFalsy();
});

test('7x7 image with straight line', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  let result = isFastKeypoint(origin, image, compassPoints, circlePoints);

  expect(result).toBeFalsy();
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

  let result = isFastKeypoint(origin, image, compassPoints, circlePoints);

  expect(result).toBeFalsy();
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

  let result = isFastKeypoint(origin, image, compassPoints, circlePoints);

  expect(result).toBeTruthy();
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

  let result = isFastKeypoint(origin, image, compassPoints, circlePoints);

  expect(result).toBeTruthy();
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

  let result = isFastKeypoint(origin, image, compassPoints, circlePoints, {
    threshold: 60,
  });

  expect(result).toBeFalsy();
});
