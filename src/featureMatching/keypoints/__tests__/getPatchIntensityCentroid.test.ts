import { ImageColorModel, Image, ImageCoordinates } from '../../../Image';
import { round, sum } from '../../../utils/geometry/points';
import { getPatchIntensityCentroid } from '../getPatchIntensityCentroid';

test('3x3 empty image', () => {
  const image = new Image(7, 7, { colorModel: ImageColorModel.GREY });
  const result = getPatchIntensityCentroid(image);
  expect(result).toStrictEqual([{ column: 0, row: 0 }]);
});

test.only('patch, default options', () => {
  const image = testUtils.load('featureMatching/patch.png');
  console.log(image.colorModel);

  const centroid = round(getPatchIntensityCentroid(image)[0]);
  console.log(centroid);

  const center = image.getCoordinates(ImageCoordinates.CENTER);

  const point = sum(center, centroid);
  console.log(point);

  const result = image.convertColor(ImageColorModel.RGB);
  for (let i = 14; i < 15; i++) {
    result.drawPoints([{ row: i, column: i }], {
      color: [0, 255, 0],
      out: result,
    });
  }

  expect(result).toMatchImageSnapshot();
});
