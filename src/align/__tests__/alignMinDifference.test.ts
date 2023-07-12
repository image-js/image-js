import { ImageColorModel, readSync, writeSync } from '../..';
import { alignMinDifference } from '../alignMinDifference';

test('1 pixel source', () => {
  const source = testUtils.createGreyImage([[255]]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 255, 0],
  ]);

  const result = alignMinDifference(source, destination);
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

  const result = alignMinDifference(source, destination);
  expect(result).toStrictEqual({ row: 1, column: 1 });
});

test('twice same image', () => {
  const source = testUtils.load('opencv/test.png');

  const destination = testUtils.load('opencv/test.png');

  const result = alignMinDifference(source, destination);
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
    alignMinDifference(source, destination);
  }).toThrow('Source image must fit entirely in destination image');
});

test('larger images', () => {
  const side = 100;
  const origin = { row: 30, column: 30 };
  const destination = testUtils
    .load('ssim/ssim-original.png')
    .convertColor(ImageColorModel.RGB);
  const source = destination.crop({ origin, width: side, height: side });

  const result = alignMinDifference(source, destination);

  const dstRectangles = destination;

  // original crop in green
  dstRectangles.drawRectangle({
    origin,
    width: side,
    height: side,
    strokeColor: [0, 255, 0],
    out: dstRectangles,
  });

  // min diff crop in red
  dstRectangles.drawRectangle({
    origin: result,
    width: side,
    height: side,
    strokeColor: [255, 0, 0],
    out: dstRectangles,
  });

  writeSync(`${__dirname}/dstRectangles.png`, dstRectangles);
  console.log({ result });
  expect(result).toStrictEqual(origin);
});
