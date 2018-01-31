import Image from '../Image';
import { validateArrayOfChannels } from '../../util/channel';


/**
 * Erosion is one of two fundamental operations (the other being dilation) in morphological image processing from which all other morphological operations are based (from Wikipedia).
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/erosion_dilatation/erosion_dilatation.html
 * https://en.wikipedia.org/wiki/Erosion_(morphology)
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Matrix} [options.kernel]
 * @param {number} [options.iterations] - The number of successive erosions
 * @return {Image}
 */
export default function erode(options = {}) {
  let {
    kernel = [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    iterations = 1,
    channels
  } = options;

  this.checkProcessable('erode', {
    bitDepth: [1, 8, 16],
    channel: [1]
  });
  if (kernel.columns - 1 % 2 === 0 || kernel.rows - 1 % 2 === 0) {
    throw new TypeError('erode: The number of rows and columns of the kernel must be odd');
  }

  channels = validateArrayOfChannels(this, channels, true);

  let result = this;
  for (let i = 0; i < iterations; i++) {
    if (this.bitDepth === 1) {
      result = erodeOnceBinary(this, kernel, channels);
    } else {
      result = erodeOnce(this, kernel, channels);
    }
  }
  return result;
}

function erodeOnce(img, kernel, channels) {
  let kWidth = (kernel.length - 1) / 2;
  let kHeight = (kernel[0].length - 1) / 2;
  let newImage = Image.createFrom(img);
  for (let channel = 0; channel < channels.length; channel++) {
    let c = channels[channel];
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        let min = Number.MAX_SAFE_INTEGER;
        for (let j = -kHeight; j <= kHeight; j++) {
          for (let i = -kWidth; i <= kWidth; i++) {
            let index = ((y + j) * img.width + x + i) * img.channels + c;
            if (index < 0) continue;
            const value = img.data[index];
            if (value < min) min = value;
          }
        }
        let index = (y * img.width + x) * img.channels + c;
        newImage.data[index] = min;
      }
    }
  }
  return newImage;
}

function erodeOnceBinary(img, kernel) {
  let kWidth = (kernel.length - 1) / 2;
  let kHeight = (kernel[0].length - 1) / 2;
  let newImage = Image.createFrom(img);
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      // console.log('x, y', x, y);
      let min = 1;
      intLoop: for (let j = -kHeight; j <= kHeight; j++) {
        for (let i = -kWidth; i <= kWidth; i++) {
          const realX = x + i;
          const realY = y + j;
          if (realY < 0 || realX < 0 || realX >= img.width || realY >= img.height) continue;
          const value = img.getBitXY(realX, realY);
          if (value === 0) {
            min = 0;
            break intLoop;
          }
        }
      }
      if (min === 1) {
        newImage.setBitXY(x, y);
      }
    }
  }
  return newImage;
}

