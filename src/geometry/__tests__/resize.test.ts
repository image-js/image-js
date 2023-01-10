import { ImageColorModel } from '../../Image';
import { encodePng } from '../../save';

test.skip('compares result of resize with opencv', () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    xFactor: 10,
    yFactor: 10,
  });

  expect(resized).toMatchImage('opencv/testResizeBilinear.png');
});

test('result should have correct dimensions', () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    xFactor: 10,
    yFactor: 10,
  });
  expect(resized.width).toBe(10 * img.width);
  expect(resized.height).toBe(10 * img.height);
});

test('resize to given width and height', () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    width: 300,
    height: 100,
  });

  expect(resized.width).toBe(300);
  expect(resized.height).toBe(100);
});

test('has to match snapshot', () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    xFactor: 10,
    yFactor: 10,
  });

  const png = Buffer.from(
    encodePng(resized.convertColor(ImageColorModel.GREY)),
  );

  expect(png).toMatchImageSnapshot();
});

test('aspect ratio not preserved', () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({ preserveAspectRatio: false, height: 50 });

  expect(resized.width).toBe(img.width);
  expect(resized.height).toBe(50);
});

test('xFactor = 2', () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({ xFactor: 2 });

  expect(resized.width).toBe(2 * img.width);
  expect(resized.height).toBe(2 * img.height);
});

test('yFactor = 2', () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({ yFactor: 2 });

  expect(resized.width).toBe(2 * img.width);
  expect(resized.height).toBe(2 * img.height);
});

test('should throw no parameter', () => {
  const img = testUtils.load('opencv/test.png');

  expect(() => {
    img.resize({});
  }).toThrow(
    'At least one of the width, height, xFactor or yFactor options must be passed',
  );
});

test('should throw factor and size used at the same time', () => {
  const img = testUtils.load('opencv/test.png');

  expect(() => {
    img.resize({ yFactor: 2, height: 50 });
  }).toThrow('factor and size cannot be passed together');
});
