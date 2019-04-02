import * as fs from 'fs';
import * as path from 'path';

// @ts-ignore
import * as flat from 'array.prototype.flat';
import { Image, decode, ImageKind, ColorDepth } from 'ijs';

flat.default.shim();
export function getPath(name: string): string {
  return path.join(__dirname, `./img/${name}`);
}

export function readImage(name: string): Buffer {
  const filePath = getPath(name);
  return fs.readFileSync(filePath);
}

export function decodeImage(name: string): Image {
  const buffer = readImage(name);
  return decode(buffer);
}

export function getImage(
  data: number[][] | number[][][],
  kind: ImageKind,
  depth: ColorDepth = 8
): Image {
  const height = data.length;
  const width = data[0].length;

  // @ts-ignore
  const flatData: number[] = data.flat(2);
  const imgData =
    depth === ColorDepth.UINT8
      ? Uint8Array.from(flatData)
      : Uint16Array.from(flatData);

  return new Image({
    width,
    height,
    kind,
    data: imgData,
    depth
  });
}

const black = [0, 0, 0];
const grey = [128, 128, 128];
const white = [255, 255, 255];
const red = [255, 0, 0];
const green = [0, 255, 0];
const blue = [0, 0, 255];
const cyan = [0, 255, 255];
const magenta = [255, 0, 255];
const yellow = [255, 255, 0];

const testImage = [
  [white, white, white, white, white, white, white, white],
  [black, black, black, black, black, black, black, black],
  [black, red, red, white, white, cyan, cyan, black],
  [black, red, red, white, white, cyan, cyan, black],
  [black, green, green, black, black, magenta, magenta, black],
  [black, green, green, black, black, magenta, magenta, black],
  [black, blue, blue, grey, grey, yellow, yellow, black],
  [black, blue, blue, grey, grey, yellow, yellow, black],
  [black, black, black, black, black, black, black, black],
  [white, white, white, white, white, white, white, white]
];

export function getTestImage(kind: ImageKind = ImageKind.RGB): Image {
  const img = getImage(testImage, ImageKind.RGB);
  if (kind !== ImageKind.RGB) {
    return img.convertColor(kind);
  } else {
    return img;
  }
}
