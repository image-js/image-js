import { MatchImageSnapshotOptions } from 'jest-image-snapshot';

import { IJS } from '../src';
import { Mask } from '../src/Mask';

import { TestImagePath } from './TestImagePath';

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Match an existing image object.
       *
       * @param expectedImage - The expected image.
       */
      toMatchImage(expectedImage: IJS): R;

      /**
       * Match an image from the test/img directory.
       *
       * @param expectedImagePath - The path to the expected image.
       */
      toMatchImage(expectedImagePath: TestImagePath): R;

      /**
       * Match an image by providing the expected data matrix.
       *
       * @param expectedImageData - The expected image data matrix.
       */
      toMatchImageData(expectedImageData: number[][]): R;

      /**
       * Match an image by providing the expected data.
       *
       * @param expectedImageData - The expected image data.
       */

      toMatchImageData(expectedImageData: string): R;

      /**
       * Match an existing image object.
       *
       * @param expectedMask - The expected image.
       */
      toMatchMask(expectedMask: Mask): R;

      /**
       * Match an image by providing the expected data matrix.
       *
       * @param expectedImageData - The expected image data matrix.
       */
      toMatchMaskData(expectedImageData: number[][]): R;

      /**
       * Match an image by providing the expected data.
       *
       * @param expectedImageData - The expected image data.
       */

      toMatchMaskData(expectedImageData: string): R;

      /**
       * Same as `toMatchImageSnapshot`, but with an IJS or Mask instance, which
       * will be automatically converted to PNG.
       *
       * @param options - Options of the jest-image-snapshot library.
       * @see {@link https://github.com/americanexpress/jest-image-snapshot}
       */
      toMatchIJSSnapshot(options?: MatchImageSnapshotOptions): R;
    }
  }
}
