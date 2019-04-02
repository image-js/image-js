import { Image, ImageKind, ColorDepth } from 'ijs';
import { getTestImage, getImage } from 'test';

test('GREY to GREYA', () => {
  const image = new Image({
    width: 2,
    height: 2,
    data: new Uint8Array([10, 30, 50, 70]),
    kind: ImageKind.GREY
  });

  const converted = image.convertColor(ImageKind.GREYA);
  expect(converted.data).toStrictEqual(
    new Uint8Array([10, 255, 30, 255, 50, 255, 70, 255])
  );
});

test('GREYA to GREY', () => {
  const image = new Image({
    width: 2,
    height: 2,
    data: new Uint8Array([10, 100, 30, 100, 50, 100, 70, 100]),
    kind: ImageKind.GREYA
  });

  const converted = image.convertColor(ImageKind.GREY);
  expect(converted.data).toStrictEqual(new Uint8Array([10, 30, 50, 70]));
});

test('GREY to RGB', () => {
  const image = new Image({
    width: 2,
    height: 2,
    data: new Uint8Array([10, 30, 50, 70]),
    kind: ImageKind.GREY
  });

  const converted = image.convertColor(ImageKind.RGB);
  expect(converted.data).toStrictEqual(
    new Uint8Array([10, 10, 10, 30, 30, 30, 50, 50, 50, 70, 70, 70])
  );
});

test('GREYA to RGB', () => {
  const image = new Image({
    width: 2,
    height: 2,
    data: new Uint8Array([10, 100, 30, 100, 50, 100, 70, 100]),
    kind: ImageKind.GREYA
  });

  const converted = image.convertColor(ImageKind.RGB);
  expect(converted.data).toStrictEqual(
    new Uint8Array([10, 10, 10, 30, 30, 30, 50, 50, 50, 70, 70, 70])
  );
});

test('GREY to RGBA', () => {
  const image = new Image({
    width: 2,
    height: 2,
    data: new Uint8Array([10, 30, 50, 70]),
    kind: ImageKind.GREY
  });

  const converted = image.convertColor(ImageKind.RGBA);
  expect(converted.data).toStrictEqual(
    // prettier-ignore
    new Uint8Array([10, 10, 10, 255, 30, 30, 30, 255, 50, 50, 50, 255, 70, 70, 70, 255])
  );
});

test('GREYA to RGBA', () => {
  const image = new Image({
    width: 2,
    height: 2,
    data: new Uint8Array([10, 100, 30, 100, 50, 100, 70, 100]),
    kind: ImageKind.GREYA
  });

  const converted = image.convertColor(ImageKind.RGBA);
  expect(converted.data).toStrictEqual(
    // prettier-ignore
    new Uint8Array([10, 10, 10, 100, 30, 30, 30, 100, 50, 50, 50, 100, 70, 70, 70, 100])
  );
});

test('RGB to RGBA', () => {
  const image = new Image({
    width: 2,
    height: 1,
    data: new Uint8Array([10, 20, 30, 40, 60, 70]),
    kind: ImageKind.RGB
  });

  const converted = image.convertColor(ImageKind.RGBA);
  expect(converted.data).toStrictEqual(
    new Uint8Array([10, 20, 30, 255, 40, 60, 70, 255])
  );
});

test('RGBA to RGB', () => {
  const image = new Image({
    width: 2,
    height: 1,
    data: new Uint8Array([10, 20, 30, 100, 40, 60, 70, 100]),
    kind: ImageKind.RGBA
  });

  const converted = image.convertColor(ImageKind.RGB);
  expect(converted.data).toStrictEqual(
    new Uint8Array([10, 20, 30, 40, 60, 70])
  );
});

test('Cannot convert to same kind', () => {
  const image = new Image({
    width: 2,
    height: 1,
    data: new Uint8Array([10, 20, 30, 40, 60, 70]),
    kind: ImageKind.RGB
  });

  expect(() => image.convertColor(ImageKind.RGB)).toThrow(
    /Cannot convert color, image is already RGB/
  );
});

test('GREY to RGBA 16-bit', () => {
  const image = new Image({
    width: 2,
    height: 2,
    data: new Uint16Array([256, 512, 768, 1024]),
    kind: ImageKind.GREY,
    depth: ColorDepth.UINT16
  });

  const converted = image.convertColor(ImageKind.RGBA);
  expect(converted.data).toStrictEqual(
    // prettier-ignore
    new Uint16Array([256, 256, 256, 65535, 512, 512, 512, 65535, 768, 768, 768, 65535, 1024, 1024, 1024, 65535])
  );
});

test('test image to GREY', () => {
  const testImage = getTestImage();
  const grey = testImage.convertColor(ImageKind.GREY);
  const expected = getImage(
    [
      [255, 255, 255, 255, 255, 255, 255, 255],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 76, 76, 255, 255, 179, 179, 0],
      [0, 76, 76, 255, 255, 179, 179, 0],
      [0, 150, 150, 0, 0, 105, 105, 0],
      [0, 150, 150, 0, 0, 105, 105, 0],
      [0, 29, 29, 128, 128, 226, 226, 0],
      [0, 29, 29, 128, 128, 226, 226, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [255, 255, 255, 255, 255, 255, 255, 255]
    ],
    ImageKind.GREY
  );
  expect(grey.data).toStrictEqual(expected.data);
});
