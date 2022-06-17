import { readSync } from '../../load';
import { writeSync } from '../../save';
import { correctColor } from '../correctColor';

import { getMeasuredColors, getReferenceColors } from './testUtil/formatData';
import { polish, polishAltered } from './testUtil/imageColors';
import { referenceColorCard } from './testUtil/referenceColorCard';

describe('correctColor', () => {
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
