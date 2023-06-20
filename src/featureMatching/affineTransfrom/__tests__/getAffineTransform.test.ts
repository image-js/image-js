import { Image } from '../../..';
import { TestImagePath } from '../../../../test/TestImagePath';
import { overlapImages } from '../../visualize/overlapImages';
import { getAffineTransform } from '../getAffineTransform';

test.each([
  {
    message: 'twice same image',
    source: 'polygons/scaleneTriangle',
    destination: 'polygons/scaleneTriangle',
    expected: { row: 0, column: 0 },
  },
  {
    message: 'rotation 10 degrees',
    source: 'polygons/scaleneTriangle',
    destination: 'polygons/scaleneTriangle10',
    expected: { row: 195, column: 1 },
  },
  {
    message: 'polygons',
    source: 'polygons/polygon',
    destination: 'polygons/polygon2',
    expected: { row: 68, column: 178 },
  },
])('various polygons ($message)', (data) => {
  const source = testUtils
    .load(`featureMatching/${data.source}.png` as TestImagePath)
    .convertColor('GREY');

  const destination = testUtils
    .load(`featureMatching/${data.destination}.png` as TestImagePath)
    .convertColor('GREY');

  const result = getAffineTransform(source, destination, {
    maxRansacNbIterations: 1000,
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

  const result = getAffineTransform(source, destination, {
    maxRansacNbIterations: 1000,
  });

  const transform = result.transform;

  expect(transform.translation).toBeDeepCloseTo(data.expected);
});

test('crosscheck = false', () => {
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

  const result = getAffineTransform(source, destination, {
    maxRansacNbIterations: 1000,
    crosscheck: false,
  });

  const transform = result.transform;

  expect(transform.translation).toBeDeepCloseTo(data.expected);
});

test('not enough matches found', () => {
  const source = new Image(100, 100);
  const destination = new Image(100, 100);

  expect(() => {
    getAffineTransform(source, destination, {
      maxRansacNbIterations: 1000,
      crosscheck: true,
    });
  }).toThrow(
    'Insufficient number of matches found to compute affine transform (less than 2).',
  );
});

test('debug = true', () => {
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

  const result = getAffineTransform(source, destination, {
    maxRansacNbIterations: 1000,
    crosscheck: false,
    debug: true,
  });

  const transform = result.transform;

  expect(transform.translation).toBeDeepCloseTo(data.expected);
});
