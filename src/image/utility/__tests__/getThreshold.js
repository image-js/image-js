import { Image } from 'test/common';

test('should return a number', function () {
  let image = new Image(1, 2, [230, 100], { kind: 'GREY' });

  const threshold = image.getThreshold();
  expect(typeof threshold).toBe('number');
});
