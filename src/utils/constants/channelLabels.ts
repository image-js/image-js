import { ImageColorModel } from './colorModels';

export const channelLabels = {
  GREY: ['Grey'],
  GREYA: ['Grey', 'Alpha'],
  RGB: ['Red', 'Green', 'Blue'],
  RGBA: ['Red', 'Green', 'Blue', 'Alpha'],
  BINARY: ['Mask'],
} as const satisfies Record<ImageColorModel, readonly string[]>;
