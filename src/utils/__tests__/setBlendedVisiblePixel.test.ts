import { setBlendedVisiblePixel } from '../setBlendedVisiblePixel';

test('GREYA image, default options', () => {
  const image = testUtils.createGreyaImage([
    [50, 255],
    [20, 30],
  ]);
  setBlendedVisiblePixel(image, 0, 1);
  expect(image).toMatchImageData([
    [50, 255],
    [0, 255],
  ]);
});

test('GREYA image: set pixel out of bounds', () => {
  const data = [
    [50, 255, 1, 2, 3, 4],
    [20, 30, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6],
  ];
  const image = testUtils.createGreyaImage(data);
  setBlendedVisiblePixel(image, 0, 5, [40, 40]);
  expect(image).toMatchImageData(data);
});

test('RGBA image: set pixel out of bounds', () => {
  const data = [
    [50, 255, 1, 200, 2, 3, 4, 200],
    [20, 30, 5, 200, 6, 7, 8, 200],
    [1, 2, 3, 200, 4, 5, 6, 200],
  ];
  const image = testUtils.createGreyaImage(data);
  setBlendedVisiblePixel(image, 0, 5, [40, 40, 40, 40]);
  expect(image).toMatchImageData(data);
});

test('asymetrical test', () => {
  const image = testUtils.createGreyaImage([
    [50, 255, 1, 2, 3, 4],
    [20, 30, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6],
  ]);
  setBlendedVisiblePixel(image, 2, 0, [0, 125]);
  expect(image).toMatchImageData([
    [50, 255, 1, 2, 0, 127],
    [20, 30, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6],
  ]);
});
