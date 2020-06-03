import Image from '../Image';

/**
 * Dilatation is one of two fundamental operations (with erosion) in morphological
 * image processing from which all other morphological operations are based (from Wikipedia).
 * Replaces each value with it's local maximum among the pixels with a kernel value of 1.
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/erosion_dilatation/erosion_dilatation.html
 * https://en.wikipedia.org/wiki/Dilation_(morphology)
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Array<Array<number>>} [options.kernel] - The kernel can only have ones and zeros. Default: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
 * @param {number} [options.iterations=1] - The number of successive erosions
 * @return {Image}
 */
export default function dilate(options = {}) {
  let {
    kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    iterations = 1,
  } = options;

  this.checkProcessable('dilate', {
    bitDepth: [1, 8, 16],
    components: 1,
    alpha: 0,
  });
  if (kernel.columns % 2 === 0 || kernel.rows % 2 === 0) {
    throw new TypeError(
      'dilate: The number of rows and columns of the kernel must be odd',
    );
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

  let result = this;
  for (let i = 0; i < iterations; i++) {
    if (this.bitDepth === 1) {
      if (onlyOnes) {
        const newImage = result.clone();
        result = dilateOnceBinaryOnlyOnes(
          result,
          newImage,
          kernel.length,
          kernel[0].length,
        );
      } else {
        const newImage = Image.createFrom(result);
        result = dilateOnceBinary(result, newImage, kernel);
      }
    } else if (onlyOnes) {
      const newImage = Image.createFrom(result);
      result = dilateOnceGreyOnlyOnes(
        result,
        newImage,
        kernel.length,
        kernel[0].length,
      );
    } else {
      const newImage = Image.createFrom(result);
      result = dilateOnceGrey(result, newImage, kernel);
    }
  }
  return result;
}

function dilateOnceGrey(img, newImage, kernel) {
  const kernelWidth = kernel.length;
  const kernelHeight = kernel[0].length;
  let radiusX = (kernelWidth - 1) / 2;
  let radiusY = (kernelHeight - 1) / 2;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let max = 0;
      for (let jj = 0; jj < kernelHeight; jj++) {
        for (let ii = 0; ii < kernelWidth; ii++) {
          if (kernel[ii][jj] !== 1) continue;
          let i = ii - radiusX + x;
          let j = jj - radiusY + y;
          if (i < 0 || j < 0 || i >= img.width || j >= img.height) continue;
          const value = img.getValueXY(i, j, 0);
          if (value > max) max = value;
        }
      }
      newImage.setValueXY(x, y, 0, max);
    }
  }
  return newImage;
}

function dilateOnceGreyOnlyOnes(img, newImage, kernelWidth, kernelHeight) {
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;

  const maxList = [];
  for (let x = 0; x < img.width; x++) {
    maxList.push(0);
  }

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let max = 0;
      for (
        let h = Math.max(0, y - radiusY);
        h < Math.min(img.height, y + radiusY + 1);
        h++
      ) {
        const value = img.getValueXY(x, h, 0);
        if (value > max) {
          max = value;
        }
      }
      maxList[x] = max;
    }

    for (let x = 0; x < img.width; x++) {
      let max = 0;
      for (
        let i = Math.max(0, x - radiusX);
        i < Math.min(img.width, x + radiusX + 1);
        i++
      ) {
        if (maxList[i] > max) {
          max = maxList[i];
        }
      }
      newImage.setValueXY(x, y, 0, max);
    }
  }
  return newImage;
}

function dilateOnceBinary(img, newImage, kernel) {
  const kernelWidth = kernel.length;
  const kernelHeight = kernel[0].length;
  let radiusX = (kernelWidth - 1) / 2;
  let radiusY = (kernelHeight - 1) / 2;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let max = 0;
      intLoop: for (let jj = 0; jj < kernelHeight; jj++) {
        for (let ii = 0; ii < kernelWidth; ii++) {
          if (kernel[ii][jj] !== 1) continue;
          let i = ii - radiusX + x;
          let j = jj - radiusY + y;
          if (j < 0 || i < 0 || i >= img.width || j >= img.height) continue;
          const value = img.getBitXY(i, j);
          if (value === 1) {
            max = 1;
            break intLoop;
          }
        }
      }
      if (max === 1) {
        newImage.setBitXY(x, y);
      }
    }
  }
  return newImage;
}

function dilateOnceBinaryOnlyOnes(img, newImage, kernelWidth, kernelHeight) {
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;

  const maxList = [];
  for (let x = 0; x < img.width; x++) {
    maxList.push(1);
  }

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      maxList[x] = 0;
      for (
        let h = Math.max(0, y - radiusY);
        h < Math.min(img.height, y + radiusY + 1);
        h++
      ) {
        if (img.getBitXY(x, h) === 1) {
          maxList[x] = 1;
          break;
        }
      }
    }

    for (let x = 0; x < img.width; x++) {
      if (newImage.getBitXY(x, y) === 1) continue;
      for (
        let i = Math.max(0, x - radiusX);
        i < Math.min(img.width, x + radiusX + 1);
        i++
      ) {
        if (maxList[i] === 1) {
          newImage.setBitXY(x, y);
          break;
        }
      }
    }
  }
  return newImage;
}
