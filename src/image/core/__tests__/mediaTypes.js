import { getType } from '../mediaTypes';

test('getType', function () {
  expect(getType('png')).toBe('image/png');
  expect(getType('image/png')).toBe('image/png');
});
