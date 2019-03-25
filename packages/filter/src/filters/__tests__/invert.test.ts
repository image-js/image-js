import { BaseImage } from "@image-js/core";

import { invert } from "../invert";

test('invert', () => {
  const img = new BaseImage(1, 2);
  const inverted = invert(img);
  expect(inverted.data).toStrictEqual(new Uint8Array(6).fill(255));
});
