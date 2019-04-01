import { Image, ImageKind, ColorDepth } from 'ijs';

import { getOutputImage } from '../src/utils/getOutputImage';

describe('getOutputImage', () => {
  it('should default to creating an empty image', () => {
    const img = new Image(2, 2, {
      kind: ImageKind.GREY,
      data: Uint8Array.of(0, 1, 2, 3)
    });
    const output = getOutputImage(img);
    expect(output).toMatchObject({
      width: 2,
      height: 2,
      kind: ImageKind.GREY,
      depth: ColorDepth.UINT8
    });
    expect(output.data).toStrictEqual(new Uint8Array(4));
  });

  it('should create with requirements', () => {
    const img = new Image();
    const requirements = {
      kind: ImageKind.GREY
    };
    const output = getOutputImage(img, {}, { newParameters: requirements });
    expect(output).toMatchObject({
      kind: ImageKind.GREY
    });
  });

  it('should accept out with matching requirements', () => {
    const img = new Image();
    const requirements = {
      kind: ImageKind.GREY
    };
    const correct = new Image(requirements);
    const output = getOutputImage(
      img,
      { out: correct },
      { newParameters: requirements }
    );
    expect(output).toBe(correct);
  });

  it('should throw with non-matching requirements', () => {
    const img = new Image();
    const requirements = {
      kind: ImageKind.GREY
    };
    const incorrect = new Image();
    expect(() =>
      getOutputImage(img, { out: incorrect }, { newParameters: requirements })
    ).toThrow(/cannot use out. Its kind property must be GREY. Found RGB/);
  });

  it('should throw if out is not an image', () => {
    const img = new Image();
    // @ts-ignore
    expect(() => getOutputImage(img, { out: 'str' })).toThrow(
      /out must be an Image object/
    );
  });
});
