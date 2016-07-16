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
        setRight(a.crop({x: x++, width: 200, height:200}));
    }
});
*/



load('cells/cells.jpg').then(function (img) {
    //setLeft(a);

    var mask = img.grey().mask();
    var manager = img.getROIManager();
    manager.putMask(mask, {label: 'mask1'});
    manager.putMask2(mask, {label: 'mask2'});
    console.log(manager);

});
