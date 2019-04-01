import { Image } from 'ijs';

test('invert', () => {
  const img = new Image(1, 2);
  const inverted = img.invert();
  expect(inverted.data).toStrictEqual(new Uint8Array(6).fill(255));
});
