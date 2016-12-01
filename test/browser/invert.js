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
    var manager = img.getRoiManager();
    console.time('1');
    manager.fromMask(mask, {label: 'mask1'});
    console.timeEnd('1');
    console.time('2');
    manager.fromMask2(mask, {label: 'mask2'});
    console.timeEnd('2');
    console.log(manager);

});
