'use strict';

var Image = require('../../..');

Image.load('./test/img/BW15x15.png').then(function (img) {
    var roiManager = img.getROIManager();
    var mask = img.grey().mask();

    console.time('test');
    for(var i = 0; i < 10000; i++) {
        roiManager.putMask2(mask);
    }
    console.timeEnd('test');

}, function (err) {
    console.error(err);
});



