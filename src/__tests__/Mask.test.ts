import util from 'node:util';

import { ColorDepth, ImageColorModel } from '..';
import { Mask } from '../Mask';
import { Point } from '../utils/geometry/points';

describe('create new masks', () => {
  it('should create a mask', () => {
    const mask = new Mask(10, 20);
    expect(mask).toMatchObject({
      width: 10,
      height: 20,
      size: 200,
      depth: ColorDepth.UINT1,
      colorModel: ImageColorModel.BINARY,
      components: 1,
      channels: 1,
      alpha: false,
      maxValue: 1,
    });
    expect(mask.getRawImage().data).toHaveLength(200);
  });
  it('should throw on wrong width', () => {
    expect(() => new Mask(0, 1)).toThrow(
      /width must be an integer and at least 1. Received 0/,
    );
    expect(() => new Mask(0.5, 1)).toThrow(
      /width must be an integer and at least 1. Received 0.5/,
    );
  });
  it('should throw on wrong height', () => {
    expect(() => new Mask(1, 0)).toThrow(
      /height must be an integer and at least 1. Received 0/,
    );
    expect(() => new Mask(1, 0.5)).toThrow(
      /height must be an integer and at least 1. Received 0.5/,
    );
  });
  it('should throw on wrong data size', () => {
    const data = new Uint8Array(2);
    expect(() => new Mask(2, 2, { data })).toThrow(
      /incorrect data size: 2. Expected 4/,
    );
  });
});

describe('get and set bit', () => {
  it('should get and set', () => {
    const mask = new Mask(10, 20);
    expect(mask.getBit(5, 15)).toBe(0);
    mask.setBit(5, 15, 1);
    expect(mask.getBit(5, 15)).toBe(1);
  });
  it('should get and set by index', () => {
    const mask = new Mask(10, 20);
    expect(mask.getBitByIndex(15)).toBe(0);
    mask.setBitByIndex(15, 1);
    expect(mask.getBitByIndex(15)).toBe(1);
  });
});

describe('get and set value', () => {
  it('should get and set', () => {
    const mask = new Mask(10, 20);
    expect(mask.getValue(5, 15, 0)).toBe(0);
    mask.setValue(5, 15, 0, 1);
    expect(mask.getValue(5, 15, 0)).toBe(1);
  });
  it('should get and set by index', () => {
    const mask = new Mask(10, 20);
    expect(mask.getValueByIndex(15, 0)).toBe(0);
    mask.setValueByIndex(15, 0, 1);
    expect(mask.getValueByIndex(15, 0)).toBe(1);
  });
  it('wrong channel value', () => {
    const mask = new Mask(10, 20);
    expect(() => {
      mask.getValue(2, 1, 2);
    }).toThrow(/Channel value must be 0 on type Mask, got 2./);
  });
});

describe('get and set pixels', () => {
  it('should get and set', () => {
    const img = new Mask(10, 20);
    expect(img.getPixel(5, 15)).toStrictEqual([0]);
    img.setPixel(5, 15, [1]);
    expect(img.getPixel(5, 15)).toStrictEqual([1]);
  });

  it('should get and set by index', () => {
    const img = new Mask(10, 20);
    expect(img.getPixelByIndex(5)).toStrictEqual([0]);
    img.setPixelByIndex(5, [1]);
    expect(img.getPixelByIndex(5)).toStrictEqual([1]);
  });
});

test('fill with a value', () => {
  const mask = new Mask(2, 2);
  mask.fill(1);
  expect(mask).toMatchMaskData([
    [1, 1],
    [1, 1],
  ]);
});

test('createFrom', () => {
  const mask = new Mask(2, 20);
  const newMask = Mask.createFrom(mask);
  expect(mask.width).toBe(newMask.width);
  expect(mask.height).toBe(newMask.height);
  expect(mask.origin).toStrictEqual(newMask.origin);
});

test('fromPoints', () => {
  const points: Point[] = [{ column: 1, row: 1 }];
  expect(Mask.fromPoints(5, 3, points)).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('clone', () => {
  const mask = new Mask(2, 2);
  mask.setBit(1, 0, 1);
  const copy = mask.clone();
  expect(copy).toMatchMask(mask);
});

test('check custom inspect', () => {
  const mask = new Mask(1, 2);
  expect(util.inspect(mask)).toMatchSnapshot();
});

test('check custom inspect with image too large', () => {
  const image = new Mask(25, 25);

  expect(util.inspect(image)).toMatchSnapshot();
});
