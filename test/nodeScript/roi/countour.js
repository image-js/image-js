'use strict';

var Image = require('../../..');

Image.load('./node_modules/ij-test/img/BW15x15.png').then(function (img) {
    console.log(img.width);


    var roiManager=img.getROIManager();
    var mask=img.grey.mask();
    roiManager.putMask(mask);

    console.log()

});
