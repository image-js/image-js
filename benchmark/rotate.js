'use strict';

const { Image } = require('..');

function getImage() {
  const image = new Image(1200, 800);
  for (let x = 0; x < image.width; x++) {
    for (let y = 0; y < image.height; y++) {
      for (let c = 0; c < 4; c++) {
        const value = Math.round(Math.random() * 255);
        image.setValueXY(x, y, c, value);
      }
    }
  }
  return image;
}

let image = getImage();
image.rotate(30, { interpolation: 'bilinear' });

image = getImage();
console.time('rotate');
image.rotate(30, { interpolation: 'bilinear' });
console.timeEnd('rotate');
