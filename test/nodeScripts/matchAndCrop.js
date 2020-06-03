'use strict';

/*
 Execute this script with:
 node -r esm matchAndCrop.js
*/

let { Image } = require('../../src');

// we will create a stack and load all the images

let stack = new Image.Stack();
let baseName = '../../test/img/moon/crop/BloodMoonTest-';
let images = [];
let toLoad = [];
for (let i = 1; i <= 8; i++) {
  let image = {};
  images.push(image);
  image.name = `${baseName + i}.png`;
  toLoad.push(Image.load(image.name));
}

Promise.all(toLoad).then(function (images) {
  for (let i = 0; i < images.length; i++) {
    processImage(images[i], i);
  }

  stack.matchAndCrop();
});

function processImage(image, i) {
  let grey = image.grey();
  let mask = grey.mask({ algorithm: 0.1 });
  let roiManager = image.getRoiManager();
  roiManager.fromMask(mask);
  images[i].grey = { type: 'png', value: grey.toDataURL() };
  images[i].mask = { type: 'png', value: mask.toDataURL() };
  // we take the biggest Roi and we crop based on the center of it the
  // original image
  let rois = roiManager.getRois('default', {
    negative: false,
    minSurface: 10,
  });

  // we corner is the correct one ... we need to find the corner that
  // is the closest to the meanX / meanY and from there
  // take a scale
  let width = 120; // could be determine automatically
  let height = 120;
  let frameBorder = 0;

  let minX = rois[0].minX;
  let maxX = rois[0].maxX;
  let minY = rois[0].minY;
  let maxY = rois[0].maxY;
  let meanX = rois[0].meanX;
  let meanY = rois[0].meanY;

  console.log(minX, maxX, minY, maxY, meanX, meanY);

  //   console.log(mask.toDataURL())
  let fromX;
  let fromY;
  if (Math.abs(minX - meanX) > Math.abs(maxX - meanX)) {
    fromX = maxX - width;
  } else {
    fromX = minX;
  }

  if (Math.abs(minY - meanY) > Math.abs(maxY - meanY)) {
    fromY = maxY - height;
  } else {
    fromY = minY;
  }
  let options = {
    x: fromX - frameBorder,
    y: fromY - frameBorder,
    width: width + 2 * frameBorder,
    height: height + 2 * frameBorder,
  };
  console.log(fromX, fromY, meanX, meanY, options);
  let crop = image.crop(options);
  console.log(crop.toDataURL());
  images[i].crop = { type: 'png', value: crop.toDataURL() };

  // we will create a stack
  stack.push(crop);
}
