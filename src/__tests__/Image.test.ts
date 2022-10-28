import { inspect } from 'node:util';

import { Image, ColorDepth, ImageCoordinates } from '../Image';
import { ImageColorModel } from '../utils/constants/colorModels';

describe('create new images', () => {
  it('should create a 8-bit image', () => {
    const img = new Image(10, 20);
    expect(img).toMatchObject({
      width: 10,
      height: 20,
      size: 200,
      depth: ColorDepth.UINT8,
      colorModel: ImageColorModel.RGB,
      components: 3,
      channels: 3,
      alpha: false,
      maxValue: 255,
    });
    expect(img.getRawImage().data).toHaveLength(600);
  });

  it('should create a 16-bit image', () => {
    const img = new Image(10, 20, { depth: ColorDepth.UINT16 });
    expect(img).toMatchObject({
      width: 10,
      height: 20,
      size: 200,
      depth: ColorDepth.UINT16,
      colorModel: ImageColorModel.RGB,
      components: 3,
      channels: 3,
      alpha: false,
      maxValue: 65535,
    });
    expect(img.getRawImage().data).toHaveLength(600);
  });

  it('should create a grey image with alpha', () => {
    const img = new Image(10, 20, { colorModel: ImageColorModel.GREYA });
    expect(img).toMatchObject({
      depth: ColorDepth.UINT8,
      colorModel: ImageColorModel.GREYA,
      components: 1,
      channels: 2,
      alpha: true,
    });
    expect(img.getRawImage().data).toHaveLength(400);
  });

  it('should create from existing data array', () => {
    // prettier-ignore
    const data = Uint8Array.from([
      0, 1, 2,
      3, 4, 5
    ]);
    const img = new Image(3, 2, { data, colorModel: ImageColorModel.GREY });
    expect(img.getValue(0, 1, 0)).toBe(3);
    expect(img.getRawImage().data).toBe(data);
  });

  it('should throw on wrong width', () => {
    expect(() => new Image(0, 1)).toThrow(
      /width must be an integer and at least 1. Received 0/,
    );
    expect(() => new Image(0.5, 1)).toThrow(
      /width must be an integer and at least 1. Received 0.5/,
    );
  });

  it('should throw on wrong height', () => {
    expect(() => new Image(1, 0)).toThrow(
      /height must be an integer and at least 1. Received 0/,
    );
    expect(() => new Image(1, 0.5)).toThrow(
      /height must be an integer and at least 1. Received 0.5/,
    );
  });

  it('should throw on wrong data size', () => {
    const data = new Uint16Array(2);
    expect(() => new Image(2, 2, { data, depth: ColorDepth.UINT16 })).toThrow(
      /incorrect data size: 2. Expected 12/,
    );
  });

  it('should throw on wrong bit depth', () => {
    expect(() => new Image(1, 1, { depth: 20 })).toThrow(
      /unexpected color depth: 20/,
    );
  });
  it('should throw depth 8 but data 16', () => {
    const data = new Uint16Array([1, 2, 3, 4]);
    expect(
      () => new Image(2, 2, { colorModel: ImageColorModel.GREY, data }),
    ).toThrow('depth is 8 but data is Uint16Array');
  });
  it('should throw depth 16 but data 8', () => {
    const data = new Uint8Array([1, 2, 3, 4]);
    expect(
      () =>
        new Image(2, 2, {
          colorModel: ImageColorModel.GREY,
          depth: ColorDepth.UINT16,
          data,
        }),
    ).toThrow('depth is 16 but data is Uint8Array');
  });
});

describe('get and set pixels', () => {
  it('should get and set', () => {
    const img = new Image(10, 20);
    expect(img.getPixel(5, 15)).toStrictEqual([0, 0, 0]);
    img.setPixel(5, 15, [1, 3, 5]);
    expect(img.getPixel(5, 15)).toStrictEqual([1, 3, 5]);
  });

  it('should get and set by index', () => {
    const img = new Image(10, 20);
    expect(img.getPixelByIndex(5)).toStrictEqual([0, 0, 0]);
    img.setPixelByIndex(5, [1, 3, 5]);
    expect(img.getPixelByIndex(5)).toStrictEqual([1, 3, 5]);
  });

  it('get pixel by index in grey image', () => {
    const img = testUtils.createGreyImage([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    expect(img.getPixelByIndex(0)).toStrictEqual([1]);
    expect(img.getPixelByIndex(4)).toStrictEqual([5]);
  });

  it('should get and set value', () => {
    const img = new Image(10, 20);
    expect(img.getValue(5, 15, 0)).toBe(0);
    img.setValue(5, 15, 0, 50);
    expect(img.getValue(5, 15, 0)).toBe(50);
  });

  it('should get and set value by index', () => {
    const img = new Image(10, 20);
    expect(img.getValueByIndex(15, 0)).toBe(0);
    img.setValueByIndex(15, 0, 50);
    expect(img.getValueByIndex(15, 0)).toBe(50);
  });
});

test('createFrom', () => {
  const img = new Image(2, 20, { colorModel: ImageColorModel.GREY });
  const newImg = Image.createFrom(img);
  expect(img.width).toBe(newImg.width);
  expect(img.height).toBe(newImg.height);
  expect(img.colorModel).toBe(newImg.colorModel);
  expect(img.origin).toStrictEqual(newImg.origin);
});

test('clone', () => {
  const img = new Image(2, 2, { colorModel: ImageColorModel.GREY });
  img.setValue(1, 0, 0, 50);
  const copy = img.clone();
  expect(copy).toMatchImage(img);
});

test('changeEach', () => {
  const img = new Image(1, 2);
  let i = 0;
  img.changeEach(() => i++);
  expect(img).toMatchImageData([
    [0, 1, 2],
    [3, 4, 5],
  ]);
});

test('getCoordinates', () => {
  const img = new Image(4, 5);
  expect(img.getCoordinates(ImageCoordinates.BOTTOM_LEFT)).toStrictEqual([
    0, 4,
  ]);
  expect(img.getCoordinates(ImageCoordinates.BOTTOM_RIGHT)).toStrictEqual([
    3, 4,
  ]);
  expect(img.getCoordinates(ImageCoordinates.CENTER)).toStrictEqual([1.5, 2]);
  expect(img.getCoordinates(ImageCoordinates.CENTER, true)).toStrictEqual([
    2, 2,
  ]);
  expect(img.getCoordinates(ImageCoordinates.TOP_LEFT)).toStrictEqual([0, 0]);
  expect(img.getCoordinates(ImageCoordinates.TOP_RIGHT)).toStrictEqual([3, 0]);
});

test('fill with a constant color', () => {
  const img = new Image(2, 2);
  img.fill(50);
  expect(img).toMatchImageData([
    [50, 50, 50, 50, 50, 50],
    [50, 50, 50, 50, 50, 50],
  ]);
});

test('fill with a float value', () => {
  const img = new Image(2, 2);
  img.fill(10.7);
  expect(img).toMatchImageData([
    [10, 10, 10, 10, 10, 10],
    [10, 10, 10, 10, 10, 10],
  ]);
});

test('fill with a color as RGBA array', () => {
  const img = new Image(1, 2);
  img.fill([1, 2, 3]);
  expect(img).toMatchImageData([
    [1, 2, 3],
    [1, 2, 3],
  ]);
});

test('fill with out of range value', () => {
  const img = new Image(1, 1);
  expect(() => img.fill(256)).toThrow(
    /invalid value: 256. It must be a positive value smaller than 256/,
  );
});

test('fill with out of range value in array', () => {
  const img = new Image(1, 1);
  expect(() => img.fill([0, -1, 2])).toThrow(
    /invalid value: -1. It must be a positive value smaller than 256/,
  );
});

test('fill with channel mismatch', () => {
  const img = new Image(1, 1);
  expect(() => img.fill([0, 1, 2, 3])).toThrow(
    /the size of value must match the number of channels \(3\). Got 4 instead/,
  );
});

test('fill channel 0', () => {
  const img = new Image(1, 2);
  img.fillChannel(0, 50);
  expect(img).toMatchImageData([
    [50, 0, 0],
    [50, 0, 0],
  ]);
});

test('fill channel 2', () => {
  const img = new Image(1, 2);
  img.fillChannel(2, 50);
  expect(img).toMatchImageData([
    [0, 0, 50],
    [0, 0, 50],
  ]);
});

test('fill channel invalid channel', () => {
  const img = new Image(1, 2);
  expect(() => img.fillChannel(4, 50)).toThrow(
    /invalid channel: 4. It must be a positive integer smaller than 3/,
  );
});

test('get channel', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 1],
    [1, 2, 3, 1],
    [11, 2, 2, 2],
    [1, 3, 3, 3],
    [1, 6, 4, 3],
  ]);

  let expected = [
    [1, 1, 11, 1, 1],
    [2, 2, 2, 3, 6],
    [3, 3, 2, 3, 4],
    [1, 1, 2, 3, 3],
  ];
  for (let i = 0; i < image.channels; i++) {
    expect(image.getChannel(i)).toStrictEqual(expected[i]);
  }
});

test('fill alpha', () => {
  const img = new Image(1, 2, { colorModel: ImageColorModel.RGBA });
  img.fillAlpha(0);
  expect(img).toMatchImageData([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  img.fillAlpha(50);
  expect(img).toMatchImageData([
    [0, 0, 0, 50],
    [0, 0, 0, 50],
  ]);
});

test('fill alpha should throw if no alpha', () => {
  const img = new Image(1, 1);
  expect(() => img.fillAlpha(50)).toThrow(
    /fillAlpha can only be called if the image has an alpha channel/,
  );
});

test('check custom inspect, RGB image', () => {
  const image = new Image(1, 2);

  expect(inspect(image)).toMatchSnapshot();
});

test('check custom inspect, GREYA image', () => {
  const image = new Image(2, 2, { colorModel: ImageColorModel.GREYA });

  expect(inspect(image)).toMatchSnapshot();
});

test('check custom inspect with image too large', () => {
  const image = new Image(25, 25, { colorModel: ImageColorModel.GREYA });

  expect(inspect(image)).toMatchSnapshot();
});
