import { IJS } from '../..';
import { ImageColorModel } from '../colorModels';
import { copyData } from '../copyData';

describe('copyData', () => {
  it('2x3 GREY image', () => {
    const source = testUtils.createGreyImage([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    let target = new IJS(3, 2, { colorModel: ImageColorModel.GREY });
    copyData(target, source);
    expect(target).toMatchImageData([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });
  it('check error', () => {
    const source = testUtils.createGreyImage([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    let target = new IJS(5, 2, { colorModel: ImageColorModel.GREY });
    expect(() => {
      copyData(target, source);
    }).toThrow('copyData: images width, height or color model is different');
  });
});
