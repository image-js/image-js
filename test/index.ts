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
  depth: ColorDepth
): Image {
  const width = data.length;
  const height = data[0].length;

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
