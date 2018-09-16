'use strict';

let { Image } = require('../../../src');

Image.load('./node_modules/ij-test/img/BW15x15.png').then(function (img) {
  console.log('Width: ', img.width);
  console.log('Height: ', img.height);
  let roiManager = img.getRoiManager();
  let mask = img.grey().mask();
  roiManager.fromMask(mask);
  let rois = roiManager.getRois();

  for (let i = 0; i < rois.length; i++) {
    console.log(rois[i].surface);
  }

  console.log(rois[4].internalIDs);

  console.log('Not filled');
  let extract = rois[4].extract(img);
  console.log(extract.countPixels({ alpha: 0 }));
  console.log(extract.countPixels({ alpha: 255 }));

  console.log('Filled');
  extract = rois[4].extract(img, { fill: true });
  console.log(extract.countPixels({ alpha: 0 }));
  console.log(extract.countPixels({ alpha: 255 }));
});
