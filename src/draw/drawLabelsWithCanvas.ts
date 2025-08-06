import type { Image } from '../Image.js';
import { Canvas } from 'skia-canvas';
import { readCanvas } from '../load/readCanvas.js';
import { writeCanvas } from '../save/writeCanvas.js';
import { readSync } from '../load/read.js';
import { writeSync } from '../save/write.js';

export function drawLabelWithCanvas(image: Image, label: string) {
  const canvas = new Canvas(image.width, image.height);

  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(image.width, image.height);
  imageData.data.set(image.getRawImage().data);
  ctx.putImageData(imageData, 0, 0);
  ctx.fillText(label, 10, 10);
  image = readCanvas(canvas);
  return image;
}

let image = readSync(
  '/Users/maxim/git/zakodium/image-js/test/img/various/screws.png',
);
image.gaussianBlur({ sigma: 0, sizeX: 2 });

/*
image = drawLabelWithCanvas(
  image,
  'This is a very long text that i want to write just to check if the function works.',
);
*/
writeSync('./testingLabels.png', image);
