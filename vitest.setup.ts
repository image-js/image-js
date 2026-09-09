import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import { expect } from 'vitest';

import {
  toMatchImage,
  toMatchImageData,
  toMatchImageSnapshot,
  toMatchMask,
  toMatchMaskData,
} from './test/jestMatchers.js';
import * as testUtils from './test/testUtils.js';

expect.extend({
  toBeDeepCloseTo,
  toMatchImage,
  toMatchImageData,
  toMatchImageSnapshot,
  toMatchMask,
  toMatchMaskData,
});

globalThis.testUtils = testUtils;
