'use strict';


// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

export default function invertMatrix() {
    this.checkProcessable("invert",{
        bitDepth:[1,8,16]
    });

    if (this.bitDepth==1) {
        // we simply invert all the integers value
        // there could be a small mistake if the number of points
        // is not a multiple of 8 but it is not important
        var data=this.data;
        for (var i=0; i<data.length; i++) {
            data[i]= ~data[i];
        }
    } else {
        for (let i=0; i<this.height; i++) {
            for (let j=0; j<this.width; j++) {
                for (let k=0; k<this.components; k++) {
                    var value=this.getValueXY(i, j, k);
                    this.setValueXY(i, j, k, this.maxValue-value);
                }
            }
        }
    }
};
