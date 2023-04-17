import checkProcessable from '../checkProcessable';

test('wrong bit depth', () => {
  const img = testUtils.createGreyImage([
    [0, 1],
    [2, 3],
  ]);
  expect(() => {
    checkProcessable(img, {
      bitDepth: [1, 16],
    });
  }).toThrow('image bitDepth must be 1 or 16 to apply this algorithm');
});

test('wrong alpha', () => {
  const img = testUtils.createGreyImage([
    [0, 1],
    [2, 3],
  ]);
  expect(() => {
    checkProcessable(img, { alpha: true });
  }).toThrow('image alpha must be true to apply this algorithm');
});

test('wrong color model', () => {
  const img = testUtils.createGreyImage([
    [0, 1],
    [2, 3],
  ]);
  expect(() => {
    checkProcessable(img, { colorModel: ['RGB'] });
  }).toThrow('image colorModel must be RGB to apply this algorithm');
});

test('wrong number of components', () => {
  const img = testUtils.createGreyImage([
    [0, 1],
    [2, 3],
  ]);
  expect(() => {
    checkProcessable(img, {
      components: [2, 4],
    });
  }).toThrow('image components must be 2 or 4 to apply this algorithm');
});

test('wrong number of channels', () => {
  const img = testUtils.createGreyImage([
    [0, 1],
    [2, 3],
  ]);
  expect(() => {
    checkProcessable(img, {
      channels: [2, 3],
    });
  }).toThrow(/image channels must be 2 or 3 to apply this algorithm/);
});

test('only one valid bit depth or channel', () => {
  const img = testUtils.createGreyImage([
    [0, 1],
    [2, 3],
  ]);
  expect(() => {
    checkProcessable(img, {
      bitDepth: 8,
      channels: 1,
    });
  }).not.toThrow();
});

test('only grey images accepted', () => {
  const img = testUtils.createRgbImage([[0, 1, 2]]);
  expect(() => {
    checkProcessable(img, {
      bitDepth: 8,
      components: 1,
    });
  }).toThrow(
    'image components must be 1 to apply this algorithm. The image can be converted using "image.grey()"',
  );
});
