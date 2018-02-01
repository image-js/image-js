import { Image } from 'test/common';

import { createCanvas } from 'canvas';

describe.skip('Image core toBlob', function () {
  it('constructor defaults', function () {
    let canvas = createCanvas(2, 2);
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 2, 1);
    let img = Image.fromCanvas(canvas);
    return img.toBlob().then(function () {
      // empty
    });
  });
});
