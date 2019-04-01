import { Image, ImageKind } from 'ijs';

test('invert an RGB image', () => {
  const img = new Image(1, 2, {
    data: Uint8Array.from([0, 50, 127, 255, 250, 4])
  });
  const inverted = img.invert();
  expect(inverted).not.toBe(img);
  expect(inverted.data).toStrictEqual(
    Uint8Array.from([255, 205, 128, 0, 5, 251])
  );
});

test('invert a grey image with alpha', () => {
  const img = new Image(1, 2, {
    kind: ImageKind.GREYA,
    data: Uint8Array.from([0, 255, 255, 0])
  });
  const inverted = img.invert();
  expect(inverted.data).toStrictEqual(Uint8Array.from([255, 0, 0, 255]));
});

test('invert 16-bit GREY image', function () {
  const image = new Image(2, 2, {
    kind: ImageKind.GREY,
    depth: 16,
    data: Uint16Array.from([1, 2, 3, 4])
  });

  const expected = Uint16Array.from([65534, 65533, 65532, 65531]);

  const inverted = image.invert();
  expect(inverted).not.toBe(image);
  expect(inverted.data).toStrictEqual(expected);
});

test('invert with out parameter', function () {
  const image = new Image(1, 2, {
    data: Uint8Array.from([230, 83, 120, 100, 140, 13])
  });

  const expected = Uint8Array.from([25, 172, 135, 155, 115, 242]);
  const out = new Image(1, 2);
  const inverted = image.invert({ out });
  expect(inverted.data).toStrictEqual(expected);
  expect(inverted).toBe(out);
});

test('invert with out parameter set to self', () => {
  const img = new Image(1, 2, {
    kind: ImageKind.GREYA,
    data: Uint8Array.from([0, 255, 255, 0])
  });
  img.invert({ out: img });
  expect(img.data).toStrictEqual(Uint8Array.from([255, 0, 0, 255]));
});
