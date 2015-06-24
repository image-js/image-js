'use strict';

load('rgb8.png').then(function (a) {
    var b = a.clone().invert();
    setLeft(a);
    setRight(b);
});
