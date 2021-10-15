import { IJS } from '../src';

import { TestImagePath } from './TestImagePath';

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Match an existing image object.
       * @param expectedImage The expected image.
       */
      toMatchImage(expectedImage: IJS): R;

      /**
       * Match an image from the test/img directory.
       * @param expectedImagePath The path to the expected image.
       */
      toMatchImage(expectedImagePath: TestImagePath): R;

      /**
       * Match an image by providing the expected data matrix.
       * @param expectedImageData - The expected image data matrix.
       */
      toMatchImageData(expectedImageData: number[][]): R;

      /**
       * Match an image by providing the expected data.
       * @param expectedImageData The expected image data.
       */
      toMatchImageData(expectedImageData: string): R;
    }
  }
}
