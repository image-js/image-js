import { ImageColorModel, Image, ImageCoordinates } from '../../../Image';
import { round, sum } from '../../../utils/geometry/points';
import { getPatchIntensityCentroid } from '../getPatchIntensityCentroid';

test('3x3 empty image', () => {
  const image = new Image(7, 7, { colorModel: ImageColorModel.GREY });
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

test('patch, default options', () => {
  const image = testUtils.load('featureMatching/patch.png');
  image.invert({ out: image });

  const radius = 3;

  const centroid = getPatchIntensityCentroid(image)[0];
  expect(centroid).toBeDeepCloseTo({ column: -1.179, row: -0.183 });

  const center = image.getCoordinates(ImageCoordinates.CENTER);

  const point = round(sum(center, centroid));

  const result = image.convertColor(ImageColorModel.RGB);
  result.drawCircle(center, radius + 1, { color: [255, 0, 0], out: result });

  result.drawPoints([point], { color: [0, 255, 0], out: result });

  expect(result).toMatchImageSnapshot();
});
