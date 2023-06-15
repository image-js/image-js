import { writeSync } from '../../..';
import { TestImagePath } from '../../../../test/TestImagePath';
import { overlapImages } from '../../visualize/overlapImages';
import { getAffineTransform } from '../getAffineTransform';

test.each([
  // {
  //   message: 'twice same image',
  //   source: 'polygons/scaleneTriangle',
  //   destination: 'polygons/scaleneTriangle',
  //   expected: { row: 0, column: 0 },
  // },
  // {
  //   message: 'polygons',
  //   source: 'polygons/polygon',
  //   destination: 'polygons/polygon2',
  //   expected: { row: 68, column: 178 },
  // },
  {
    message: 'ID cards crops',
    source: 'id-crops/crop1',
    destination: 'id-crops/crop2',
    expected: { row: -7, column: 1 },
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

  console.log(result);

  const transform = result.transform;

  // expect(transform.translation).toBeDeepCloseTo(data.expected);

  const origin = {
    column: -transform.translation.column,
    row: -transform.translation.row,
  };

  const image = overlapImages(source, destination, {
    origin,
    angle: -transform.rotation,
    scale: transform.scale,
  });

  writeSync(`${__dirname}/result.png`, image);
  // expect(image).toMatchImageSnapshot();
});
