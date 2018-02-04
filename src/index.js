import Image from './image/Image';
import * as Kernel from './kernel/kernel';
import { names as greyNames } from './image/transform/greyAlgorithms';
import { names as thresholdNames } from './image/transform/mask/thresholdAlgorithms';

export { Kernel };

export { Image as default, Image };
export { default as Stack } from './stack/Stack';
export { default as Shape } from './util/Shape';

export const Static = {
  grey: greyNames,
  threshold: thresholdNames
};

export { default as Worker } from './worker/worker';
