'use strict';

import IJ from '../ij';

export default function analseMask({} = {}) {

    this.checkProcessable('analyseMask', {
        bitDepth: [1]
    });


    // based on a binary image we will create plently of small images
    var pixels=new Int16Array(this.size); // maxValue: 32767, minValue: -32768


    // split will always return an array of images
    var positiveID=0;
    var negativeID=0;
    var self=this;


    for (let x=0; x<this.width; x++) {
        for (let y=0; y<this.height; y++) {
            if (pixels[y*this.width+x]===0) {
                // need to process the whole surface
                analyseSurface(x,y);
            }
        }
    }

    function analyseSurface(x,y) {
        let targetState=self.getBitXY(x,y);
        console.log(x,y);
        console.log("target state ", targetState)

        let id=targetState ? ++positiveID : --negativeID;
        console.log("ID ",id)
        let xToProcess=new Uint16Array(8); // assign dynamically ????
        let yToProcess=new Uint16Array(8);
        let from=0;
        let to=0;
        xToProcess[0]=x;
        yToProcess[0]=y;
        while(from<=to) {
            let currentX=xToProcess[from & 0xffff];
            let currentY=yToProcess[from & 0xffff];
            console.log("Processing: ",currentX, " ", currentY)
            pixels[currentY*self.width+currentX]=id;
            // need to check all around this pixel
            if (currentX>0 && pixels[currentY*self.width+currentX-1]===0 &&
                self.getBitXY(currentX-1,currentY)==targetState) {
                    console.log("left")
                    to++;
                    xToProcess[to & 0xffff]=currentX-1;
                    yToProcess[to & 0xffff]=currentY;
            }
            if (currentY>0 && pixels[(currentY-1)*self.width+currentX]===0 &&
                self.getBitXY(currentX,currentY-1)==targetState) {
                console.log("top")
                    to++;
                    xToProcess[to & 0xffff]=currentX;
                    yToProcess[to & 0xffff]=currentY-1;
            }
            if (currentX<self.width-1 && pixels[currentY*self.width+currentX+1]===0 &&
                self.getBitXY(currentX+1,currentY)==targetState) {
                console.log("right")
                    to++;
                console.log("--- ",to)
                    xToProcess[to & 0xffff]=currentX+1;
                    yToProcess[to & 0xffff]=currentY;
            }
            if (currentY<self.height-1 && pixels[(currentY+1)*self.width+currentX]===0 &&
                self.getBitXY(currentX,currentY+1)==targetState) {
                console.log("bottom")
                    to++;
                    xToProcess[to & 0xffff]=currentX;
                    yToProcess[to & 0xffff]=currentY+1;
            }
            console.log(xToProcess);
            console.log(yToProcess);
            from++;
            console.log(from, to);
        }
    }

    return {
        pixels: pixels,
        negative: -negativeID,
        positive: positiveID,
        total: positiveID-negativeID
    };
}
