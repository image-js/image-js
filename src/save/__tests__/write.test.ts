import { existsSync } from 'node:fs';
import path from 'node:path';

import { write, writeSync } from '..';
import { read } from '../..';
import { ImageColorModel } from '../../utils/constants/colorModels';
import { ImageFormat } from '../encode';

let tmpDir: string;
beforeEach(() => {
  tmpDir = testUtils.makeTmpDir();
});
afterEach(() => {
  testUtils.cleanTmpDir(tmpDir);
});

test('async write image to disk (png)', async () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'image.png');
  await write(destination, img);
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead).toMatchImage(img);
});

test('format option png', async () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'image.png');
  await write(destination, img, { format: ImageFormat.png });
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead).toMatchImage(img);
});

test('async write image to disk (jpeg)', async () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'image.jpeg');
  await write(destination, img, { format: ImageFormat.jpeg });
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead.width).toBe(img.width);
  expect(imgRead.colorModel).toBe(ImageColorModel.RGBA);
});

test('write image to disk', async () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'image.png');
  writeSync(destination, img);
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead).toMatchImage(img);
});

test('write image to disk (jpeg)', async () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'image.jpeg');
  writeSync(destination, img);
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead.width).toBe(img.width);
  expect(imgRead.colorModel).toBe(ImageColorModel.RGBA);
});

test('write mask image to disk', async () => {
  let img = testUtils.load('opencv/test.png');
  img = img.convertColor(ImageColorModel.GREY);
  let mask = img.threshold();
  let maskImage = mask.convertColor(ImageColorModel.GREY);
  const destination = path.join(tmpDir, 'image.png');
  writeSync(destination, mask);
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead).toMatchImage(maskImage);
});
test('async write mask image to disk', async () => {
  let img = testUtils.load('opencv/test.png');
  img = img.convertColor(ImageColorModel.GREY);
  let mask = img.threshold();
  let maskImage = mask.convertColor(ImageColorModel.GREY);
  const destination = path.join(tmpDir, 'image.png');
  await write(destination, mask);
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead).toMatchImage(maskImage);
});

test('image extension error', async () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'image.tiff');
  await expect(write(destination, img)).rejects.toThrow(
    'image format could not be determined from file extension. Please use a supported extension or specify the format option',
  );
});
