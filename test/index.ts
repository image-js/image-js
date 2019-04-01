import * as fs from 'fs';
import * as path from 'path';

import { Image, decode, ImageKind, ColorDepth } from 'ijs';

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
  data: number[][],
  kind: ImageKind,
  depth: ColorDepth
): Image {
  const width = data.length;
  const height = data[0].length;

  // @ts-ignore
  const flatData: number[] = data.flat();
  const imgData =
    depth === ColorDepth.UINT8
      ? new Uint8Array(flatData)
      : new Uint16Array(flatData);

  return new Image({
    width,
    height,
    kind,
    data: imgData,
    depth
  });
}
