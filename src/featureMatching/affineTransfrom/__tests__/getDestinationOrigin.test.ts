import { TestImagePath } from '../../../../test/TestImagePath';
import { getDestinationOrigin } from '../getDestinationOrigin';

test.each([
  {
    message: 'scalene triangle',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle2',
    expected: 2,
  },
])('various polygons($message)', (data) => {
  const source = testUtils
    .load(`featureMatching/polygons/${data.source}.png` as TestImagePath)
    .convertColor('GREY');

  const destination = testUtils
    .load(`featureMatching/polygons/${data.destination}.png` as TestImagePath)
    .convertColor('GREY');

  const result = getDestinationOrigin(source, destination);
});
