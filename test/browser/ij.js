'use strict';

IJ.load('../img/rgb8.png').then(function (a) {
    document.getElementById('in').src = a.toDataURL();
    a.invert();
    document.getElementById('out').src = a.toDataURL();
});
