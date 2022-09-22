import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import * as jestMatchers from './test/jestMatchers';
import * as testUtils from './test/testUtils';

expect.extend({
  toBeDeepCloseTo,
  ...jestMatchers,
});

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

globalThis.testUtils = testUtils;
