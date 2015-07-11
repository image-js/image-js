'use strict';

import IJ from '../ij';


export default function splitBinary({} = {}) {

    this.checkProcessable('mark', {
        bitDepth: [1]
    });




    var maskInfo=this.analyseMask();


    var rois=this.createROIs(maskInfo);




    var images=[];

    return images;
}
