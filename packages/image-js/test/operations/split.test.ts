import { Image, ImageKind } from 'ijs';

test('split RGB', () => {
  const img = new Image(1, 2, {
    data: Uint8Array.from([0, 1, 2, 253, 254, 255])
  });
  const split = img.split();
  expect(split).toHaveLength(3);
  split.forEach((g) =>
    expect(g).toMatchObject({
      width: 1,
      height: 2,
      kind: ImageKind.GREY
    })
  );
  expect(split[0].data).toStrictEqual(Uint8Array.from([0, 253]));
  expect(split[1].data).toStrictEqual(Uint8Array.from([1, 254]));
  expect(split[2].data).toStrictEqual(Uint8Array.from([2, 255]));
});

test('split GREYA', () => {
  const img = new Image(1, 2, {
    kind: ImageKind.GREYA,
    data: Uint8Array.from([0, 1, 254, 255])
  });
  const split = img.split();
  expect(split).toHaveLength(2);
  expect(split[0].data).toStrictEqual(Uint8Array.from([0, 254]));
  expect(split[1].data).toStrictEqual(Uint8Array.from([1, 255]));
});
