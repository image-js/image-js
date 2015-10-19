/*
 We will try to move a set of images in order to get only the best common part of them
 The match is always done on the first image ?
*/
import Stack from '../stack';

// in a stack we compare 2 consecutive images
// or directly to a parent

// algorithm: matchToPrevious || matchToFirst

export default function matchAndCrop({algorithm = 'matchToPrevious'} = {}) {
    this.checkProcessable('matchAndCrop', {
        bitDepth: [8, 16]
    });

    let matchToPrevious = (algorithm === 'matchToPrevious') ? true : false;

    let parent = this[0];
    let results = [];
    results[0] = {
        position:[0,0],
        image: this[0]
    };

    let relativePosition = [0,0];

    // we calculate the best relative position to the parent image
    for (let i = 1; i < this.length; i++) {
        // in order to calculate the similarity we need to add a border that will not be compared
        // by default we take as border 1/8 of the image width and height
        let position = parent.getBestMatch(this[i],{border:[parent.width >> 3,parent.height >> 3]});

        results[i] = {
            position: [position[0] + relativePosition[0], position[1] + relativePosition[1]],
            image: this[i]
        };
        if (matchToPrevious) {
            relativePosition[0] += position[0];
            relativePosition[1] += position[1];
            parent = this[i];
        }


    }
    // now we can calculate the cropping that we need to do

    let leftShift = 0;
    let rightShift = 0;
    let topShift = 0;
    let bottomShift = 0;

    for (let i = 0; i < results.length; i++) {
        let result = results[i];
        if (result.position[0] > leftShift) leftShift = result.position[0];
        if (result.position[0] < rightShift) rightShift = result.position[0];
        if (result.position[1] > topShift) topShift = result.position[1];
        if (result.position[1] < bottomShift) bottomShift = result.position[1];
    }
    rightShift *= -1;
    bottomShift *= -1;


    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        /*
        console.log("CROP",
            leftShift - result.position[0],
            topShift - result.position[1],
            parent.width - rightShift - leftShift,
            parent.height - bottomShift - topShift
        )
        */

        result.crop = result.image.crop({
            x: leftShift - result.position[0],
            y: topShift - result.position[1],
            width:parent.width - rightShift - leftShift,
            height:parent.height - bottomShift - topShift
        });
    }

    // finally we crop and create a new array of images
    let newImages = [];
    for (let i = 0; i < results.length; i++) {
        newImages[i] = results[i].crop;
    }

    return new Stack(newImages);
}
