'use strict';
/*
load('rgb8.png').then(function (a) {
    var b = a.clone().invert();
    setLeft(a);
    setRight(b);
});
*/

/*load('rgb8.png').then(function (a) {
    setLeft(a);

    setInterval(move, 25);

    var x = 0;
    function move() {
        setRight(a.crop(x++, 0, 200, 200));
    }
});
*/

load('rgb8.png').then(function (a) {
    setLeft(a);

    var newImage = a.grey();

    setRight(newImage);

});
