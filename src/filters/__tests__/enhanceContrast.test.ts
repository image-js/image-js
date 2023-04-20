import { enhanceContrast } from '../enhanceContrast';

test('3x1 rgba image, custom output min and max', () => {
  const image = testUtils.createRgbaImage([
    [0, 100, 0, 50],
    [127, 150, 0, 50],
    [255, 200, 0, 50],
  ]);

  const result = enhanceContrast(image);

  expect(result).toMatchImageData([
    [0, 0, 0, 50],
    [127, 127, 0, 50],
    [255, 255, 0, 50],
  ]);
});

test('1x3 grey image', () => {
  const image = testUtils.createGreyImage([[50, 100]]);
  expect(enhanceContrast(image)).toMatchImageData([[0, 255]]);
});

test('alpha should not be modified', () => {
  const image = testUtils.createGreyaImage([
    [50, 100],
    [100, 50],
  ]);
  expect(enhanceContrast(image)).toMatchImageData([
    [0, 100],
    [255, 50],
  ]);
});

test('out option', () => {
  const image = testUtils.createGreyaImage([
    [0, 10],
    [30, 40],
    [60, 70],
  ]);
  const result = enhanceContrast(image, { out: image });
  expect(result).toMatchImageData([
    [0, 10],
    [127, 40],
    [255, 70],
  ]);
  expect(result).toBe(image);
});

test('bigger image', () => {
  const image = testUtils.load('featureMatching/id-crops/crop1.png');
  expect(enhanceContrast(image)).toMatchImageSnapshot();
});
