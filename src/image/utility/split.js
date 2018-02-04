import Image from '../Image';
import Stack from '../../stack/Stack';
import { GREY } from '../model/model';

/**
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {boolean} [options.preserveAlpha=true]
 * @return {Stack}
 */
export default function split(options = {}) {
  let {
    preserveAlpha = true
  } = options;

  this.checkProcessable('split', {
    bitDepth: [8, 16]
  });

  // split will always return a stack of images
  if (this.components === 1) {
    return new Stack([this.clone()]);
  }

  let images = new Stack();

  let data = this.data;
  if (this.alpha && preserveAlpha) {
    for (let i = 0; i < this.components; i++) {
      let newImage = Image.createFrom(this, {
        components: 1,
        alpha: true,
        colorModel: GREY
      });
      let ptr = 0;
      for (let j = 0; j < data.length; j += this.channels) {
        newImage.data[ptr++] = data[j + i];
        newImage.data[ptr++] = data[j + this.components];
      }
      images.push(newImage);
    }
  } else {
    for (let i = 0; i < this.channels; i++) {
      let newImage = Image.createFrom(this, {
        components: 1,
        alpha: false,
        colorModel: GREY
      });
      let ptr = 0;
      for (let j = 0; j < data.length; j += this.channels) {
        newImage.data[ptr++] = data[j + i];
      }
      images.push(newImage);
    }
  }

  return images;
}
