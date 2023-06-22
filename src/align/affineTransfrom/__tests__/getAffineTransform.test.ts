import { Image } from '../../..';
import { TestImagePath } from '../../../../test/TestImagePath';
import { overlapImages } from '../../../featureMatching/visualize/overlapImages';
import { getAffineTransform } from '../getAffineTransform';

test('RGB images', () => {
  const data = {
    source: 'polygons/scaleneTriangle',
    destination: 'polygons/scaleneTriangle',
    expected: { row: 0, column: 0 },
  };

  const source = testUtils.load(
    `featureMatching/${data.source}.png` as TestImagePath,
  );

  const destination = testUtils.load(
    `featureMatching/${data.destination}.png` as TestImagePath,
  );

  const result = getAffineTransform(source, destination);

  const transform = result.transform;

  expect(transform.translation).toBeDeepCloseTo(data.expected);

  const image = overlapImages(source, destination, {
    origin: transform.translation,
    angle: -transform.rotation,
    scale: transform.scale,
  });

  expect(image).toMatchImageSnapshot();
});

test('crosscheck = false', () => {
  const data = {
    message: 'polygons',
    source: 'polygons/polygon',
    destination: 'polygons/polygon2',
    expected: { row: 68, column: 178 },
  };

  const source = testUtils.load(
    `featureMatching/${data.source}.png` as TestImagePath,
  );

  const destination = testUtils.load(
    `featureMatching/${data.destination}.png` as TestImagePath,
  );

  const result = getAffineTransform(source, destination, {
    maxRansacNbIterations: 1000,
    crosscheck: false,
  });

  const transform = result.transform;

  expect(transform.translation).toBeDeepCloseTo(data.expected);

  const image = overlapImages(source, destination, {
    origin: transform.translation,
    angle: -transform.rotation,
    scale: transform.scale,
  });

  expect(image).toMatchImageSnapshot();
});

test('debug = true', () => {
  const data = {
    message: 'rotation 10 degrees',
    source: 'polygons/scaleneTriangle',
    destination: 'polygons/scaleneTriangle10',
    expected: { row: 195, column: 1 },
  };

  const source = testUtils.load(
    `featureMatching/${data.source}.png` as TestImagePath,
  );

  const destination = testUtils.load(
    `featureMatching/${data.destination}.png` as TestImagePath,
  );

  const result = getAffineTransform(source, destination, {
    maxRansacNbIterations: 1000,
    crosscheck: false,
    debug: true,
  });

  const transform = result.transform;

  expect(transform.translation).toBeDeepCloseTo(data.expected);

  const image = overlapImages(source, destination, {
    origin: transform.translation,
    angle: -transform.rotation,
    scale: transform.scale,
  });

  expect(image).toMatchImageSnapshot();
});

test('not enough matches found', () => {
  const source = new Image(50, 50);
  const destination = new Image(50, 50);

  expect(() => {
    getAffineTransform(source, destination, {
      maxRansacNbIterations: 1000,
      crosscheck: true,
    });
  }).toThrow(
    'Insufficient number of matches found to compute affine transform (less than 2).',
  );
});
