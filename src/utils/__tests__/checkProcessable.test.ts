import { ColorDepth } from '../..';
import checkProcessable from '../checkProcessable';
import { ImageColorModel } from '../colorModels';

describe('checkProcessable', () => {
  it('wrong bit depth', () => {
    const img = testUtils.createGreyImage([
      [0, 1],
      [2, 3],
    ]);
    expect(() => {
      checkProcessable(img, 'test', {
        bitDepth: [ColorDepth.UINT1, ColorDepth.UINT16],
      });
    }).toThrow(
      /The process "test" can only be applied if bit depth is 1 or 16/,
    );
  });
  it('wrong alpha', () => {
    const img = testUtils.createGreyImage([
      [0, 1],
      [2, 3],
    ]);
    expect(() => {
      checkProcessable(img, 'test', { alpha: true });
    }).toThrow(/The process "test" can only be applied if alpha is true/);
  });
  it('wrong color model', () => {
    const img = testUtils.createGreyImage([
      [0, 1],
      [2, 3],
    ]);
    expect(() => {
      checkProcessable(img, 'test', { colorModel: [ImageColorModel.RGB] });
    }).toThrow(/The process "test" can only be applied if color model is RGB/);
  });
  it('wrong number of components', () => {
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
  it('wrong number of channels', () => {
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
});
