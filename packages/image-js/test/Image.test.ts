import { Image, ColorDepth, ImageKind } from 'ijs';

describe('create new images', () => {
  it('should create a 8-bit image', () => {
    const img = new Image(10, 20);
    expect(img).toMatchObject({
      width: 10,
      height: 20,
      size: 200,
      depth: ColorDepth.UINT8,
      kind: ImageKind.RGB,
      components: 3,
      channels: 3,
      alpha: false,
      maxValue: 255
    });
    expect(img.data).toHaveLength(600);
  });

  it('should create a 16-bit image', () => {
    const img = new Image(10, 20, { depth: ColorDepth.UINT16 });
    expect(img).toMatchObject({
      width: 10,
      height: 20,
      size: 200,
      depth: ColorDepth.UINT16,
      kind: ImageKind.RGB,
      components: 3,
      channels: 3,
      alpha: false,
      maxValue: 65535
    });
    expect(img.data).toHaveLength(600);
  });

  it('should create a grey image with alpha', () => {
    const img = new Image(10, 20, { kind: ImageKind.GREYA });
    expect(img).toMatchObject({
      depth: ColorDepth.UINT8,
      kind: ImageKind.GREYA,
      components: 1,
      channels: 2,
      alpha: true
    });
    expect(img.data).toHaveLength(400);
  });

  it('should have a default width of 1', () => {
    const img = new Image({ height: 2 });
    expect(img).toMatchObject({
      width: 1,
      height: 2
    });
  });

  it('should have a default height of 1', () => {
    const img = new Image({ width: 2 });
    expect(img).toMatchObject({
      width: 2,
      height: 1
    });
  });

  it('should default to width and height of 1', () => {
    const img = new Image();
    expect(img).toMatchObject({
      width: 1,
      height: 1
    });
  });

  it('should create from existing data array', () => {
    // prettier-ignore
    const data = Uint8Array.from([
      0, 1, 2,
      3, 4, 5
    ]);
    const img = new Image(3, 2, { data, kind: ImageKind.GREY });
    expect(img.getValue(1, 0, 0)).toBe(3);
    expect(img.data).toBe(data);
  });

  it('should throw on wrong width', () => {
    expect(() => new Image(0, 1)).toThrow(
      /width must be an integer and at least 1. Received 0/
    );
    expect(() => new Image(0.5, 1)).toThrow(
      /width must be an integer and at least 1. Received 0.5/
    );
  });

  it('should throw on wrong height', () => {
    expect(() => new Image(1, 0)).toThrow(
      /height must be an integer and at least 1. Received 0/
    );
    expect(() => new Image(1, 0.5)).toThrow(
      /height must be an integer and at least 1. Received 0.5/
    );
  });

  it('should throw on wrong data size', () => {
    const data = new Uint16Array(2);
    expect(() => new Image(2, 2, { data, depth: ColorDepth.UINT16 })).toThrow(
      /incorrect data size: 2. Expected 12/
    );
  });

  it('should throw on wrong bit depth', () => {
    expect(() => new Image(1, 1, { depth: 20 })).toThrow(
      /unexpected color depth: 20/
    );
  });
});

describe('get and set pixels', () => {
  it('should get and set', () => {
    const img = new Image(10, 20);
    expect(img.get(15, 5)).toStrictEqual([0, 0, 0]);
    img.set(15, 5, [1, 3, 5]);
    expect(img.get(15, 5)).toStrictEqual([1, 3, 5]);
  });

  it('should getValue and setValue', () => {
    const img = new Image(10, 20);
    expect(img.getValue(15, 5, 0)).toBe(0);
    img.setValue(15, 5, 0, 50);
    expect(img.getValue(15, 5, 0)).toBe(50);
  });
});

test('clone', () => {
  const img = new Image(2, 2, { kind: ImageKind.GREY });
  img.setValue(0, 1, 0, 50);
  const copy = img.clone();
  expect(copy).toStrictEqual(img);
  expect(copy.data).not.toBe(img.data);
});

test('changeEach', () => {
  const img = new Image(1, 2);
  let i = 0;
  img.changeEach(() => i++);
  expect(Array.from(img.data)).toStrictEqual([0, 1, 2, 3, 4, 5]);
});

test('fill with a constant color', () => {
  const img = new Image(2, 2);
  img.fill(50);
  expect(img.data).toStrictEqual(new Uint8Array(12).fill(50));
});

test('fill with a color as RGBA array', () => {
  const img = new Image(1, 2);
  img.fill([1, 2, 3]);
  expect(img.data).toStrictEqual(Uint8Array.from([1, 2, 3, 1, 2, 3]));
});

test('fill with out of range value', () => {
  const img = new Image(1, 1);
  expect(() => img.fill(256)).toThrow(
    /invalid value: 256. It must be a positive integer smaller than 256/
  );
});

test('fill with out of range value in array', () => {
  const img = new Image(1, 1);
  expect(() => img.fill([0, -1, 2])).toThrow(
    /invalid value: -1. It must be a positive integer smaller than 256/
  );
});

test('fill with channel mismatch', () => {
  const img = new Image(1, 1);
  expect(() => img.fill([0, 1, 2, 3])).toThrow(
    /the size of value must match the number of channels \(3\). Got 4 instead/
  );
});

test('fill channel 0', () => {
  const img = new Image(1, 2);
  img.fillChannel(0, 50);
  expect(img.data).toStrictEqual(Uint8Array.from([50, 0, 0, 50, 0, 0]));
});

test('fill channel 2', () => {
  const img = new Image(1, 2);
  img.fillChannel(2, 50);
  expect(img.data).toStrictEqual(Uint8Array.from([0, 0, 50, 0, 0, 50]));
});

test('fill channel invalid channel', () => {
  const img = new Image(1, 2);
  expect(() => img.fillChannel(4, 50)).toThrow(
    /invalid channel: 4. It must be a positive integer smaller than 3/
  );
});

test('fill alpha', () => {
  const img = new Image(1, 2, { kind: ImageKind.RGBA });
  img.fillAlpha(0);
  expect(img.data).toStrictEqual(Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0]));
  img.fillAlpha(50);
  expect(img.data).toStrictEqual(Uint8Array.from([0, 0, 0, 50, 0, 0, 0, 50]));
});

test('fill alpha should throw if no alpha', () => {
  const img = new Image(1, 1);
  expect(() => img.fillAlpha(50)).toThrow(
    /fillAlpha can only be called if the image has an alpha channel/
  );
});
