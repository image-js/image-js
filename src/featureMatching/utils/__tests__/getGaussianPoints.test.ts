import { Image, ImageColorModel, ImageCoordinates } from '../../../Image';
import { getGaussianPoints, getGaussianValues } from '../getGaussianPoints';

test('gaussian values, size 7', () => {
  const result = new Float64Array([-1, -1, 2, -2, 2, 2, 0, 2, 1, -1]);
  expect(getGaussianValues(7, 0, 10)).toStrictEqual(result);
});

test('gaussian values, size 20', () => {
  const result = new Float64Array([-3, -2, 6, -6, 6, 6, 1, 5, 3, -2]);
  expect(getGaussianValues(20, 0, 10)).toStrictEqual(result);
});

test('10000 gaussian points, default options', () => {
  const size = 15;
  const image = new Image(size, size, { colorModel: ImageColorModel.GREY });

  const points = getGaussianPoints(size, size, { nbPoints: 10000 });

  const center = image.getCoordinates(ImageCoordinates.CENTER);
  for (let point of points) {
    const current = image.getValue(
      point.column + center.column,
      point.row + center.row,
      0,
    );
    if (current < 255) {
      image.setValue(
        point.column + center.column,
        point.row + center.row,
        0,
        current + 1,
      );
    }
  }

  expect(image).toMatchImageSnapshot();
});

test('10000 gaussian points, sigma = 1', () => {
  const size = 15;
  const image = new Image(size, size, { colorModel: ImageColorModel.GREY });

  const points = getGaussianPoints(size, size, { nbPoints: 10000, sigma: 1 });
  const center = image.getCoordinates(ImageCoordinates.CENTER);
  for (let point of points) {
    const current = image.getValue(
      point.column + center.column,
      point.row + center.row,
      0,
    );
    if (current < 255) {
      image.setValue(
        point.column + center.column,
        point.row + center.row,
        0,
        current + 1,
      );
    }
  }

  expect(image).toMatchImageSnapshot();
});

test('default pairs of points for getBriefDescriptors', () => {
  const size = 32;
  const nbPairs = 256;
  const scalingFactor = 20;

  const image = new Image(size * scalingFactor, size * scalingFactor, {
    colorModel: ImageColorModel.GREY,
  });

  const points = getGaussianPoints(size, size, { nbPoints: nbPairs * 2 });

  const center = image.getCoordinates(ImageCoordinates.CENTER);
  const absolutePoints = points.map((point) => {
    return {
      column: point.column * scalingFactor + center.column,
      row: point.row * scalingFactor + center.row,
    };
  });

  for (let i = 0; i < nbPairs; i++) {
    const p1 = absolutePoints[i];
    const p2 = absolutePoints[i + nbPairs];
    image.drawLine(p1, p2, { strokeColor: [255], out: image });
  }

  expect(image).toMatchImageSnapshot();
});
