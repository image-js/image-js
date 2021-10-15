// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./jest.d.ts" />

import { IJS } from '../src';

import { TestImagePath } from './TestImagePath';
import { createImageFromData } from './createImageFromData';

interface MatcherResult {
  message: () => string;
  pass: boolean;
}

export function toMatchImage(
  this: jest.MatcherContext,
  received: IJS,
  expected: IJS | TestImagePath,
): MatcherResult {
  const expectedImage =
    typeof expected === 'string' ? testUtils.load(expected) : expected;
  let error: string | null = null;

  if (received === expected) {
    error = 'Expected image instances to be different';
  } else if (received.width !== expectedImage.width) {
    error = `Expected image width to be ${expectedImage.width}, but got ${received.width}`;
  } else if (received.height !== expectedImage.height) {
    error = `Expected image height to be ${expectedImage.height}, but got ${received.height}`;
  } else if (received.depth !== expectedImage.depth) {
    error = `Expected image depth to be ${expectedImage.depth}, but got ${received.depth}`;
  } else if (received.colorModel !== expectedImage.colorModel) {
    error = `Expected image color model to be ${expectedImage.colorModel}, but got ${received.colorModel}`;
  } else {
    for (let row = 0; row < received.height; row++) {
      for (let col = 0; col < received.width; col++) {
        const receivedPixel = received.getPixel(row, col);
        const expectedPixel = expectedImage.getPixel(row, col);
        if (!this.equals(receivedPixel, expectedPixel)) {
          error = `Expected pixel at (${col}, ${row}) to be [${expectedPixel.join(
            ', ',
          )}], but got [${receivedPixel.join(', ')}]`;
          break;
        }
      }
    }
  }

  return {
    message: () => error || '',
    pass: error === null,
  };
}

export function toMatchImageData(
  this: jest.MatcherContext,
  received: IJS,
  expectedData: number[][] | string,
): MatcherResult {
  const expectedImage = createImageFromData(expectedData, received.colorModel);
  return toMatchImage.call(this, received, expectedImage);
}
