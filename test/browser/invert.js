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



load('cells.jpg').then(function (img) {
    //setLeft(a);

    console.time("invert");
    for (var i=0; i<20; i++) {
        img.invert();
    }
    console.timeEnd("invert");


    console.time("invertApply");
    for (var i=0; i<20; i++) {
        img.invertApply();
    }
    console.timeEnd("invertApply");

    console.time("invertApplyAll");
    for (var i=0; i<20; i++) {
        img.invertApplyAll();
    }
    console.timeEnd("invertApplyAll");

    console.time("invertOneLoop");
    for (var i=0; i<20; i++) {
        img.invertOneLoop();
    }
    console.timeEnd("invertOneLoop");


   // setRight(a);

});
