import Image from '../../Image';

describe('abs fiter', function () {
  it('basic test', function () {
    const img = new Image(1, 2, [
      -2000, 3000
    ], { kind: 'GREY', bitDepth: 32 });
    img.abs();
    expect(img.data).toEqual([
      2000, 3000
    ]);
  });
});
