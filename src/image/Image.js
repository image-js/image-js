// This file contains imports that have a circular dependency with the ImageClass

import baseMethods from './baseMethods';
import bitMethods from './bitMethods';
import extend from './extend';

import Image from './ImageClass';
export default Image;

baseMethods(Image);
bitMethods(Image);
extend(Image);
