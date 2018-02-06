'use strict';

const { Image } = require('..');

const image = new Image(1000, 1000, { bitDepth: 8 });

function test(n) {
  for (let i = 0; i < n; i++) {
    image.invert();
  }
}

test(10);

console.time('test');
test(100);
console.timeEnd('test');
