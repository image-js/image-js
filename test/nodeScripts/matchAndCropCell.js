'use strict';

let fs = require('fs');

/*
 Execute this script with:
 node -r esm matchAndCropCell.js
*/

let { Image } = require('../../src');

// we will create a stack and load all the images

let baseDir = `${__dirname}/../img/cells/fluorescent/`;
let files = fs.readdirSync(baseDir).slice(0, 5);
console.log(files);
let images = [];
let toLoad = [];
for (let i = 0; i < files.length; i++) {
  let image = {};
  images.push(image);
  image.name = baseDir + files[i];
  toLoad.push(Image.load(image.name));
}

Promise.all(toLoad).then(
  function (images) {
    let stack = new Image.Stack(images);
    let cropped = stack.matchAndCrop();
    for (let i = 0; i < cropped.length; i++) {
      console.log(i, cropped[i].width, cropped[i].height);
    }
  },
  function (error) {
    console.log(error);
  },
);
