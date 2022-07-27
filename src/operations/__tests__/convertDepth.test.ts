import { ColorDepth } from '../../IJS';
import { ImageColorModel } from '../../utils/constants/colorModels';

test('Uint8 to Uint16', () => {
  const img = testUtils.createGreyImage([
    [1, 2],
    [3, 4],
  ]);

  const newImg = img.convertDepth(ColorDepth.UINT16);
  expect(newImg.width).toBe(2);
  expect(newImg.height).toBe(2);
  expect(newImg.depth).toStrictEqual(ColorDepth.UINT16);
  expect(newImg.colorModel).toStrictEqual(ImageColorModel.GREY);
  expect(newImg).toMatchImageData([
    [256, 512],
    [768, 1024],
  ]);
});

test('Uint16 to Uint8', () => {
  const img = testUtils.createGreyImage(
    [
      [30, 260],
      [512, 2047],
    ],
    { depth: ColorDepth.UINT16 },
  );

  const newImg = img.convertDepth(ColorDepth.UINT8);
  expect(newImg.width).toBe(2);
  expect(newImg.height).toBe(2);
  expect(newImg.depth).toStrictEqual(ColorDepth.UINT8);
  expect(newImg.colorModel).toStrictEqual(ImageColorModel.GREY);
  expect(newImg).toMatchImageData([
    [0, 1],
    [2, 7],
  ]);
});

test('Uint16 to Uint8 for rgba', () => {
  const img = testUtils.createRgbaImage(
    [
      [256, 256, 256, 256, 512, 512, 512, 512],
      [768, 768, 768, 768, 1024, 1024, 1024, 1024],
    ],
    { depth: ColorDepth.UINT16 },
  );

  const newImg = img.convertDepth(ColorDepth.UINT8);
  expect(newImg.width).toBe(2);
  expect(newImg.height).toBe(2);
  expect(newImg.colorModel).toStrictEqual(ImageColorModel.RGBA);
  expect(newImg.depth).toStrictEqual(ColorDepth.UINT8);
  expect(newImg).toMatchImageData([
    [1, 1, 1, 1, 2, 2, 2, 2],
    [3, 3, 3, 3, 4, 4, 4, 4],
  ]);
});

test('throw if converting to same depth', () => {
  const img = testUtils.createRgbaImage([
    [256, 256, 256, 256, 512, 512, 512, 512],
    [768, 768, 768, 768, 1024, 1024, 1024, 1024],
  ]);

  expect(() => {
    img.convertDepth(ColorDepth.UINT8);
  }).toThrow('convertDepth: cannot convert image to same depth');
});
