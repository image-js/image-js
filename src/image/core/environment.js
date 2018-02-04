import { readFile, createWriteStream, writeFile } from 'fs';

const message =
  'requires the canvas library. Install it with `npm install canvas@next`.';

// eslint-disable-next-line import/no-mutable-exports
let createCanvas, DOMImage, ImageData;
try {
  const canvas = require('canvas');
  createCanvas = canvas.createCanvas;
  DOMImage = canvas.Image;
  ImageData = canvas.ImageData;
} catch (e) {
  createCanvas = function () {
    throw new Error(`createCanvas ${message}`);
  };
  DOMImage = function () {
    throw new Error(`DOMImage ${message}`);
  };
  ImageData = function () {
    throw new Error(`ImageData ${message}`);
  };
}

export const env = 'node';

export function fetchBinary(path) {
  return new Promise(function (resolve, reject) {
    readFile(path, function (err, data) {
      if (err) reject(err);
      else resolve(data.buffer);
    });
  });
}

export { createCanvas, ImageData, DOMImage, createWriteStream, writeFile };
