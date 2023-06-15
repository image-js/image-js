import { TestImagePath } from '../../../../test/TestImagePath';
import { overlapImages } from '../../visualize/overlapImages';
import { getAffineTransform } from '../getAffineTransform';

test.each([
  {
    message: 'twice same image',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle',
    expected: { row: 0, column: 0 },
  },
  // {
  //   message: 'polygons',
  //   source: 'polygon',
  //   destination: 'polygon2',
  //   expected: { row: 68, column: 178 },
  // },
])('various polygons($message)', (data) => {
  const source = testUtils
    .load(`featureMatching/polygons/${data.source}.png` as TestImagePath)
    .convertColor('GREY');

  const destination = testUtils
    .load(`featureMatching/polygons/${data.destination}.png` as TestImagePath)
    .convertColor('GREY');

  const result = getAffineTransform(source, destination);

  const transform = result.transform;

  expect(transform.translation).toBeDeepCloseTo(data.expected);

  const image = overlapImages(destination, source, {
    origin: transform.translation,
  });

  expect(image).toMatchImageSnapshot();
});
