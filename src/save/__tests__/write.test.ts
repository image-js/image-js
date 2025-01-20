import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { read, readSync } from '../../load/index.js';
import { write, writeSync } from '../write.js';

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
  await write(destination, img, { format: 'png' });
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead).toMatchImage(img);
});

test('async write image to disk (jpeg)', async () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'image.jpeg');
  await write(destination, img, { format: 'jpeg' });
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead.width).toBe(img.width);
  expect(imgRead.colorModel).toBe('RGBA');
});

test('sync write image to disk', () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'image.png');
  writeSync(destination, img);
  expect(existsSync(destination)).toBe(true);
  const imgRead = readSync(destination);
  expect(imgRead).toMatchImage(img);
});

test('sync write image to disk (jpeg)', () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'image.jpeg');
  writeSync(destination, img);
  expect(existsSync(destination)).toBe(true);
  const imgRead = readSync(destination);
  expect(imgRead.width).toBe(img.width);
  expect(imgRead.colorModel).toBe('RGBA');
});

test('sync write mask image to disk', () => {
  let img = testUtils.load('opencv/test.png');
  img = img.convertColor('GREY');
  const mask = img.threshold();
  const maskImage = mask.convertColor('GREY');
  const destination = path.join(tmpDir, 'image.png');
  writeSync(destination, mask);
  expect(existsSync(destination)).toBe(true);
  const imgRead = readSync(destination);
  expect(imgRead).toMatchImage(maskImage);
});

test('async write mask image to disk', async () => {
  let img = testUtils.load('opencv/test.png');
  img = img.convertColor('GREY');
  const mask = img.threshold();
  const maskImage = mask.convertColor('GREY');
  const destination = path.join(tmpDir, 'image.png');
  await write(destination, mask);
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead).toMatchImage(maskImage);
});

test('async write with URL', async () => {
  const img = testUtils.load('opencv/test.png');
  const destination = pathToFileURL(path.join(tmpDir, 'image.png'));
  await write(destination, img);
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead).toMatchImage(img);
});

test('sync write with URL', () => {
  const img = testUtils.load('opencv/test.png');
  const destination = pathToFileURL(path.join(tmpDir, 'image.png'));
  writeSync(destination, img);
  expect(existsSync(destination)).toBe(true);
  const imgRead = readSync(destination);
  expect(imgRead).toMatchImage(img);
});

test('async write with recursive option', async () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'subdir/123', 'image.png');
  await write(destination, img, { recursive: true });
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead).toMatchImage(img);
});

test('sync write with recursive option', () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'subdir/123', 'image.png');
  writeSync(destination, img, { recursive: true });
  expect(existsSync(destination)).toBe(true);
  const imgRead = readSync(destination);
  expect(imgRead).toMatchImage(img);
});

test('unknown format error', () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'image.png');
  expect(() => {
    // @ts-expect-error test invalid format
    writeSync(destination, img, { format: 'foo' });
  }).toThrow(/foo/);
});

test('image extension error', async () => {
  const img = testUtils.load('opencv/test.png');
  const destination = path.join(tmpDir, 'image.tiff');
  await expect(write(destination, img)).rejects.toThrow(
    'image format could not be determined from file extension. Use a supported extension or specify the format option',
  );
});
