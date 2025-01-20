import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
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
  toMatchCloseTo,
  toMatchImage,
  toMatchImageData,
  toMatchImageSnapshot,
  toMatchMask,
  toMatchMaskData,
});

globalThis.testUtils = testUtils;
