import { rotate } from '..';
import { ImageColorModel, ImageCoordinates } from '../../IJS';
import { encodePng } from '../../save';
import { BorderType } from '../../utils/interpolateBorder';
import { InterpolationType } from '../../utils/interpolatePixel';

describe('rotate', () => {
  it('rotate + scale compared to opencv (nearest)', () => {
    const img = testUtils.load('opencv/test.png');
    const rotated = img.rotate(30, {
      scale: 0.8,
      borderType: BorderType.REFLECT,
      interpolationType: InterpolationType.NEAREST,
      center: [2, 4],
    });

    expect(rotated).toMatchImage('opencv/testRotate.png');
  });

  it.skip('rotate + scale compared to opencv (bilinear)', () => {
    const img = testUtils.load('opencv/test.png');

    const rotated = rotate(img, 30, {
      scale: 1.4,
      borderType: BorderType.REFLECT,
      interpolationType: InterpolationType.BILINEAR,
      center: [2, 4],
    });

    expect(rotated).toMatchImage('opencv/testRotateBilinear.png');
  });

  it.skip('rotate + scale compared to opencv (bicubic)', () => {
    const img = testUtils.load('opencv/test.png');

    const rotated = rotate(img, 30, {
      scale: 1.4,
      borderType: BorderType.REFLECT,
      interpolationType: InterpolationType.BICUBIC,
      center: [2, 4],
    });

    expect(rotated).toMatchImage('opencv/testRotateBicubic.png');
  });

  it('default options', () => {
    const img = testUtils.load('opencv/test.png');
    const rotated = img.rotate(90);

    const rotatedString = img.rotate(90, {
      center: ImageCoordinates.CENTER,
    });

    expect(rotated).toMatchImage(rotatedString);
  });

  it('coordinates as a string', () => {
    const img = testUtils.load('opencv/test.png');
    const rotated = img.rotate(90, {
      center: [3.5, 4.5],
    });

    const rotatedString = img.rotate(90, {
      center: ImageCoordinates.CENTER,
    });

    expect(rotated).toMatchImage(rotatedString);
  });

  it('rotate around corner', () => {
    const img = testUtils.load('opencv/test.png');
    const rotated = img.rotate(15, {
      center: ImageCoordinates.BOTTOM_LEFT,
    });

    const png = Buffer.from(
      encodePng(rotated.convertColor(ImageColorModel.GREY)),
    );

    expect(png).toMatchImageSnapshot();
  });
  it('rotate around center', () => {
    const img = testUtils.load('opencv/test.png');
    const rotated = img.rotate(90, {
      center: ImageCoordinates.CENTER,
    });

    const png = Buffer.from(
      encodePng(rotated.convertColor(ImageColorModel.GREY)),
    );

    expect(png).toMatchImageSnapshot();
  });
  it('test fullImage option', () => {
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
});
