/*
 We will try to move a set of images in order to get only the best common part of them
 The match is always done on the first image ?
*/
import Stack from '../stack';

export default function matchAndCrop({} = {}) {
    this.checkProcessable('matchAndCrop', {
        bitDepth: [8, 16]
    });

    let parent=this[0];
    let results=[];
    results[0]={
        position:[0,0],
        image: this[0]
    }
    // we calculate the best relative position to the parent image
    for (let i=1; i<this.length; i++) {
        results[i]={
            position: parent.getBestMatch(this[i]),
            image: this[i]
        }
    }
    // now we can calculate the cropping that we need to do

    let leftShift=0;
    let rightShift=0;
    let topShift=0;
    let bottomShift=0;

    for (let i=0; i<results.length; i++) {
        let result=results[i];
        if (result.position[0]>leftShift) leftShift=result.position[0];
        if (result.position[0]<rightShift) rightShift=result.position[0];
        if (result.position[1]>topShift) topShift=result.position[1];
        if (result.position[1]<bottomShift) bottomShift=result.position[1];
    }

    for (let i=0; i<results.length; i++) {
        let result=results[i];

        result.crop=result.image.crop({
            x:leftShift-result.position[0],
            y:topShift-result.position[1],
            width:parent.width-rightShift-leftShift,
            height:parent.height-bottomShift-topShift
        });
    }

    // finally we crop and create a new array of images
    let newImages=[];
    for (let i=0; i<results.length; i++) {
        newImages[i]=results[i].crop;
    }

    return new Stack(newImages);
}
