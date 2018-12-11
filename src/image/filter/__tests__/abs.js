import { Image } from 'test/common';

test('abs fiter', function () {
  const img = new Image(1, 2, [-2000, 3000], { kind: 'GREY', bitDepth: 32 });
  const out = img.abs();
  expect(Array.from(out.data)).toStrictEqual([2000, 3000]);
});
