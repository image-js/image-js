// eslint-disable-next-line import/no-unassigned-import
import 'vitest';
import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';

import type { type Mask } from '../src/index.ts';

import type {
  JestMatcherImage,
  JestMatcherImageData,
  JestMatcherOptions,
} from './jestMatchers.ts';

declare module 'vitest' {
  interface Matchers<R> {
    toBeDeepCloseTo: (expected: T, precision?: number) => R;
    toMatchImage: (
      expected: JestMatcherImage,
      options?: JestMatcherOptions,
    ) => R;
    toMatchImageData: (
      data: JestMatcherImageData,
      options?: JestMatcherOptions,
    ) => R;
    toMatchImageSnapshot: (options?: MatchImageSnapshotOptions) => R;
    toMatchMask: (image: Mask) => R;
    toMatchMaskData: (data: JestMatcherImageData) => R;
  }
}
