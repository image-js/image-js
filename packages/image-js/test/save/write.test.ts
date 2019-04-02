import { join } from 'path';

import { existsSync } from 'fs-extra';
import { write, read, ImageFormat, ImageKind } from 'ijs';
import { getTestImage, makeTmpDir, cleanTmpDir } from 'test';

let tmpDir: string;
beforeEach(() => {
  tmpDir = makeTmpDir();
});
afterEach(() => {
  cleanTmpDir(tmpDir);
});

test('write image to disk', async () => {
  const img = getTestImage();
  const destination = join(tmpDir, 'image.png');
  await write(destination, img);
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead).toStrictEqual(img);
});

test('write image to disk (jpeg)', async () => {
  const img = getTestImage();
  const destination = join(tmpDir, 'image.png');
  await write(destination, img, { format: ImageFormat.jpeg });
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead.width).toBe(img.width);
  expect(imgRead.kind).toBe(ImageKind.RGBA);
});
