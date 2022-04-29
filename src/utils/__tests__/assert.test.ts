import { assert } from '../assert';

describe('assert', () => {
  it('should restrict type', () => {
    const variable: number | undefined = 3;
    assert(variable);
    expect(typeof variable).toBe('number');
  });
  it('should throw error message', () => {
    const variable: number | undefined = 3;
    expect(() => {
      assert(variable === 2, 'Error message');
    }).toThrow('Error message');
  });
  it('should throw default error message', () => {
    const variable: number | undefined = 3;
    expect(() => {
      assert(variable === 2);
    }).toThrow('unreachable');
  });
});
