import { overlapImages } from '../..';
import { alignMinDifference } from '../alignMinDifference';

test('1 pixel source', () => {
  const source = testUtils.createGreyImage([[255]]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 255, 0],
  ]);

  const result = alignMinDifference(source, destination);
  expect(result).toStrictEqual({ row: 2, column: 1, similarity: 1 });
});

test('4 pixels source', () => {
  const source = testUtils.createGreyImage([
    [0, 80],
    [150, 200],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 100],
    [0, 255, 255],
  ]);

  const result = alignMinDifference(source, destination);
  expect(result).toStrictEqual({
    row: 1,
    column: 1,
    similarity: 0.8235294117647058,
  });
});

test('twice same image', () => {
  const source = testUtils.load('opencv/test.png').grey();

  const destination = testUtils.load('opencv/test.png').grey();

  const result = alignMinDifference(source, destination);
  expect(result).toStrictEqual({ row: 0, column: 0, similarity: 1 });
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
    alignMinDifference(source, destination);
  }).toThrow('Source image must fit entirely in destination image');
});

test('larger image and crop', () => {
  const side = 100;
  const origin = { row: 30, column: 30 };
  const destination = testUtils.load('ssim/ssim-original.png');
  const source = destination.crop({ origin, width: side, height: side });

  const result = alignMinDifference(source, destination);

  expect(result).toStrictEqual({ ...origin, similarity: 1 });
});

test('larger image and crop 2', () => {
  const side = 100;
  const origin = { row: 50, column: 100 };
  const destination = testUtils.load('ssim/ssim-original.png');
  const source = destination.crop({ origin, width: side, height: side });

  const result = alignMinDifference(source, destination);

  expect(result).toStrictEqual({ ...origin, similarity: 1 });
});

test('id crops', () => {
  const destination = testUtils.load('align/cropped.png').grey();
  const source = testUtils.load('align/croppedRef.png').grey();

  const result = alignMinDifference(source, destination);

  const overlap = overlapImages(source, destination, { origin: result });

  expect(overlap).toMatchImageSnapshot();
});

test('other id crops', () => {
  const destination = testUtils.load('align/cropped1.png').grey();
  const source = testUtils.load('align/croppedRef1.png').grey();
  const result = alignMinDifference(source, destination);

  const overlap = overlapImages(source, destination, { origin: result });
  expect(overlap).toMatchImageSnapshot();
});

test('RGB images', () => {
  const destination = testUtils.createRgbImage([
    [255, 255, 0, 255, 0, 0, 255, 0, 0],
    [255, 0, 0, 255, 0, 0, 255, 0, 0],
    [255, 0, 0, 255, 0, 0, 255, 0, 0],
  ]);

  const source = testUtils.createRgbImage([[255, 255, 0]]);

  const result = alignMinDifference(source, destination, {
    startStep: 1,
  });

  expect(result).toStrictEqual({ row: 0, column: 0, similarity: 1 });
});
