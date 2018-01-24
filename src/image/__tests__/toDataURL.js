import { getSquare, get1BitSquare } from 'test/common';

describe('toDataURL and toBase64', () => {
  it('toDataURL', () => {
    const image = getSquare();
    const dataURL = image.toDataURL();
    expect(typeof dataURL).toBe('string');
    expect(dataURL).toContain('data:image/png;base64,');
  });

  it('toDataURL (async jpeg)', async () => {
    const image = getSquare();
    const dataURL = await image.toDataURL('jpeg', { async: true });
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

  it('toBase64 (async jpeg)', () => {
    const image = getSquare();
    return Promise.all([
      image.toBase64('jpeg', { async: true }),
      image.toDataURL('jpeg', { async: true })
    ]).then(function (result) {
      const base64 = result[0];
      const dataURL = result[1];
      expect(typeof base64).toBe('string');
      expect(base64).toBe(dataURL.substring(dataURL.indexOf(',') + 1));
    });
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

  it('toBase64 (async bmp', () => {
    const image = get1BitSquare();
    const base64 = image.toBase64('bmp', { async: true });
    const dataURL = image.toDataURL('bmp', { async: true });
    return Promise.all([base64, dataURL], (base64, dataURL) => {
      expect(typeof dataURL).toBe('string');
      expect(typeof base64).toBe('string');
      expect(dataURL).toContain('data:image/bmp;base64,');
      expect(base64).toBe(dataURL.substring(dataURL.indexOf(',') + 1));
    });
  });
});
