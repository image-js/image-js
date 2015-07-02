'use strict';


// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

export default function invertMatrix() {
    this.checkProcessable("invert",{
        bitDepth:[8,16]
    });

    for (let i=0; i<this.height; i++) {
        for (let j=0; j<this.width; j++) {
            for (let k=0; k<this.components; k++) {
                var value=this.getValue(i, j, k);
                this.setValue(this.maxValue-value, i,j,k);
            }
        }
    }
};
