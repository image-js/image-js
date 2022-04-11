import { decode as decodeJpegExif } from 'fast-jpeg';
import { decode as decodePng } from 'fast-png';
import imageType from 'image-type';
import { decode as decodeJpeg } from 'jpeg-js';
import { decode as decodeTiff } from 'tiff';

import Stack from '../../stack/Stack';
import { decode as base64Decode, toBase64URL } from '../../util/base64';
import Image from '../Image';
import { GREY, RGB } from '../model/model';

import { fetchBinary, DOMImage, createCanvas } from './environment';

const isDataURL = /^data:[a-z]+\/(?:[a-z]+);base64,/;

/**
 * Load an image
 * @memberof Image
 * @static
 * @param {string|ArrayBuffer|Buffer|Uint8Array} image - URL of the image (browser, can be a dataURL) or path (Node.js)
 * or buffer containing the binary data
 * @param {object} [options] - In the browser, the options object is passed to the underlying `fetch` call, along with
 * the data URL. For binary data, the option specify decoding options.
 * @param {boolean} [options.ignorePalette] - When set to true and loading a tiff from binary data, if the tiff is of
 * type 3 (palette), load as single channel greyscale rather than as a pseudo-colored RGB.
 * @return {Promise<Image>}
 * @example
 * const image = await Image.load('https://example.com/image.png');
 */
export default function load(image, options) {
  if (typeof image === 'string') {
    return loadURL(image, options);
  } else if (image instanceof ArrayBuffer) {
    return Promise.resolve(
      loadBinary(
        new Uint8Array(image),
        undefined,
        options && options.ignorePalette,
      ),
    );
  } else if (image.buffer) {
    return Promise.resolve(
      loadBinary(image, undefined, options && options.ignorePalette),
    );
  } else {
    throw new Error('argument to "load" must be a string or buffer.');
  }
}

function loadBinary(image, base64Url, ignorePalette) {
  const type = imageType(image);
  if (type) {
    switch (type.mime) {
      case 'image/png':
        return loadPNG(image);
      case 'image/jpeg':
        return loadJPEG(image);
      case 'image/tiff':
        return loadTIFF(image, ignorePalette);
      default:
        return loadGeneric(getBase64(type.mime));
    }
  }
  return loadGeneric(getBase64('application/octet-stream'));

  function getBase64(type) {
    if (base64Url) {
      return base64Url;
    } else {
      return toBase64URL(image, type);
    }
  }
}

function loadURL(url, options) {
  const dataURL = url.slice(0, 64).match(isDataURL);
  let binaryDataP;
  if (dataURL !== null) {
    binaryDataP = Promise.resolve(base64Decode(url.slice(dataURL[0].length)));
  } else {
    binaryDataP = fetchBinary(url, options);
  }
  return binaryDataP.then((binaryData) => {
    const uint8 = new Uint8Array(binaryData);
    return loadBinary(
      uint8,
      dataURL ? url : undefined,
      options && options.ignorePalette,
    );
  });
}

function loadPNG(data) {
  const png = decodePng(data);
  let channels = png.channels;
  let components;
  let alpha = 0;
  if (channels === 2 || channels === 4) {
    components = channels - 1;
    alpha = 1;
  } else {
    components = channels;
  }
  if (png.palette) {
    return loadPNGFromPalette(png);
  }

  return new Image(png.width, png.height, png.data, {
    components,
    alpha,
    bitDepth: png.depth,
  });
}

function loadPNGFromPalette(png) {
  const pixels = png.width * png.height;
  const channels = png.palette[0].length;
  const data = new Uint8Array(pixels * channels);
  const pixelsPerByte = 8 / png.depth;
  const factor = png.depth < 8 ? pixelsPerByte : 1;
  const mask = parseInt('1'.repeat(png.depth), 2);
  const hasAlpha = channels === 4;
  let dataIndex = 0;

  for (let i = 0; i < pixels; i++) {
    const index = Math.floor(i / factor);
    let value = png.data[index];
    if (png.depth < 8) {
      value =
        (value >>> (png.depth * (pixelsPerByte - 1 - (i % pixelsPerByte)))) &
        mask;
    }
    const paletteValue = png.palette[value];
    data[dataIndex++] = paletteValue[0];
    data[dataIndex++] = paletteValue[1];
    data[dataIndex++] = paletteValue[2];
    if (hasAlpha) {
      data[dataIndex++] = paletteValue[3];
    }
  }

  return new Image(png.width, png.height, data, {
    components: 3,
    alpha: hasAlpha,
    bitDepth: 8,
  });
}

function loadJPEG(data) {
  const decodedExif = decodeJpegExif(data);
  let meta;
  if (decodedExif.exif) {
    meta = getMetadata(decodedExif.exif);
  }
  const jpeg = decodeJpeg(data, { useTArray: true, maxMemoryUsageInMB: 1024 });
  let image = new Image(jpeg.width, jpeg.height, jpeg.data, { meta });
  if (meta && meta.tiff.tags.Orientation) {
    const orientation = meta.tiff.tags.Orientation;
    if (orientation > 2) {
      image = image.rotate(
        {
          3: 180,
          4: 180,
          5: 90,
          6: 90,
          7: 270,
          8: 270,
        }[orientation],
      );
    }
    if ([2, 4, 5, 7].includes(orientation)) {
      image = image.flipX();
    }
  }
  return image;
}

function loadTIFF(data, ignorePalette) {
  let result = decodeTiff(data);
  if (result.length === 1) {
    return getImageFromIFD(result[0], ignorePalette);
  } else {
    return new Stack(
      result.map(function (image) {
        return getImageFromIFD(image, ignorePalette);
      }),
    );
  }
}

function getMetadata(image) {
  const metadata = {
    tiff: {
      fields: image.fields,
      tags: image.map,
    },
  };
  if (image.exif) {
    metadata.exif = image.exif;
  }
  if (image.gps) {
    metadata.gps = image.gps;
  }
  return metadata;
}

function getImageFromIFD(image, ignorePalette) {
  if (!ignorePalette && image.type === 3) {
    // Palette
    const data = new Uint16Array(3 * image.width * image.height);
    const palette = image.palette;
    let ptr = 0;
    for (let i = 0; i < image.data.length; i++) {
      const index = image.data[i];
      const color = palette[index];
      data[ptr++] = color[0];
      data[ptr++] = color[1];
      data[ptr++] = color[2];
    }
    return new Image(image.width, image.height, data, {
      components: 3,
      alpha: image.alpha,
      colorModel: RGB,
      bitDepth: 16,
      meta: getMetadata(image),
    });
  } else {
    return new Image(image.width, image.height, image.data, {
      components: image.type === 2 ? 3 : 1,
      alpha: image.alpha,
      colorModel: image.type === 2 ? RGB : GREY,
      bitDepth: image.bitsPerSample.length
        ? image.bitsPerSample[0]
        : image.bitsPerSample,
      meta: getMetadata(image),
    });
  }
}

function loadGeneric(url, options) {
  options = options || {};
  return new Promise(function (resolve, reject) {
    let image = new DOMImage();
    image.onload = function () {
      let w = image.width;
      let h = image.height;
      let canvas = createCanvas(w, h);
      let ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, w, h);
      let data = ctx.getImageData(0, 0, w, h).data;
      resolve(new Image(w, h, data, options));
    };
    image.onerror = function () {
      reject(new Error(`Could not load ${url}`));
    };
    image.src = url;
  });
}
