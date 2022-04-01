import { rgbToNumber } from '../rgbToNumber';

describe('rgbToNumber', () => {
  it('white', () => {
    const rgb = new Uint8Array([255, 255, 255]);
    expect(rgbToNumber(rgb)).toBe(0xffffffff);
  });
  it('red', () => {
    const rgb = new Uint8Array([255, 0, 0]);
    expect(rgbToNumber(rgb)).toBe(0xff0000ff);
  });
  it('green', () => {
    const rgb = new Uint8Array([0, 255, 0]);
    expect(rgbToNumber(rgb)).toBe(0xff00ff00);
  });
});
