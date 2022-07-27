import { ColorDepth } from '../..';
import checkProcessable from '../checkProcessable';
import { ImageColorModel } from '../constants/colorModels';

test('wrong bit depth', () => {
  const img = testUtils.createGreyImage([
    [0, 1],
    [2, 3],
  ]);
  expect(() => {
    checkProcessable(img, 'test', {
      bitDepth: [ColorDepth.UINT1, ColorDepth.UINT16],
    });
  }).toThrow(/The process "test" can only be applied if bit depth is 1 or 16/);
});

test('wrong alpha', () => {
  const img = testUtils.createGreyImage([
    [0, 1],
    [2, 3],
  ]);
  expect(() => {
    checkProcessable(img, 'test', { alpha: true });
  }).toThrow(/The process "test" can only be applied if alpha is true/);
});

test('wrong color model', () => {
  const img = testUtils.createGreyImage([
    [0, 1],
    [2, 3],
  ]);
  expect(() => {
    checkProcessable(img, 'test', { colorModel: [ImageColorModel.RGB] });
  }).toThrow(/The process "test" can only be applied if color model is RGB/);
});

test('wrong number of components', () => {
  const img = testUtils.createGreyImage([
    [0, 1],
    [2, 3],
  ]);
  expect(() => {
    checkProcessable(img, 'test', {
      components: [2, 4],
    });
  }).toThrow(
    /The process "test" can only be applied if the number of components is 2 or 4/,
  );
});

test('wrong number of channels', () => {
  const img = testUtils.createGreyImage([
    [0, 1],
    [2, 3],
  ]);
  expect(() => {
    checkProcessable(img, 'test', {
      channels: [2, 3],
    });
  }).toThrow(
    /The process "test" can only be applied if the number of channels is 2 or 3/,
  );
});

test('only one valid depth or channel', () => {
  const img = testUtils.createGreyImage([
    [0, 1],
    [2, 3],
  ]);
  expect(() => {
    checkProcessable(img, 'test', {
      bitDepth: ColorDepth.UINT8,
      channels: 1,
    });
  }).not.toThrow();
});

test('only grey images accepted', () => {
  const img = testUtils.createRgbImage([[0, 1, 2]]);
  expect(() => {
    checkProcessable(img, 'test', {
      bitDepth: ColorDepth.UINT8,
      components: 1,
    });
  }).toThrow(
    `You should transform your image using "image.grey()" before applying the algorithm`,
  );
});
