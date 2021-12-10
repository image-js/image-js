import { ImageColorModel } from '../../../IJS';
import { Mask } from '../../Mask';

describe('convert color model', () => {
  it('mask to GREY', () => {
    const mask = new Mask(2, 2);
    mask.setBitByIndex(0, 1);

    const img = mask.convertColor(ImageColorModel.GREY);
    expect(img).toMatchImageData([
      [255, 0],
      [0, 0],
    ]);
  });
  it('wrong color model', () => {
    const mask = new Mask(2, 2);
    mask.setBitByIndex(0, 1);

    expect(() => {
      mask.convertColor(ImageColorModel.GREYA);
    }).toThrow(/Masks can only be converted to GREY images./);
  });
});
