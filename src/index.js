import Image from './image/Image';
export { Image as default, Image };
export { default as Stack } from './stack/Stack';
export { default as Shape } from './util/Shape';

import * as Kernel from './kernel/kernel';
export { Kernel };

import { names as greyNames } from './image/transform/greyAlgorithms';
import { names as maskNames } from './image/transform/mask/maskAlgorithms';

const Static = {
  grey: greyNames,
  mask: maskNames
};
export { Static };

export { default as Worker } from './worker/worker';
