import { IJS, ImageColorModel } from '../../IJS';
import { hue } from '../greyAlgorithms';

describe('hue', () => {
  it('hue is zero', () => {
    const image = new IJS(1, 1, { colorModel: ImageColorModel.RGBA });

    expect(hue(20, 20, 20, image)).toBe(0);
  });
  it('max value red', () => {
    const image = new IJS(1, 1, { colorModel: ImageColorModel.RGBA });

    expect(hue(255, 0, 0, image)).toBe(0);
  });
  it('max value green', () => {
    const image = new IJS(1, 1, { colorModel: ImageColorModel.RGBA });

    expect(hue(0, 255, 0, image)).toBe(85);
  });
  it('max value blue', () => {
    const image = new IJS(1, 1, { colorModel: ImageColorModel.RGBA });

    expect(hue(0, 0, 255, image)).toBe(170);
  });
});
