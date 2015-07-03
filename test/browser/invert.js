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

load('rgb8.png').then(function (img) {
    //setLeft(a);

    console.time("invert");
    for (var i=0; i<200; i++) {
        img.invert();
    }
    console.timeEnd("invert");

    console.time("invertMatrix");
    for (var i=0; i<200; i++) {
        img.invertMatrix();
    }
    console.timeEnd("invertMatrix");

    console.time("invertOneLoop");
    for (var i=0; i<200; i++) {
        img.invertOneLoop();
    }
    console.timeEnd("invertOneLoop");


   // setRight(a);

});
