'use strict';

import IJ from '../ij';


export default function splitBinary({} = {}) {

    this.checkProcessable('mark', {
        bitDepth: [1]
    });

    var images=[];


    // based on a binary image we will create plently of small images
    var pixels=this.mark();



    return images;
}
