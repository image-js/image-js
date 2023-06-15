import { TestImagePath } from '../../../../test/TestImagePath';
import { overlapImages } from '../../visualize/overlapImages';
import { getAffineTransform } from '../getAffineTransform';

test.each([
  {
    message: 'twice same image',
    imageName: 'twice-same-image',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle',
    expected: { row: 0, column: 0 },
  },
  {
    message: 'scalene triangles',
    imageName: 'scalene-triangles',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle2',
    expected: { row: 39, column: 1 },
  },
])('various polygons($message)', (data) => {
  const source = testUtils
    .load(`featureMatching/polygons/${data.source}.png` as TestImagePath)
    .convertColor('GREY');

  const destination = testUtils
    .load(`featureMatching/polygons/${data.destination}.png` as TestImagePath)
    .convertColor('GREY');

  const result = getAffineTransform(source, destination);

  // expect(result).toBeDeepCloseTo(data.expected);

  const image = overlapImages(source, destination, {
    origin: result.translation,
  });

  expect(image).toMatchImageSnapshot();
});
