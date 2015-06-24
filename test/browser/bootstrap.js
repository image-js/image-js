'use strict';

var root = '../../node_modules/ij-test/img/';

function load(name) {
    return IJ.load(root + name);
}

var left = document.getElementById('left');
function setLeft(img) {
    left.src = img.toDataURL();
}

var right = document.getElementById('right');
function setRight(img) {
    right.src = img.toDataURL();
}
