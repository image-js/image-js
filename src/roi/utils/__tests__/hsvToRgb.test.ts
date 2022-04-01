import { hsvToRgb } from '../hsvToRgb';

describe('hsvToRgb', () => {
  it('black', () => {
    const rgb = new Uint8Array([0, 0, 0]);
    expect(hsvToRgb([50, 100, 0])).toStrictEqual(rgb);
  });
  it('white', () => {
    const rgb = new Uint8Array([255, 255, 255]);
    expect(hsvToRgb([50, 0, 255])).toStrictEqual(rgb);
  });
  it('red', () => {
    const rgb = new Uint8Array([255, 0, 0]);
    expect(hsvToRgb([0, 255, 255])).toStrictEqual(rgb);
  });
  it('green', () => {
    const rgb = new Uint8Array([0, 255, 0]);
    expect(hsvToRgb([120, 255, 255])).toStrictEqual(rgb);
  });
  it('blue', () => {
    const rgb = new Uint8Array([0, 0, 255]);
    expect(hsvToRgb([240, 255, 255])).toStrictEqual(rgb);
  });
  it('random color', () => {
    const rgb = new Uint8Array([255, 0, 42]);
    expect(hsvToRgb([350, 255, 255])).toStrictEqual(rgb);
  });
  it('other random color', () => {
    const rgb = new Uint8Array([0, 127, 255]);
    expect(hsvToRgb([210, 255, 255])).toStrictEqual(rgb);
  });
  it('yet another random color', () => {
    const rgb = new Uint8Array([127, 255, 0]);
    expect(hsvToRgb([90, 255, 255])).toStrictEqual(rgb);
  });
});
