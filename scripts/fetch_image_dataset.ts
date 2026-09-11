/* eslint-disable no-await-in-loop */

import fs from 'node:fs/promises';
import path from 'node:path';

import { fetchURL, write } from '../src/index.ts';

const dir = path.join(import.meta.dirname, '../demo-images');

const demoUrl = 'https://demo-dataset.image-js.org/';
const response = await fetch(demoUrl);
const data = await response.json();
for (const entry of data.entries) {
  if (
    entry.name.endsWith('.jpg') ||
    entry.name.endsWith('.jpeg') ||
    entry.name.endsWith('.png')
  ) {
    await fs.mkdir(path.dirname(`${dir}/${entry.relativePath}`), {
      recursive: true,
    });
    console.log('Downloading', entry.name);
    const image = await fetchURL(`${demoUrl}${entry.relativePath}`);
    await write(`${dir}/${entry.relativePath}`, image);
  }
}
