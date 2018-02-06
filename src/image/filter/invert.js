/**
 * Invert the colors of an image
 * @memberof Image
 * @instance
 * @return {Image}
 */
export default function invert() {
  this.checkProcessable('invert', {
    bitDepth: [1, 8, 16]
  });

  if (this.bitDepth === 1) {
    invertBinary(this);
  } else {
    invertColor(this);
  }
  return this;
}

function invertBinary(image) {
  for (let i = 0; i < image.data.length; i++) {
    image.data[i] = ~image.data[i];
  }
}

function invertColor(image) {
  for (let pixel = 0; pixel < image.data.length; pixel += image.channels) {
    for (let c = 0; c < image.components; c++) {
      image.data[pixel + c] = image.maxValue - image.data[pixel + c];
    }
  }
}
