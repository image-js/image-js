import { ImageColorModel } from '../../utils/constants/colorModels';

test('split RGB', () => {
  const img = testUtils.createRgbImage([[0, 1, 2, 253, 254, 255]]);
  const split = img.split();
  expect(split).toHaveLength(3);
  for (const g of split) {
    expect(g).toMatchObject({
      width: 2,
      height: 1,
      colorModel: ImageColorModel.GREY,
    });
  }
  expect(split[0]).toMatchImageData([[0, 253]]);
  expect(split[1]).toMatchImageData([[1, 254]]);
  expect(split[2]).toMatchImageData([[2, 255]]);
});

test('split GREYA', () => {
  const img = testUtils.createGreyaImage([[0, 1, 254, 255]]);
  const split = img.split();
  expect(split).toHaveLength(2);
  expect(split[0]).toMatchImageData([[0, 254]]);
  expect(split[1]).toMatchImageData([[1, 255]]);
});
