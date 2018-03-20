import { Image } from 'test/common';

describe('calculate svd', function () {
  it('check the result', function () {
    let img = new Image(8, 2, [255, 0], {
      kind: 'BINARY'
    });

    let svd = img.getSvd();

    expect(svd.V[0]).toEqual([-1, -0]);
    expect(svd.V[1]).toEqual([-0, -1]);
  });
});

