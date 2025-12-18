//To look at the equivalent opencv code go to generate.py in test/img/opencv
//folder.
import { expect, test } from 'vitest';

test('compare result of translation with opencv with default parameters', () => {
  const img = testUtils.load('opencv/test.png');
  const translation = [
    [1, 0, 2],
    [0, 1, 4],
  ];
  const transformed = img.transform(translation, {
    width: 16,
    height: 20,
  });

  expect(transformed).toMatchImage('opencv/testTranslate.png');
});

test('compare result of clockwise rotation with opencv', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [0, -1, img.width + 1],
      [1, 0, 0],
    ],
    {
      inverse: false,
      fullImage: false,
      width: 10,
      height: 8,
      borderType: 'constant',
      borderValue: 0,
      interpolationType: 'bilinear',
    },
  );

  expect(transformed).toMatchImage('opencv/testClockwiseRot90.png');
});

test('compare result of clockwise rotation with opencv and fullImage:true', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [0, -1, img.width + 1],
      [1, 0, 0],
    ],
    {
      inverse: false,
      fullImage: true,
      borderType: 'constant',
      borderValue: 0,
      interpolationType: 'bilinear',
    },
  );

  expect(transformed).toMatchImage('opencv/testClockwiseRot90.png');
});

test('compare result of anti-clockwise rotation with opencv', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [0, 1, 0],
      [-1, 0, img.width - 1],
    ],
    {
      inverse: false,
      fullImage: false,
      width: 10,
      height: 8,
      borderType: 'constant',
      borderValue: 0,
      interpolationType: 'bilinear',
    },
  );

  expect(transformed).toMatchImage('opencv/testAntiClockwiseRot90.png');
});

test('get a vertical reflection of an image', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [1, 0, 0],
      [0, -1, img.height - 1],
    ],
    {
      inverse: false,
      fullImage: false,
      borderType: 'constant',
      borderValue: 0,
      interpolationType: 'bilinear',
    },
  );

  expect(transformed).toMatchImage('opencv/testReflect.png');
});

//problematic test1
//Scaling with test image works only if the image is scaled by 2 or by 4.
test('get a scale of an image to 32*40', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [4, 0, 0],
      [0, 4, 0],
    ],
    {
      inverse: false,
      fullImage: false,
      width: img.width * 4,
      height: img.height * 4,
      borderType: 'constant',
      borderValue: 0,
      interpolationType: 'bilinear',
    },
  );

  expect(transformed).toMatchImage('opencv/testScale.png');
});

test('affineTransformation', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [2, 1, 2],
      [-1, 1, 2],
    ],
    {
      inverse: false,
      fullImage: false,
      interpolationType: 'bilinear',
      borderType: 'constant',
    },
  );

  // OpenCV bilinear interpolation is less precise for speed.
  expect(transformed).toMatchImage('opencv/testAffineTransform.png', {
    error: 3,
  });
});

test('should throw if matrix has wrong size', () => {
  const img = testUtils.load('opencv/test.png');
  const translation = [
    [1, 0, 2, 3],
    [0, 1, 10, 4],
  ];

  expect(() => {
    img.transform(translation);
  }).toThrowError('transformation matrix must be 2x3 or 3x3. Received 2x4');
});

test('check borderValue behavior', () => {
  const img = testUtils.load('opencv/test.png');
  const matrix = [
    [2, 1, 2],
    [-1, 1, 2],
  ];
  const transformed = img.transform(matrix, {
    interpolationType: 'nearest',
    width: 10,
    height: 8,
    inverse: false,
    borderValue: [255, 255],
    borderType: 'constant',
  });

  expect(img.colorModel).toBe('RGB');
  expect(img.bitDepth).toBe(8);

  expect(transformed).toMatchImage('opencv/test_border_value_yellow.png', {
    error: 3,
  });

  const transformed2 = img.transform(matrix, {
    interpolationType: 'nearest',
    width: 10,
    height: 8,
    inverse: false,
    borderValue: [255],
    borderType: 'constant',
  });

  expect(transformed2).toMatchImage('opencv/test_border_value_red.png', {
    error: 3,
  });

  const transformed3 = img.transform(matrix, {
    interpolationType: 'nearest',
    width: 10,
    height: 8,
    inverse: false,
    borderValue: [0, 0, 255],
    borderType: 'constant',
  });

  expect(transformed3).toMatchImage('opencv/test_border_value_blue.png', {
    error: 3,
  });

  const transformed4 = img.transform(matrix, {
    interpolationType: 'nearest',
    width: 10,
    height: 8,
    inverse: false,
    borderValue: [255, 255, 255],
    borderType: 'constant',
  });

  expect(transformed4).toMatchImage('opencv/test_border_value_white.png', {
    error: 3,
  });
});

test('check borderValue with alpha', () => {
  const img = testUtils.createRgbaImage([
    [
      125, 125, 125, 255, 125, 125, 125, 255, 125, 125, 125, 255, 125, 125, 125,
      255,
    ],
    [
      125, 125, 125, 255, 255, 255, 255, 255, 255, 255, 255, 255, 125, 125, 125,
      255,
    ],
    [
      125, 125, 125, 255, 255, 255, 255, 255, 255, 255, 255, 255, 125, 125, 125,
      255,
    ],
    [
      125, 125, 125, 255, 125, 125, 125, 255, 125, 125, 125, 255, 125, 125, 125,
      255,
    ],
  ]);

  expect(img.colorModel).toBe('RGBA');
  expect(img.bitDepth).toBe(8);

  const matrix = [
    [2, 0, 0],
    [0, 2, 0],
  ];
  const result = img.transform(matrix, {
    inverse: true,
    width: img.width,
    height: img.height,
    interpolationType: 'nearest',
    borderType: 'constant',
    borderValue: [125, 125, 125, 125],
  });

  expect(result.getRawImage().data).toStrictEqual(
    new Uint8Array(
      [
        [
          125, 125, 125, 255, 125, 125, 125, 255, 125, 125, 125, 125, 125, 125,
          125, 125,
        ],
        [
          125, 125, 125, 255, 255, 255, 255, 255, 125, 125, 125, 125, 125, 125,
          125, 125,
        ],
        [
          125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 125,
          125, 125,
        ],
        [
          125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 125,
          125, 125,
        ],
      ].flat(),
    ),
  );
});
