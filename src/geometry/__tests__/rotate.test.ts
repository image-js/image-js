import { rotate } from '..';
import { ImageColorModel, ImageCoordinates } from '../../Image';
import { encodePng } from '../../save';
import { BorderType } from '../../utils/interpolateBorder';
import { InterpolationType } from '../../utils/interpolatePixel';

test('rotate + scale compared to opencv (nearest)', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = img.rotate(30, {
    scale: 0.8,
    borderType: BorderType.REFLECT,
    interpolationType: InterpolationType.NEAREST,
    center: { column: 2, row: 4 },
  });

  expect(rotated).toMatchImage('opencv/testRotate.png');
});

test('rotate + scale compared to opencv (bilinear)', () => {
  const img = testUtils.load('opencv/test.png');

  const rotated = rotate(img, 30, {
    scale: 1.4,
    borderType: BorderType.REFLECT,
    interpolationType: InterpolationType.BILINEAR,
    center: { column: 2, row: 4 },
  });
  expect(rotated).toMatchImage('opencv/testRotateBilinear.png', { error: 5 });
});

test('rotate + scale compared to opencv (bicubic)', () => {
  const img = testUtils.load('opencv/test.png');

  const rotated = rotate(img, 30, {
    scale: 1.4,
    borderType: BorderType.REFLECT,
    interpolationType: InterpolationType.BICUBIC,
    center: { column: 2, row: 4 },
  });

  expect(rotated).toMatchImage('opencv/testRotateBicubic.png', { error: 13 });
});

test('default options', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = img.rotate(90);

  const rotatedAroundCenter = img.rotate(90, {
    center: ImageCoordinates.CENTER,
  });

  expect(rotated).toMatchImage(rotatedAroundCenter);
});

test('coordinates as a string', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = img.rotate(90, {
    center: { column: 3.5, row: 4.5 },
  });

  const rotatedAroundCenter = img.rotate(90, {
    center: ImageCoordinates.CENTER,
  });

  expect(rotated).toMatchImage(rotatedAroundCenter);
});

test('rotate around corner', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = img.rotate(15, {
    center: ImageCoordinates.BOTTOM_LEFT,
  });

  const png = Buffer.from(
    encodePng(rotated.convertColor(ImageColorModel.GREY)),
  );

  expect(png).toMatchImageSnapshot();
});

test('rotate around center', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = img.rotate(90, {
    center: ImageCoordinates.CENTER,
  });

  const png = Buffer.from(
    encodePng(rotated.convertColor(ImageColorModel.GREY)),
  );

  expect(png).toMatchImageSnapshot();
});

test('fullImage option', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = img.rotate(15, {
    center: ImageCoordinates.BOTTOM_LEFT,
    fullImage: true,
  });

  const png = Buffer.from(
    encodePng(rotated.convertColor(ImageColorModel.GREY)),
  );

  expect(png).toMatchImageSnapshot();
});
