import { merge } from '../merge';

test('merge into RGB', () => {
  const img = testUtils.createRgbImage([[0, 1, 2, 253, 254, 255]]);
  const split = img.split();
  expect(merge(split)).toMatchImage(img);
});

test('merge into RGBA', () => {
  const img = testUtils.createRgbaImage([[0, 1, 2, 42, 253, 254, 255, 42]]);
  const split = img.split();
  expect(merge(split)).toMatchImage(img);
});

test('merge into GREYA', () => {
  const img = testUtils.createGreyaImage([[0, 1, 254, 255]]);
  const split = img.split();
  expect(merge(split)).toMatchImage(img);
});

test('throw on image with more than 1 channel', () => {
  const img1 = testUtils.createGreyaImage([[0, 1, 254, 255]]);
  const img2 = testUtils.createGreyImage([[0, 1, 254, 255]]);
  expect(() => {
    merge([img1, img2]);
  }).toThrow('each image must have one channel. Received 2');
  expect(() => {
    merge([img2, img1]);
  }).toThrow('each image must have one channel. Received 2');
});

test('throw on image with sizes different', () => {
  const img1 = testUtils.createGreyImage([[0, 1]]);
  const img2 = testUtils.createGreyImage([[0, 1, 254, 255]]);
  expect(() => {
    merge([img1, img2]);
  }).toThrow('all images must have the same width, height and bitDepth');
});

test('throw on too many images', () => {
  const img1 = testUtils.createGreyImage([[0, 1]]);
  const img2 = testUtils.createGreyImage([[0, 1, 254, 255]]);
  expect(() => {
    merge([img1, img2, img1, img2, img1]);
  }).toThrow('merge expects an array of two to four images. Received 5');
});
