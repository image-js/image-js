import Image from '../Image';
import { validInterpolations, checkInterpolation } from '../internal/checks';

export default function rotateFree(degrees, options = {}) {
  const {
    interpolation = validInterpolations.nearestneighbor,
    width = this.width,
    height = this.height,
  } = options;

  if (typeof degrees !== 'number') {
    throw new TypeError('degrees must be a number');
  }

  const interpolationToUse = (0, checkInterpolation)(interpolation);
  const radians = (degrees * Math.PI) / 180;
  const newWidth = Math.floor(
    Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians)),
  );
  const newHeight = Math.floor(
    Math.abs(height * Math.cos(radians)) + Math.abs(width * Math.sin(radians)),
  );

  const cos = Math.cos(-radians);
  const sin = Math.sin(-radians);
  let x0 = newWidth / 2;
  let y0 = newHeight / 2;

  if (newWidth % 2 === 0) {
    x0 = x0 - 0.5;

    if (newHeight % 2 === 0) {
      y0 = y0 - 0.5;
    } else {
      y0 = Math.floor(y0);
    }
  } else {
    x0 = Math.floor(x0);

    if (newHeight % 2 === 0) {
      y0 = y0 - 0.5;
    } else {
      y0 = Math.floor(y0);
    }
  }

  const incrementX = Math.floor(width / 2 - x0);
  const incrementY = Math.floor(height / 2 - y0);

  if (this.bitDepth === 1) {
    const newImage = new Image(newWidth, newHeight, {
      kind: 'BINARY',
      parent: this,
    });

    switch (interpolationToUse) {
      case validInterpolations.nearestneighbor:
        return rotateBinaryNearestNeighbor(
          this,
          newImage,
          incrementX,
          incrementY,
          x0,
          y0,
          cos,
          sin,
        );

      case validInterpolations.bilinear:
        return rotateBinaryBilinear(
          this,
          newImage,
          incrementX,
          incrementY,
          x0,
          y0,
          cos,
          sin,
        );

      default:
        throw new Error(
          `unsupported rotate interpolation: ${interpolationToUse}`,
        );
    }
  } else {
    const newImage = Image.createFrom(this, {
      width: newWidth,
      height: newHeight,
    });

    switch (interpolationToUse) {
      case validInterpolations.nearestneighbor:
        return rotateNearestNeighbor(
          this,
          newImage,
          incrementX,
          incrementY,
          x0,
          y0,
          cos,
          sin,
        );

      case validInterpolations.bilinear:
        return rotateBilinear(
          this,
          newImage,
          incrementX,
          incrementY,
          x0,
          y0,
          cos,
          sin,
        );

      default:
        throw new Error(
          `unsupported rotate interpolation: ${interpolationToUse}`,
        );
    }
  }
}

function rotateNearestNeighbor(
  thisImage,
  newImage,
  incrementX,
  incrementY,
  x0,
  y0,
  cos,
  sin,
) {
  for (let i = 0; i < newImage.width; i += 1) {
    for (let j = 0; j < newImage.height; j += 1) {
      for (let c = 0; c < thisImage.channels; c++) {
        let x = Math.round((i - x0) * cos - (j - y0) * sin + x0) + incrementX;
        let y = Math.round((j - y0) * cos + (i - x0) * sin + y0) + incrementY;

        if (x < 0 || x >= thisImage.width || y < 0 || y >= thisImage.height) {
          if (thisImage.alpha === 1 && c === thisImage.channels - 1) {
            newImage.setValueXY(i, j, c, 0);
          } else {
            newImage.setValueXY(i, j, c, thisImage.maxValue);
          }
        } else {
          newImage.setValueXY(i, j, c, thisImage.getValueXY(x, y, c));
        }
      }
    }
  }

  return newImage;
}

function rotateBinaryNearestNeighbor(
  thisImage,
  newImage,
  incrementX,
  incrementY,
  x0,
  y0,
  cos,
  sin,
) {
  for (let i = 0; i < newImage.width; i += 1) {
    for (let j = 0; j < newImage.height; j += 1) {
      let x = Math.round((i - x0) * cos - (j - y0) * sin + x0) + incrementX;
      let y = Math.round((j - y0) * cos + (i - x0) * sin + y0) + incrementY;

      if (
        x < 0 ||
        x >= thisImage.width ||
        y < 0 ||
        y >= thisImage.height ||
        thisImage.getBitXY(x, y)
      ) {
        newImage.setBitXY(i, j);
      }
    }
  }

  return newImage;
}

function rotateBilinear(
  thisImage,
  newImage,
  incrementX,
  incrementY,
  x0,
  y0,
  cos,
  sin,
) {
  let stride = thisImage.width * thisImage.channels;

  for (let j = 0; j < newImage.height; j++) {
    for (let i = 0; i < newImage.width; i++) {
      let x = (i - x0) * cos - (j - y0) * sin + x0 + incrementX;
      let y = (j - y0) * cos + (i - x0) * sin + y0 + incrementY;
      let x1 = x | 0;
      let y1 = y | 0;
      let xDiff = x - x1;
      let yDiff = y - y1;

      for (let c = 0; c < thisImage.channels; c++) {
        if (x < 0 || x >= thisImage.width || y < 0 || y >= thisImage.height) {
          if (thisImage.alpha === 1 && c === thisImage.channels - 1) {
            newImage.setValueXY(i, j, c, 0);
          } else {
            newImage.setValueXY(i, j, c, thisImage.maxValue);
          }
        } else {
          let index = (y1 * thisImage.width + x1) * thisImage.channels + c;
          let A = thisImage.data[index];
          let B = thisImage.data[index + thisImage.channels];
          let C = thisImage.data[index + stride];
          let D = thisImage.data[index + stride + thisImage.channels];
          let result =
            (A +
              xDiff * (B - A) +
              yDiff * (C - A) +
              xDiff * yDiff * (A - B - C + D)) |
            0;
          newImage.setValueXY(i, j, c, result);
        }
      }
    }
  }

  return newImage;
}

function rotateBinaryBilinear(
  thisImage,
  newImage,
  incrementX,
  incrementY,
  x0,
  y0,
  cos,
  sin,
) {
  let stride = thisImage.width;

  for (let j = 0; j < newImage.height; j++) {
    for (let i = 0; i < newImage.width; i++) {
      let x = (i - x0) * cos - (j - y0) * sin + x0 + incrementX;
      let y = (j - y0) * cos + (i - x0) * sin + y0 + incrementY;
      let x1 = x | 0;
      let y1 = y | 0;
      let xDiff = x - x1;
      let yDiff = y - y1;

      if (x < 0 || x >= thisImage.width || y < 0 || y >= thisImage.height) {
        newImage.setBitXY(i, j);
      } else {
        let index = y1 * thisImage.width + x1;
        let A = thisImage.getBit(index);
        let B = thisImage.getBit(index + 1);
        let C = thisImage.getBit(index + stride);
        let D = thisImage.getBit(index + 1 + stride);
        let result =
          A |
          (xDiff & (B - A)) |
          (yDiff & (C - A)) |
          (xDiff & yDiff & (A - B - C + D));
        if (result > 0) newImage.setBitXY(i, j);
      }
    }
  }

  return newImage;
}
