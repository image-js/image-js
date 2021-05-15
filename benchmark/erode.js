'use strict';

const { Image } = require('..');

function getImage() {
  const image = new Image(1000, 500, { kind: 'BINARY' });
  for (let x = 0; x < image.width; x++) {
    for (let y = 0; y < image.height; y++) {
      if (Math.random() > 0.5) {
        image.setBitXY(x, y);
      }
    }
  }
  return image;
}

const kSize = 50;
const kernel = new Array(kSize).fill(new Array(kSize).fill(1));

let image = getImage();
image.erode({ kernel });

image = getImage();
console.time('erode');
image.erode({ kernel });
console.timeEnd('erode');
