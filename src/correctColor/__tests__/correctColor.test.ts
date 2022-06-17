import { readSync } from '../../load';
import { writeSync } from '../../save';
import { correctColor } from '../correctColor';

import { getMeasuredColors, getReferenceColors } from './testUtil/formatData';
import { polish, polishAltered } from './testUtil/imageColors';
import { referenceColorCard } from './testUtil/referenceColorCard';

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

    expect(result).toMatchImageData([[0, 0, 0, 9, 9, 9, 20, 20, 20]]);
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

    expect(result).toMatchImageData([
      [0, 0, 0, 0, 9, 9, 9, 100, 20, 20, 20, 200],
    ]);
  });

  it('small test image', () => {
    const image = testUtils.load('opencv/test.png');

    const measuredColors = getMeasuredColors(polish);
    const referenceColors = getReferenceColors(referenceColorCard);

    const result = correctColor(image, measuredColors, referenceColors);

    expect(result).toMatchIJSSnapshot();
  });

  it('polish scan', () => {
    const image = readSync(
      'src/correctColor/__tests__/testUtil/polish-scan.png',
    );

    const measuredColors = getMeasuredColors(polish);
    const referenceColors = getReferenceColors(referenceColorCard);

    const result = correctColor(image, measuredColors, referenceColors);

    writeSync('src/correctColor/__tests__/corrected1.png', result);
  });

  it('polish scan with altered color balance', () => {
    const image = readSync(
      'src/correctColor/__tests__/testUtil/polish-scan-altered.tif',
    );

    const measuredColors = getMeasuredColors(polishAltered);
    const referenceColors = getReferenceColors(referenceColorCard);

    const result = correctColor(image, measuredColors, referenceColors);

    writeSync('src/correctColor/__tests__/corrected2.png', result);
  });
});
