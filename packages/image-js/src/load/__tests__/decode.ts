import { decode } from '..';
import {readImage} from '../../../../../test/readFile';
import { ColorDepth } from '../../Image';

describe('Load PNG', function() {
  const tests: [string][] = [
    ['grey8'],
  ];

  it.each(tests)('auto decode %s', async (name) => {
    const buffer = readImage(`${name}.png`);
    expect(() => decode(buffer)).not.toThrowError();
    const decoded = decode(buffer);
    expect(decoded.depth).toEqual(ColorDepth.UINT8);
  });
});
