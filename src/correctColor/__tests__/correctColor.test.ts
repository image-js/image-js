import { correctColor } from '../correctColor';
import { getMeasuredColors, getReferenceColors } from '../utils/formatData';
import { getImageColors } from '../utils/getImageColors';

import { polish } from './testUtils/imageColors';
import { referenceColorCard } from './testUtils/referenceColorCard';

describe('correctColor', () => {
  it('RGB image should not change', () => {
    const image = testUtils.createRgbImage([[0, 0, 0, 10, 10, 10, 20, 20, 20]]);

    const measuredColors = [
      { r: 0, g: 0, b: 0 },
      { r: 50, g: 50, b: 50 },
      { r: 100, g: 100, b: 100 },
      { r: 150, g: 150, b: 150 },
      { r: 200, g: 200, b: 200 },
    ];

    const result = correctColor(image, measuredColors, measuredColors);

    expect(result).toMatchImage(image, { error: 1 });
  });

  it('RGBA image should not change', () => {
    const image = testUtils.createRgbaImage([
      [0, 0, 0, 0, 10, 10, 10, 100, 20, 20, 20, 200],
    ]);

    const measuredColors = [
      { r: 0, g: 0, b: 0 },
      { r: 50, g: 50, b: 50 },
      { r: 100, g: 100, b: 100 },
      { r: 150, g: 150, b: 150 },
      { r: 200, g: 200, b: 200 },
    ];

    const result = correctColor(image, measuredColors, measuredColors);

    expect(result).toMatchImage(image, { error: 1 });
  });

  it('RGB image, measured colors are translated', () => {
    const image = testUtils.createRgbImage([
      [10, 10, 10, 100, 100, 100, 150, 150, 150],
    ]);

    const measuredColors = [
      { r: 5, g: 5, b: 5 },
      { r: 55, g: 55, b: 55 },
      { r: 105, g: 105, b: 105 },
      { r: 155, g: 155, b: 155 },
      { r: 205, g: 205, b: 205 },
    ];

    const referenceColors = [
      { r: 0, g: 0, b: 0 },
      { r: 50, g: 50, b: 50 },
      { r: 100, g: 100, b: 100 },
      { r: 150, g: 150, b: 150 },
      { r: 200, g: 200, b: 200 },
    ];

    const result = correctColor(image, measuredColors, referenceColors);

    expect(result).toMatchImageData([[5, 5, 5, 95, 95, 95, 145, 145, 145]], {
      error: 1,
    });
  });

  it('small RGB image with true reference and measured colors', () => {
    const image = testUtils.load('correctColor/test.png');

    const measuredColors = getMeasuredColors(polish);
    const referenceColors = getReferenceColors(referenceColorCard);

    const result = correctColor(image, measuredColors, referenceColors);

    expect(result).toMatchIJSSnapshot();
  });

  it('modified color balance', () => {
    const image = testUtils.load('correctColor/color-balance.png');
    const reference = testUtils.load('correctColor/test.png');

    const measuredColors = getImageColors(image);
    const referenceColors = getImageColors(reference);

    const result = correctColor(image, measuredColors, referenceColors);

    expect(result).toMatchImage(reference, { error: 1 });
  });

  it('exposure -1', () => {
    const image = testUtils.load('correctColor/exposure-minus-1.png');
    const reference = testUtils.load('correctColor/test.png');

    const measuredColors = getImageColors(image);
    const referenceColors = getImageColors(reference);

    const result = correctColor(image, measuredColors, referenceColors);

    expect(result).toMatchImage(reference, { error: 1 });
  });

  it('exposure +1', () => {
    const image = testUtils.load('correctColor/exposure-plus-1.png');
    const reference = testUtils.load('correctColor/test.png');

    const measuredColors = getImageColors(image);
    const referenceColors = getImageColors(reference);

    const result = correctColor(image, measuredColors, referenceColors);

    expect(result).toMatchImage(reference, { error: 1 });
  });

  it('inverted', () => {
    const image = testUtils.load('correctColor/inverted.png');
    const reference = testUtils.load('correctColor/test.png');

    const measuredColors = getImageColors(image);
    const referenceColors = getImageColors(reference);

    const result = correctColor(image, measuredColors, referenceColors);

    expect(result).toMatchImage(reference, { error: 1 });
  });

  it('offsets', () => {
    const image = testUtils.load('correctColor/offsets.png');
    const reference = testUtils.load('correctColor/test.png');

    const measuredColors = getImageColors(image);
    const referenceColors = getImageColors(reference);

    const result = correctColor(image, measuredColors, referenceColors);

    // all colors are nearly perfectly corrected, expect the gray
    expect(result).toMatchIJSSnapshot();
  });

  it('inverted, black and white pixel', () => {
    const image = testUtils.createRgbImage([[0, 0, 0, 255, 255, 255]]);
    const reference = testUtils.createRgbImage([[255, 255, 255, 0, 0, 0]]);

    const measuredColors = getImageColors(image);
    const referenceColors = getImageColors(reference);

    const result = correctColor(image, measuredColors, referenceColors);

    expect(result).toMatchImage(reference, { error: 1 });
  });
});
