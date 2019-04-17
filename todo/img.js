const IJS = require('../packages/image-js/lib');

const img = new IJS.Image(4, 4, { kind: 'GREY' });

img.setValue(0, 0, 0, 100);
img.setValue(0, img.width - 1, 0, 200);
img.setValue(img.height - 1, 0, 0, 300);
img.setValue(img.height - 1, img.width - 1, 0, 400);

for (let i = 1; i < img.height - 1; i++) {
  for (let j = 1; j < img.width - 1; j++) {
    img.setValue(i, j, 0, i * j * 10);
  }
}

console.log(img);
IJS.writeSync('img.png', img);

const resized = img.resize({ xFactor: 2, interpolationType: 'BILINEAR' });
console.log(resized);
