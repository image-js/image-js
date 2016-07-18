'use strict';

var Image = require('../../..');

Image.load('./test/img/moon/nocrop/BloodMoonTest-6.png').then(function (img) {
    img = img.scale({factor:4});
    var roiManager = img.getROIManager();
    var mask = img.grey().mask();

    console.time('test');
    //for(var i = 0; i < 10000; i++) {
        roiManager.putMask2(mask);
    //}
    console.timeEnd('test');

}, function (err) {
    console.error(err);
});
