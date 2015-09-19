import Image from '../image';
import newArray from 'new-array';
import Matrix from './matrix';

// Try to match the current pictures with another one

export default function match( image, {}={} ) {

    this.checkProcessable('getChannel', {
        bitDepth: [8, 16]
    });

    if (this.bitDepth!==image.bitDepth) {
        throw new Error('Both images must have the same bitDepth');
    }
    if (this.channels!==image.channels) {
        throw new Error('Both images must have the same number of channels');
    }
    if (this.colorModel!==image.colorModel) {
        throw new Error('Both images must have the same colorModel');
    }

    // there could be many algorithms
    let similarityMatrix = new Matrix(image.width, image.height, -Infinity);

    let currentX=Math.round(image.width/2);
    let currentY=Math.round(image.height/2);
    let currentSimilarity=-Infinity;

  //  console.log(similarityMatrix);

    // we need to calculate all the similarity around the current point that was
    // not yet calculated

}


function calculateMissing() {

}

function getBestMatch(similarityMatrix,x,y) {

}
