'use strict';

IJ.load('../../img/rgb8.png').then(function (a) {
    var b = a.clone().invert();
    document.getElementById('in').src = a.toDataURL();
    document.getElementById('out').src = b.toDataURL();
});
