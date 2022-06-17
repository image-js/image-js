import { readSync } from '../../load';
import { writeSync } from '../../save';
import { correctColor } from '../correctColor';
import { polishImageData } from '../imageColors';
import { referenceQpCard } from '../referenceQpCard';
import { arrayColorsToRgbColors, getReferenceColors } from '../util/formatData';

describe('correctColor', () => {
  it('small test image', () => {
    const image = testUtils.load('opencv/test.png');

    const measuredColors = arrayColorsToRgbColors(polishImageData.colors);
    const referenceColors = getReferenceColors(referenceQpCard);

    const result = correctColor(image, measuredColors, referenceColors);

    expect(result).toMatchIJSSnapshot();
  });

  it('polish scan data', () => {
    const image = readSync('src/correctColor/__tests__/polish-scan.png');

    const measuredColors = arrayColorsToRgbColors(polishImageData.colors);
    const referenceColors = getReferenceColors(referenceQpCard);

    const result = correctColor(image, measuredColors, referenceColors);

    writeSync('src/correctColor/__tests__/correctColor.png', result);
  });
});
