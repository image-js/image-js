import type { MatcherState } from '@vitest/expect';
import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { configureToMatchImageSnapshot } from 'jest-image-snapshot';

import type { Image } from '../src/index.js';
import { Mask, encodePng } from '../src/index.js';

import type { TestImagePath } from './TestImagePath.js';
import { createImageFromData } from './createImageFromData.js';

interface MatcherResult {
  message: () => string;
  pass: boolean;
}

export interface JestMatcherOptions {
  /**
   * Acceptable difference between the received image and the expected for each channel.
   * @default `0`
   */
  error?: number;
}

/**
 * Match a received image to an expected image.
 * @param received - Received image.
 * @param expected - Expected image.
 * @param options - Jest matcher options.
 * @returns - Jest matcher result.
 */
export function toMatchImage(
  this: MatcherState,
  received: Image,
  expected: Image | TestImagePath,
  options: JestMatcherOptions = {},
): MatcherResult {
  const { error = 0 } = options;
  const expectedImage =
    typeof expected === 'string' ? testUtils.load(expected) : expected;
  let errorString: string | null = null;

  if (received === expected) {
    errorString = 'Expected image instances to be different';
  } else if (received.width !== expectedImage.width) {
    errorString = `Expected image width to be ${expectedImage.width}, but got ${received.width}`;
  } else if (received.height !== expectedImage.height) {
    errorString = `Expected image height to be ${expectedImage.height}, but got ${received.height}`;
  } else if (received.bitDepth !== expectedImage.bitDepth) {
    errorString = `Expected image bitDepth to be ${expectedImage.bitDepth}, but got ${received.bitDepth}`;
  } else if (received.colorModel !== expectedImage.colorModel) {
    errorString = `Expected image color model to be ${expectedImage.colorModel}, but got ${received.colorModel}`;
  } else if (error === 0) {
    rowsLoop: for (let row = 0; row < received.height; row++) {
      for (let col = 0; col < received.width; col++) {
        const receivedPixel = received.getPixel(col, row);
        const expectedPixel = expectedImage.getPixel(col, row);
        if (!this.equals(receivedPixel, expectedPixel)) {
          errorString = `Expected pixel at (${col}, ${row}) to be [${expectedPixel.join(
            ', ',
          )}], but got [${receivedPixel.join(', ')}]`;
          break rowsLoop;
        }
      }
    }
  } else {
    rowsLoop: for (let row = 0; row < received.height; row++) {
      for (let col = 0; col < received.width; col++) {
        for (let channel = 0; channel < received.channels; channel++) {
          const receivedValue = received.getValue(col, row, channel);
          const expectedValue = expectedImage.getValue(col, row, channel);
          if (Math.abs(receivedValue - expectedValue) > error) {
            errorString = `Expected value at (${col}, ${row}) to be in range [${
              expectedValue - error
            },${expectedValue + error}], but got ${receivedValue}`;
            break rowsLoop;
          }
        }
      }
    }
  }

  return {
    message: () => errorString || '',
    pass: errorString === null,
  };
}

/**
 * Match a received image to expected image data.
 * @param received - Received image.
 * @param expectedData - Expected image data.
 *  @param options - Jest matcher options.
 * @returns - Jest matcher result.
 */
export function toMatchImageData(
  this: MatcherState,
  received: Image,
  expectedData: number[][] | string,
  options: JestMatcherOptions = {},
): MatcherResult {
  const expectedImage = createImageFromData(expectedData, received.colorModel, {
    bitDepth: received.bitDepth,
  });
  return toMatchImage.call(this, received, expectedImage, options);
}

/**
 * Match a received mask to an expected mask.
 * @param received - Received mask.
 * @param expected - Expected mask.
 * @returns - Jest matcher result.
 */
export function toMatchMask(
  this: MatcherState,
  received: Mask,
  expected: Image | Mask,
): MatcherResult {
  let error: string | null = null;

  if (received.width !== expected.width) {
    error = `Expected mask width to be ${expected.width}, but got ${received.width}`;
  } else if (received.height !== expected.height) {
    error = `Expected mask height to be ${expected.height}, but got ${received.height}`;
  } else {
    rowsLoop: for (let row = 0; row < received.height; row++) {
      for (let col = 0; col < received.width; col++) {
        const receivedBit = received.getBit(col, row);
        const expectedBit = expected.getValue(col, row, 0);
        if (!this.equals(receivedBit, expectedBit)) {
          error = `Expected bit at (${col}, ${row}) to be ${expectedBit}, but got ${receivedBit}`;
          break rowsLoop;
        }
      }
    }
  }

  return {
    message: () => error || '',
    pass: error === null,
  };
}

/**
 * Match a received mask to expected mask data.
 * @param received - Received mask.
 * @param expectedData - Expected mask data.
 * @returns - Jest matcher result.
 */
export function toMatchMaskData(
  this: MatcherState,
  received: Mask,
  expectedData: number[][] | string,
): MatcherResult {
  const expectedMask = createImageFromData(expectedData, 'BINARY');
  return toMatchMask.call(this, received, expectedMask);
}

const toMatchImageFileSnapshot = configureToMatchImageSnapshot({});

/**
 * Snapshot matching with Image objects.
 * @param received - Received image.
 * @param options - Options.
 * @returns - Jest matcher result.
 */
export function toMatchImageSnapshot(
  this: MatcherState,
  received: Image | Mask | Uint8Array,
  options?: MatchImageSnapshotOptions,
): MatcherResult {
  let png: Uint8Array;

  if (ArrayBuffer.isView(received)) {
    png = received;
  } else {
    const receivedImage =
      received instanceof Mask ? received.convertColor('GREY') : received;
    png = encodePng(receivedImage);
  }

  const buffer = Buffer.from(png.buffer, png.byteOffset, png.byteLength);
  // @ts-expect-error The public types doesn't correspond to the implementation.
  return toMatchImageFileSnapshot.call(this, buffer, options);
}
