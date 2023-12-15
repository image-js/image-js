import { Stack } from '../../../Stack';

test('two grey images, bitsDepth = 8', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const stack = new Stack([image, image]);

  const histogram = stack.histogram();

  expect(histogram).toHaveLength(256);
  expect(histogram.subarray(0, 5)).toStrictEqual(
    new Uint32Array([0, 2, 2, 2, 2]),
  );
});

test('two grey images, bitsDepth = 16', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 5, 6, 7]]);
  const stack = new Stack([image1, image2]);

  const histogram = stack.histogram();

  expect(histogram).toHaveLength(256);
  expect(histogram.subarray(0, 8)).toStrictEqual(
    new Uint32Array([0, 1, 1, 1, 2, 1, 1, 1]),
  );
});

test('two RGB images, channel = 2', () => {
  const image1 = testUtils.createRgbImage([[1, 2, 0]]);
  const image2 = testUtils.createRgbImage([[4, 5, 1]]);
  const stack = new Stack([image1, image2]);

  const histogram = stack.histogram({ channel: 2 });

  expect(histogram).toHaveLength(256);
  expect(histogram.subarray(0, 2)).toStrictEqual(new Uint32Array([1, 1]));
});

test('two grey images, slots = 2', () => {
  const image1 = testUtils.createGreyImage([[1, 200, 3, 150]]);
  const image2 = testUtils.createGreyImage([[200, 5, 190, 7]]);
  const stack = new Stack([image1, image2]);

  const histogram = stack.histogram({ slots: 2 });

  expect(histogram).toHaveLength(2);
  expect(histogram).toStrictEqual(new Uint32Array([4, 4]));
});
