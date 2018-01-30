import Image from '../Image';

describe('getRGBAData', function () {
  it('32 bit grey image', function () {
    const img = new Image(2, 1, [
      -2000, 3000
    ], { kind: 'GREY', bitDepth: 32 });

    const data = img.getRGBAData();
    expect(Array.from(data)).toEqual([0, 0, 0, 255, 255, 255, 255, 255]);

    const img1 = new Image(3, 1, [
      -2000, 3000, 500
    ], { kind: 'GREY', bitDepth: 32 });
    const data1 = img1.getRGBAData();
    expect(Array.from(data1)).toEqual([
      0, 0, 0, 255,
      255, 255, 255, 255,
      127, 127, 127, 255
    ]);
  });
});
