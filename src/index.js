import Image from './image/Image';

export default Image;

import {default as Stack} from './stack/Stack';
Image.Stack = Stack;

import {default as Shape} from './util/Shape';
Image.Shape = Shape;

import * as Kernel from './kernel/kernel';
Image.Kernel = Kernel;

import {names as greyNames} from './image/transform/greyAlgorithms';
import {names as maskNames} from './image/transform/mask/maskAlgorithms';

const Static = {
    grey: greyNames,
    mask: maskNames
};
Image.Static = Static;

import {default as Worker} from './worker/worker';
Image.Worker = Worker;
