import { encodePng } from '../../save/index.js';
import { transformRotate } from '../transformRotate.js';

test('rotate + scale compared to opencv (nearest)', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = img.transformRotate(30, {
    scale: 0.8,
    borderType: 'reflect',
    interpolationType: 'nearest',
    center: { column: 2, row: 4 },
  });

  expect(rotated).toMatchImage('opencv/testInterpolate.png');
});

test('rotate + scale compared to opencv (bilinear)', () => {
  const img = testUtils.load('opencv/test.png');

  const rotated = transformRotate(img, 30, {
    scale: 1.4,
    borderType: 'reflect',
    interpolationType: 'bilinear',
    center: { column: 2, row: 4 },
  });
  // OpenCV bilinear interpolation is less precise for speed.
  expect(rotated).toMatchImage('opencv/testRotateBilinear.png', { error: 5 });
});

test('rotate + scale compared to opencv (bicubic)', () => {
  const img = testUtils.load('opencv/test.png');

  const rotated = transformRotate(img, 30, {
    scale: 1.4,
    borderType: 'reflect',
    interpolationType: 'bicubic',
    center: { column: 2, row: 4 },
  });

  // OpenCV bilinear interpolation is less precise for speed.
  expect(rotated).toMatchImage('opencv/testRotateBicubic.png', { error: 13 });
});

test('default options', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = img.transformRotate(90);

  const rotatedAroundCenter = img.transformRotate(90, {
    center: 'center',
  });

  expect(rotated).toMatchImage(rotatedAroundCenter);
});

test('coordinates as a string', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = img.transformRotate(90, {
    center: { column: 3.5, row: 4.5 },
  });

  const rotatedAroundCenter = img.transformRotate(90, {
    center: 'center',
  });

  expect(rotated).toMatchImage(rotatedAroundCenter);
});

test('rotate around corner', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = img.transformRotate(15, {
    center: 'bottom-left',
  });

  const png = Buffer.from(encodePng(rotated.convertColor('GREY')));

  expect(png).toMatchImageSnapshot();
});

test('rotate around center', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = img.transformRotate(90, {
    center: 'center',
  });

  const png = Buffer.from(encodePng(rotated.convertColor('GREY')));

  expect(png).toMatchImageSnapshot();
});

test('fullImage option', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = img.transformRotate(15, {
    center: 'bottom-left',
    fullImage: true,
  });

  const png = Buffer.from(encodePng(rotated.convertColor('GREY')));

  expect(png).toMatchImageSnapshot();
});
