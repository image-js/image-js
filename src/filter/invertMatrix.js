'use strict';


// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

export default function invertMatrix() {
    this.checkProcessable("invert",{
        bitDepth:[8,16]
    });
console.log("GET")
    let matrix=this.getMatrix();

    console.log(matrix);
    for (let i=0; i<matrix.length; i++) {
        let row=matrix[i];
        console.log(i);
        for (let j=0; j<row.length; j++) {
            var pixel=row[j];
            for (let k=0; k<this.components; k++) {
                pixel[k] = this.maxValue - pixel[k];
            }
        }
    }
    this.setMatrix(matrix);
};
