import { encodePng, Mask } from '../..';

test('mask 5x5, default options', () => {
  const image = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ]);

  expect(image.solidFill()).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('pixels touching border', () => {
  const image = testUtils.createMask([
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ]);

  expect(image.solidFill()).toMatchMaskData([
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('mask should not change', () => {
  const image = testUtils.createMask([
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ]);

  expect(image.solidFill()).toMatchMaskData([
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('allowCorners true', () => {
  const image = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ]);

  expect(image.solidFill({ allowCorners: true })).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ]);
});

test('1x1 mask', () => {
  const image = testUtils.createMask([[0]]);

  expect(image.solidFill({ allowCorners: true })).toMatchMaskData([[0]]);
});

test('Out option', () => {
  const image = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ]);

  const out = new Mask(5, 5);

  image.solidFill({ out });
  expect(out).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('in place modification', () => {
  const image = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ]);

  image.solidFill({ out: image });
  expect(image).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ]);
});

test('larger image', () => {
  const image = testUtils.load('morphology/alphabetCannyEdge.png');
  const mask = image.threshold();
  const solided = mask.solidFill();
  const png = Buffer.from(encodePng(solided.convertColor('GREY')));

  expect(png).toMatchImageSnapshot();
});
