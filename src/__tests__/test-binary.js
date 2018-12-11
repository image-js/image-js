import binary from 'test/binary';

test('test-binary', () => {
  {
    const result = binary`
      1010
      1010
      0101
      0101
  `;
    expect(result).toStrictEqual(new Uint8Array([0b10101010, 0b01010101]));
  }
  {
    const result = binary`
      1010101001010101
    `;
    expect(result).toStrictEqual(new Uint8Array([0b10101010, 0b01010101]));
  }

  {
    const result = binary`
      11111111
      00000000
      00001111
    `;
    expect(result).toStrictEqual(new Uint8Array([0b11111111, 0b00000000, 0b00001111]));
  }
});
