import { Image } from '../../../Image';
import { getKeypointColor } from '../getKeypointColor';
import { getScoreColors } from '../getScoreColors';

const origin = { column: 0, row: 0 };

test('keypoint should have middle color', () => {
  const image = new Image(5, 5);
  const keypoints = [
    { origin, score: 5 },
    { origin, score: 4 },
    { origin, score: 3 },
    { origin, score: 2 },
    { origin, score: 1 },
  ];

  const colors = getScoreColors(image, [255, 0, 0], 5);
  expect(colors).toStrictEqual([
    [255, 0, 0],
    [195, 0, 0],
    [135, 0, 0],
    [75, 0, 0],
    [15, 0, 0],
  ]);

  let result = [];
  for (let i = 0; i < keypoints.length; i++) {
    result.push(getKeypointColor(keypoints, i, colors));
  }
  expect(result).toStrictEqual(colors);
});
