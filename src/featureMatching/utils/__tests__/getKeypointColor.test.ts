import { Image } from '../../../Image';
import { getColors } from '../getColors';
import { getKeypointColor } from '../getKeypointColor';

const origin = { column: 0, row: 0 };

test('keypoint should all have a different color', () => {
  const image = new Image(5, 5);
  const keypoints = [
    { origin, score: 5 },
    { origin, score: 4 },
    { origin, score: 3 },
    { origin, score: 2 },
    { origin, score: 1 },
  ];

  const colors = getColors(image, [255, 0, 0], { nbShades: 5 });
  const result = [];
  for (let i = 0; i < keypoints.length; i++) {
    result.push(getKeypointColor(keypoints, i, colors));
  }
  expect(result).toStrictEqual(colors);
});

test('keypoint with more random scores', () => {
  const image = new Image(5, 5);
  const keypoints = [
    { origin, score: 50 },
    { origin, score: 40 },
    { origin, score: 10 },
    { origin, score: 5 },
    { origin, score: 1 },
  ];

  const colors = getColors(image, [255, 0, 0], { nbShades: 5 });

  const result = [];
  for (let i = 0; i < keypoints.length; i++) {
    result.push(getKeypointColor(keypoints, i, colors));
  }
  expect(result).toStrictEqual([
    [255, 0, 0],
    [204, 0, 0],
    [51, 0, 0],
    [51, 0, 0],
    [51, 0, 0],
  ]);
});

test('all keypoints have same score', () => {
  const image = new Image(5, 5);
  const keypoints = [
    { origin, score: 50 },
    { origin, score: 50 },
  ];

  const colors = getColors(image, [255, 0, 0], { nbShades: 5 });

  const result = [];
  for (let i = 0; i < keypoints.length; i++) {
    result.push(getKeypointColor(keypoints, i, colors));
  }
  expect(result).toStrictEqual([
    [255, 0, 0],
    [255, 0, 0],
  ]);
});
