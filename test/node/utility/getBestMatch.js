import {Image} from '../common';


describe('check matrix class', function () {
    let image1 = new Image(5,5,
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
        {kind:'GREY'}
    );

    let image2 = new Image(5,5,
        [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        {kind:'GREY'}
    );



});

