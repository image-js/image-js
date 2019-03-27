import { encodePng, decode } from 'ijs';
import { readImage } from 'test/readFile';

describe('encode PNG', () => {
  it('should encode what it decoded', () => {
    const buffer = readImage('grey8.png');
    const img = decode(buffer);
    const imgDup = decode(encodePng(img));
    expect(imgDup.kind).toStrictEqual(img.kind);
    expect(imgDup.depth).toStrictEqual(img.depth);
    expect(imgDup.data).toStrictEqual(img.data);
  });
});
