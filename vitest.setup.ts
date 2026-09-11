import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import { expect } from 'vitest';

import {
  toMatchImage,
  toMatchImageData,
  toMatchImageSnapshot,
  toMatchMask,
  toMatchMaskData,
} from './test/jestMatchers.ts';
import * as testUtils from './test/testUtils.ts';

expect.extend({
  toBeDeepCloseTo,
  toMatchImage,
  toMatchImageData,
  toMatchImageSnapshot,
  toMatchMask,
  toMatchMaskData,
});

globalThis.testUtils = testUtils;
