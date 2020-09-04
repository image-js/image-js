import deepValue from '../deepValue';

test('deepValue', function () {
  const object = { a: [{ b: 1, c: [2, 3, 4], d: [{ e: 'f' }] }], b: { c: 5 } };
  expect(deepValue(object)).toBeUndefined();
  expect(deepValue(object)).toBeUndefined();
  expect(deepValue(1, 'ab')).toBeUndefined();
  expect(deepValue('abc', 'ab')).toBeUndefined();
  expect(deepValue(object, 'b.c')).toBe(5);
  expect(deepValue(object, 'a.0.b')).toBe(1);
  expect(deepValue(object, 'a.0.c')).toStrictEqual([2, 3, 4]);
});
