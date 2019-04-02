import { getImage, getTestImage } from 'test';
import { ImageKind, write } from 'ijs';

test('RGBA image - channel 0', () => {
  const image = getImage(
    [[[230, 80, 120, 255]], [[100, 140, 13, 1]]],
    ImageKind.RGBA
  );
  const histogram = image.histogram({ channel: 0 });
  const expected = new Array(256).fill(0);
  expected[230] = 1;
  expected[100] = 1;
  expect(histogram).toStrictEqual(expected);
});

test('RGBA image - channel 2', () => {
  const image = getImage(
    [[[230, 80, 120, 255]], [[100, 140, 120, 1]]],
    ImageKind.RGBA
  );
  const histogram = image.histogram({ channel: 2 });
  const expected = new Array(256).fill(0);
  expected[120] = 2;
  expect(histogram).toStrictEqual(expected);
});

test('binary image', function () {
  const image = getImage(
    [
      [0, 0, 0, 0, 0],
      [0, 255, 255, 255, 0],
      [0, 255, 255, 255, 0],
      [0, 255, 255, 255, 0],
      [0, 0, 0, 0, 0]
    ],
    ImageKind.GREY
  );
  const histogram = image.histogram();
  expect(histogram[0]).toStrictEqual(16);
  expect(histogram[255]).toStrictEqual(9);
});

test('throw if channel option is missing', () => {
  const image = getTestImage();
  expect(() => image.histogram()).toThrow(
    /channel option is mandatory for multi-channel images/
  );
});
