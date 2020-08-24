import binary from 'test/binary';

describe('floodFill', function () {
  it('should fill the binary image', function () {
    const image = binary`
      00100000
      00110000
      00010000
      00111000
      11110000
    `;

    image.floodFill();

    const filled = binary`
      11100000
      11110000
      11110000
      11111000
      11110000
    `;

    expect(image.data).toStrictEqual(filled.data);
  });

  it('should fill the binary image (not in place)', function () {
    const image = binary`
        00100000
        00110000
        00010000
        00111000
        11110000
    `;
    const result = image.floodFill({ inPlace: false });

    const filled = binary`
        11000000
        11000000
        11100000
        11000000
        00000000
    `;

    const expected = binary`
      00100000
      00110000
      00010000
      00111000
      11110000
    `;

    expect(result.data).toStrictEqual(filled.data);
    expect(image.data).toStrictEqual(expected.data);
  });
});
