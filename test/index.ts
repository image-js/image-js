import * as fs from 'fs';
import * as path from 'path';

export function getPath(name: string): string {
  return path.join(__dirname, `./img/${name}`);
}

export function readImage(name: string): Buffer {
  const filePath = getPath(name);
  return fs.readFileSync(filePath);
}
