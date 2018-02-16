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
  if (kernel.columns % 2 === 0 || kernel.rows % 2 === 0) {
    throw new TypeError('erode: The number of rows and columns of the kernel must be odd');
  }

  let onlyOnes = true;
  outer: for (const row of kernel) {
    for (const value of row) {
      if (value !== 1) {
        onlyOnes = false;
        break outer;
      }
    }
  }

  channels = validateArrayOfChannels(this, channels, true);

  let result = this;
  for (let i = 0; i < iterations; i++) {
    if (this.bitDepth === 1) {
      if (onlyOnes) {
        const newImage = result.clone();
        result = erodeOnceBinaryOnlyOnes(result, newImage, kernel.length, kernel[0].length);
      } else {
        const newImage = Image.createFrom(result);
        result = erodeOnceBinary(result, newImage, kernel);
      }
    } else {
      const newImage = Image.createFrom(result);
      result = erodeOnce(result, newImage, kernel, channels);
    }
  }
  return result;
}

function erodeOnce(img, newImage, kernel, channels) {
  const kernelWidth = kernel.length;
  const kernelHeight = kernel[0].length;
  let radiusX = (kernelWidth - 1) / 2;
  let radiusY = (kernelHeight - 1) / 2;
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
            if (i < 0 || j < 0 || i >= img.width || j >= img.height) continue;
            let index = (j * img.width + i) * img.channels + c;
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

function erodeOnceBinary(img, newImage, kernel) {
  const kernelWidth = kernel.length;
  const kernelHeight = kernel[0].length;
  let radiusX = (kernelWidth - 1) / 2;
  let radiusY = (kernelHeight - 1) / 2;
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

function erodeOnceBinaryOnlyOnes(img, newImage, kernelWidth, kernelHeight) {
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;

  const minList = [];
  for (let x = 0; x < img.width; x++) {
    minList.push(0);
  }

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      minList[x] = 1;
      for (let h = Math.max(0, y - radiusY); h < Math.min(img.height, y + radiusY + 1); h++) {
        if (img.getBitXY(x, h) === 0) {
          minList[x] = 0;
          break;
        }
      }
    }

    for (let x = 0; x < img.width; x++) {
      if (newImage.getBitXY(x, y) === 0) continue;
      for (let i = Math.max(0, x - radiusX); i < Math.min(img.width, x + radiusX + 1); i++) {
        if (minList[i] === 0) {
          newImage.clearBitXY(x, y);
          break;
        }
      }
    }
  }
  return newImage;
}
