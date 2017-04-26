'use strict';

import Image from '../../src';
import {imageList, getHash} from '../test-util';

window.images = imageList;
window.getHash = getHash;

let root = '../img/';

window.load = function load(name) {
    return Image.load(root + name);
};

var left = document.getElementById('left');
window.setLeft = function setLeft(img) {
    left.innerHTML = '';
    left.appendChild(img.getCanvas());
};

var right = document.getElementById('right');
window.setRight = function setRight(img) {
    right.innerHTML = '';
    right.appendChild(img.getCanvas());
};

module.exports = Image;
