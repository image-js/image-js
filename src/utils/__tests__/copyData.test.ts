import { IJS } from '../..';
import { ImageColorModel } from '../constants/colorModels';
import { copyData } from '../copyData';

test('2x3 GREY image', () => {
  const source = testUtils.createGreyImage([
    [1, 2, 3],
    [4, 5, 6],
  ]);
  let target = new IJS(3, 2, { colorModel: ImageColorModel.GREY });
  copyData(source, target);
  expect(target).toMatchImageData([
    [1, 2, 3],
    [4, 5, 6],
  ]);
});

test('check error', () => {
  const source = testUtils.createGreyImage([
    [1, 2, 3],
    [4, 5, 6],
  ]);
  let target = new IJS(5, 2, { colorModel: ImageColorModel.GREY });
  expect(() => {
    copyData(source, target);
  }).toThrow('copyData: images width, height or color model is different');
});
