import { describe, expect, it, test } from 'vitest';

import { Image } from '../Image.js';
import { Stack } from '../Stack.js';

describe('Stack constructor', () => {
  it('create a stack containing one image', () => {
    const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
    const stack = new Stack([image]);

    const images = stack.getImages();

    expect(stack).toBeInstanceOf(Stack);
    expect(images).toHaveLength(1);
    expect(images[0]).toBeInstanceOf(Image);
    expect(images[0]).toBe(image);
    expect(stack.size).toBe(1);
    expect(stack.alpha).toBe(false);
    expect(stack.colorModel).toBe('GREY');
    expect(stack.channels).toBe(1);
    expect(stack.bitDepth).toBe(8);
    expect(stack.sameDimensions).toBe(true);
  });

  it('should throw if color model is different', () => {
    const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
    const image2 = testUtils.createRgbaImage([[1, 2, 3, 4]]);

    expect(() => {
      return new Stack([image1, image2]);
    }).toThrow('images must all have the same bit depth and color model');
  });

  it('should throw if bit depths different', () => {
    const image1 = testUtils.createGreyImage([[1, 2, 3, 4]], { bitDepth: 8 });
    const image2 = testUtils.createGreyImage([[1, 2, 3, 4]], { bitDepth: 16 });

    expect(() => {
      return new Stack([image1, image2]);
    }).toThrow('images must all have the same bit depth and color model');
  });
});

test('iterator', () => {
  expect.assertions(2);

  const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const stack = new Stack([image, image]);

  for (const image of stack) {
    expect(image).toBeInstanceOf(Image);
  }
});

test('clone', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const stack = new Stack([image]);
  const clone = stack.clone();

  expect(clone).toBeInstanceOf(Stack);
  expect(clone).not.toBe(stack);
  expect(clone.getImages()[0]).toBeInstanceOf(Image);
  expect(clone.getImages()[0]).not.toBe(image);
  expect(clone.getImages()[0]).toStrictEqual(image);
});

test('getImage', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const stack = new Stack([image]);

  expect(stack.getImage(0)).toBe(image);
});

describe('get values from stack', () => {
  it('getValue on grey image', () => {
    const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
    const stack = new Stack([image]);

    expect(stack.getValue(0, 0, 0, 0)).toBe(1);
  });

  it('getValue on RGB image', () => {
    const image1 = testUtils.createRgbImage([[1, 2, 3]]);
    const image2 = testUtils.createRgbImage([[4, 5, 6]]);
    const stack = new Stack([image1, image2]);

    expect(stack.getValue(1, 0, 0, 1)).toBe(5);
  });

  it('getValueByIndex', () => {
    const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
    const stack = new Stack([image]);

    expect(stack.getValueByIndex(0, 1, 0)).toBe(2);
  });
});

test('level the images with map', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 5, 6, 7]]);
  const stack = new Stack([image1, image2]);
  const result = stack.map((image) => image.level());

  expect(result).not.toBe(stack);
  expect(result.getImage(0)).toMatchImageData([[0, 85, 170, 255]]);
  expect(result.getImage(1)).toMatchImageData([[0, 85, 170, 255]]);
});

test('remove images too dark using filter', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[100, 100, 100, 100]]);
  const stack = new Stack([image1, image2]);
  const result = stack.filter((image) => image.mean()[0] > 10);

  expect(result).not.toBe(stack);
  expect(result.size).toBe(1);
  expect(result.getImage(0)).toMatchImageData([[100, 100, 100, 100]]);
});
