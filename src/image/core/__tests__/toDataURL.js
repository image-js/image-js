import { getSquare, get1BitSquare } from 'test/common';

describe('toDataURL and toBase64', () => {
  it('toDataURL', () => {
    const image = getSquare();
    const dataURL = image.toDataURL();
    expect(typeof dataURL).toBe('string');
    expect(dataURL).toContain('data:image/png;base64,');
  });

  it('toDataURL (jpeg)', () => {
    const image = getSquare();
    const dataURL = image.toDataURL('jpeg');
    expect(typeof dataURL).toBe('string');
    expect(dataURL).toContain('data:image/jpeg;base64,');
  });

  it('toBase64', () => {
    const image = getSquare();
    const dataURL = image.toDataURL();
    const base64 = image.toBase64();
    expect(typeof base64).toBe('string');
    expect(base64).toBe(dataURL.substring(dataURL.indexOf(',') + 1));
  });

  it('toBase64 (jpeg)', () => {
    const image = getSquare();
    const base64 = image.toBase64('jpeg');
    const dataURL = image.toDataURL('jpeg');
    expect(typeof base64).toBe('string');
    expect(base64).toBe(dataURL.substring(dataURL.indexOf(',') + 1));
  });

  it('toBase64 (sync bmp)', () => {
    const image = get1BitSquare();
    const base64 = image.toBase64('bmp');
    const dataURL = image.toDataURL('bmp');
    expect(typeof dataURL).toBe('string');
    expect(typeof base64).toBe('string');
    expect(dataURL).toContain('data:image/bmp;base64,');
    expect(base64).toBe(dataURL.substring(dataURL.indexOf(',') + 1));
  });
});
