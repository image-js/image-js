import { canvasToBlob } from 'blob-util';
import { encode as encodeBmp } from 'fast-bmp';
import { encode as realEncodePng } from 'fast-png';
import { encode as realEncodeJpeg } from 'jpeg-js';

import { toBase64URL } from '../../util/base64';

import {
  ImageData,
  createCanvas,
  createWriteStream,
  writeFile
} from './environment';
import { getType } from './mediaTypes';

function encodeJpeg(image, options = {}) {
  const data = {
    width: image.width,
    height: image.height,
    data: image.getRGBAData()
  };
  return realEncodeJpeg(data, options.quality).data;
}

function encodePng(image, options) {
  const data = {
    width: image.width,
    height: image.height,
    channels: image.channels,
    depth: image.bitDepth,
    data: image.data
  };

  if (data.depth === 1 || data.depth === 32) {
    data.depth = 8;
    data.channels = 4;
    data.data = image.getRGBAData();
  }

  return realEncodePng(data, options);
}

const exportMethods = {
  /**
   * Save the image to disk (Node.js only)
   * @memberof Image
   * @instance
   * @param {string} path
   * @param {object} [options]
   * @param {string} [options.format] - One of: png, jpg, bmp (limited support for bmp). If not specified will try to infer from filename
   * @param {boolean} [options.useCanvas=false] - Force use of the canvas API to save the image instead of a JavaScript implementation
   * @param {object} [options.encoder] - Specify options for the encoder if applicable.
   * @return {Promise} - Resolves when the file is fully written
   */
  save(path, options = {}) {
    const { useCanvas = false, encoder: encoderOptions = undefined } = options;

    let { format } = options;
    if (!format) {
      // try to infer format from filename
      const m = /\.([a-zA-Z]+)$/.exec(path);
      if (m) {
        format = m[1].toLowerCase();
      }
    }
    if (!format) {
      throw new Error('file format not provided');
    }
    return new Promise((resolve, reject) => {
      let stream, buffer;
      switch (format.toLowerCase()) {
        case 'png': {
          if (useCanvas) {
            stream = this.getCanvas().pngStream();
          } else {
            buffer = encodePng(this, encoderOptions);
          }
          break;
        }
        case 'jpg':
        case 'jpeg':
          if (useCanvas) {
            stream = this.getCanvas().jpegStream();
          } else {
            buffer = encodeJpeg(this, encoderOptions);
          }
          break;
        case 'bmp':
          buffer = encodeBmp(this, encoderOptions);
          break;
        default:
          throw new RangeError(`invalid output format: ${format}`);
      }
      if (stream) {
        let out = createWriteStream(path);
        out.on('finish', resolve);
        out.on('error', reject);
        stream.pipe(out);
      } else if (buffer) {
        writeFile(path, buffer, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      }
    });
  },

  /**
   * Creates a dataURL string from the image.
   * @memberof Image
   * @instance
   * @param {string} [type='image/png']
   * @param {object} [options]
   * @param {boolean} [options.useCanvas=false] - Force use of the canvas API to save the image instead of JavaScript implementation.
   * @param {object} [options.encoder] - Specify options for the encoder if applicable.
   * @return {string|Promise<string>}
   */
  toDataURL(type = 'image/png', options = {}) {
    if (typeof type === 'object') {
      options = type;
      type = 'image/png';
    }
    const { useCanvas = false, encoder: encoderOptions = undefined } = options;
    type = getType(type);
    function dataUrl(encoder, ctx) {
      const u8 = encoder(ctx, encoderOptions);
      return toBase64URL(u8, type);
    }
    if (type === 'image/bmp') {
      return dataUrl(encodeBmp, this);
    } else if (type === 'image/png' && !useCanvas) {
      return dataUrl(encodePng, this);
    } else if (type === 'image/jpeg' && !useCanvas) {
      return dataUrl(encodeJpeg, this);
    } else {
      return this.getCanvas().toDataURL(type);
    }
  },

  /**
   * Encodes the image and returns a buffer
   * @memberof Image
   * @instance
   * @param {object} [options]
   * @param {string} [options.format='png']
   * @param {object} [options.encoder] - Specify options for the encoder if applicable.
   * @return {Uint8Array}
   */
  toBuffer(options = {}) {
    const { format = 'png', encoder: encoderOptions = undefined } = options;
    switch (format.toLowerCase()) {
      case 'png':
        return encodePng(this, encoderOptions);
      case 'jpeg':
      case 'jpg':
        return encodeJpeg(this, encoderOptions);
      case 'bmp':
        return encodeBmp(this, encoderOptions);
      default:
        throw new RangeError(`invalid output format: ${format}`);
    }
  },

  /**
   * Creates a base64 string from the image.
   * @memberof Image
   * @instance
   * @param {string} [type='image/png']
   * @param {object} [options] - Same options as toDataURL
   * @return {string|Promise<string>}
   */
  toBase64(type = 'image/png', options = {}) {
    if (options.async) {
      return this.toDataURL(type, options).then(function (dataURL) {
        return dataURL.substring(dataURL.indexOf(',') + 1);
      });
    } else {
      const dataURL = this.toDataURL(type, options);
      return dataURL.substring(dataURL.indexOf(',') + 1);
    }
  },

  /**
   * Creates a blob from the image and return a Promise.
   * This function is only available in the browser.
   * @memberof Image
   * @instance
   * @param {string} [type='image/png'] A String indicating the image format. The default type is image/png.
   * @param {string} [quality=0.8] A Number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp. If this argument is anything else, the default value for image quality is used. Other arguments are ignored.
   * @return {Promise}
   */
  toBlob(type = 'image/png', quality = 0.8) {
    return canvasToBlob(this.getCanvas(), type, quality);
  },

  /**
   * Creates a new canvas element and draw the image inside it
   * @memberof Image
   * @instance
   * @return {Canvas}
   */
  getCanvas() {
    const data = new ImageData(
      this.getRGBAData({ clamped: true }),
      this.width,
      this.height
    );
    let canvas = createCanvas(this.width, this.height);
    let ctx = canvas.getContext('2d');
    ctx.putImageData(data, 0, 0);
    return canvas;
  }
};

export default function setExportMethods(Image) {
  for (const i in exportMethods) {
    Image.prototype[i] = exportMethods[i];
  }
}
