import Image from '../Image';
import { validateArrayOfChannels } from '../../util/channel';

/**
 * Erosion is one of two fundamental operations (the other being dilation) in morphological image processing from which all other morphological operations are based (from Wikipedia).
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/erosion_dilatation/erosion_dilatation.html
 * https://en.wikipedia.org/wiki/Erosion_(morphology)
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {SelectedChannels} [options.channels] - Selected channels
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
      result = erodeOnceBinary(result, kernel, channels);
    } else {
      result = erodeOnce(result, kernel, channels);
    }
  }
  return result;
}

function erodeOnce(img, kernel, channels) {
  const kernelWidth = kernel.length;
  const kernelHeight = kernel[0].length;
  let radiusX = (kernelWidth - 1) / 2;
  let radiusY = (kernelHeight - 1) / 2;
  let newImage = Image.createFrom(img);
  for (let channel = 0; channel < channels.length; channel++) {
    let c = channels[channel];
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        let min = Number.MAX_SAFE_INTEGER;
        for (let jj = 0; jj < kernelHeight; jj++) {
          for (let ii = 0; ii < kernelWidth; ii++) {
            if (kernel[ii][jj] !== 1) continue;
            let i = ii - radiusX + x;
            let j = jj - radiusY + y;
            let index = (j * img.width + i) * img.channels + c;
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
  const kernelWidth = kernel.length;
  const kernelHeight = kernel[0].length;
  let radiusX = (kernelWidth - 1) / 2;
  let radiusY = (kernelHeight - 1) / 2;
  let newImage = Image.createFrom(img);
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let min = 1;
      intLoop: for (let jj = 0; jj < kernelHeight; jj++) {
        for (let ii = 0; ii < kernelWidth; ii++) {
          if (kernel[ii][jj] !== 1) continue;
          let i = ii - radiusX + x;
          let j = jj - radiusY + y;
          if (j < 0 || i < 0 || i >= img.width || j >= img.height) continue;
          const value = img.getBitXY(i, j);
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

