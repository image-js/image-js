import Image from '../../image/Image';

/**
 * @memberof Stack
 * @instance
 * @return {Image}
 */
export default function minImage() {
  this.checkProcessable('max', {
    bitDepth: [8, 16],
  });

  let image = Image.createFrom(this[0]);
  image.data.fill(image.maxValue);
  for (const current of this) {
    for (let j = 0; j < image.data.length; j++) {
      image.data[j] = Math.min(current.data[j], image.data[j]);
    }
  }

  return image;
}
