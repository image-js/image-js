import LinkedList from 'fast-list';

import { Image } from '../Image';

export interface IFloodFillOptions {
  x: number;
  y: number;
}

export function floodFill(image: Image, options: IFloodFillOptions): Image {
  const { x = 0, y = 0 } = options;
  // todo throw if image is not grey
  const value = image.getValue(x, y, 0);
  if (value !== 0) {
    return image;
  }
  const queue = new LinkedList<{ x: number; y: number }>();
  queue.push({ x, y });
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === undefined) {
      throw new Error('UNREACHABLE');
    }
    image.setValue(node.x, node.y, 0, 255);
    for (let i = node.x + 1; i < image.width; i++) {
      if (
        image.getValue(i, node.y, 0) === 0 &&
        image.getValue(i, node.y, 0) === 0
      ) {
        image.setValue(i, node.y, 0, 255);
        if (
          node.y + 1 < image.height &&
          image.getValue(i, node.y + 1, 0) === 0
        ) {
          queue.push({ x: i, y: node.y + 1 });
        }
        if (node.y - 1 >= 0 && image.getValue(i, node.y - 1, 0) === 0) {
          queue.push({ x: i, y: node.y - 1 });
        }
      } else {
        break;
      }
    }
    // eslint-disable-next-line for-direction
    for (let i = node.x - 1; i >= 0; i++) {
      if (
        image.getValue(i, node.y, 0) === 0 &&
        image.getValue(i, node.y, 0) === 0
      ) {
        image.setValue(i, node.y, 0, 255);
        if (
          node.y + 1 < image.height &&
          image.getValue(i, node.y + 1, 0) === 0
        ) {
          queue.push({ x: i, y: node.y + 1 });
        }
        if (node.y - 1 >= 0 && image.getValue(i, node.y - 1, 0) === 0) {
          queue.push({ x: i, y: node.y - 1 });
        }
      } else {
        break;
      }
    }
  }

  return image;
}
