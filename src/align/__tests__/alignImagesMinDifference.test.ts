import { alignImagesMinDifference } from '../alignImagesMinDifference';

test('1 pixel source', () => {
  const source = testUtils.createGreyImage([[255]]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 255, 0],
  ]);

  const result = alignImagesMinDifference(source, destination);
  expect(result).toStrictEqual({ row: 2, column: 1 });
});

test('4 pixels source', () => {
  const source = testUtils.createGreyImage([
    [0, 20],
    [40, 60],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 100],
    [0, 255, 255],
  ]);

  const result = alignImagesMinDifference(source, destination);
  expect(result).toStrictEqual({ row: 1, column: 1 });
});

test('twice same image', () => {
  const source = testUtils.load('opencv/test.png');

  const destination = testUtils.load('opencv/test.png');

  const result = alignImagesMinDifference(source, destination);
  expect(result).toStrictEqual({ row: 0, column: 0 });
});

test('source too big', () => {
  const destination = testUtils.createGreyImage([
    [0, 20],
    [40, 60],
  ]);
  const source = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 100],
    [0, 255, 255],
  ]);

  expect(() => {
    alignImagesMinDifference(source, destination);
  }).toThrow('Source image must fit entirely in destination image');
});
