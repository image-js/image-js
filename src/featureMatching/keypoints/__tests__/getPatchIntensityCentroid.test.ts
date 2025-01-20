import { Image } from '../../../Image.js';
import { round, sum } from '../../../utils/geometry/points.js';
import { getPatchIntensityCentroid } from '../getPatchIntensityCentroid.js';

test('3x3 empty image', () => {
  const image = new Image(7, 7, { colorModel: 'GREY' });
  const result = getPatchIntensityCentroid(image);
  expect(result).toStrictEqual([{ column: 0, row: 0 }]);
});

test('3x3 image', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0],
    [1, 0, 0],
    [0, 0, 0],
  ]);
  const result = getPatchIntensityCentroid(image, { radius: 1 });
  expect(result).toStrictEqual([{ column: -1, row: 0 }]);
});

test('5x5 image', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 9],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const result = getPatchIntensityCentroid(image, { radius: 2 });
  expect(result).toStrictEqual([{ column: 1.9, row: 0 }]);
});

test('5x5 image, diagonal line', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const result = getPatchIntensityCentroid(image, { radius: 2 });
  expect(result).toStrictEqual([{ column: -0.5, row: -0.5 }]);
});

test('check window is circular', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 100],
  ]);
  const result = getPatchIntensityCentroid(image, { radius: 2 });
  expect(result).toStrictEqual([{ column: 1, row: 0 }]);
});

test('triangle center of mass', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 0],
  ]);
  const result = getPatchIntensityCentroid(image, { radius: 2 });
  expect(result).toBeDeepCloseTo([{ column: 0.444, row: 0 }]);
});

test('patch, default options', () => {
  const image = testUtils.load('featureMatching/patch.png');
  image.invert({ out: image });

  const radius = 3;

  const centroid = getPatchIntensityCentroid(image)[0];
  expect(centroid).toBeDeepCloseTo({ column: -1.179, row: -0.183 });

  const center = image.getCoordinates('center');

  const point = round(sum(center, centroid));

  const result = image.convertColor('RGB');
  result.drawCircle(center, radius + 1, { color: [255, 0, 0], out: result });

  result.drawPoints([point], { color: [0, 255, 0], out: result });

  expect(result).toMatchImageSnapshot();
});

test('scalene triangle keypoint', () => {
  const origin = { row: 332, column: 253 };
  const size = 7;
  const radius = (size - 1) / 2;

  const cropOrigin = {
    row: origin.row - radius,
    column: origin.column - radius,
  };

  const origialImage = testUtils
    .load('featureMatching/polygons/scaleneTriangle.png')
    .convertColor('GREY')
    .invert();

  const image = origialImage.crop({
    origin: cropOrigin,
    width: size,
    height: size,
  });

  const centroid = getPatchIntensityCentroid(image, { radius })[0];
  expect(centroid).toBeDeepCloseTo({ column: 1.281, row: 0.204 });

  const center = image.getCoordinates('center');

  const point = round(sum(center, centroid));

  const result = image.convertColor('RGB');
  result.drawCircle(center, radius + 1, { color: [255, 0, 0], out: result });

  result.drawPoints([point], { color: [0, 255, 0], out: result });

  expect(result).toMatchImageSnapshot();
});

test('scalene triangle 90 keypoint', () => {
  const origin = { row: 868, column: 332 };
  const size = 7;
  const radius = (size - 1) / 2;

  const cropOrigin = {
    row: origin.row - radius,
    column: origin.column - radius,
  };

  const originalImage = testUtils
    .load('featureMatching/polygons/scaleneTriangle90.png')
    .convertColor('GREY')
    .invert();

  const image = originalImage.crop({
    origin: cropOrigin,
    width: size,
    height: size,
  });

  const centroid = getPatchIntensityCentroid(image, { radius })[0];
  expect(centroid).toBeDeepCloseTo({ column: 0.204, row: -1.281 });

  const center = image.getCoordinates('center');

  const point = round(sum(center, centroid));

  const result = image.convertColor('RGB');
  result.drawCircle(center, radius + 1, { color: [255, 0, 0], out: result });

  result.drawPoints([point], { color: [0, 255, 0], out: result });

  expect(result).toMatchImageSnapshot();
});
