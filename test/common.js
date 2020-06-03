import { mkdirSync } from 'fs';

import { sync as rmSync } from 'rimraf';

import Image from '../src/image/Image';
import IJS from '../src/index';
import Stack from '../src/stack/Stack';

import { getImage, getHash } from './test-util';

export { getImage, getHash };

export { Image, Stack, IJS };

export function load(name) {
  return Image.load(getImage(name));
}

export function getSquare() {
  return new Image(3, 3, [
    0,
    0,
    255,
    255, // red
    0,
    255,
    0,
    255, // green
    255,
    0,
    0,
    255, // blur
    255,
    255,
    0,
    255, // yellow
    255,
    0,
    255,
    255, // magenta
    0,
    255,
    255,
    255, // cyan
    0,
    0,
    0,
    255, // black
    255,
    255,
    255,
    255, // white
    127,
    127,
    127,
    255, // grey
  ]);
}

export function get1BitSquare() {
  return new Image(3, 3, new Uint8Array([0b00001000, 0b00000000]), {
    kind: 'BINARY',
  });
}

export const tmpDir = `${__dirname}/TMP`;
export function refreshTmpDir() {
  rmSync(tmpDir);
  mkdirSync(tmpDir);
}
