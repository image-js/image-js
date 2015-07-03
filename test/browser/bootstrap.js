'use strict';

import IJ from '../../src/ij';
import {imageList, getHash} from 'ij-test';

window.images = imageList;
window.getHash = getHash;

let root = '../../node_modules/ij-test/img/';

window.load = function load(name) {
    return IJ.load(root + name);
};

var left = document.getElementById('left');
window.setLeft = function setLeft(img) {
    left.src = img.toDataURL();
};

var right = document.getElementById('right');
window.setRight = function setRight(img) {
    right.src = img.toDataURL();
};

export default IJ;
