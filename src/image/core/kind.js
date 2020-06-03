import * as ColorModel from '../model/model';

import * as Kind from './kindNames';

const kinds = {};

kinds[Kind.BINARY] = {
  components: 1,
  alpha: 0,
  bitDepth: 1,
  colorModel: ColorModel.GREY,
};

kinds[Kind.GREYA] = {
  components: 1,
  alpha: 1,
  bitDepth: 8,
  colorModel: ColorModel.GREY,
};

kinds[Kind.GREY] = {
  components: 1,
  alpha: 0,
  bitDepth: 8,
  colorModel: ColorModel.GREY,
};

kinds[Kind.RGBA] = {
  components: 3,
  alpha: 1,
  bitDepth: 8,
  colorModel: ColorModel.RGB,
};

kinds[Kind.RGB] = {
  components: 3,
  alpha: 0,
  bitDepth: 8,
  colorModel: ColorModel.RGB,
};

kinds[Kind.CMYK] = {
  components: 4,
  alpha: 0,
  bitDepth: 8,
  colorModel: ColorModel.CMYK,
};

kinds[Kind.CMYKA] = {
  components: 4,
  alpha: 1,
  bitDepth: 8,
  colorModel: ColorModel.CMYK,
};

export function getKind(kind) {
  const result = kinds[kind];
  if (!result) {
    throw new RangeError(`invalid image kind: ${kind}`);
  }
  return result;
}
const validBitDepth = [1, 8, 16, 32];
export function verifyKindDefinition(definition) {
  const { components, alpha, bitDepth, colorModel } = definition;
  if (!Number.isInteger(components) || components <= 0) {
    throw new RangeError(
      `invalid components: ${components}. Must be a positive integer`,
    );
  }
  if (alpha !== 0 && alpha !== 1 && typeof alpha !== 'boolean') {
    throw new TypeError(`invalid alpha: ${alpha}: must be a boolean, 0 or 1`);
  }
  if (!validBitDepth.includes(bitDepth)) {
    throw new RangeError(
      `invalid bitDepth: ${bitDepth}. Must be one of ${validBitDepth.join(
        ', ',
      )}`,
    );
  }
  // eslint-disable-next-line import/namespace
  if (!ColorModel[colorModel]) {
    throw new RangeError(
      `invalid colorModel: ${colorModel}. Must be one of ${Object.keys(
        ColorModel,
      ).join(', ')}`,
    );
  }
}

export function getTheoreticalPixelArraySize(size, channels, bitDepth) {
  let length = channels * size;
  if (bitDepth === 1) {
    length = Math.ceil(length / 8);
  }
  return length;
}

export function createPixelArray(
  size,
  components,
  alpha,
  channels,
  bitDepth,
  maxValue,
) {
  const length = channels * size;
  let arr;
  switch (bitDepth) {
    case 1:
      arr = new Uint8Array(Math.ceil(length / 8));
      break;
    case 8:
      arr = new Uint8Array(length);
      break;
    case 16:
      arr = new Uint16Array(length);
      break;
    case 32:
      arr = new Float32Array(length);
      break;
    default:
      throw new Error(`Cannot create pixel array for bit depth ${bitDepth}`);
  }

  // alpha channel is 100% by default
  if (alpha) {
    for (let i = components; i < arr.length; i += channels) {
      arr[i] = maxValue;
    }
  }

  return arr;
}
