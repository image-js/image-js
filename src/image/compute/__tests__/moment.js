import binary from 'test/binary';

describe('check moment', function () {
  it('should yield the correct moment', function () {
    const image = binary`
      10000011
      10000000
    `;

    expect(image.getMoment()).toBe(4);
    expect(image.getMoment(0, 0)).toBe(4);
    expect(image.getMoment(1, 0)).toBe(13);
    expect(image.getMoment(0, 1)).toBe(1);
    expect(image.getMoment(1, 1)).toBe(0);
  });
});
