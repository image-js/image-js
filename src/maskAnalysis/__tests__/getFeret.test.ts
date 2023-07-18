test('empty mask', () => {
  const mask = testUtils.createMask(`0 0 0`);
  const result = mask.getFeret();

  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 0,
        angle: 0,
        points: [
          { column: 0, row: 0 },
          { column: 0, row: 0 },
        ],
        calliperLines: [
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
        ],
      },
      maxDiameter: {
        length: 0,
        angle: 0,
        points: [
          { column: 0, row: 0 },
          { column: 0, row: 0 },
        ],
        calliperLines: [
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
        ],
      },
      aspectRatio: 1,
    },
    3,
  );
});
test('mask with only 1 pixel', () => {
  const mask = testUtils.createMask(`0 1 0`);
  const result = mask.getFeret();
  // the minimum diameter points are not as expected,
  // but this is a very edge case so it does not matter too much
  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 1,
        angle: 90,
        points: [
          { column: 1, row: 0 },
          { column: 2, row: 1 },
        ],
        calliperLines: [
          [
            { column: 1, row: 0 },
            { column: 1, row: 1 },
          ],
          [
            { column: 2, row: 0 },
            { column: 2, row: 1 },
          ],
        ],
      },
      maxDiameter: {
        length: 1.414,
        angle: 45,
        points: [
          { column: 1, row: 0 },
          { column: 2, row: 1 },
        ],
        calliperLines: [
          [
            { column: 1.5, row: -0.5 },
            { column: 0.5, row: 0.5 },
          ],
          [
            { column: 2.5, row: 0.5 },
            { column: 1.5, row: 1.5 },
          ],
        ],
      },
      aspectRatio: 0.707,
    },
    3,
  );
});
test('mask 3x3', () => {
  const mask = testUtils.createMask(`
        0 1 0
        1 1 1
        0 1 0
      `);
  const result = mask.getFeret();
  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 2.83,
        angle: 45,
        points: [
          { column: 0, row: 2 },
          { column: 3, row: 1 },
        ],
        calliperLines: [
          [
            { column: -0.5, row: 1.5 },
            { column: 1.5, row: 3.5 },
          ],
          [
            { column: 1.5, row: -0.5 },
            { column: 3.5, row: 1.5 },
          ],
        ],
      },
      maxDiameter: {
        length: 3.16,
        angle: 18.43,
        points: [
          { column: 0, row: 1 },
          { column: 3, row: 2 },
        ],
        calliperLines: [
          [
            { column: 0.5, row: -0.5 },
            { column: -0.5, row: 2.5 },
          ],
          [
            { column: 3.5, row: 0.5 },
            { column: 2.5, row: 3.5 },
          ],
        ],
      },

      aspectRatio: 0.8944,
    },
    2,
  );
});

test('mask 4x4', () => {
  const mask = testUtils.createMask(`
        0 1 1 0
        0 1 1 0
        0 1 1 0
        0 1 1 0
      `);

  const result = mask.getFeret();

  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 2,
        angle: 90,
        points: [
          { column: 1, row: 0 },
          { column: 3, row: 0 },
        ],
        calliperLines: [
          [
            { column: 1, row: 0 },
            { column: 1, row: 4 },
          ],
          [
            { column: 3, row: 0 },
            { column: 3, row: 4 },
          ],
        ],
      },
      maxDiameter: {
        length: 4.4721,
        angle: 63.43,
        points: [
          { column: 1, row: 0 },
          { column: 3, row: 4 },
        ],
        calliperLines: [
          [
            { column: 2.6, row: -0.8 },
            { column: -0.6, row: 0.8 },
          ],
          [
            { column: 4.6, row: 3.2 },
            { column: 1.4, row: 4.8 },
          ],
        ],
      },

      aspectRatio: 0.4472,
    },
    2,
  );
});

test('mask 5x5', () => {
  const mask = testUtils.createMask(`
        0 0 1 0 0
        0 0 1 0 0
        1 1 1 1 1
        0 0 1 0 0
        0 0 1 0 0
      `);

  const result = mask.getFeret();

  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 4.2426,
        angle: -45,
        points: [
          { column: 3, row: 5 },
          { column: 0, row: 2 },
        ],
        calliperLines: [
          [
            { column: 2.5, row: 5.5 },
            { column: 5.5, row: 2.5 },
          ],
          [
            { column: -0.5, row: 2.5 },
            { column: 2.5, row: -0.5 },
          ],
        ],
      },
      maxDiameter: {
        length: 5.099,
        angle: 11.31,
        points: [
          { column: 0, row: 2 },
          { column: 5, row: 3 },
        ],
        calliperLines: [
          [
            { column: 0.5, row: -0.5 },
            { column: -0.5, row: 4.5 },
          ],
          [
            { column: 5.5, row: 0.5 },
            { column: 4.5, row: 5.5 },
          ],
        ],
      },

      aspectRatio: 0.832,
    },
    2,
  );
});

test('triangle 5x5', () => {
  const mask = testUtils.createMask(`
      1 0 0 0 0 0
      1 1 1 0 0 0
      1 1 1 1 1 1
      1 1 1 0 0 0
      1 0 0 0 0 0
    `);

  const result = mask.getFeret();

  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 5,
        angle: 0,
        points: [
          { column: 0, row: 5 },
          { column: 0, row: 0 },
        ],
        calliperLines: [
          [
            { column: 0, row: 5 },
            { column: 6, row: 5 },
          ],
          [
            { column: 0, row: 0 },
            { column: 6, row: 0 },
          ],
        ],
      },
      maxDiameter: {
        length: 6.7082,
        angle: 26.565,
        points: [
          { column: 0, row: 0 },
          { column: 6, row: 3 },
        ],
        calliperLines: [
          [
            { column: 0.4, row: -0.8 },
            { column: -2, row: 4 },
          ],
          [
            { column: 6.4, row: 2.2 },
            { column: 4, row: 7 },
          ],
        ],
      },

      aspectRatio: 0.7453,
    },
    3,
  );
});

test('square triangle 3x3', () => {
  const mask = testUtils.createMask(`
        1 1 1
        1 0 0
        1 0 0
      `);

  const result = mask.getFeret();

  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 2.8284,
        angle: -45,
        points: [
          { column: 1, row: 3 },
          { column: 0, row: 0 },
        ],
        calliperLines: [
          [
            { column: 0.5, row: 3.5 },
            { column: 3.5, row: 0.5 },
          ],
          [
            { column: -1.5, row: 1.5 },
            { column: 1.5, row: -1.5 },
          ],
        ],
      },
      maxDiameter: {
        length: 4.2426,
        angle: -45,
        points: [
          { column: 0, row: 3 },
          { column: 3, row: 0 },
        ],
        calliperLines: [
          [
            { column: -1.5, row: 1.5 },
            { column: 0.5, row: 3.5 },
          ],
          [
            { column: 1.5, row: -1.5 },
            { column: 3.5, row: 0.5 },
          ],
        ],
      },

      aspectRatio: 0.6667,
    },
    3,
  );
});

test('complex figure', () => {
  const mask = testUtils.createMask(`
      1 1 1 0 0 0 0 0 0
      1 1 1 1 0 0 0 1 0
      1 1 1 1 1 1 1 1 1
      1 1 1 1 1 1 1 1 1
      0 0 0 1 0 1 0 1 0
    `);

  const result = mask.getFeret();

  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        points: [
          { column: 8, row: 1 },
          { column: 3, row: 5 },
        ],
        length: 4.903,
        angle: -168.69,
        calliperLines: [
          [
            { column: 9.538, row: 1.3077 },
            { column: 0.115, row: -0.5769 },
          ],
          [
            { column: 8.577, row: 6.115 },
            { column: -0.846, row: 4.231 },
          ],
        ],
      },
      maxDiameter: {
        length: 9.8488,
        angle: 23.9624,
        points: [
          { column: 0, row: 0 },
          { column: 9, row: 4 },
        ],
        calliperLines: [
          [
            { column: 0.9484, row: -2.134 },
            { column: -1.4845, row: 3.34 },
          ],
          [
            { column: 9.948, row: 1.866 },
            { column: 7.515, row: 7.34 },
          ],
        ],
      },
      aspectRatio: 0.498,
    },
    3,
  );
});
