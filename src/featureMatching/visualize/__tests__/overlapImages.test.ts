import { overlapImages } from '../overlapImages';

test('two triangles', () => {
  const source = testUtils.load('featureMatching/polygons/scaleneTriangle.png');
  const destination = testUtils.load(
    'featureMatching/polygons/scaleneTriangle2.png',
  );

  const result = overlapImages(source, destination);

  expect(result).toMatchImageSnapshot();
});

test('scale cannot be zero', () => {
  const source = testUtils.load('featureMatching/polygons/scaleneTriangle.png');
  const destination = testUtils.load(
    'featureMatching/polygons/scaleneTriangle2.png',
  );
  expect(() => {
    overlapImages(source, destination, { scale: 0 });
  }).toThrow('Scale cannot be 0');
});
