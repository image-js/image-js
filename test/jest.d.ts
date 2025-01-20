import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';

import type { Mask } from '../src/Mask.js';
import type { Image } from '../src/index.js';

import type { TestImagePath } from './TestImagePath.js';
import type { JestMatcherOptions } from './jestMatchers.js';

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Match an existing image object.
       * @param expectedImage - The expected image.
       */
      toMatchImage(expectedImage: Image, options?: JestMatcherOptions): R;

      /**
       * Match an image from the test/img directory.
       * @param expectedImagePath - The path to the expected image.
       */
      toMatchImage(
        expectedImagePath: TestImagePath,
        options?: JestMatcherOptions,
      ): R;

      /**
       * Match an image by providing the expected data matrix.
       * @param expectedImageData - The expected image data matrix.
       */
      toMatchImageData(
        expectedImageData: number[][],
        options?: JestMatcherOptions,
      ): R;

      /**
       * Match an image by providing the expected data.
       * @param expectedImageData - The expected image data.
       */

      toMatchImageData(
        expectedImageData: string,
        options?: JestMatcherOptions,
      ): R;

      /**
       * Match an existing image object.
       * @param expectedMask - The expected image.
       */
      toMatchMask(expectedMask: Mask): R;

      /**
       * Match an image by providing the expected data matrix.
       * @param expectedImageData - The expected image data matrix.
       */
      toMatchMaskData(expectedImageData: number[][]): R;

      /**
       * Match an image by providing the expected data.
       * @param expectedImageData - The expected image data.
       */

      toMatchMaskData(expectedImageData: string): R;

      /**
       * Match an image snapshot. Can be used on Image and Mask objects as well
       * as PNG-encoded data.
       * @param options - Options of the jest-image-snapshot library.
       * @see {@link https://github.com/americanexpress/jest-image-snapshot}
       */
      toMatchImageSnapshot(options?: MatchImageSnapshotOptions): R;
    }
  }
}
