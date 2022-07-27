import { cropAlpha } from '../cropAlpha';

test('GREYA, no crop', () => {
  const image = testUtils.createGreyaImage([
    [1, 255, 2, 255, 3, 255],
    [4, 255, 5, 255, 6, 255],
    [7, 255, 8, 255, 9, 255],
    [10, 255, 11, 255, 12, 255],
  ]);

  const cropped = cropAlpha(image);
  expect(cropped).toMatchImage(image);
});

test('GREYA, some crop', () => {
  const image = testUtils.createGreyaImage([
    [1, 0, 2, 255, 3, 255],
    [4, 0, 5, 255, 6, 255],
    [7, 0, 8, 255, 9, 255],
    [10, 0, 11, 0, 12, 0],
  ]);

  const cropped = image.cropAlpha();
  expect(cropped).toMatchImageData([
    [2, 255, 3, 255],
    [5, 255, 6, 255],
    [8, 255, 9, 255],
  ]);
});

test('GREYA, single pixel remains', () => {
  const image = testUtils.createGreyaImage([
    [1, 0, 2, 0, 3, 0],
    [4, 0, 5, 255, 6, 0],
    [7, 0, 8, 0, 9, 0],
    [10, 0, 11, 0, 12, 0],
  ]);

  const cropped = image.cropAlpha();
  expect(cropped).toMatchImageData([[5, 255]]);
});

test('GREYA, other threshold', () => {
  const image = testUtils.createGreyaImage([
    [1, 0, 2, 240, 3, 0],
    [4, 110, 5, 255, 6, 250],
    [7, 110, 8, 239, 9, 250],
    [10, 10, 11, 0, 12, 90],
  ]);

  const cropped = image.cropAlpha({ threshold: 240 });
  expect(cropped).toMatchImageData([
    [2, 240, 3, 0],
    [5, 255, 6, 250],
    [8, 239, 9, 250],
  ]);
});

test('should throw if result is empty', () => {
  const image = testUtils.createGreyaImage([
    [1, 40, 2, 240, 3, 50],
    [4, 110, 5, 0, 6, 250],
    [7, 110, 8, 239, 9, 250],
    [10, 10, 11, 0, 12, 90],
  ]);

  expect(() => {
    image.cropAlpha();
  }).toThrow(/Could not find new dimensions. Threshold may be too high./);
});
