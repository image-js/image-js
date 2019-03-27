import { encodePng, decode } from 'ijs';
import { readImage } from 'test/readFile';

describe('encode PNG', () => {
  it('should encode what it decoded', () => {
    const buffer = readImage('grey8.png');
    const img = decode(buffer);
    expect(decode(encodePng(img)).data).toStrictEqual(img.data);
  });
});
