import { Image, load } from 'test/common';

describe('we check the relative position', function () {
  it('check the extract without specify position', function () {
    let mask = new Image(2, 2, {
      kind: 'BINARY'
    });
    mask.setBitXY(0, 0);
    mask.setBitXY(1, 1);

    return load('BW4x4.png').then(function (image) {
      let position = image.getRelativePosition(mask);
      expect(position).toBe(false);
    });
  });

  it('check the extract without specify position but force top parent', function () {
    let mask = new Image(2, 2, {
      kind: 'BINARY'
    });
    mask.setBitXY(0, 0);
    mask.setBitXY(1, 1);

    return load('BW4x4.png').then(function (image) {
      let position = image.getRelativePosition(mask, { defaultFurther: true });
      expect(position).toEqual([0, 0]);
    });
  });

  it('check by specify 1,1 position with parent', function () {
    return load('BW4x4.png').then(function (image) {
      let mask = new Image(2, 2, {
        kind: 'BINARY',
        position: [1, 1],
        parent: image
      });

      mask.setBitXY(0, 0);
      mask.setBitXY(1, 0);

      let position = mask.getRelativePosition(image);

      expect(position).toEqual([1, 1]);
    });
  });
});
