//To look at the equivalent opencv code go to generate.py in test/img/opencv
//folder.
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
  }).toThrow('transformation matrix must be 2x3. Received 2x4');
});
